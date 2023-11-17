## Overview
Custom types for postgis

## Context for terms
Geometry has slightly different meanings between the broader mapping community and the specific PostGIS typing system. The geojson specification uses Geometry to refer to any coordinates, regardless of whether those coordinates model the Earth as an ellipsoid or a plane. 

In contrast, PostGIS uses Geometry to refer specifically to coordinates that model the Earth as a plane. It uses Geography to refer specifically to coordinates that model the Earth as an ellipsoid.

## Guidelines for using the types
Within PostGIS, projected coordinate systems typically should be stored in Geometry columns. Conversely, geodetic coordinate systems should be stored in Geography columns.

Following this guidance, WGS84 (EPSG:4326) should be stored in a Geography column.
Its projected counterpart, Pseudo-Mercator (EPSG:3857), should be stored in a Geometry Column. This package encourages this convention by setting the default srid for geomtry types to 3857 and geography types to 4326.

## WGS84 is special
The Geometry type predates the Geography type in PostGIS. It also evolved with GeoJSON. GeoJSON uses WSG84 as the default spatial reference system for sharing coordinates. Consequently, the Geometry type historically supported WSG84 by applying [Plate Carée](https://en.wikipedia.org/wiki/Equirectangular_projection) projection.

Converting from GeoJSON to Geometry types is also easier, thanks to the `ST_GeomFromGeoJSON` PostGIS function. There exists no equivalent function for converting directly from GeoJSON to Geography. Fortunately, the same effect can be achieved by casting the geometry to a geography:
```
ST_GeomFromGeoJSON(geojson_feature)::geography
```

## WGS84 isn't special
Despite Geometry's historical support for WSG84, it is generally safer to move coordinates in this system to a Geography column. Spatial functions for Geometry types assume a flat surface for its calculations. PostGIS will not check whether the coordinates actually satisfy this assumption. Consequently, applying geometry functions to WGS84 coordinates will return meaningless results and PostGIS will fail to emit errors to flag these issues.
