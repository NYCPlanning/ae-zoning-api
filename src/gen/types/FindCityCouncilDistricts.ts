import type { Error } from "./Error";
import type { CityCouncilDistrict } from "./CityCouncilDistrict";

export type FindCityCouncilDistricts400 = Error;

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
