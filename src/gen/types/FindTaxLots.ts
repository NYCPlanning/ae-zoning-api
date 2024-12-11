import type { TaxLotBasicPage } from "./TaxLotBasicPage";
import type { Error } from "./Error";

export const findTaxLotsQueryParamsGeometry = {
  Point: "Point",
  LineString: "LineString",
  Polygon: "Polygon",
} as const;
export type FindTaxLotsQueryParamsGeometry =
  (typeof findTaxLotsQueryParamsGeometry)[keyof typeof findTaxLotsQueryParamsGeometry];
export type FindTaxLotsQueryParams = {
  /**
   * @description The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.
   * @type integer | undefined
   */
  limit?: number;
  /**
   * @description The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.
   * @type integer | undefined
   */
  offset?: number;
  /**
   * @description The type of geometry used for a spatial filter. It must be provided when applying a spatial filter; each geometry has its own coordinate requirements. Point geometries have length of 1. LineString geometries have length of 2 to 5, inclusive. Polygons have length 4 to 5, inclusive; the last coordinate must match the first coordinate to close the polygon.
   * @type string | undefined
   */
  geometry?: FindTaxLotsQueryParamsGeometry;
  /**
   * @description The longitude portion of coordinates. It must be provided when applying a spatial filter and have the same length as the latitudes. (If using a tool like axios, serializing the array with brackets is also supported. ex; lons[]=-74.010776&lons[]=-74.010776)
   * @type array | undefined
   */
  lons?: number[];
  /**
   * @description The latitude portion of coordinates. It must be provided when applying a spatial filter and have the same length as the longitudes. (If using a tool like axios, serializing the array with brackets is also supported. ex; lats[]=40.708649&lats[]=40.707800)
   * @type array | undefined
   */
  lats?: number[];
  /**
   * @description A buffer around the spatial feature. Units are feet. It is optional when applying a spatial filter.
   * @type number | undefined
   */
  buffer?: number;
};
/**
 * @description An object containing a list of tax lots and pagination metadata. An optional spatial filter will return all tax lots that intersect the spatial feature and its optional buffer. When applying a spatial filter, tax lots are ordered by their closeness to the spatial feature.
 */
export type FindTaxLots200 = TaxLotBasicPage;
/**
 * @description Invalid client request
 */
export type FindTaxLots400 = Error;
/**
 * @description Server side error
 */
export type FindTaxLots500 = Error;
/**
 * @description An object containing a list of tax lots and pagination metadata. An optional spatial filter will return all tax lots that intersect the spatial feature and its optional buffer. When applying a spatial filter, tax lots are ordered by their closeness to the spatial feature.
 */
export type FindTaxLotsQueryResponse = TaxLotBasicPage;
export type FindTaxLotsQuery = {
  Response: FindTaxLotsQueryResponse;
  QueryParams: FindTaxLotsQueryParams;
  Errors: FindTaxLots400 | FindTaxLots500;
};
