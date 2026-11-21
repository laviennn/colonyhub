import { INSIGHT_CATEGORIES } from '@colonyhub/content';
import { hashPassword } from './auth';
import { getPostgresDb, hasDatabaseUrl } from './client';
import { listRoles } from './repository';
import { authors, categories, siteSettings, users } from './schema';

async function seed() {
  if (!hasDatabaseUrl()) {
    console.error('DATABASE_URL is not set. Load .env.local before running db:seed.');
    process.exit(1);
  }

  const db = getPostgresDb();

  // 1. Seed default roles & sync all ADMIN_MENUS permissions
  const syncedRoles = await listRoles();
  const roleBySlug = new Map(syncedRoles.map((r) => [r.slug, r.id]));
  console.log(`Roles synced: ${syncedRoles.map((r) => r.slug).join(', ')}`);

  // 2. Seed initial Command Center accounts (idempotent)
  const existingUsers = await db.select({ id: users.id }).from(users).limit(1);
  if (existingUsers.length === 0) {
    await db
      .insert(users)
      .values([
        {
          email: 'admin@colonyhub.local',
          displayName: 'Colony Super Admin',
          role: 'admin',
          roleId: roleBySlug.get('superadmin') ?? null,
          passwordHash: hashPassword('colonyhub-admin-dev'),
          mfaEnabled: false,
        },
        {
          email: 'reviewer@colonyhub.local',
          displayName: 'Colony Reviewer',
          role: 'reviewer',
          roleId: roleBySlug.get('reviewer') ?? null,
          passwordHash: hashPassword('colonyhub-reviewer-dev'),
          mfaEnabled: false,
        },
        {
          email: 'editor@colonyhub.local',
          displayName: 'Colony Editor',
          role: 'editor',
          roleId: roleBySlug.get('editor') ?? null,
          passwordHash: hashPassword('colonyhub-editor-dev'),
          mfaEnabled: false,
        },
      ])
      .onConflictDoNothing();
    console.log('Seeded initial accounts (admin, reviewer, editor).');
  } else {
    console.log('Users table already populated; skipping user seed.');
  }

  // 3. Seed default author (idempotent)
  const existingAuthors = await db.select({ id: authors.id }).from(authors).limit(1);
  if (existingAuthors.length === 0) {
    await db.insert(authors).values({
      displayName: 'colonyhub Editorial',
      role: 'Editorial Team',
      bio: 'Integrated digital strategy, design, engineering, and growth team at colonyhub.',
      consentApproved: true,
    });
    console.log('Seeded default author (colonyhub Editorial).');
  } else {
    console.log('Authors table already populated; skipping author seed.');
  }

  // 4. Seed 5 official Insight categories (idempotent)
  for (let i = 0; i < INSIGHT_CATEGORIES.length; i++) {
    const cat = INSIGHT_CATEGORIES[i]!;
    await db
      .insert(categories)
      .values({
        slug: cat.slug,
        nameEn: cat.name.en,
        nameId: cat.name.id,
        sortOrder: i + 1,
      })
      .onConflictDoNothing();
  }
  console.log(`Synced ${INSIGHT_CATEGORIES.length} Insight categories.`);

  // 5. Seed default tracking settings row (idempotent)
  await db
    .insert(siteSettings)
    .values({
      key: 'tracking',
      valueJson: {
        enabled: false,
        ga4MeasurementId: '',
        gtmContainerId: '',
        metaPixelId: '',
      },
      updatedBy: 'seed',
    })
    .onConflictDoNothing();
  console.log('Synced default tracking settings row.');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
