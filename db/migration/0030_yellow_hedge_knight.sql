CREATE INDEX "borough_li_ft_index" ON "borough" USING GIST ("li_ft");--> statement-breakpoint
CREATE INDEX "borough_mercator_fill_index" ON "borough" USING GIST ("mercator_fill");--> statement-breakpoint
CREATE INDEX "borough_mercator_label_index" ON "borough" USING GIST ("mercator_label");