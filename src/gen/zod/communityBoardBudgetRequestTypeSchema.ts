import { z } from "zod";

/**
 * @description The type of budget request (Capital or Expense).
 */
export const communityBoardBudgetRequestTypeSchema = z
  .enum(["C", "E"])
  .describe("The type of budget request (Capital or Expense).");
