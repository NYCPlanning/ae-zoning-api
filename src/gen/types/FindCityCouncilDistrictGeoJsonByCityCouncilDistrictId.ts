import type { Error } from "./Error";
import type { CityCouncilDistrictGeoJson } from "./CityCouncilDistrictGeoJson";

export type FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParams = {
  /**
   * @description One or two character code to represent city council districts.
   * @type string
   */
  cityCouncilDistrictId: string;
};
/**
 * @description a city council district geojson object
 */
export type FindCityCouncilDistrictGeoJsonByCityCouncilDistrictId200 =
  CityCouncilDistrictGeoJson;
/**
 * @description Invalid client request
 */
export type FindCityCouncilDistrictGeoJsonByCityCouncilDistrictId400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindCityCouncilDistrictGeoJsonByCityCouncilDistrictId404 = Error;
/**
 * @description Server side error
 */
export type FindCityCouncilDistrictGeoJsonByCityCouncilDistrictId500 = Error;
/**
 * @description a city council district geojson object
 */
export type FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdQueryResponse =
  CityCouncilDistrictGeoJson;
export type FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdQuery = {
  Response: FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdQueryResponse;
  PathParams: FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParams;
  Errors:
    | FindCityCouncilDistrictGeoJsonByCityCouncilDistrictId400
    | FindCityCouncilDistrictGeoJsonByCityCouncilDistrictId404
    | FindCityCouncilDistrictGeoJsonByCityCouncilDistrictId500;
};
