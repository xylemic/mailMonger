import {
  pgTable,
  uuid,
  varchar,
  timestamp
} from "drizzle-orm/pg-core"

export const customers = pgTable("customers", {
  id : uuid("id").defaultRandom().primaryKey(),

  email : varchar("email", { length : 320 })
    .notNull()
    .unique(),

  paswordHash : varchar("password_hash", { length : 255 })
    .notNull(),

  createdAt : timestamp("created_at")
    .defaultNow()
    .notNull()
})


