CREATE TABLE "email_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"domain_id" uuid NOT NULL,
	"recipient" varchar(320) NOT NULL,
	"subject" varchar(998) NOT NULL,
	"body" text NOT NULL,
	"status" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
