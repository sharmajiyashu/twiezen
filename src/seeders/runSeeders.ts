import 'dotenv/config';
import createDbConnection, { Database } from '../api/loaders/db';
import { seedSettings } from './SettingSeeder';
import AppLogger from '../api/loaders/logger';
import { adminSeeder } from './adminSeeder';

async function main() {
  try {
    // 1️⃣ Get DB connections
    const { writeDb, readDb }: { writeDb: Database; readDb: Database } = await createDbConnection();

    AppLogger.info('🌱 Starting database seeders...');

    // 2️⃣ Run the Settings Seeder
    await seedSettings(writeDb); // always use writeDb to insert data
    await adminSeeder(writeDb); // always use writeDb to insert data

    AppLogger.info('✅ All seeders completed successfully!');
    process.exit(0);
  } catch (err) {
    AppLogger.error('❌ Seeder failed', err);
    process.exit(1);
  }
}

main();
