ALTER TABLE "borough" ADD COLUMN "li_ft" geometry(multiPolygon,2263);--> statement-breakpoint
ALTER TABLE "borough" ADD COLUMN "mercator_fill" geometry(multiPolygon,3857);--> statement-breakpoint
ALTER TABLE "borough" ADD COLUMN "mercator_label" geometry(point,3857);