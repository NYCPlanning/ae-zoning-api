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
