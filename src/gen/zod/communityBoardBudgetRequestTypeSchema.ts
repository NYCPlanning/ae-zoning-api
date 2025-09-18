import { z } from "zod";

/**
 * @description The type of budget request (Capital or Expense).
 */
export const communityBoardBudgetRequestTypeSchema = z
  .enum(["Capital", "Expense"])
  .describe("The type of budget request (Capital or Expense).");
