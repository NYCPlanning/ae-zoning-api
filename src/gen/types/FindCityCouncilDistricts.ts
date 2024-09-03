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
  /**
   * @description City council districts ids are sorted as if numbers in ascending order
   * @type string
   */
  order: string;
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
  /**
   * @description City council districts ids are sorted as if numbers in ascending order
   * @type string
   */
  order: string;
};
export type FindCityCouncilDistrictsQuery = {
  Response: FindCityCouncilDistrictsQueryResponse;
  Errors: FindCityCouncilDistricts400 | FindCityCouncilDistricts500;
};
