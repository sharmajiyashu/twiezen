import { Database } from '../api/loaders/db';
import AppLogger from '../api/loaders/logger';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcrypt';


export async function adminSeeder(db: Database) {
  try {
    const name = 'Super Admin';
    const email = 'admin@pineapplelifestyle.com';
    const password = 'Admin@123'; 
    const userRole = 'admin';

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(sql`
      INSERT INTO users (name, email, password, user_role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${userRole})
      ON DUPLICATE KEY UPDATE user_role = ${userRole};
    `);

    AppLogger.info('Super Admin seeded successfully');
  } catch (error) {
    AppLogger.error('Admin seeder failed', error);
  }
}
