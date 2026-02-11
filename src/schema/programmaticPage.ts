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
import { relations } from 'drizzle-orm';
import { services } from './service';
import { locations } from './location';
import { industries } from './Industry';

// -------------------- Programmatic Pages --------------------
export const programmaticPages = pgTable(
  'programmatic_pages',
  {
    id: integer('id')
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    serviceId: integer('service_id').notNull(),
    locationId: integer('location_id').notNull(),
    industryId: integer('industry_id'),

    slug: varchar('slug', { length: 255 }).notNull().unique(),
    url: varchar('url', { length: 500 }).notNull().unique(),

    indexable: boolean('indexable').notNull().default(true),
    canonicalUrl: varchar('canonical_url', { length: 500 }),

    contentBlocks: jsonb('content_blocks')
      .$type<{
        hero: string;
        benefits: string[];
        faq: { q: string; a: string }[];
        cta: string;
      }>()
      .notNull(),

    seo: jsonb('seo')
      .$type<{
        title: string;
        description: string;
        breadcrumbs: string[];
        schemaJson?: Record<string, unknown>;
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
    index('programmatic_pages_service_idx').on(table.serviceId),
    index('programmatic_pages_location_idx').on(table.locationId),
    index('programmatic_pages_industry_idx').on(table.industryId),
    index('programmatic_pages_indexable_idx').on(table.indexable),
    index('programmatic_pages_slug_idx').on(table.slug),
  ]
);

export const programmaticPagesRelations = relations(
  programmaticPages,
  ({ one }) => ({
    service: one(services, {
      fields: [programmaticPages.serviceId],
      references: [services.id],
    }),

    location: one(locations, {
      fields: [programmaticPages.locationId],
      references: [locations.id],
    }),

    industry: one(industries, {
      fields: [programmaticPages.industryId],
      references: [industries.id],
    }),
  })
);

export type ProgrammaticPage = typeof programmaticPages.$inferSelect;
export type NewProgrammaticPage = typeof programmaticPages.$inferInsert;