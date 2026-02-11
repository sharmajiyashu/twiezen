import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  jsonb,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// -------------------- Location Type Enum --------------------
export const locationTypeEnum = pgEnum('location_type', [
  'country',
  'state',
  'city',
]);

// -------------------- Locations --------------------
export const locations = pgTable(
  'locations',
  {
    id: integer('id')
      .generatedAlwaysAsIdentity()
      .primaryKey(),

    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),

    // Explicit fields
    country: varchar('country', { length: 150 }),
    state: varchar('state', { length: 150 }),
    city: varchar('city', { length: 150 }),

    type: locationTypeEnum('type').notNull(),

    parentId: integer('parent_id'),

    seo: jsonb('seo')
      .$type<{
        title?: string;
        description?: string;
      }>()
      .notNull()
      .default({}),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => [
    index('locations_slug_idx').on(table.slug),
    index('locations_type_idx').on(table.type),
    index('locations_parent_idx').on(table.parentId),
    index('locations_country_state_city_idx').on(
      table.country,
      table.state,
      table.city
    ),
  ]
);

export const locationsRelations = relations(locations, ({ one, many }) => ({
  parent: one(locations, {
    fields: [locations.parentId],
    references: [locations.id],
    relationName: 'location_parent',
  }),

  children: many(locations, {
    relationName: 'location_parent',
  }),
}));

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
