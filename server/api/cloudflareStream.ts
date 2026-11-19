import crypto from 'crypto';

export const ALLOWED_VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska',
  'video/mpeg',
  'video/x-msvideo',
  'video/3gpp',
  'video/3gpp2',
]);

export const ALLOWED_VIDEO_EXTENSIONS = new Set([
  '.mp4',
  '.m4v',
  '.mov',
  '.webm',
  '.mkv',
  '.mpeg',
  '.mpg',
  '.avi',
  '.3gp',
]);

export const VIDEO_CATEGORIES = [
  'quran_recitations',
  'islamic_lectures',
  'quran_memorization',
  'educational_courses',
  'charity_activities',
  'official_intro',
] as const;

export type ValidVideoCategory = (typeof VIDEO_CATEGORIES)[number];

export interface CloudflareConfig {
  accountId: string;
  apiToken: string;
  webhookSecret: string;
  customerSubdomain: string;
}

export function getCloudflareConfig(): CloudflareConfig | null {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim() || '';
  const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim() || '';
  const webhookSecret = process.env.CLOUDFLARE_STREAM_WEBHOOK_SECRET?.trim() || '';
  const customerSubdomain = process.env.CLOUDFLARE_CUSTOMER_SUBDOMAIN?.trim() || '';

  if (!accountId || !apiToken) {
    return null;
  }

  return {
    accountId,
    apiToken,
    webhookSecret,
    customerSubdomain,
  };
}

export function getMaxVideoSizeBytes(): number {
  const envVal = Number(process.env.VIDEO_MAX_FILE_SIZE_BYTES);
  // Default 5 GB (Cloudflare Stream TUS supports large files up to 30 GB; 5 GB safe campus policy)
  return Number.isFinite(envVal) && envVal > 0 ? envVal : 5 * 1024 * 1024 * 1024;
}

export function getMaxDurationSeconds(): number {
  const envVal = Number(process.env.VIDEO_UPLOAD_MAX_DURATION_SECONDS);
  return Number.isFinite(envVal) && envVal > 0 ? envVal : 14400; // 4 hours
}

export function validateVideoUploadInput(input: {
  fileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  titleAr?: string;
  titleEn?: string;
  category?: string;
}): { valid: true } | { valid: false; code: string; message: string } {
  const fileName = (input.fileName || '').trim();
  const mimeType = (input.mimeType || '').trim().toLowerCase();
  const fileSizeBytes = Number(input.fileSizeBytes || 0);
  const titleAr = (input.titleAr || '').trim();
  const titleEn = (input.titleEn || '').trim();
  const category = (input.category || '').trim();

  if (!titleAr || titleAr.length < 2) {
    return {
      valid: false,
      code: 'TITLE_AR_REQUIRED',
      message: 'العنوان العربي للفيديو مطلوب ويجب أن يتكون من حرفين على الأقل.',
    };
  }

  if (!titleEn || titleEn.length < 2) {
    return {
      valid: false,
      code: 'TITLE_EN_REQUIRED',
      message: 'العنوان الإنجليزي للفيديو مطلوب ويجب أن يتكون من حرفين على الأقل.',
    };
  }

  if (!VIDEO_CATEGORIES.includes(category as ValidVideoCategory)) {
    return {
      valid: false,
      code: 'INVALID_CATEGORY',
      message: 'التصنيف المحدد غير صالح. يرجى اختيار أحد التصنيفات الستة المعتمدة بالمجمع.',
    };
  }

  if (!fileName) {
    return {
      valid: false,
      code: 'FILENAME_REQUIRED',
      message: 'اسم ملف الفيديو مطلوب للتحقق من الصيغة.',
    };
  }

  const lowerName = fileName.toLowerCase();
  const extDotIdx = lowerName.lastIndexOf('.');
  const ext = extDotIdx >= 0 ? lowerName.slice(extDotIdx) : '';

  if (!ALLOWED_VIDEO_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      code: 'UNSUPPORTED_VIDEO_EXTENSION',
      message: `صيغة الملف (${ext || 'غير معروفة'}) غير مدعومة. الصيغ المسموحة هي: MP4, MOV, WEBM, MKV, MPEG, AVI.`,
    };
  }

  // Some mobile browsers send empty mimeType for .mkv or .mov; validate if provided
  if (mimeType && !ALLOWED_VIDEO_MIME_TYPES.has(mimeType) && !mimeType.startsWith('video/')) {
    return {
      valid: false,
      code: 'UNSUPPORTED_MIME_TYPE',
      message: `نوع الملف (${mimeType}) غير صالح. يرجى اختيار ملف فيديو معتمد فقط.`,
    };
  }

  const maxBytes = getMaxVideoSizeBytes();
  if (!Number.isFinite(fileSizeBytes) || fileSizeBytes <= 0) {
    return {
      valid: false,
      code: 'INVALID_FILE_SIZE',
      message: 'حجم ملف الفيديو غير صالح أو يساوي صفراً.',
    };
  }

  if (fileSizeBytes > maxBytes) {
    const maxGb = (maxBytes / (1024 * 1024 * 1024)).toFixed(1);
    return {
      valid: false,
      code: 'FILE_TOO_LARGE',
      message: `حجم الفيديو يتجاوز الحد الأقصى المسموح به (${maxGb} جيجابايت). يرجى ضغط الملف أو تقسيمه.`,
    };
  }

  return { valid: true };
}

