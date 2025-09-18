export const communityBoardBudgetRequestType = {
  C: "C",
  E: "E",
} as const;
export type CommunityBoardBudgetRequestType =
  (typeof communityBoardBudgetRequestType)[keyof typeof communityBoardBudgetRequestType];
