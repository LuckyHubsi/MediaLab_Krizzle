import {
  insertAttribute,
  insertMultiselectOptions,
  insertRatingSymbol,
} from "../AttributeService";
import { executeQuery } from "@/utils/QueryHelper";
import { AttributeDTO, isValidAttributeType } from "@/dto/AttributeDTO";
import { AttributeType } from "@/utils/enums/AttributeType";
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

  describe("insertAttribute", () => {
    it("should call executeQuery with correct parameters for valid attribute", async () => {
      const attributeDTO: AttributeDTO = {
        attributeLabel: "Title",
        type: AttributeType.Text,
        preview: true,
        itemTemplateID: 1,
      };

      await insertAttribute(attributeDTO);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.any(String),
        ["Title", AttributeType.Text, 1, 1],
        undefined,
      );
    });

    it("should throw DatabaseError if executeQuery fails", async () => {
      mockExecuteQuery.mockRejectedValueOnce(new Error("DB failure"));

      const attributeDTO: AttributeDTO = {
        attributeLabel: "Title",
        type: AttributeType.Text,
        preview: true,
        itemTemplateID: 1,
      };

      await expect(insertAttribute(attributeDTO)).rejects.toThrow(
        DatabaseError,
      );
    });
  });

  describe("insertMultiselectOptions", () => {
    it("should call executeQuery with correct parameters", async () => {
      await insertMultiselectOptions("Horror", 1);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.any(String),
        ["Horror", 1],
        undefined,
      );
    });

    it("should throw DatabaseError if executeQuery fails", async () => {
      mockExecuteQuery.mockRejectedValueOnce(new Error("DB failure"));

      await expect(insertMultiselectOptions("Horror", 1)).rejects.toThrow(
        DatabaseError,
      );
    });
  });

  describe("insertRatingSymbol", () => {
    it("should call executeQuery with correct parameters", async () => {
      await insertRatingSymbol("star", 1);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.any(String),
        ["star", 1],
        undefined,
      );
    });

    it("should throw DatabaseError if executeQuery fails", async () => {
      mockExecuteQuery.mockRejectedValueOnce(new Error("DB failure"));

      await expect(insertRatingSymbol("star", 1)).rejects.toThrow(
        DatabaseError,
      );
    });
  });
});
