import type { Page } from "./Page";

export type CommunityBoardBudgetRequestPage = Page & {
  /**
   * @type array
   */
  communityBoardBudgetRequests: {
    /**
     * @description The id for the community board budget request.
     * @type string
     */
    id: string;
    /**
     * @description The id for the policy area of the request.
     * @type integer
     */
    cbbrPolicyAreaId: number;
    /**
     * @description The title of the budget request.
     * @type string
     */
    title: string;
    /**
     * @description The id of the community board that made the request.
     * @type string
     */
    communityBoardId: string;
    /**
     * @description Whether the budget request has associated mappable data
     * @type boolean
     */
    isMapped: boolean;
    /**
     * @description Whether the budget request is for Continued Support
     * @type boolean
     */
    isContinuedSupport: boolean;
  }[];
  /**
   * @description The total number of results matching the query parameters.
   * @type integer
   */
  totalBudgetRequests: number;
};
