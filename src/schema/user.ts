import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export interface PermissionModule {
  moduleName: string;
  enabled: boolean;
  features: {
    [featureName: string]: {
      enabled: boolean;
      description: string;
    };
  };
}

// PostgreSQL enum
export const userTypeEnum = pgEnum('user_role', ['user', 'admin']);

// -------------------- Users --------------------
export const users = pgTable(
  'users',
  {
    id: integer('id')
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    userRole: userTypeEnum('user_role').notNull().default('user'),

    name: varchar('name', { length: 255 }).notNull(),
    bio: text('bio'),

    email: varchar('email', { length: 255 }).unique(),

    isEmailVerified: boolean('is_email_verified').notNull().default(false),
    emailVerified: boolean('email_verified').notNull().default(false),
    emailVerificationToken: text('email_verification_token'),

    phoneVerified: boolean('phone_verified').notNull().default(false),
    phoneVerificationToken: text('phone_verification_token'),

    passwordResetToken: text('password_reset_token'),
    passwordResetExpires: timestamp('password_reset_expires'),
    lastLoginAt: timestamp('last_login_at'),

    password: text('password').notNull(),

    adminRoleId: integer('admin_role_id'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  table => [
    index('users_email_idx').on(table.email),
  ]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// -------------------- Admin Role --------------------
export const adminRole = pgTable(
  'admin_role',
  {
    id: integer('id')
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    name: varchar('name', { length: 100 }).notNull().unique(),
    description: text('description'),

    permissions: jsonb('permission')
      .$type<
        Array<{
          moduleName: string;
          enabled: boolean;
          features: {
            [featureName: string]: {
              enabled: boolean;
              description: string;
            };
          };
        }>
      >()
      .notNull(),

    isActive: boolean('is_active').default(true).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  table => [
    index('admin_role_created_at_idx').on(table.createdAt),
    index('admin_role_name_idx').on(table.name)
  ]
);

export type AdminRole = typeof adminRole.$inferSelect;
export type NewAdminRole = typeof adminRole.$inferInsert;
