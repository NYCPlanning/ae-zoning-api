import type { CommunityBoardBudgetRequestType } from "./CommunityBoardBudgetRequestType";

export type CommunityBoardBudgetRequest = {
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
   * @description Description of the budget request.
   * @type string
   */
  description: string;
  /**
   * @description The id of the community board that made the request.
   * @type string
   */
  communityBoardId: string;
  /**
   * @description Initials of the agency of which the request was made.
   * @type string
   */
  agencyInitials: string;
  /**
   * @description The board\'s ranking of the request\'s priority
   * @type number
   */
  priority: number;
  /**
   * @type string | undefined
   */
  requestType?: CommunityBoardBudgetRequestType;
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
  /**
   * @description The id of the agency\'s response type
   * @type number | undefined
   */
  cbbrAgencyResponseTypeId?: number;
  /**
   * @description The agency\'s written explanation for the response type
   * @type string | undefined
   */
  cbbrAgencyResponse?: string;
};
