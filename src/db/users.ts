import { db } from './index.ts';
import { users, enrollments, orphanSponsorships, waqfDonations } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface UserPayload {
  uid: string;
  email: string;
  displayName?: string | null;
  photoUrl?: string | null;
  role?: string;
  preferredLanguage?: string;
}

/**
 * Safely get or register a user upon authentication using Drizzle upsert
 */
export async function getOrCreateUser(payload: UserPayload) {
  try {
    const result = await db.insert(users)
      .values({
        uid: payload.uid,
        email: payload.email,
        displayName: payload.displayName || null,
        photoUrl: payload.photoUrl || null,
        role: payload.role || 'student',
        preferredLanguage: payload.preferredLanguage || 'ar',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: payload.email,
          ...(payload.displayName ? { displayName: payload.displayName } : {}),
          ...(payload.photoUrl ? { photoUrl: payload.photoUrl } : {}),
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query getOrCreateUser failed:', error);
    throw new Error('Database operation failed. Please try again later.', { cause: error });
  }
}

/**
 * Fetch user record by Firebase UID
 */
export async function getUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Database query getUserByUid failed:', error);
    throw new Error('Database operation failed. Please try again later.', { cause: error });
  }
}

/**
 * Fetch all registered users (for admin or directory)
 */
export async function getAllUsers() {
  try {
    return await db.select().from(users).orderBy(desc(users.createdAt)).limit(100);
  } catch (error) {
    console.error('Database query getAllUsers failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

/**
 * Get user enrollments
 */
export async function getUserEnrollments(userDbId: number) {
  try {
    return await db.select().from(enrollments).where(eq(enrollments.userId, userDbId));
  } catch (error) {
    console.error('Database query getUserEnrollments failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

/**
 * Get user orphan sponsorships
 */
export async function getUserOrphanSponsorships(userDbId: number) {
  try {
    return await db.select().from(orphanSponsorships).where(eq(orphanSponsorships.userId, userDbId));
  } catch (error) {
    console.error('Database query getUserOrphanSponsorships failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
