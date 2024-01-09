  SELECT ST_AsMVT(tile, 'tax_lot_fill', 4096, 'geom') FROM (
		SELECT
			tax_lot.bbl,
			'['||('x'||SUBSTRING(land_use.color, 2, 2))::bit(8)::int||','||
			('x'||SUBSTRING(land_use.color, 4, 2))::bit(8)::int||','||
			('x'||SUBSTRING(land_use.color, 6, 2))::bit(8)::int||','||
			('x'||SUBSTRING(land_use.color, 8, 2))::bit(8)::int||']' AS color,
			ST_AsMVTGeom(
				  tax_lot.mercator_fill,
				  ST_TileEnvelope(13, 2410, 3082),
				  4096, 64, true) AS geom
		FROM tax_lot
	  	LEFT JOIN land_use ON land_use.id = tax_lot.land_use_id
		WHERE tax_lot.mercator_fill && ST_TileEnvelope(13, 2410, 3082)
  ) as tile WHERE geom IS NOT NULL;