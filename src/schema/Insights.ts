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

// -------------------- Insights --------------------
export const insights = pgTable(
  'insights',
  {
    id: integer('id')
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),

    content: text('content').notNull(),

    relatedServices: jsonb('related_services')
      .$type<number[]>()
      .notNull()
      .default([]),

    relatedIndustries: jsonb('related_industries')
      .$type<number[]>()
      .notNull()
      .default([]),

    seo: jsonb('seo')
      .$type<{
        title: string;
        description: string;
      }>()
      .notNull(),

    publishedAt: timestamp('published_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => [
    index('insights_slug_idx').on(table.slug),
    index('insights_published_at_idx').on(table.publishedAt),
    index('insights_related_services_gin').using(
      'gin',
      table.relatedServices
    ),
    index('insights_related_industries_gin').using(
      'gin',
      table.relatedIndustries
    ),
  ]
);

export type Insight = typeof insights.$inferSelect;
export type NewInsight = typeof insights.$inferInsert;


