import { DatabaseError } from "@/utils/DatabaseError";
import {
  getItemById,
  getItemsByPageId,
  insertItemAndReturnID,
  insertItemAttributeValue,
} from "../ItemService";
import { ItemMapper } from "@/utils/mapper/ItemMapper";
import { ItemsMapper } from "@/utils/mapper/ItemsMapper";
import {
  executeQuery,
  executeTransaction,
  fetchAll,
  fetchFirst,
  getLastInsertId,
} from "@/utils/QueryHelper";
import { AttributeType } from "@/utils/enums/AttributeType";
import { ItemDTO } from "@/dto/ItemDTO";
import * as ItemQuery from "@/queries/ItemQuery";

jest.mock("@/utils/QueryHelper", () => ({
  fetchFirst: jest.fn(),
  fetchAll: jest.fn(),
  executeTransaction: jest.fn(),
  getLastInsertId: jest.fn(),
  executeQuery: jest.fn(),
}));

jest.mock("@/utils/mapper/ItemMapper", () => ({
  ItemMapper: {
    toDTO: jest.fn(),
  },
}));

jest.mock("@/utils/mapper/ItemsMapper", () => ({
  ItemsMapper: {
    toDTO: jest.fn(),
  },
}));

describe("ItemService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockItemModel = {
    itemID: 1,
    pageID: 2,
    categoryID: 3,
    attributes: JSON.stringify([
      { attributeID: 1, value: "test value", type: "text" },
    ]),
  };

  const parsedItemModel = {
    ...mockItemModel,
    attributes: [{ attributeID: 1, value: "test value", type: "text" }],
  };

  const itemDTO = {
    itemID: 1,
    pageID: 2,
    categoryID: 3,
    attributeValues: [{ attributeID: 1, value: "test value", type: "text" }],
  };

  const itemDTOInsertion = {
    pageID: 2,
    categoryID: 3,
    attributeValues: [
      {
        attributeID: 1,
        valueString: "test text",
        type: AttributeType.Text,
      },
      {
        attributeID: 2,
        valueNumber: 5,
        type: AttributeType.Rating,
      },
      {
        attributeID: 3,
        valueMultiselect: ["option 1", "option 2"],
        type: AttributeType.Multiselect,
      },
    ],
  } as ItemDTO;

  const mockFetchFirst = fetchFirst as jest.MockedFunction<typeof fetchFirst>;
  const mockFetchAll = fetchAll as jest.MockedFunction<typeof fetchAll>;
  const mockExecuteQuery = executeQuery as jest.MockedFunction<
    typeof executeQuery
  >;
  const mockExecuteTransaction = executeTransaction as jest.MockedFunction<
    typeof executeTransaction
  >;
  const mockGetLastInsertId = getLastInsertId as jest.MockedFunction<
    typeof getLastInsertId
  >;

  describe("getItemById", () => {
    it("returns item DTO if item is found", async () => {
      mockFetchFirst.mockResolvedValue(mockItemModel);
      (ItemMapper.toDTO as jest.Mock).mockReturnValue(itemDTO);

      const result = await getItemById(1);

      expect(mockFetchFirst).toHaveBeenCalledWith(
        ItemQuery.itemSelectByIdQuery,
        [1],
      );
      expect(ItemMapper.toDTO).toHaveBeenCalledWith(parsedItemModel);
      expect(result).toEqual(itemDTO);
    });

    it("throws DatabaseError if fetchFirst fails", async () => {
      mockFetchFirst.mockResolvedValue(null);

      await expect(getItemById(1)).rejects.toThrow(DatabaseError);

      expect(mockFetchFirst).toHaveBeenCalledWith(
        ItemQuery.itemSelectByIdQuery,
        [1],
      );
      expect(ItemMapper.toDTO).not.toHaveBeenCalled();
    });
  });

  describe("getItemsByPageId", () => {
    it("returns items DTO for given page", async () => {
      const rawItems = [mockItemModel, mockItemModel];
      const expectedItemsDTO = { items: [itemDTO, itemDTO] };

      mockFetchAll.mockResolvedValue(rawItems);
      (ItemsMapper.toDTO as jest.Mock).mockReturnValue(expectedItemsDTO);

      const result = await getItemsByPageId(2);

      expect(mockFetchAll).toHaveBeenCalledWith(
        ItemQuery.itemSelectByPageIdQuery,
        [2],
      );
      expect(ItemsMapper.toDTO).toHaveBeenCalledWith(rawItems);
      expect(result).toEqual(expectedItemsDTO);
    });

    it("throws DatabaseError if fetchAll fails", async () => {
      mockFetchAll.mockRejectedValue(new Error());

      await expect(getItemsByPageId(1)).rejects.toThrow(DatabaseError);

      expect(mockFetchAll).toHaveBeenCalledWith(
        ItemQuery.itemSelectByPageIdQuery,
        [1],
      );
      expect(ItemMapper.toDTO).not.toHaveBeenCalled();
    });
  });

  describe("insertItemAndReturnID", () => {
    it("successfully inserts item and attributes", async () => {
      const mockTxn = {} as any;

      mockExecuteTransaction.mockImplementation(async (fn) => {
        return await fn({} as any);
      });

      mockGetLastInsertId.mockResolvedValue(1);

      const result = await insertItemAndReturnID(itemDTOInsertion);

      expect(mockExecuteTransaction).toHaveBeenCalledTimes(1);

      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        1,
        expect.any(String),
        [itemDTOInsertion.pageID, itemDTOInsertion.categoryID],
        mockTxn,
      );

      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        2,
        expect.any(String),
        [1, 1, "test text"],
        mockTxn,
      );

      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        3,
        expect.any(String),
        [1, 2, 5],
        mockTxn,
      );

      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        4,
        expect.any(String),
        [1, 3, JSON.stringify(["option 1", "option 2"])],
        mockTxn,
      );

      expect(result).toBe(1);
    });

    it("throws DatabaseError if transaction fails", async () => {
      mockExecuteTransaction.mockRejectedValue(new Error());

      await expect(insertItemAndReturnID(itemDTOInsertion)).rejects.toThrow(
        DatabaseError,
      );

      expect(mockExecuteTransaction).toHaveBeenCalledTimes(1);
    });
  });

  describe("insertItemAttributeValue", () => {
    it("inserts a text attribute value", async () => {
      await insertItemAttributeValue("query", {
        itemID: 1,
        attributeID: 10,
        valueString: "test text",
      } as any);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "query",
        [1, 10, "test text"],
        undefined,
      );
    });

    it("inserts a number attribute value", async () => {
      await insertItemAttributeValue("query", {
        itemID: 1,
        attributeID: 20,
        valueNumber: 5,
      } as any);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "query",
        [1, 20, 5],
        undefined,
      );
    });

    it("inserts a multiselect attribute value", async () => {
      await insertItemAttributeValue("query", {
        itemID: 1,
        attributeID: 30,
        valueMultiselect: ["opt1", "opt2"],
      } as any);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "query",
        [1, 30, JSON.stringify(["opt1", "opt2"])],
        undefined,
      );
    });

    it("throws DatabaseError if executeQuery fails", async () => {
      mockExecuteQuery.mockRejectedValue(new Error());

      await expect(
        insertItemAttributeValue("query", {
          itemID: 1,
          attributeID: 99,
          valueString: "Error",
        } as any),
      ).rejects.toThrow(DatabaseError);
    });
  });
});
