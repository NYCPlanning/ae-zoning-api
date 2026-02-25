CREATE TABLE "neighborhood_tabulation_area" (
	"name" text NOT NULL,
	"year" smallint NOT NULL,
	"code" text,
	"li_ft" geometry(multiPolygon,2263),
	"mercator_fill" geometry(multiPolygon,3857),
	CONSTRAINT "neighborhood_tabulation_area_name_year_pk" PRIMARY KEY("name","year")
);
--> statement-breakpoint
CREATE INDEX "neighborhood_tabulation_area_li_ft_index" ON "neighborhood_tabulation_area" USING GIST ("li_ft");--> statement-breakpoint
CREATE INDEX "neighborhood_tabulation_area_mercator_fill_index" ON "neighborhood_tabulation_area" USING GIST ("mercator_fill");