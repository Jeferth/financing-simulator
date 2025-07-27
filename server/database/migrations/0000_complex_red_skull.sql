CREATE TABLE "simulations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"property_value" real,
	"down_payment" real,
	"loan_value" real,
	"term_months" integer,
	"monthly_installment" real,
	"total_payable" real,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"avatar" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
