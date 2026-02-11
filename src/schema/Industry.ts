import { relations } from 'drizzle-orm';
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

export const industries = pgTable(
  'industries',
  {
    id: integer('id')
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),

    parentIndustryId: integer('parent_industry_id'),

    isActive: boolean('is_active').notNull().default(true),

    seo: jsonb('seo')
      .$type<{
        title: string;
        description: string;
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
    index('industries_slug_idx').on(table.slug),
    index('industries_parent_idx').on(table.parentIndustryId),
    index('industries_is_active_idx').on(table.isActive),
  ]
);

export const industriesRelations = relations(industries, ({ one, many }) => ({
  parent: one(industries, {
    fields: [industries.parentIndustryId],
    references: [industries.id],
    relationName: 'industry_parent',
  }),

  children: many(industries, {
    relationName: 'industry_parent',
  }),
}));

export type Industry = typeof industries.$inferSelect;
export type NewIndustry = typeof industries.$inferInsert;

