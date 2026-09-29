CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "prompt_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"from" text NOT NULL,
	"to" text NOT NULL,
	"deactivated" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "room" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "room_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"owner" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"gameEnded" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "submission_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"room" integer NOT NULL,
	"owner" text NOT NULL,
	"prompt" integer NOT NULL,
	"target" numeric(3, 2) NOT NULL,
	"hint" text,
	"timestamp" timestamp with time zone,
	"rerolled" integer,
	"used" json
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "room_owner_user_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_room_room_id_fk" FOREIGN KEY ("room") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_owner_user_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_prompt_prompt_id_fk" FOREIGN KEY ("prompt") REFERENCES "public"."prompt"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_rerolled_prompt_id_fk" FOREIGN KEY ("rerolled") REFERENCES "public"."prompt"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");