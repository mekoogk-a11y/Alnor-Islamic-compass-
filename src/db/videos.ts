import crypto from 'crypto';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from './index.ts';
import { videoAuditLogs, videos } from './schema.ts';
import type { VideoCategory, VideoPublicationStatus, VideoUploadStatus } from '../types.ts';

export type DbVideoRow = typeof videos.$inferSelect;

export interface CreateVideoDraftInput {
  titleAr: string;
  titleEn: string;
  description?: string;
  category: VideoCategory;
  thumbnailUrl?: string | null;
  streamVideoId: string;
  playbackUrl?: string | null;
  previewUrl?: string | null;
  fileSizeBytes: number;
  mimeType: string;
  originalFileName: string;
  fileFingerprint: string;
  uploadUrlExpiresAt: Date;
  adminId?: number | null;
  adminUid: string;
  adminEmail: string;
}

export function generatePublicVideoId(): string {
  return `VID-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
}

export async function logVideoAuditEvent(params: {
  videoId?: number | null;
  streamVideoId?: string | null;
  eventType: string;
  actorUid?: string | null;
  details?: string | null;
}) {
  try {
    await db.insert(videoAuditLogs).values({
      videoId: params.videoId ?? null,
      streamVideoId: params.streamVideoId ?? null,
      eventType: params.eventType,
      actorUid: params.actorUid ?? null,
      details: params.details ?? null,
    });
  } catch (err) {
    console.error('Failed to record video audit log:', err);
  }
}

/**
 * Prevents duplicate uploads by checking if a non-errored video with the same fingerprint
 * is already pending upload, uploading, processing, or ready.
 */
export async function findDuplicateActiveVideo(fileFingerprint: string) {
  if (!fileFingerprint) return null;
  const rows = await db
    .select()
    .from(videos)
    .where(
      and(
        eq(videos.fileFingerprint, fileFingerprint),
        sql`${videos.uploadStatus} != 'error'`
      )
    )
    .orderBy(desc(videos.createdAt))
    .limit(1);

  return rows[0] || null;
}

export async function createVideoRecord(input: CreateVideoDraftInput) {
  const publicId = generatePublicVideoId();
  const inserted = await db
    .insert(videos)
    .values({
      publicId,
      titleAr: input.titleAr.trim(),
      titleEn: input.titleEn.trim(),
      description: (input.description || '').trim(),
      category: input.category,
      thumbnailUrl: input.thumbnailUrl || null,
      streamVideoId: input.streamVideoId,
      playbackUrl: input.playbackUrl || null,
      previewUrl: input.previewUrl || null,
      fileSizeBytes: input.fileSizeBytes,
      mimeType: input.mimeType,
      originalFileName: input.originalFileName,
      fileFingerprint: input.fileFingerprint,
      uploadUrlExpiresAt: input.uploadUrlExpiresAt,
      uploadStatus: 'pending_upload',
      processingProgress: 0,
      publicationStatus: 'draft',
      adminId: input.adminId ?? null,
      adminUid: input.adminUid,
      adminEmail: input.adminEmail,
    })
    .returning();

  const record = inserted[0];
  await logVideoAuditEvent({
    videoId: record.id,
    streamVideoId: record.streamVideoId,
    eventType: 'upload_url_created',
    actorUid: input.adminUid,
    details: JSON.stringify({
      publicId: record.publicId,
      fileName: record.originalFileName,
      fileSizeBytes: record.fileSizeBytes,
    }),
  });

  return record;
}

export async function getVideoByIdOrPublicId(idOrPublicId: string | number) {
  const str = String(idOrPublicId).trim();
  const isNumeric = /^\d+$/.test(str);
  const rows = await db
    .select()
    .from(videos)
    .where(isNumeric ? eq(videos.id, Number(str)) : eq(videos.publicId, str))
    .limit(1);
  return rows[0] || null;
}

export async function getVideoByStreamId(streamVideoId: string) {
  const rows = await db
    .select()
    .from(videos)
    .where(eq(videos.streamVideoId, streamVideoId))
    .limit(1);
  return rows[0] || null;
}

export async function updateVideoUploadProgress(
  id: number,
  payload: {
    uploadStatus?: VideoUploadStatus;
    processingProgress?: number;
    playbackUrl?: string | null;
    previewUrl?: string | null;
    thumbnailUrl?: string | null;
    durationSeconds?: number;
    errorMessage?: string | null;
  }
) {
  const updateSet: Partial<typeof videos.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (payload.uploadStatus !== undefined) updateSet.uploadStatus = payload.uploadStatus;
  if (payload.processingProgress !== undefined) {
    updateSet.processingProgress = Math.max(0, Math.min(100, Math.round(payload.processingProgress)));
  }
  if (payload.playbackUrl !== undefined) updateSet.playbackUrl = payload.playbackUrl;
  if (payload.previewUrl !== undefined) updateSet.previewUrl = payload.previewUrl;
  if (payload.thumbnailUrl !== undefined) updateSet.thumbnailUrl = payload.thumbnailUrl;
  if (payload.durationSeconds !== undefined) updateSet.durationSeconds = payload.durationSeconds;
  if (payload.errorMessage !== undefined) updateSet.errorMessage = payload.errorMessage;

  // Never allow a failed video to remain published
  if (payload.uploadStatus === 'error') {
    updateSet.publicationStatus = 'unpublished';
  }

  const rows = await db
    .update(videos)
    .set(updateSet)
    .where(eq(videos.id, id))
    .returning();

  return rows[0] || null;
}

/**
 * Enforces strict readiness check before publishing:
 * A video CANNOT be published unless uploadStatus === 'ready' AND playbackUrl is present.
 */
export async function updateVideoMetadataAndPublication(
  id: number,
  actorUid: string,
  updates: {
    titleAr?: string;
    titleEn?: string;
    description?: string;
    category?: VideoCategory;
    thumbnailUrl?: string | null;
    publicationStatus?: VideoPublicationStatus;
  }
): Promise<{ ok: true; video: DbVideoRow } | { ok: false; status: number; code: string; message: string }> {
  const existing = await getVideoByIdOrPublicId(id);
  if (!existing) {
    return { ok: false, status: 404, code: 'VIDEO_NOT_FOUND', message: 'الفيديو غير موجود.' };
  }

  if (updates.publicationStatus === 'published') {
    if (existing.uploadStatus !== 'ready' || !existing.playbackUrl) {
      return {
        ok: false,
        status: 409,
        code: 'VIDEO_NOT_READY_FOR_PUBLISH',
        message: 'لا يمكن نشر الفيديو قبل اكتمال رفعه ومعالجته بنجاح وجاهزية رابط البث التكيفي (HLS).',
      };
    }
  }

  const updateSet: Partial<typeof videos.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (updates.titleAr !== undefined) updateSet.titleAr = updates.titleAr.trim();
  if (updates.titleEn !== undefined) updateSet.titleEn = updates.titleEn.trim();
  if (updates.description !== undefined) updateSet.description = updates.description.trim();
  if (updates.category !== undefined) updateSet.category = updates.category;
  if (updates.thumbnailUrl !== undefined) updateSet.thumbnailUrl = updates.thumbnailUrl;
  if (updates.publicationStatus !== undefined) updateSet.publicationStatus = updates.publicationStatus;

  const updated = await db
    .update(videos)
    .set(updateSet)
    .where(eq(videos.id, existing.id))
    .returning();

  const video = updated[0];

  await logVideoAuditEvent({
    videoId: video.id,
    streamVideoId: video.streamVideoId,
    eventType:
      updates.publicationStatus === 'published'
        ? 'published'
        : updates.publicationStatus === 'unpublished'
        ? 'unpublished'
        : 'edited',
    actorUid,
    details: JSON.stringify({
      publicationStatus: video.publicationStatus,
      category: video.category,
    }),
  });

  return { ok: true, video };
}

export async function deleteVideoRecord(id: number, actorUid: string) {
  const existing = await getVideoByIdOrPublicId(id);
  if (!existing) return null;

  await logVideoAuditEvent({
    videoId: existing.id,
    streamVideoId: existing.streamVideoId,
    eventType: 'deleted',
    actorUid,
    details: JSON.stringify({ publicId: existing.publicId, titleAr: existing.titleAr }),
  });

  await db.delete(videos).where(eq(videos.id, existing.id));
  return existing;
}

export async function listPublicVideos(params: {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, Number(params.page || 1));
  const limit = Math.min(48, Math.max(1, Number(params.limit || 12)));
  const offset = (page - 1) * limit;

  const conditions = [
    eq(videos.publicationStatus, 'published'),
    eq(videos.uploadStatus, 'ready'),
  ];

  if (params.category && params.category !== 'all') {
    conditions.push(eq(videos.category, params.category));
  }

  if (params.q && params.q.trim()) {
    const term = `%${params.q.trim()}%`;
    const searchCond = or(
      ilike(videos.titleAr, term),
      ilike(videos.titleEn, term),
      ilike(videos.description, term)
    );
    if (searchCond) conditions.push(searchCond);
  }

  const whereClause = and(...conditions);

  const [items, countRows] = await Promise.all([
    db
      .select()
      .from(videos)
      .where(whereClause)
      .orderBy(desc(videos.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(videos)
      .where(whereClause),
  ]);

  const total = countRows[0]?.count ?? 0;

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function listAdminVideos(params: {
  q?: string;
  category?: string;
  uploadStatus?: string;
  publicationStatus?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, Number(params.page || 1));
  const limit = Math.min(100, Math.max(1, Number(params.limit || 25)));
  const offset = (page - 1) * limit;

  const conditions = [];

  if (params.category && params.category !== 'all') {
    conditions.push(eq(videos.category, params.category));
  }
  if (params.uploadStatus && params.uploadStatus !== 'all') {
    conditions.push(eq(videos.uploadStatus, params.uploadStatus));
  }
  if (params.publicationStatus && params.publicationStatus !== 'all') {
    conditions.push(eq(videos.publicationStatus, params.publicationStatus));
  }
  if (params.q && params.q.trim()) {
    const term = `%${params.q.trim()}%`;
    const searchCond = or(
      ilike(videos.titleAr, term),
      ilike(videos.titleEn, term),
      ilike(videos.publicId, term),
      ilike(videos.streamVideoId, term)
    );
    if (searchCond) conditions.push(searchCond);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, countRows] = await Promise.all([
    db
      .select()
      .from(videos)
      .where(whereClause)
      .orderBy(desc(videos.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(videos)
      .where(whereClause),
  ]);

  const total = countRows[0]?.count ?? 0;

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function incrementVideoViewCount(id: number) {
  await db
    .update(videos)
    .set({ viewsCount: sql`${videos.viewsCount} + 1` })
    .where(eq(videos.id, id));
}
