BEGIN;
UPDATE tax_lot
	SET
		mercator_fill = ST_Transform(wgs84::geometry, 3857),
		mercator_label = ST_Transform((ST_MaximumInscribedCircle(wgs84::geometry)).center, 3857);
		
COMMIT;

BEGIN;
UPDATE zoning_district
	SET
		mercator_fill = ST_Transform(wgs84::geometry, 3857),
		mercator_label = ST_Transform((ST_MaximumInscribedCircle(wgs84::geometry)).center, 3857);
		
COMMIT;
	