import type { Error } from "./Error";
import type { CapitalProjectBudgeted } from "./CapitalProjectBudgeted";

export type FindCapitalProjectByManagingCodeCapitalProjectIdPathParams = {
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
 * @description An object of capital project details
 */
export type FindCapitalProjectByManagingCodeCapitalProjectId200 =
  CapitalProjectBudgeted;
/**
 * @description Invalid client request
 */
export type FindCapitalProjectByManagingCodeCapitalProjectId400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindCapitalProjectByManagingCodeCapitalProjectId404 = Error;
/**
 * @description Server side error
 */
export type FindCapitalProjectByManagingCodeCapitalProjectId500 = Error;
/**
 * @description An object of capital project details
 */
export type FindCapitalProjectByManagingCodeCapitalProjectIdQueryResponse =
  CapitalProjectBudgeted;
export type FindCapitalProjectByManagingCodeCapitalProjectIdQuery = {
  Response: FindCapitalProjectByManagingCodeCapitalProjectIdQueryResponse;
  PathParams: FindCapitalProjectByManagingCodeCapitalProjectIdPathParams;
  Errors:
    | FindCapitalProjectByManagingCodeCapitalProjectId400
    | FindCapitalProjectByManagingCodeCapitalProjectId404
    | FindCapitalProjectByManagingCodeCapitalProjectId500;
};
