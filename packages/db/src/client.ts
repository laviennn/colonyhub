import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

type DbInstance = ReturnType<typeof drizzle<typeof schema>>;

let cachedDb: DbInstance | null = null;

export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0);
}

export function getPostgresDb(): DbInstance {
  if (cachedDb) return cachedDb;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not configured');
  }
  const sql = postgres(url, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  cachedDb = drizzle(sql, { schema });
  return cachedDb;
}
