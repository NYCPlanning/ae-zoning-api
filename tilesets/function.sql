BEGIN;

CREATE OR REPLACE
    FUNCTION get_zoning_district(z integer, x integer, y integer)
    RETURNS bytea AS $$
DECLARE
  mvt bytea;
BEGIN
  SELECT INTO mvt ST_AsMVT(tile, 'function_zxy_query', 4096, 'geom') FROM (
    SELECT
      ST_AsMVTGeom(
          ST_Transform(ST_CurveToLine(li_ft), 3857),
          ST_TileEnvelope(z, x, y),
          4096, 64, true) AS geom
    FROM zoning_district
    WHERE li_ft && ST_Transform(ST_TileEnvelope(z, x, y), 4326)
  ) as tile WHERE geom IS NOT NULL;

  RETURN mvt;
END
$$ LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE;
ROLLBACK;
COMMIT;

DROP FUNCTION get_zoning_district;

SELECT ST_Transform(ST_Transform(ST_CurveToLine(li_ft), 3857), 4326) FROM zoning_district;