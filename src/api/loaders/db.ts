import { drizzle } from 'drizzle-orm/node-postgres';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Pool } from 'pg';
import config from '../../config';
import AppLogger from './logger';
import * as schema from '../../schema';

export type Database = PostgresJsDatabase<typeof schema>;

export default async (): Promise<{ writeDb: Database; readDb: Database }> => {
  if (!config.database.postgre.write) {
    throw new Error('DATABASE_URL_WRITE is not set in config');
  }

  const writeClient = new Pool({
    connectionString: config.database.postgre.write,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 10000
  });

  const readClient = new Pool({
    connectionString: config.database.postgre.read,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 10000
  });

  try {
    const writeDb = drizzle(writeClient, { schema }) as Database;
    const readDb = drizzle(readClient, { schema }) as Database;
    AppLogger.info('✌️ Drizzle connected to PostgreSQL (Read/Write) successfully');
    return { writeDb, readDb };
  } catch (error) {
    AppLogger.error('❌ Error connecting to PostgreSQL', error);
    throw error;
  }
};