export interface DirectTusUploadResult {
  uploadUrl: string;
  streamVideoId: string;
  expiresAt: string;
}

/**
 * Requests a one-time resumable TUS Direct Creator Upload URL from Cloudflare Stream.
 * Reference: https://developers.cloudflare.com/stream/uploading-videos/resumable-uploads/
 * Note: Uses ?direct_user=true with Tus-Resumable: 1.0.0 so the browser uploads chunks
 * directly to Cloudflare edge without touching our API token.
 */
export async function createDirectTusUploadUrl(
  config: CloudflareConfig,
  params: {
    fileSizeBytes: number;
    fileName: string;
    titleAr: string;
    titleEn: string;
    category: string;
    adminUid: string;
    allowedOrigins?: string[];
  },
  fetchImpl: typeof fetch = fetch
): Promise<DirectTusUploadResult> {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(config.accountId)}/stream?direct_user=true`;

  const encodeMeta = (val: string) => Buffer.from(val, 'utf8').toString('base64');
  const maxDurationSeconds = getMaxDurationSeconds();
  const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour TUS upload window

  const metadataParts = [
    `name ${encodeMeta(params.fileName.slice(0, 120))}`,
    `maxDurationSeconds ${encodeMeta(String(maxDurationSeconds))}`,
    `expiry ${encodeMeta(expiryDate.toISOString())}`,
    `requiresignedurls ${encodeMeta('false')}`,
  ];

  if (params.allowedOrigins && params.allowedOrigins.length > 0) {
    metadataParts.push(`allowedorigins ${encodeMeta(params.allowedOrigins.join(','))}`);
  }

  const response = await fetchImpl(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      'Tus-Resumable': '1.0.0',
      'Upload-Length': String(params.fileSizeBytes),
      'Upload-Metadata': metadataParts.join(','),
      'Upload-Creator': params.adminUid,
    },
  });

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status}`;
    try {
      const text = await response.text();
      if (text) errorDetail += `: ${text.slice(0, 300)}`;
    } catch (_) {}
    throw new Error(`CLOUDFLARE_TUS_INIT_FAILED: ${errorDetail}`);
  }

  const uploadUrl = response.headers.get('location') || response.headers.get('Location');
  const streamVideoId =
    response.headers.get('stream-media-id') ||
    response.headers.get('Stream-Media-Id');

  if (!uploadUrl || !streamVideoId) {
    throw new Error('CLOUDFLARE_TUS_MISSING_HEADERS: Missing Location or stream-media-id header');
  }

  return {
    uploadUrl,
    streamVideoId,
    expiresAt: expiryDate.toISOString(),
  };
}

export interface CloudflareStreamVideoInfo {
  streamVideoId: string;
  state: 'pendingupload' | 'downloading' | 'queued' | 'inprogress' | 'ready' | 'error';
  pctComplete: number;
  readyToStream: boolean;
  durationSeconds: number;
  playbackHlsUrl: string | null;
  previewUrl: string | null;
  thumbnailUrl: string | null;
  errorReasonCode: string | null;
  errorReasonText: string | null;
}

export function buildHlsUrl(streamVideoId: string, customerSubdomain?: string): string {
  if (customerSubdomain) {
    const cleanHost = customerSubdomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    return `https://${cleanHost}/${streamVideoId}/manifest/video.m3u8`;
  }
  return `https://videodelivery.net/${streamVideoId}/manifest/video.m3u8`;
}

export function buildThumbnailUrl(streamVideoId: string, customerSubdomain?: string): string {
  if (customerSubdomain) {
    const cleanHost = customerSubdomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    return `https://${cleanHost}/${streamVideoId}/thumbnails/thumbnail.jpg?time=2s&height=720`;
  }
  return `https://videodelivery.net/${streamVideoId}/thumbnails/thumbnail.jpg?time=2s&height=720`;
}

