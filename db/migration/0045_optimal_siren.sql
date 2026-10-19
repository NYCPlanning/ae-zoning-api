ALTER TABLE "facility" RENAME COLUMN "sgr_ltr" TO "fcs_letter_grade_total";--> statement-breakpoint
ALTER TABLE "facility" RENAME COLUMN "sgr_arc_ltr" TO "fcs_letter_grade_architectural";--> statement-breakpoint
ALTER TABLE "facility" RENAME COLUMN "sgr_sys_ltr" TO "fcs_letter_grade_systems";--> statement-breakpoint
ALTER TABLE "facility" RENAME COLUMN "sgr_year" TO "fcs_assessment_year";--> statement-breakpoint
ALTER TABLE "facility" ADD COLUMN "fcs_score_total" smallint;--> statement-breakpoint
ALTER TABLE "facility" ADD COLUMN "fcs_score_architectural" smallint;--> statement-breakpoint
ALTER TABLE "facility" ADD COLUMN "fcs_score_systems" smallint;