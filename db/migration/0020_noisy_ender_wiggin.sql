ALTER TABLE "borough" ADD COLUMN "li_ft" geometry(multiPolygon,2263) NOT NULL;--> statement-breakpoint
ALTER TABLE "borough" ADD COLUMN "mercator_fill" geometry(multiPolygon,3857) NOT NULL;--> statement-breakpoint
ALTER TABLE "borough" ADD COLUMN "mercator_label" geometry(point,3857) NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "borough_li_ft_index" ON "borough" USING GIST ("li_ft");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "borough_mercator_fill_index" ON "borough" USING GIST ("mercator_fill");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "borough_mercator_label_index" ON "borough" USING GIST ("mercator_label");