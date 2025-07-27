import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../database/schema';
import { sql, eq, and, or } from 'drizzle-orm';

export const tables = schema;

type DB = ReturnType<typeof drizzle<typeof schema>>;

let db: DB | null = null;

export function useDrizzle() {
  if (!db) {
    const client = postgres(process.env.DATABASE_URL || 'postgresql://localhost:5432/financing_simulator');
    db = drizzle(client, { schema });
  }
  return db;
}
