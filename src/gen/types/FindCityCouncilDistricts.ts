import type { Error } from "./Error";
import type { CityCouncilDistrict } from "./CityCouncilDistrict";

/**
 * @description an object of city council districts
 */
export type FindCityCouncilDistricts200 = {
  /**
   * @type array
   */
  cityCouncilDistricts: CityCouncilDistrict[];
};
/**
 * @description Invalid client request
 */
export type FindCityCouncilDistricts400 = Error;
/**
 * @description Server side error
 */
export type FindCityCouncilDistricts500 = Error;
/**
 * @description an object of city council districts
 */
export type FindCityCouncilDistrictsQueryResponse = {
  /**
   * @type array
   */
  cityCouncilDistricts: CityCouncilDistrict[];
};
export type FindCityCouncilDistrictsQuery = {
  Response: FindCityCouncilDistrictsQueryResponse;
  Errors: FindCityCouncilDistricts400 | FindCityCouncilDistricts500;
};
