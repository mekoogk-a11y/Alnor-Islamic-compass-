import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

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

// User Relations
export const usersRelations = relations(users, ({ many }) => ({
  enrollments: many(enrollments),
  orphanSponsorships: many(orphanSponsorships),
  waqfDonations: many(waqfDonations),
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
