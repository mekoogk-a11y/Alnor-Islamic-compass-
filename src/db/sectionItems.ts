import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { sectionItems } from './schema.ts';

export type DbSectionItem = typeof sectionItems.$inferSelect;

export async function listSectionItemsBySlug(section: string): Promise<DbSectionItem[]> {
  return db
    .select()
    .from(sectionItems)
    .where(eq(sectionItems.section, section))
    .orderBy(desc(sectionItems.createdAt));
}

export async function listAllSectionItems(): Promise<DbSectionItem[]> {
  return db
    .select()
    .from(sectionItems)
    .orderBy(desc(sectionItems.createdAt));
}

export async function createSectionItemRecord(input: {
  section: string;
  title: string;
  body?: string;
  url?: string;
  adminUid: string;
}): Promise<DbSectionItem> {
  const now = new Date();
  const [inserted] = await db
    .insert(sectionItems)
    .values({
      section: input.section.trim(),
      title: input.title.trim(),
      body: (input.body || '').trim(),
      url: (input.url || '').trim(),
      adminUid: input.adminUid,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return inserted;
}

export async function deleteSectionItemRecord(id: number): Promise<boolean> {
  const deleted = await db
    .delete(sectionItems)
    .where(eq(sectionItems.id, id))
    .returning({ id: sectionItems.id });
  return deleted.length > 0;
}
