--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invitations" (
	`id` VARCHAR(191) PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	"invited_by" integer NOT NULL,
	"invited_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"role" varchar(50) NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	`id` VARCHAR(191) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"stripe_product_id" text,
	"plan_name" varchar(50),
	"subscription_status" varchar(20),
	CONSTRAINT "teams_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "teams_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "servers" (
	"id" varchar(55) PRIMARY KEY NOT NULL,
	"ip" varchar(16),
	"region" varchar(10) NOT NULL,
	"url" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "server_ip_unique" UNIQUE("ip")
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "machines" (
	"id" varchar(55) PRIMARY KEY NOT NULL,
	"ip" varchar(16),
	"region" varchar(10) NOT NULL,
	"name" varchar(100)  NOT NULL,
	"vlan" varchar(100),
	"port" integer NOT NULL DEFAULT 22,
	"machine_type" varchar(10) NOT NULL,
	"public_ip" varchar(20),
	"gateway_id" varchar(55),
    "user_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "machine_relays" (
	"id" serial PRIMARY KEY NOT NULL,
	"machine_id" varchar(55) NOT NULL,
	"server_id" varchar(55) NOT NULL,
	"region" varchar(10) NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);


--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ssh_account" (
	`id` VARCHAR(191) PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"root" boolean default false,
    "user_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "machine_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"machine_id" varchar(55) NOT NULL,
	"account_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"deployed" boolean default false,
	"joined_at" timestamp DEFAULT now() NOT NULL
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer NOT NULL,
	"key_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"deployed" boolean default false,
	"joined_at" timestamp DEFAULT now() NOT NULL
);