export async function getCloudflareVideoDetails(
  config: CloudflareConfig,
  streamVideoId: string,
  fetchImpl: typeof fetch = fetch
): Promise<CloudflareStreamVideoInfo> {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(config.accountId)}/stream/${encodeURIComponent(streamVideoId)}`;
  const response = await fetchImpl(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const txt = await response.text().catch(() => '');
    throw new Error(`CLOUDFLARE_GET_VIDEO_FAILED (${response.status}): ${txt.slice(0, 240)}`);
  }

  const json: any = await response.json();
  const result = json?.result || {};
  const statusObj = result.status || {};
  const state = (statusObj.state || 'queued') as CloudflareStreamVideoInfo['state'];
  const pctRaw = Number(statusObj.pctComplete ?? (result.readyToStream ? 100 : 0));
  const pctComplete = Number.isFinite(pctRaw) ? Math.max(0, Math.min(100, Math.round(pctRaw))) : 0;

  return {
    streamVideoId: result.uid || streamVideoId,
    state,
    pctComplete,
    readyToStream: Boolean(result.readyToStream),
    durationSeconds: Number.isFinite(Number(result.duration)) ? Math.round(Number(result.duration)) : 0,
    playbackHlsUrl:
      result.playback?.hls ||
      (result.readyToStream ? buildHlsUrl(streamVideoId, config.customerSubdomain) : null),
    previewUrl: result.preview || null,
    thumbnailUrl: result.thumbnail || null,
    errorReasonCode: statusObj.errorReasonCode || null,
    errorReasonText: statusObj.errorReasonText || null,
  };
}

export async function deleteCloudflareVideo(
  config: CloudflareConfig,
  streamVideoId: string,
  fetchImpl: typeof fetch = fetch
): Promise<void> {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(config.accountId)}/stream/${encodeURIComponent(streamVideoId)}`;
  const response = await fetchImpl(endpoint, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
    },
  });

  // Treat 404 as already deleted on Cloudflare
  if (!response.ok && response.status !== 404) {
    const txt = await response.text().catch(() => '');
    throw new Error(`CLOUDFLARE_DELETE_FAILED (${response.status}): ${txt.slice(0, 240)}`);
  }
}

/**
 * Verifies Cloudflare Stream Webhook-Signature header:
 * Header format: `time=1640000000,sig1=<hex_hmac_sha256>`
 * Signed payload: `${time}.${rawBody}`
 * Reference: https://developers.cloudflare.com/stream/manage-video-library/using-webhooks/
 */
export function verifyCloudflareWebhookSignature(
  rawBody: string | Buffer,
  signatureHeader: string | undefined,
  secret: string,
  toleranceSeconds = 600,
  nowUnixSeconds = Math.floor(Date.now() / 1000)
): { verified: boolean; reason?: string } {
  if (!secret) {
    return { verified: false, reason: 'WEBHOOK_SECRET_NOT_CONFIGURED' };
  }
  if (!signatureHeader || typeof signatureHeader !== 'string') {
    return { verified: false, reason: 'MISSING_SIGNATURE_HEADER' };
  }

  const parts = signatureHeader.split(',').reduce<Record<string, string>>((acc, part) => {
    const [k, ...rest] = part.trim().split('=');
    if (k && rest.length > 0) {
      acc[k] = rest.join('=');
    }
    return acc;
  }, {});

  const timestampStr = parts.time;
  const sigHex = parts.sig1;

  if (!timestampStr || !sigHex) {
    return { verified: false, reason: 'MALFORMED_SIGNATURE_HEADER' };
  }

  const timestamp = Number(timestampStr);
  if (!Number.isFinite(timestamp)) {
    return { verified: false, reason: 'INVALID_TIMESTAMP' };
  }

  if (Math.abs(nowUnixSeconds - timestamp) > toleranceSeconds) {
    return { verified: false, reason: 'SIGNATURE_TIMESTAMP_EXPIRED' };
  }

  const bodyStr = Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : rawBody;
  const signedPayload = `${timestampStr}.${bodyStr}`;
  const expectedHex = crypto
    .createHmac('sha256', secret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  const sigBuf = Buffer.from(sigHex, 'hex');
  const expectedBuf = Buffer.from(expectedHex, 'hex');

  if (sigBuf.length === 0 || sigBuf.length !== expectedBuf.length) {
    return { verified: false, reason: 'SIGNATURE_MISMATCH' };
  }

  const match = crypto.timingSafeEqual(sigBuf, expectedBuf);
  return match ? { verified: true } : { verified: false, reason: 'SIGNATURE_MISMATCH' };
}

export function mapCloudflareStateToUploadStatus(
  state: string,
  readyToStream: boolean
): 'pending_upload' | 'uploading' | 'processing' | 'ready' | 'error' {
  const s = (state || '').toLowerCase();
  if (readyToStream || s === 'ready') return 'ready';
  if (s === 'error') return 'error';
  if (s === 'pendingupload') return 'pending_upload';
  if (s === 'downloading') return 'uploading';
  return 'processing';
}
