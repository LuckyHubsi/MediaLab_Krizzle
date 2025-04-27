import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";
import { executeQuery } from "@/utils/QueryHelper";
import { insertCollectionCategory } from "../CollectionCategoriesService";
import { DatabaseError } from "@/utils/DatabaseError";

// mock the QueryHelper functions
jest.mock("@/utils/QueryHelper", () => ({
  executeQuery: jest.fn(),
}));

describe("AttributeService", () => {
  const mockExecuteQuery = executeQuery as jest.MockedFunction<
    typeof executeQuery
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("insertCollectionCategory", () => {
    it("should call executeQuery with correct parameters for valid attribute", async () => {
      const categoryDTO: CollectionCategoryDTO = {
        category_name: "category 1",
        collectionID: 1,
      };

      await insertCollectionCategory(categoryDTO);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.any(String),
        ["category 1", 1],
        undefined,
      );
    });

    it("should throw DatabaseError if executeQuery fails", async () => {
      mockExecuteQuery.mockRejectedValueOnce(new Error("DB failure"));

      const categoryDTO: CollectionCategoryDTO = {
        category_name: "category 1",
        collectionID: 1,
      };

      await expect(insertCollectionCategory(categoryDTO)).rejects.toThrow(
        DatabaseError,
      );
    });
  });
});
