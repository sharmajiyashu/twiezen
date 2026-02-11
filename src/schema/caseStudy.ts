import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';

// -------------------- Case Studies --------------------
export const caseStudies = pgTable(
  'case_studies',
  {
    id: integer('id')
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    clientName: varchar('client_name', { length: 255 }).notNull(),

    industryId: integer('industry_id').notNull(),

    serviceIds: jsonb('service_ids')
      .$type<number[]>()
      .notNull()
      .default([]),

    problem: text('problem').notNull(),
    solution: text('solution').notNull(),

    results: jsonb('results')
      .$type<string[]>()
      .notNull()
      .default([]),

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
    index('case_studies_industry_idx').on(table.industryId),
    index('case_studies_service_ids_gin').using(
      'gin',
      table.serviceIds
    ),
  ]
);


export type CaseStudy = typeof caseStudies.$inferSelect;
export type NewCaseStudy = typeof caseStudies.$inferInsert;
