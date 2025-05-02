import { itemTemplateService } from "@/services/ItemTemplateService";
import { DatabaseError } from "@/utils/DatabaseError";
import { ItemTemplateMapper } from "@/utils/mapper/ItemTemplateMapper";
import {
  executeQuery,
  executeTransaction,
  fetchFirst,
  getLastInsertId,
} from "@/utils/QueryHelper";
import * as ItemTemplateQuery from "@/queries/ItemTemplateQuery";

jest.mock("@/utils/QueryHelper", () => ({
  fetchFirst: jest.fn(),
  executeTransaction: jest.fn(),
  executeQuery: jest.fn(),
  getLastInsertId: jest.fn(),
}));

jest.mock("@/utils/mapper/ItemTemplateMapper", () => ({
  ItemTemplateMapper: {
    toDTO: jest.fn(),
  },
}));

describe("ItemTemplateService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockExecuteTransaction = executeTransaction as jest.MockedFunction<
    typeof executeTransaction
  >;
  const mockExecuteQuery = executeQuery as jest.MockedFunction<
    typeof executeQuery
  >;
  const mockFetchFirst = fetchFirst as jest.MockedFunction<typeof fetchFirst>;
  const mockGetLastInsertId = getLastInsertId as jest.MockedFunction<
    typeof getLastInsertId
  >;

  describe("insertItemTemplateAndReturnID", () => {
    it("should insert item template and return the new ID", async () => {
      mockExecuteTransaction.mockImplementation(async (fn) => {
        return await fn({} as any);
      });
      mockGetLastInsertId.mockResolvedValue(10);

      const templateDTO = { template_name: "temp 1" } as any;

      const result =
        await itemTemplateService.insertItemTemplateAndReturnID(templateDTO);

      expect(mockExecuteTransaction).toHaveBeenCalledTimes(1);
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.any(String),
        ["temp 1"],
        undefined,
      );
      expect(mockGetLastInsertId).toHaveBeenCalledWith(undefined);
      expect(result).toBe(10);
    });

    it("should throw DatabaseError if transaction fails", async () => {
      mockExecuteTransaction.mockRejectedValue(new Error("fail"));

      const templateDTO = { template_name: "temp 1" } as any;

      await expect(
        itemTemplateService.insertItemTemplateAndReturnID(templateDTO),
      ).rejects.toThrow(DatabaseError);

      expect(mockExecuteTransaction).toHaveBeenCalledTimes(1);
    });
  });

  describe("getTemplate", () => {
    it("should fetch and map template correctly", async () => {
      const templateModel = {
        templateID: 1,
        template_name: "temp 1",
      } as any;
      const templateDTO = { templateID: 1, template_name: "temp 1" } as any;

      mockFetchFirst.mockResolvedValue(templateModel);
      (ItemTemplateMapper.toDTO as jest.Mock).mockReturnValue(templateDTO);

      const result = await itemTemplateService.getTemplate(1);

      expect(mockFetchFirst).toHaveBeenCalledWith(
        expect.any(String),
        [1],
        undefined,
      );
      expect(ItemTemplateMapper.toDTO).toHaveBeenCalledWith(templateModel);
      expect(result).toEqual(templateDTO);
    });

    it("should throw DatabaseError if no template is found", async () => {
      mockFetchFirst.mockResolvedValue(null);

      await expect(itemTemplateService.getTemplate(1)).rejects.toThrow(
        DatabaseError,
      );

      expect(mockFetchFirst).toHaveBeenCalledWith(
        expect.any(String),
        [1],
        undefined,
      );
    });

    it("should throw DatabaseError if fetchFirst fails", async () => {
      mockFetchFirst.mockRejectedValue(new Error("fetch fail"));

      await expect(itemTemplateService.getTemplate(1)).rejects.toThrow(
        DatabaseError,
      );

      expect(mockFetchFirst).toHaveBeenCalledWith(
        expect.any(String),
        [1],
        undefined,
      );
    });
  });
});
