BEGIN;
	COPY borough ("id", "title", "abbr")
		FROM '../borough.csv'
		DELIMITER ','
		CSV HEADER;
	
COMMIT;

BEGIN;
	COPY land_use ("id", "description", "color")
		FROM '../land_use.csv'
		DELIMITER ','
		CSV HEADER;

COMMIT;

BEGIN;
	COPY tax_lot (
		"bbl",
		"borough_id",
		"block",
		"lot",
		"address",
		"land_use_id",
		"wgs84",
		"li_ft"
	)
		FROM '../tax_lot.csv'
		DELIMITER ','
		CSV HEADER;

COMMIT;


BEGIN;
	COPY zoning_district (
		"id",
		"label",
		"wgs84",
		"li_ft"
	)
		FROM '../zoning_district.csv'
		DELIMITER ','
		CSV HEADER;

COMMIT;


BEGIN;
	COPY zoning_district_class (
		"id",
		"category",
		"description",
		"url",
		"color"
	)
		FROM '../zoning_district_class.csv'
		DELIMITER ','
		CSV HEADER;

COMMIT;

BEGIN;
	COPY zoning_district_zoning_district_class (
		"zoning_district_id",
		"zoning_district_class_id"
	)
		FROM '../zoning_district_zoning_district_class.csv'
		DELIMITER ','
		CSV HEADER;

COMMIT;
