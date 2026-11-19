import express, { Request, Response, Router } from 'express';
import { AuthRequest, requireAuth, requireAdmin } from '../../src/middleware/auth.ts';
import { getOrCreateUser } from '../../src/db/users.ts';
import {
  createVideoRecord,
  deleteVideoRecord,
  findDuplicateActiveVideo,
  getVideoByIdOrPublicId,
  getVideoByStreamId,
  incrementVideoViewCount,
  listAdminVideos,
  listPublicVideos,
  logVideoAuditEvent,
  updateVideoMetadataAndPublication,
  updateVideoUploadProgress,
} from '../../src/db/videos.ts';
import {
  ALLOWED_VIDEO_EXTENSIONS,
  buildHlsUrl,
  buildThumbnailUrl,
  CloudflareConfig,
  createDirectTusUploadUrl,
  deleteCloudflareVideo,
  getCloudflareConfig,
  getCloudflareVideoDetails,
  getMaxVideoSizeBytes,
  mapCloudflareStateToUploadStatus,
  validateVideoUploadInput,
  verifyCloudflareWebhookSignature,
  VIDEO_CATEGORIES,
  ValidVideoCategory,
} from './cloudflareStream.js';
import { sendApiError, sendApiResponse } from './gatewayCore.js';

export interface VideoRouterDeps {
  getCloudflareConfigFn?: () => CloudflareConfig | null;
  fetchImpl?: typeof fetch;
  authMiddleware?: typeof requireAuth;
  adminMiddleware?: typeof requireAdmin;
}

function validateImageMagicBytes(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 12) return false;
  if (mime === 'image/jpeg' || mime === 'image/jpg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mime === 'image/png') {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }
  if (mime === 'image/webp') {
    return (
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    );
  }
  return false;
}

