CREATE TABLE "census_tract" (
	"label" text NOT NULL,
	"year" smallint NOT NULL,
	"li_ft" geometry(multiPolygon,2263),
	"mercator_fill" geometry(multiPolygon,3857),
	CONSTRAINT "census_tract_label_year_pk" PRIMARY KEY("label","year")
);
--> statement-breakpoint
CREATE INDEX "census_tract_li_ft_index" ON "census_tract" USING GIST ("li_ft");--> statement-breakpoint
CREATE INDEX "census_tract_mercator_fill_index" ON "census_tract" USING GIST ("mercator_fill");