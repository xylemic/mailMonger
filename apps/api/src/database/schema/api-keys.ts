import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp
} from "drizzle-orm/pg-core"


import { customers } from "./customers.js"

export const apiKeys = pgTable("api_keys", {
  id : uuid("id")
    .defaultRandom()
    .primaryKey(),

  customerId : uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  
  name : varchar("name", { length : 100 })
    .notNull(),

  identifier : varchar("identifier", { length : 16 })
    .notNull()
    .unique(),

  keyHash : varchar("key_hash", { length : 255 })
    .notNull(),

  isActive : boolean("is_active")
    .default(true)
    .notNull(),

  lastUsedAt : timestamp("last_used_at"),

  expiresAt : timestamp("expires_at"),

  createdAt : timestamp("created_at")
    .defaultNow()
    .notNull()
})


