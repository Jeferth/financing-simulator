import { drizzle } from 'drizzle-orm/libsql/node';
import { createClient } from '@libsql/client';
import * as schema from '../database/schema';
import { sql, eq, and, or } from 'drizzle-orm';

export const tables = schema;

type DB = ReturnType<typeof drizzle<typeof schema>>;

let db: DB | null = null;

export function useDrizzle() {
  if (!db) {
    const client = createClient({
      url: process.env.DATABASE_URL || 'file:./.data/db.sqlite',
    });
    db = drizzle(client, { schema });
  }
  return db;
}
