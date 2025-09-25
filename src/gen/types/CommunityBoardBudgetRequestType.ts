export const communityBoardBudgetRequestType = {
  Capital: "Capital",
  Expense: "Expense",
} as const;
export type CommunityBoardBudgetRequestType =
  (typeof communityBoardBudgetRequestType)[keyof typeof communityBoardBudgetRequestType];
