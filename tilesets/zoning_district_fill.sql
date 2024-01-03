DROP FUNCTION get_zoning_district;
DROP INDEX zoning_district_wgs84_gix;

BEGIN;

CREATE INDEX zoning_district_li_ft_gix
	ON zoning_district USING GIST (li_ft);

CREATE INDEX zoning_district_wgs84_gix
	ON zoning_district USING GIST (wgs84);
ROLLBACK;
COMMIT;

BEGIN;



-- START ZONING_DISTRICT_FILL Function definition
CREATE OR REPLACE
    FUNCTION zoning_district_fill(z integer, x integer, y integer)
    RETURNS bytea AS $$
DECLARE
  mvt bytea;
BEGIN
  SELECT INTO mvt ST_AsMVT(tile, 'zoning_district_fill', 4096, 'geom') FROM (
		SELECT
			zoning_district.id,
			zoning_district.label,
			zoning_district_zoning_district_class.zoning_district_class_id AS class,
			zoning_district_class.category AS category,
			'['||('x'||SUBSTRING(zoning_district_class.color, 2, 2))::bit(8)::int||','||
			('x'||SUBSTRING(zoning_district_class.color, 4, 2))::bit(8)::int||','||
			('x'||SUBSTRING(zoning_district_class.color, 6, 2))::bit(8)::int||','||
			('x'||SUBSTRING(zoning_district_class.color, 8, 2))::bit(8)::int||']' AS color,
			ST_AsMVTGeom(
				  ST_Transform(ST_CurveToLine(wgs84::geometry), 3857),
				  ST_TileEnvelope(z, x, y),
				  4096, 64, true) AS geom
		FROM zoning_district
		LEFT JOIN zoning_district_zoning_district_class ON zoning_district.id = zoning_district_zoning_district_class.zoning_district_id
		LEFT JOIN zoning_district_class ON zoning_district_class.id = zoning_district_zoning_district_class.zoning_district_class_id 
		WHERE wgs84 && ST_Transform(ST_TileEnvelope(z, x, y), 4326)
  ) as tile WHERE geom IS NOT NULL;

  RETURN mvt;
END
$$ LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE;
-- END ZONING_DISTRICT_FILL function definition
-- ROLLBACK;
COMMIT;



SELECT convert_from(get_zoning_district(10, 301, 384), 'UTF8');

    SELECT * FROM (
		SELECT
			zoning_district.id,
			zoning_district.label,
			zoning_district_zoning_district_class.zoning_district_class_id AS class,
			zoning_district_class.category AS category,
			'''['||('x'||SUBSTRING(zoning_district_class.color, 2, 2))::bit(8)::int||','||
			('x'||SUBSTRING(zoning_district_class.color, 4, 2))::bit(8)::int||','||
			('x'||SUBSTRING(zoning_district_class.color, 6, 2))::bit(8)::int||','||
			('x'||SUBSTRING(zoning_district_class.color, 8, 2))::bit(8)::int||']''' AS color,
			ST_AsMVTGeom(
-- 				  ST_Transform(ST_CurveToLine(li_ft), 3857),
				  ST_Transform(ST_CurveToLine(wgs84::geometry), 3857),
				  ST_TileEnvelope(10, 301, 384),
				  4096, 64, true) AS geom
		FROM zoning_district
		LEFT JOIN zoning_district_zoning_district_class ON zoning_district.id = zoning_district_zoning_district_class.zoning_district_id
		LEFT JOIN zoning_district_class ON zoning_district_class.id = zoning_district_zoning_district_class.zoning_district_class_id 
-- 		WHERE li_ft && ST_Transform(ST_TileEnvelope(10, 301, 385), 2263)
		WHERE wgs84 && ST_Transform(ST_TileEnvelope(10, 301, 385), 4326)
	) AS tile WHERE geom IS NOT NULL;

SELECT * FROM zoning_district;

SELECT 
	'''['||('x'||SUBSTRING(zoning_district_class.color, 2, 2))::bit(8)::int||','||
	('x'||SUBSTRING(zoning_district_class.color, 4, 2))::bit(8)::int||','||
	('x'||SUBSTRING(zoning_district_class.color, 6, 2))::bit(8)::int||','||
	('x'||SUBSTRING(zoning_district_class.color, 8, 2))::bit(8)::int||']'''
AS color FROM zoning_district_class;

SELECT * FROM zoning_district_zoning_district_class;

SELECT DISTINCT
	zoning_district.id,
	zoning_district_zoning_district_class.zoning_district_class_id AS zd_class,
	zoning_district_class.category AS zd_category
FROM zoning_district
LEFT JOIN zoning_district_zoning_district_class ON zoning_district.id = zoning_district_zoning_district_class.zoning_district_id
LEFT JOIN zoning_district_class ON zoning_district_class.id = zoning_district_zoning_district_class.zoning_district_class_id
	