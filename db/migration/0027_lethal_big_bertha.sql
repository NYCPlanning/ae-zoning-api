ALTER TABLE "community_board_budget_request" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "community_board_budget_request" ALTER COLUMN "agency_category_response_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "community_board_budget_request" ALTER COLUMN "is_continued_support" SET NOT NULL;