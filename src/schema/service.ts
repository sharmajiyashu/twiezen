import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';

// -------------------- Services --------------------
export const services = pgTable(
  'services',
  {
    id: integer('id')
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    name: varchar('name', { length: 255 }).notNull(),          // Web Development
    slug: varchar('slug', { length: 255 }).notNull().unique(), // web-development

    shortDescription: text('short_description').notNull(),
    longDescription: text('long_description'),

    isActive: boolean('is_active').notNull().default(true),

    seo: jsonb('seo')
      .$type<{
        titleTemplate: string;
        metaDescriptionTemplate: string;
        h1Template: string;
      }>()
      .notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => [
    index('services_slug_idx').on(table.slug),
    index('services_is_active_idx').on(table.isActive),
    index('services_created_at_idx').on(table.createdAt),
  ]
);


export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
