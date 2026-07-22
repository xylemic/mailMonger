import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer
} from "drizzle-orm/pg-core"


export const emailRequests = pgTable("email_requests", {
  id : uuid("id").defaultRandom().primaryKey(),
  // customerId : uuid("customer_id").notNull(),
  // domainId : uuid("domain_id").notNull(),
  recipient : varchar("recipient", { length : 320 }).notNull(),
  subject : varchar("subject", { length : 998 }).notNull(),
  body : text("body").notNull(),
  status : varchar("status", { length : 50 }).notNull(),
  retryCount : integer("retry_count")
     .default(0)
     .notNull(), 
  createdAt : timestamp("created_at").defaultNow().notNull()
})


