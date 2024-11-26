ALTER TABLE "tax_lot" ADD COLUMN "block_id" char(5);--> statement-breakpoint
ALTER TABLE "tax_lot" ADD COLUMN "lot_id" char(4);--> statement-breakpoint
UPDATE "tax_lot" SET "block_id" = SUBSTRING("bbl", 2, 5), "lot_id" = SUBSTRING("bbl", 7, 4);--> statement-breakpoint
ALTER TABLE "tax_lot" ALTER COLUMN "block_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tax_lot" ALTER COLUMN "lot_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tax_lot" DROP CONSTRAINT "tax_lot_pkey";--> statement-breakpoint
ALTER TABLE "tax_lot" ADD CONSTRAINT "tax_lot_borough_id_block_id_lot_id_pk" PRIMARY KEY("borough_id","block_id","lot_id");--> statement-breakpoint
ALTER TABLE "tax_lot" DROP COLUMN IF EXISTS "bbl";--> statement-breakpoint
ALTER TABLE "tax_lot" DROP COLUMN IF EXISTS "block";--> statement-breakpoint
ALTER TABLE "tax_lot" DROP COLUMN IF EXISTS "lot";
