import { communityBoardBudgetRequestEntitySchema } from "./community-board-budget-request";

describe("communityBoardBudgetRequestEntitySchema", () => {
  const agencyCategoryResponseSchema =
    communityBoardBudgetRequestEntitySchema.pick({
      agencyCategoryResponse: true,
    });

  it("accepts agencyCategoryResponse", () => {
    const result = agencyCategoryResponseSchema.safeParse({
      agencyCategoryResponse: 1,
    });

    expect(result.success).toBe(true);
  });

  it("rejects the legacy agencyCategoryReponse key", () => {
    const result = agencyCategoryResponseSchema.safeParse({
      agencyCategoryReponse: 1,
    });

    expect(result.success).toBe(false);
  });
});
