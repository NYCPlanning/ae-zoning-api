BEGIN;
	COPY borough ("id", "title", "abbr")
		FROM '../borough.csv'
		DELIMITER ','
		CSV HEADER;
	
COMMIT;
