import type { CapitalProjectBudgetedGeoJson } from "./CapitalProjectBudgetedGeoJson";
import type { Error } from "./Error";

export type FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParams =
  {
    /**
     * @description Three character string of numbers representing managing agency
     * @type string
     */
    managingCode: string;
    /**
     * @description The id for the project, which combines with the managing code to make a unique id
     * @type string
     */
    capitalProjectId: string;
  };
/**
 * @description A capital project geojson object
 */
export type FindCapitalProjectGeoJsonByManagingCodeCapitalProjectId200 =
  CapitalProjectBudgetedGeoJson;
/**
 * @description Invalid client request
 */
export type FindCapitalProjectGeoJsonByManagingCodeCapitalProjectId400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindCapitalProjectGeoJsonByManagingCodeCapitalProjectId404 = Error;
/**
 * @description Server side error
 */
export type FindCapitalProjectGeoJsonByManagingCodeCapitalProjectId500 = Error;
/**
 * @description A capital project geojson object
 */
export type FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdQueryResponse =
  CapitalProjectBudgetedGeoJson;
export type FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdQuery = {
  Response: FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdQueryResponse;
  PathParams: FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParams;
  Errors:
    | FindCapitalProjectGeoJsonByManagingCodeCapitalProjectId400
    | FindCapitalProjectGeoJsonByManagingCodeCapitalProjectId404
    | FindCapitalProjectGeoJsonByManagingCodeCapitalProjectId500;
};
