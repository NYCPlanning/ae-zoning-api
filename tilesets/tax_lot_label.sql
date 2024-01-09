  SELECT ST_AsMVT(tile, 'tax_lot_label', 4096, 'geom') FROM (
		SELECT
			tax_lot.bbl,
			ST_AsMVTGeom(
				  tax_lot.mercator_label,
				  ST_TileEnvelope(13, 2410, 3082),
				  4096, 64, true) AS geom
		FROM tax_lot
		WHERE tax_lot.mercator_label && ST_TileEnvelope(13, 2410, 3082)
	) AS tile WHERE geom IS NOT NULL;