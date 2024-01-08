ALTER TABLE "tax_lot" ADD COLUMN "mercator_fill" geometry(multiPolygon,3857);--> statement-breakpoint
ALTER TABLE "tax_lot" ADD COLUMN "mercator_label" geometry(point,3857);--> statement-breakpoint
ALTER TABLE "zoning_district" ADD COLUMN "mercator_fill" geometry(multiPolygon,3857);--> statement-breakpoint
ALTER TABLE "zoning_district" ADD COLUMN "mercator_label" geometry(point,3857);