export function createVideoRouter(deps: VideoRouterDeps = {}): Router {
  const router = express.Router();
  const resolveConfig = deps.getCloudflareConfigFn || getCloudflareConfig;
  const fetchImpl = deps.fetchImpl || fetch;
  const authGuard = deps.authMiddleware || requireAuth;
  const adminGuard = deps.adminMiddleware || requireAdmin;

  // Dedicated per-admin upload rate limiter (max 25 upload initializations per minute)
  const uploadRateMap = new Map<string, { count: number; resetAt: number }>();
  const checkUploadRateLimit = (key: string): boolean => {
    const now = Date.now();
    const record = uploadRateMap.get(key);
    if (!record || now > record.resetAt) {
      uploadRateMap.set(key, { count: 1, resetAt: now + 60_000 });
      return true;
    }
    if (record.count >= 25) return false;
    record.count += 1;
    return true;
  };

  // =========================================================================
  // ADMIN CONFIG STATUS (NO SECRETS EXPOSED)
  // =========================================================================
  router.get('/videos/config-status', authGuard, adminGuard, (_req: Request, res: Response) => {
    const cfg = resolveConfig();
    return sendApiResponse(res, {
      cloudflareConfigured: Boolean(cfg),
      hasWebhookSecret: Boolean(cfg?.webhookSecret),
      hasCustomerSubdomain: Boolean(cfg?.customerSubdomain),
      maxFileSizeBytes: getMaxVideoSizeBytes(),
      allowedExtensions: Array.from(ALLOWED_VIDEO_EXTENSIONS),
      categories: VIDEO_CATEGORIES,
    });
  });

  // =========================================================================
  // ADMIN: GENERATE SECURE DIRECT CREATOR TUS UPLOAD URL
  // =========================================================================
  router.post('/videos/upload-url', authGuard, adminGuard, async (req: AuthRequest, res: Response) => {
    try {
      const adminUid = req.user?.uid || 'unknown-admin';
      const adminEmail = req.user?.email || 'admin@alnoor.internal';

      if (!checkUploadRateLimit(adminUid)) {
        return sendApiError(
          res,
          429,
          'UPLOAD_RATE_LIMITED',
          'تم تجاوز الحد المسموح به لطلبات رفع الفيديو في الدقيقة. يرجى الانتظار قليلاً ثم المحاولة.'
        );
      }

      const {
        titleAr,
        titleEn,
        description = '',
        category,
        fileName,
        mimeType = 'video/mp4',
        fileSizeBytes,
        fileFingerprint,
        thumbnailUrl = null,
      } = req.body || {};

      const validation = validateVideoUploadInput({
        titleAr,
        titleEn,
        category,
        fileName,
        mimeType,
        fileSizeBytes: Number(fileSizeBytes),
      });

      if (!validation.valid) {
        return sendApiError(res, 400, validation.code, validation.message);
      }

      const cfg = resolveConfig();
      if (!cfg) {
        return sendApiError(
          res,
          503,
          'CLOUDFLARE_CONFIG_MISSING',
          'إعدادات خدمة بث الفيديو (CLOUDFLARE_ACCOUNT_ID و CLOUDFLARE_API_TOKEN) غير مضافة في متغيرات البيئة على الخادم.'
        );
      }

      const cleanFingerprint =
        typeof fileFingerprint === 'string' && fileFingerprint.trim().length >= 8
          ? fileFingerprint.trim().slice(0, 128)
          : `${fileName}:${fileSizeBytes}:${mimeType}`;

      const duplicate = await findDuplicateActiveVideo(cleanFingerprint);
      if (duplicate) {
        const message =
          duplicate.uploadStatus === 'ready'
            ? 'هذا الفيديو مرفوع وجاهز بالفعل في المكتبة المرئية. لا يُسمح بتكرار رفع نفس الملف.'
            : 'يوجد رفع نشط أو قيد المعالجة لهذا الملف بالفعل. يمكنك استئناف الرفع أو حذف المسودة غير المكتملة أولاً.';
        return res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_UPLOAD',
            message,
            existingVideo: duplicate,
          },
          timestamp: new Date().toISOString(),
        });
      }

      const originHeader = req.headers.origin;
      const allowedOrigins: string[] = [];
      if (originHeader && typeof originHeader === 'string') {
        try {
          allowedOrigins.push(new URL(originHeader).host);
        } catch (_) {}
      }

      const tusResult = await createDirectTusUploadUrl(
        cfg,
        {
          fileSizeBytes: Number(fileSizeBytes),
          fileName: String(fileName).trim(),
          titleAr: String(titleAr).trim(),
          titleEn: String(titleEn).trim(),
          category: String(category).trim(),
          adminUid,
          allowedOrigins,
        },
        fetchImpl
      );

      let adminDbId: number | null = null;
      try {
        const dbUser = await getOrCreateUser({
          uid: adminUid,
          email: adminEmail,
          role: 'admin',
        });
        adminDbId = dbUser?.id ?? null;
      } catch (userErr) {
        console.warn('Could not sync admin user row during upload init:', userErr);
      }

      const video = await createVideoRecord({
        titleAr: String(titleAr).trim(),
        titleEn: String(titleEn).trim(),
        description: String(description || '').trim(),
        category: category as ValidVideoCategory,
        thumbnailUrl: typeof thumbnailUrl === 'string' && thumbnailUrl.startsWith('https://') ? thumbnailUrl : null,
        streamVideoId: tusResult.streamVideoId,
        fileSizeBytes: Number(fileSizeBytes),
        mimeType: String(mimeType || 'video/mp4'),
        originalFileName: String(fileName).trim(),
        fileFingerprint: cleanFingerprint,
        uploadUrlExpiresAt: new Date(tusResult.expiresAt),
        adminId: adminDbId,
        adminUid,
        adminEmail,
      });

      return sendApiResponse(
        res,
        {
          video,
          uploadUrl: tusResult.uploadUrl,
          streamVideoId: tusResult.streamVideoId,
          expiresAt: tusResult.expiresAt,
        },
        { provider: 'Cloudflare Stream Direct Creator TUS' }
      );
    } catch (error: any) {
      console.error('Failed to create Cloudflare Direct TUS upload URL:', error);
      return sendApiError(
        res,
        502,
        'CLOUDFLARE_UPLOAD_INIT_ERROR',
        error?.message?.includes('CLOUDFLARE_')
          ? 'تعذر إنشاء رابط الرفع الآمن من خدمة البث السحابي (Cloudflare Stream). يرجى التحقق من صلاحية الرمز والإعدادات.'
          : 'حدث خطأ غير متوقع أثناء تهيئة جلسة الرفع.'
      );
    }
  });

  // =========================================================================
  // ADMIN: REPORT UPLOAD CLIENT STATE (NEVER MARKS PROCESSING AS READY!)
  // =========================================================================
  router.post('/videos/:id/upload-state', authGuard, adminGuard, async (req: AuthRequest, res: Response) => {
    try {
      const existing = await getVideoByIdOrPublicId(req.params.id);
      if (!existing) {
        return sendApiError(res, 404, 'VIDEO_NOT_FOUND', 'سجل الفيديو غير موجود.');
      }

      const { state, errorMessage } = req.body || {};
      if (!['uploading', 'uploaded', 'error'].includes(state)) {
        return sendApiError(res, 400, 'INVALID_UPLOAD_STATE', 'حالة الرفع المرسلة غير صالحة.');
      }

      // If client finished sending all TUS chunks ('uploaded'), mark as 'processing'
      // NEVER mark as 'ready' from client input — only Cloudflare Stream API / Webhook can verify readiness!
      const nextStatus =
        state === 'uploading'
          ? 'uploading'
          : state === 'uploaded'
          ? existing.uploadStatus === 'ready'
            ? 'ready'
            : 'processing'
          : 'error';

      const updated = await updateVideoUploadProgress(existing.id, {
        uploadStatus: nextStatus,
        errorMessage: state === 'error' ? String(errorMessage || 'تعذر إكمال رفع الفيديو بسبب انقطاع الاتصال.') : null,
      });

      await logVideoAuditEvent({
        videoId: existing.id,
        streamVideoId: existing.streamVideoId,
        eventType: state === 'uploaded' ? 'upload_completed' : state === 'error' ? 'error' : 'uploading',
        actorUid: req.user?.uid || null,
        details: errorMessage ? String(errorMessage) : null,
      });

      return sendApiResponse(res, updated);
    } catch (error: any) {
      console.error('Failed to update upload state:', error);
      return sendApiError(res, 500, 'UPLOAD_STATE_ERROR', 'تعذر تحديث حالة الرفع.');
    }
  });

  // =========================================================================
  // ADMIN: SYNC PROCESSING STATUS DIRECTLY FROM CLOUDFLARE STREAM
  // =========================================================================
  router.post('/videos/:id/sync-status', authGuard, adminGuard, async (req: AuthRequest, res: Response) => {
    try {
      const existing = await getVideoByIdOrPublicId(req.params.id);
      if (!existing) {
        return sendApiError(res, 404, 'VIDEO_NOT_FOUND', 'الفيديو غير موجود.');
      }

      const cfg = resolveConfig();
      if (!cfg) {
        return sendApiError(
          res,
          503,
          'CLOUDFLARE_CONFIG_MISSING',
          'مفاتيح Cloudflare Stream غير مهيأة لمزامنة حالة المعالجة.'
        );
      }

      const details = await getCloudflareVideoDetails(cfg, existing.streamVideoId, fetchImpl);
      const mappedStatus = mapCloudflareStateToUploadStatus(details.state, details.readyToStream);

      // Check expired TUS URL before upload ever started
      if (
        mappedStatus === 'pending_upload' &&
        existing.uploadUrlExpiresAt &&
        new Date(existing.uploadUrlExpiresAt).getTime() < Date.now()
      ) {
        const expiredUpdated = await updateVideoUploadProgress(existing.id, {
          uploadStatus: 'error',
          errorMessage: 'انتهت صلاحية رابط الرفع قبل اكتمال نقل الملف. يرجى إنشاء عملية رفع جديدة.',
        });
        return sendApiResponse(res, expiredUpdated);
      }

      const playbackUrl =
        details.playbackHlsUrl ||
        (mappedStatus === 'ready' ? buildHlsUrl(existing.streamVideoId, cfg.customerSubdomain) : existing.playbackUrl);

      const thumbnailUrl =
        existing.thumbnailUrl ||
        details.thumbnailUrl ||
        (mappedStatus === 'ready' ? buildThumbnailUrl(existing.streamVideoId, cfg.customerSubdomain) : null);

      const errMsg =
        mappedStatus === 'error'
          ? details.errorReasonText || details.errorReasonCode || 'فشلت معالجة الفيديو في خادم البث.'
          : null;

      const updated = await updateVideoUploadProgress(existing.id, {
        uploadStatus: mappedStatus,
        processingProgress: mappedStatus === 'ready' ? 100 : details.pctComplete,
        playbackUrl,
        previewUrl: details.previewUrl || existing.previewUrl,
        thumbnailUrl,
        durationSeconds: details.durationSeconds || existing.durationSeconds,
        errorMessage: errMsg,
      });

      await logVideoAuditEvent({
        videoId: existing.id,
        streamVideoId: existing.streamVideoId,
        eventType: 'status_synced',
        actorUid: req.user?.uid || null,
        details: JSON.stringify({ state: details.state, pctComplete: details.pctComplete, ready: details.readyToStream }),
      });

      return sendApiResponse(res, updated);
    } catch (error: any) {
      console.error('Failed to sync video status from Cloudflare:', error);
      return sendApiError(res, 502, 'CLOUDFLARE_SYNC_FAILED', 'تعذر مزامنة حالة المعالجة من Cloudflare Stream.');
    }
  });

  // =========================================================================
  // ADMIN: UPLOAD CUSTOM THUMBNAIL (VALIDATED IMAGE)
  // =========================================================================
  router.post('/videos/:id/thumbnail', authGuard, adminGuard, async (req: AuthRequest, res: Response) => {
    try {
      const existing = await getVideoByIdOrPublicId(req.params.id);
      if (!existing) {
        return sendApiError(res, 404, 'VIDEO_NOT_FOUND', 'الفيديو غير موجود.');
      }

      const { imageDataUrl, thumbnailUrl } = req.body || {};

      if (typeof thumbnailUrl === 'string' && thumbnailUrl.startsWith('https://')) {
        const result = await updateVideoMetadataAndPublication(existing.id, req.user?.uid || 'admin', {
          thumbnailUrl: thumbnailUrl.trim(),
        });
        return result.ok
          ? sendApiResponse(res, result.video)
          : sendApiError(res, result.status, result.code, result.message);
      }

      if (typeof imageDataUrl !== 'string') {
        return sendApiError(res, 400, 'THUMBNAIL_REQUIRED', 'يرجى اختيار صورة مصغرة صالحة.');
      }

      const match = imageDataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
      if (!match) {
        return sendApiError(
          res,
          400,
          'INVALID_THUMBNAIL_FORMAT',
          'صيغة الصورة المصغرة غير مدعومة. الصيغ المسموحة هي: JPEG, PNG, WEBP.'
        );
      }

      const mime = match[1].toLowerCase();
      const buffer = Buffer.from(match[2], 'base64');

      // Limit custom inline thumbnail to 1.5 MB binary
      if (buffer.length > 1.5 * 1024 * 1024) {
        return sendApiError(
          res,
          400,
          'THUMBNAIL_TOO_LARGE',
          'حجم الصورة المصغرة يتجاوز الحد المسموح (1.5 ميجابايت).'
        );
      }

      if (!validateImageMagicBytes(buffer, mime)) {
        return sendApiError(
          res,
          400,
          'CORRUPT_THUMBNAIL',
          'محتوى ملف الصورة المصغرة تالف أو لا يطابق الصيغة المعلنة.'
        );
      }

      const result = await updateVideoMetadataAndPublication(existing.id, req.user?.uid || 'admin', {
        thumbnailUrl: imageDataUrl,
      });

      return result.ok
        ? sendApiResponse(res, result.video)
        : sendApiError(res, result.status, result.code, result.message);
    } catch (error: any) {
      console.error('Thumbnail update error:', error);
      return sendApiError(res, 500, 'THUMBNAIL_ERROR', 'تعذر حفظ الصورة المصغرة للفيديو.');
    }
  });

  // =========================================================================
  // ADMIN: LIST ALL VIDEOS (INCLUDING DRAFTS, PROCESSING, ERRORS)
  // =========================================================================
  router.get('/admin/videos', authGuard, adminGuard, async (req: Request, res: Response) => {
    try {
      const result = await listAdminVideos({
        q: req.query.q as string | undefined,
        category: req.query.category as string | undefined,
        uploadStatus: req.query.uploadStatus as string | undefined,
        publicationStatus: req.query.publicationStatus as string | undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 25,
      });
      return sendApiResponse(res, {
        ...result,
        cloudflareConfigured: Boolean(resolveConfig()),
      });
    } catch (error: any) {
      console.error('Admin video list error:', error);
      return sendApiError(res, 500, 'DB_ERROR', 'تعذر تحميل قائمة الفيديوهات من قاعدة البيانات.');
    }
  });

  // =========================================================================
  // ADMIN: GET SINGLE VIDEO FOR PREVIEW (INCLUDES DRAFTS)
  // =========================================================================
  router.get('/admin/videos/:id', authGuard, adminGuard, async (req: Request, res: Response) => {
    try {
      const video = await getVideoByIdOrPublicId(req.params.id);
      if (!video) {
        return sendApiError(res, 404, 'VIDEO_NOT_FOUND', 'الفيديو غير موجود.');
      }
      return sendApiResponse(res, video);
    } catch (error: any) {
      return sendApiError(res, 500, 'DB_ERROR', 'تعذر جلب تفاصيل الفيديو.');
    }
  });

  // =========================================================================
  // ADMIN: EDIT METADATA OR PUBLISH / UNPUBLISH (STRICT READINESS CHECK)
  // =========================================================================
  router.patch('/admin/videos/:id', authGuard, adminGuard, async (req: AuthRequest, res: Response) => {
    try {
      const existing = await getVideoByIdOrPublicId(req.params.id);
      if (!existing) {
        return sendApiError(res, 404, 'VIDEO_NOT_FOUND', 'الفيديو غير موجود.');
      }

      const { titleAr, titleEn, description, category, thumbnailUrl, publicationStatus } = req.body || {};

      if (category !== undefined && !VIDEO_CATEGORIES.includes(category)) {
        return sendApiError(res, 400, 'INVALID_CATEGORY', 'التصنيف المحدد غير صالح.');
      }

      if (
        publicationStatus !== undefined &&
        !['draft', 'published', 'unpublished'].includes(publicationStatus)
      ) {
        return sendApiError(res, 400, 'INVALID_PUBLICATION_STATUS', 'حالة النشر المحددة غير صالحة.');
      }

      const result = await updateVideoMetadataAndPublication(
        existing.id,
        req.user?.uid || 'admin',
        {
          titleAr,
          titleEn,
          description,
          category,
          thumbnailUrl,
          publicationStatus,
        }
      );

      if (!result.ok) {
        return sendApiError(res, result.status, result.code, result.message);
      }

      return sendApiResponse(res, result.video);
    } catch (error: any) {
      console.error('Update video metadata error:', error);
      return sendApiError(res, 500, 'UPDATE_ERROR', 'تعذر تحديث بيانات الفيديو.');
    }
  });

  // =========================================================================
  // ADMIN: DELETE VIDEO FROM CLOUDFLARE STREAM & DATABASE
  // =========================================================================
  router.delete('/admin/videos/:id', authGuard, adminGuard, async (req: AuthRequest, res: Response) => {
    try {
      const existing = await getVideoByIdOrPublicId(req.params.id);
      if (!existing) {
        return sendApiError(res, 404, 'VIDEO_NOT_FOUND', 'الفيديو غير موجود.');
      }

      const cfg = resolveConfig();
      if (cfg && existing.streamVideoId) {
        try {
          await deleteCloudflareVideo(cfg, existing.streamVideoId, fetchImpl);
        } catch (cfErr) {
          console.error('Cloudflare delete error (proceeding carefully):', cfErr);
          return sendApiError(
            res,
            502,
            'CLOUDFLARE_DELETE_FAILED',
            'تعذر حذف الفيديو من خادم البث (Cloudflare Stream). يرجى المحاولة مرة أخرى.'
          );
        }
      }

      await deleteVideoRecord(existing.id, req.user?.uid || 'admin');
      return sendApiResponse(res, {
        deleted: true,
        id: existing.id,
        publicId: existing.publicId,
        streamVideoId: existing.streamVideoId,
      });
    } catch (error: any) {
      console.error('Delete video error:', error);
      return sendApiError(res, 500, 'DELETE_ERROR', 'تعذر حذف الفيديو.');
    }
  });

  // =========================================================================
  // CLOUDFLARE STREAM SIGNED WEBHOOK HANDLER
  // =========================================================================
  router.post('/webhooks/cloudflare-stream', async (req: Request, res: Response) => {
    try {
      const cfg = resolveConfig();
      const secret = cfg?.webhookSecret || process.env.CLOUDFLARE_STREAM_WEBHOOK_SECRET?.trim() || '';
      const rawBody: Buffer | string = (req as any).rawBody || JSON.stringify(req.body || {});
      const sigHeader = req.headers['webhook-signature'] as string | undefined;

      const verification = verifyCloudflareWebhookSignature(rawBody, sigHeader, secret);
      if (!verification.verified) {
        return sendApiError(
          res,
          401,
          'INVALID_WEBHOOK_SIGNATURE',
          `توقيع إشعار Cloudflare غير صالح (${verification.reason || 'UNAUTHORIZED'}).`
        );
      }

      const payload = req.body || {};
      const streamVideoId = payload.uid;
      if (!streamVideoId || typeof streamVideoId !== 'string') {
        return sendApiError(res, 400, 'MISSING_STREAM_UID', 'معرف الفيديو مفقود في حمولة الإشعار.');
      }

      const existing = await getVideoByStreamId(streamVideoId);
      if (!existing) {
        // Acknowledge unknown video UID with 202 so Cloudflare does not endlessly retry
        return sendApiResponse(res, { acknowledged: true, matched: false });
      }

      const statusObj = payload.status || {};
      const readyToStream = Boolean(payload.readyToStream);
      const state = String(statusObj.state || (readyToStream ? 'ready' : 'inprogress'));
      const mappedStatus = mapCloudflareStateToUploadStatus(state, readyToStream);

      const pctRaw = Number(statusObj.pctComplete ?? (readyToStream ? 100 : existing.processingProgress));
      const pctComplete = Number.isFinite(pctRaw) ? Math.max(0, Math.min(100, Math.round(pctRaw))) : 0;

      const playbackUrl =
        payload.playback?.hls ||
        (mappedStatus === 'ready'
          ? buildHlsUrl(streamVideoId, cfg?.customerSubdomain)
          : existing.playbackUrl);

      const thumbnailUrl =
        existing.thumbnailUrl ||
        payload.thumbnail ||
        (mappedStatus === 'ready'
          ? buildThumbnailUrl(streamVideoId, cfg?.customerSubdomain)
          : null);

      const errorMessage =
        mappedStatus === 'error'
          ? statusObj.errorReasonText || statusObj.errorReasonCode || 'فشلت معالجة الفيديو في Cloudflare Stream.'
          : null;

      const updated = await updateVideoUploadProgress(existing.id, {
        uploadStatus: mappedStatus,
        processingProgress: mappedStatus === 'ready' ? 100 : pctComplete,
        playbackUrl,
        previewUrl: payload.preview || existing.previewUrl,
        thumbnailUrl,
        durationSeconds: Number.isFinite(Number(payload.duration))
          ? Math.round(Number(payload.duration))
          : existing.durationSeconds,
        errorMessage,
      });

      await logVideoAuditEvent({
        videoId: existing.id,
        streamVideoId,
        eventType: 'webhook_received',
        actorUid: 'cloudflare-webhook',
        details: JSON.stringify({ state, readyToStream, pctComplete }),
      });

      return sendApiResponse(res, { acknowledged: true, matched: true, video: updated });
    } catch (error: any) {
      console.error('Cloudflare webhook error:', error);
      return sendApiError(res, 500, 'WEBHOOK_PROCESSING_ERROR', 'تعذر معالجة إشعار Cloudflare Stream.');
    }
  });

  // =========================================================================
  // PUBLIC VIDEO LIBRARY ENDPOINTS (ONLY PUBLISHED + READY)
  // =========================================================================
  router.get('/videos', async (req: Request, res: Response) => {
    try {
      const result = await listPublicVideos({
        q: req.query.q as string | undefined,
        category: req.query.category as string | undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 12,
      });
      return sendApiResponse(res, result);
    } catch (error: any) {
      console.error('Public video library fetch error:', error);
      return sendApiError(res, 500, 'DB_ERROR', 'تعذر تحميل المكتبة المرئية حالياً.');
    }
  });

  router.get('/videos/:id', async (req: Request, res: Response) => {
    try {
      const video = await getVideoByIdOrPublicId(req.params.id);
      if (!video || video.publicationStatus !== 'published' || video.uploadStatus !== 'ready') {
        return sendApiError(res, 404, 'VIDEO_NOT_FOUND', 'الفيديو المطلوب غير متاح أو غير منشور.');
      }
      return sendApiResponse(res, video);
    } catch (error: any) {
      return sendApiError(res, 500, 'DB_ERROR', 'تعذر تحميل بيانات الفيديو.');
    }
  });

  router.post('/videos/:id/view', async (req: Request, res: Response) => {
    try {
      const video = await getVideoByIdOrPublicId(req.params.id);
      if (!video || video.publicationStatus !== 'published' || video.uploadStatus !== 'ready') {
        return sendApiError(res, 404, 'VIDEO_NOT_FOUND', 'الفيديو غير موجود.');
      }
      await incrementVideoViewCount(video.id);
      return sendApiResponse(res, { viewsCount: video.viewsCount + 1 });
    } catch (error: any) {
      return sendApiError(res, 500, 'VIEW_COUNT_ERROR', 'تعذر تحديث عداد المشاهدات.');
    }
  });

  return router;
}
