import type { Error } from "./Error";
import type { CapitalProjectPage } from "./CapitalProjectPage";

export type FindCapitalProjectsByCityCouncilIdPathParams = {
  /**
   * @description One or two character code to represent city council districts.
   * @type string
   * @example 25
   */
  cityCouncilDistrictId: string;
};

export type FindCapitalProjectsByCityCouncilId400 = Error;

export type FindCapitalProjectsByCityCouncilId404 = Error;

export type FindCapitalProjectsByCityCouncilId500 = Error;

/**
 * @description An object containing pagination metadata and an array of capital projects for the city council district
 */
export type FindCapitalProjectsByCityCouncilIdQueryResponse =
  CapitalProjectPage;
