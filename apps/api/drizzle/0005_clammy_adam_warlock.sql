ALTER TABLE "api_keys" ADD COLUMN "identifier" varchar(16) NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_identifier_unique" UNIQUE("identifier");