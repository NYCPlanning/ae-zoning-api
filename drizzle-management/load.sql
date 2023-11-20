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
