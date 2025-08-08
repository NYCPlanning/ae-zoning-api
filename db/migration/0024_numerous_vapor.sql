CREATE TABLE "cbbr_options_cascade" (
	"policy_area_id" smallint NOT NULL,
	"need_group_id" smallint NOT NULL,
	"agency_initials" text NOT NULL,
	"type" text NOT NULL,
	"need_id" smallint NOT NULL,
	"request_id" smallint NOT NULL,
	CONSTRAINT "cbbr_request_type_options" CHECK ("cbbr_options_cascade"."type" IN ('Capital', 'Expense'))
);
--> statement-breakpoint
ALTER TABLE "cbbr_agency_need" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "cbbr_agency_need_group" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "cbbr_agency_need_request" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "cbbr_agency_need" CASCADE;--> statement-breakpoint
DROP TABLE "cbbr_agency_need_group" CASCADE;--> statement-breakpoint
DROP TABLE "cbbr_agency_need_request" CASCADE;--> statement-breakpoint
ALTER TABLE "cbbr_request" DROP CONSTRAINT "cbbr_request_type_options";--> statement-breakpoint
ALTER TABLE "cbbr_need_group" DROP CONSTRAINT "cbbr_need_group_policy_area_id_cbbr_policy_area_id_fk";
--> statement-breakpoint
ALTER TABLE "cbbr_options_cascade" ADD CONSTRAINT "cbbr_options_cascade_policy_area_id_cbbr_policy_area_id_fk" FOREIGN KEY ("policy_area_id") REFERENCES "public"."cbbr_policy_area"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cbbr_options_cascade" ADD CONSTRAINT "cbbr_options_cascade_need_group_id_cbbr_need_group_id_fk" FOREIGN KEY ("need_group_id") REFERENCES "public"."cbbr_need_group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cbbr_options_cascade" ADD CONSTRAINT "cbbr_options_cascade_agency_initials_agency_initials_fk" FOREIGN KEY ("agency_initials") REFERENCES "public"."agency"("initials") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cbbr_options_cascade" ADD CONSTRAINT "cbbr_options_cascade_need_id_cbbr_need_id_fk" FOREIGN KEY ("need_id") REFERENCES "public"."cbbr_need"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cbbr_options_cascade" ADD CONSTRAINT "cbbr_options_cascade_request_id_cbbr_request_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."cbbr_request"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cbbr_need_group" DROP COLUMN "policy_area_id";--> statement-breakpoint
ALTER TABLE "cbbr_request" DROP COLUMN "type";