import { relations } from 'drizzle-orm';
import { bigint, integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// Users table linked directly to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  role: text('role').default('student').notNull(), // 'admin' | 'scholar' | 'student' | 'donor'
  preferredLanguage: text('preferred_language').default('ar').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Quran memorization & academy course enrollments
export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  courseId: text('course_id').notNull(),
  courseTitle: text('course_title').notNull(),
  track: text('track').notNull(), // 'memorization' | 'tajweed' | 'qiraat' | 'sciences'
  status: text('status').default('active').notNull(), // 'active' | 'completed' | 'paused'
  progressPercentage: integer('progress_percentage').default(0).notNull(),
  enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
});

// Orphans sponsorships records
export const orphanSponsorships = pgTable('orphan_sponsorships', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  orphanId: text('orphan_id').notNull(),
  orphanName: text('orphan_name').notNull(),
  country: text('country').notNull(),
  monthlyAmountUsd: integer('monthly_amount_usd').notNull(),
  billingFrequency: text('billing_frequency').default('monthly').notNull(),
  status: text('status').default('active').notNull(),
  sponsoredAt: timestamp('sponsored_at').defaultNow().notNull(),
});

// Waqf & Charity shares
export const waqfDonations = pgTable('waqf_donations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  campaignId: text('campaign_id').notNull(),
  campaignTitle: text('campaign_title').notNull(),
  sharesCount: integer('shares_count').default(1).notNull(),
  amountUsd: integer('amount_usd').notNull(),
  isAnonymous: boolean('is_anonymous').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Dawah inquiries and requests for Quran / Mentor
export const dawahInquiries = pgTable('dawah_inquiries', {
  id: serial('id').primaryKey(),
  inquiryType: text('inquiry_type').notNull(), // 'question' | 'free_quran' | 'counselor_request' | 'new_muslim'
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  country: text('country'),
  preferredLanguage: text('preferred_language').default('en').notNull(),
  message: text('message').notNull(),
  status: text('status').default('pending').notNull(), // 'pending' | 'assigned' | 'in_dialogue' | 'resolved'
  assignedMentor: text('assigned_mentor'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// New Muslims personalized progress and confidential mentorship
export const newMuslimsProgress = pgTable('new_muslims_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  convertedYear: text('converted_year'),
  nativeLanguage: text('native_language').default('en').notNull(),
  shahadaCompleted: boolean('shahada_completed').default(true).notNull(),
  wuduMastered: boolean('wudu_mastered').default(false).notNull(),
  prayerLevel: text('prayer_level').default('learning').notNull(), // 'learning' | 'daily_practicing' | 'consistent'
  memorizedSurahsCount: integer('memorized_surahs_count').default(1).notNull(),
  mentorAssigned: text('mentor_assigned'),
  confidentialNotes: text('confidential_notes'),
  lastCheckinAt: timestamp('last_checkin_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Academy course quizzes, tests, and score tracking
export const quizSubmissions = pgTable('quiz_submissions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  courseId: text('course_id').notNull(),
  quizId: text('quiz_id').notNull(),
  scorePercentage: integer('score_percentage').notNull(),
  passed: boolean('passed').notNull(),
  answersJson: text('answers_json'),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

// Formal verifiable certificates of completion
export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  certificateCode: text('certificate_code').notNull().unique(), // e.g. ALNOOR-CERT-XXXXXX
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  recipientName: text('recipient_name').notNull(),
  courseTitle: text('course_title').notNull(),
  track: text('track').notNull(),
  grade: text('grade').default('ممتاز').notNull(),
  issuedAt: timestamp('issued_at').defaultNow().notNull(),
  isRevoked: boolean('is_revoked').default(false).notNull(),
});

// Quran.com style bookmarks, notes, and study bookmarks
export const userBookmarks = pgTable('user_bookmarks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  itemType: text('item_type').notNull(), // 'ayah' | 'hadith' | 'book' | 'dawah_lecture'
  itemId: text('item_id').notNull(),
  title: text('title').notNull(),
  notes: text('notes'),
  savedAt: timestamp('saved_at').defaultNow().notNull(),
});

// Cloudflare Stream Video Management & Adaptive Streaming Catalog
export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  publicId: text('public_id').notNull().unique(),
  titleAr: text('title_ar').notNull(),
  titleEn: text('title_en').notNull(),
  description: text('description').default('').notNull(),
  category: text('category').notNull(), // 'quran_recitations' | 'islamic_lectures' | 'quran_memorization' | 'educational_courses' | 'charity_activities' | 'official_intro'
  thumbnailUrl: text('thumbnail_url'),
  streamVideoId: text('stream_video_id').notNull().unique(),
  playbackUrl: text('playback_url'),
  previewUrl: text('preview_url'),
  durationSeconds: integer('duration_seconds').default(0).notNull(),
  fileSizeBytes: bigint('file_size_bytes', { mode: 'number' }).default(0).notNull(),
  mimeType: text('mime_type').default('video/mp4').notNull(),
  originalFileName: text('original_file_name').default('').notNull(),
  fileFingerprint: text('file_fingerprint').notNull(),
  uploadUrlExpiresAt: timestamp('upload_url_expires_at'),
  uploadStatus: text('upload_status').default('pending_upload').notNull(), // 'pending_upload' | 'uploading' | 'processing' | 'ready' | 'error'
  processingProgress: integer('processing_progress').default(0).notNull(),
  publicationStatus: text('publication_status').default('draft').notNull(), // 'draft' | 'published' | 'unpublished'
  errorMessage: text('error_message'),
  adminId: integer('admin_id').references(() => users.id),
  adminUid: text('admin_uid').notNull(),
  adminEmail: text('admin_email').notNull(),
  viewsCount: integer('views_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Audit trail for video uploads, Cloudflare webhooks, and publication changes
export const videoAuditLogs = pgTable('video_audit_logs', {
  id: serial('id').primaryKey(),
  videoId: integer('video_id').references(() => videos.id, { onDelete: 'cascade' }),
  streamVideoId: text('stream_video_id'),
  eventType: text('event_type').notNull(),
  actorUid: text('actor_uid'),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Dynamic admin-managed items linked to any portal section slug
export const sectionItems = pgTable('section_items', {
  id: serial('id').primaryKey(),
  section: text('section').notNull(),
  title: text('title').notNull(),
  body: text('body').default('').notNull(),
  url: text('url').default('').notNull(),
  adminUid: text('admin_uid').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  enrollments: many(enrollments),
  orphanSponsorships: many(orphanSponsorships),
  waqfDonations: many(waqfDonations),
  quizSubmissions: many(quizSubmissions),
  certificates: many(certificates),
  bookmarks: many(userBookmarks),
  videos: many(videos),
  newMuslimProgress: one(newMuslimsProgress, {
    fields: [users.id],
    references: [newMuslimsProgress.userId],
  }),
}));

// Video Relations
export const videosRelations = relations(videos, ({ one, many }) => ({
  admin: one(users, {
    fields: [videos.adminId],
    references: [users.id],
  }),
  auditLogs: many(videoAuditLogs),
}));

export const videoAuditLogsRelations = relations(videoAuditLogs, ({ one }) => ({
  video: one(videos, {
    fields: [videoAuditLogs.videoId],
    references: [videos.id],
  }),
}));

// Enrollment Relations
export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
}));

// Orphan Sponsorship Relations
export const orphanSponsorshipsRelations = relations(orphanSponsorships, ({ one }) => ({
  user: one(users, {
    fields: [orphanSponsorships.userId],
    references: [users.id],
  }),
}));

// Waqf Donation Relations
export const waqfDonationsRelations = relations(waqfDonations, ({ one }) => ({
  user: one(users, {
    fields: [waqfDonations.userId],
    references: [users.id],
  }),
}));

// Certificate Relations
export const certificatesRelations = relations(certificates, ({ one }) => ({
  user: one(users, {
    fields: [certificates.userId],
    references: [users.id],
  }),
}));


