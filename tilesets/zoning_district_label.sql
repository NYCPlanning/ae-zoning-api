DROP FUNCTION get_zoning_district;


BEGIN;

CREATE INDEX zoning_district_li_ft_gix
	ON zoning_district USING GIST (li_ft);

CREATE INDEX zoning_district_wgs84_gix
	ON zoning_district USING GIST (wgs84);
ROLLBACK;
COMMIT;

-- START zoning_district_label function definition
CREATE OR REPLACE
    FUNCTION zoning_district_label(z integer, x integer, y integer)
    RETURNS bytea AS $$
DECLARE
  mvt bytea;
BEGIN
  SELECT INTO mvt ST_AsMVT(tile, 'zoning_district_label', 4096, 'geom') FROM (
		SELECT DISTINCT ON (zoning_district.id)
			zoning_district.id,
			zoning_district.label,
			'["'||STRING_AGG(zoning_district_class.category::TEXT, '","')||'"]' AS zd_category,
			'["'||STRING_AGG(zoning_district_zoning_district_class.zoning_district_class_id, '","')||'"]' AS zd_class,
			ST_AsMVTGeom(
				  ST_Transform((ST_MaximumInscribedCircle(wgs84::geometry)).center, 3857),
				  ST_TileEnvelope(z, x, y),
				  4096, 64, true) AS geom
		FROM zoning_district
		LEFT JOIN zoning_district_zoning_district_class ON zoning_district.id = zoning_district_zoning_district_class.zoning_district_id
		LEFT JOIN zoning_district_class ON zoning_district_class.id = zoning_district_zoning_district_class.zoning_district_class_id 
		WHERE wgs84 && ST_Transform(ST_TileEnvelope(z, x, y), 4326)
	  	GROUP BY 
			zoning_district.id,
			zoning_district.label
	) AS tile WHERE geom IS NOT NULL;

  RETURN mvt;
END
$$ LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE;
-- END zoning_district_label function definition
-- ROLLBACK;
COMMIT;

    SELECT * FROM (
		SELECT DISTINCT ON (zoning_district.id)
			zoning_district.id,
			zoning_district.label,
			zoning_district_zoning_district_class.zoning_district_class_id AS class,
			zoning_district_class.category AS category,
			ST_AsMVTGeom(
				  ST_Transform((ST_MaximumInscribedCircle(wgs84::geometry)).center, 3857),
				  ST_TileEnvelope(10, 301, 384),
				  4096, 64, true) AS geom
		FROM zoning_district
		LEFT JOIN zoning_district_zoning_district_class ON zoning_district.id = zoning_district_zoning_district_class.zoning_district_id
		LEFT JOIN zoning_district_class ON zoning_district_class.id = zoning_district_zoning_district_class.zoning_district_class_id 
		WHERE wgs84 && ST_Transform(ST_TileEnvelope(10, 301, 385), 4326)
	) AS tile WHERE geom IS NOT NULL;

SELECT id, label, ST_AsText(ST_Transform((ST_MaximumInscribedCircle(wgs84::geometry)).center, 3857)) FROM zoning_district;

SELECT id, label, ST_AsText((ST_MaximumInscribedCircle(wgs84::geometry)).center) FROM zoning_district;


SELECT * FROM zoning_district_zoning_district_class;

SELECT 
	zoning_district.id,
	'['||STRING_AGG(zoning_district_class.category::TEXT, ',')||']' AS zd_category,
	'['||STRING_AGG(zoning_district_zoning_district_class.zoning_district_class_id, ',')||']' AS zd_class
FROM zoning_district
LEFT JOIN zoning_district_zoning_district_class ON zoning_district.id = zoning_district_zoning_district_class.zoning_district_id
LEFT JOIN zoning_district_class ON zoning_district_class.id = zoning_district_zoning_district_class.zoning_district_class_id
GROUP BY zoning_district.id