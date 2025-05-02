import { CollectionDTO } from "@/dto/CollectionDTO";
import { CollectionModel } from "@/models/CollectionModel";
import { PageType } from "@/utils/enums/PageType";
import { CollectionMapper } from "@/utils/mapper/CollectionMapper";
import {
  executeQuery,
  executeTransaction,
  fetchAll,
  fetchFirst,
  getLastInsertId,
} from "@/utils/QueryHelper";
import { collectionService } from "../CollectionService";
import { DatabaseError } from "@/utils/DatabaseError";
import * as SQLite from "expo-sqlite";
import { ItemTemplateDTO } from "@/dto/ItemTemplateDTO";
import { AttributeType } from "@/utils/enums/AttributeType";
import { attributeService } from "../AttributeService";
import { collectionCategoryService } from "../CollectionCategoriesService";
import { generalPageService } from "../GeneralPageService";
import { itemTemplateService } from "../ItemTemplateService";

// mock the QueryHelper functions
jest.mock("@/utils/QueryHelper", () => ({
  fetchFirst: jest.fn(),
  executeQuery: jest.fn(),
  executeTransaction: jest.fn(),
  getLastInsertId: jest.fn(),
}));

jest.mock("@/utils/mapper/CollectionMapper", () => ({
  CollectionMapper: {
    toDTO: jest.fn(),
  },
}));

jest.mock("../CollectionCategoriesService", () => ({
  insertCollectionCategory: jest.fn(),
}));
jest.mock("../GeneralPageService", () => ({
  insertGeneralPageAndReturnID: jest.fn(),
}));
jest.mock("../ItemTemplateService", () => ({
  insertItemTemplateAndReturnID: jest.fn(),
}));
jest.mock("../AttributeService", () => ({
  insertAttribute: jest.fn(),
  insertMultiselectOptions: jest.fn(),
  insertRatingSymbol: jest.fn(),
}));

describe("CollectionService", () => {
  const mockCollectionModel = {
    pageID: 1,
    page_type: PageType.Note,
    page_title: "Test Page",
    collectionID: 1,
    templateID: 1,
    categories: JSON.stringify([
      {
        collection_categoryID: 1,
        category_name: "list 1",
        collectionID: 1,
      },
      {
        collection_categoryID: 2,
        category_name: "list 2",
        collectionID: 1,
      },
    ]),
  } as CollectionModel;

  const mockCollectionDTO = {
    page_type: PageType.Note,
    page_title: "Test Page",
    collectionID: 1,
    templateID: 1,
    categories: [
      {
        collectionCategoryID: 1,
      },
      {
        collectionCategoryID: 2,
      },
    ],
  } as CollectionDTO;

  const mockTemplateDTO = {
    template_name: "Test template",
    item_templateID: 1,
    attributes: [
      {
        attributeID: 1,
      },
      {
        attributeID: 2,
      },
    ],
  } as ItemTemplateDTO;

  const mockExecuteQuery = executeQuery as jest.MockedFunction<
    typeof executeQuery
  >;
  const mockFetchFirst = fetchFirst as jest.MockedFunction<typeof fetchFirst>;

  const mockExecuteTransaction = executeTransaction as jest.MockedFunction<
    typeof executeTransaction
  >;

  const mockGetLastInsertId = getLastInsertId as jest.MockedFunction<
    typeof getLastInsertId
  >;

  describe("getCollectionByPageId", () => {
    it("should fetch a collection and return it as DTO", async () => {
      const mockTxn = {} as any;

      mockFetchFirst.mockResolvedValue(mockCollectionModel);
      (CollectionMapper.toDTO as jest.Mock).mockReturnValue(mockCollectionDTO);

      const result = await collectionService.getCollectionByPageId(1, mockTxn);

      expect(mockFetchFirst).toHaveBeenCalledWith(
        expect.any(String),
        [1],
        mockTxn,
      );
      expect(CollectionMapper.toDTO).toHaveBeenCalledWith(mockCollectionModel);
      expect(result).toEqual(mockCollectionDTO);
    });

    it("should throw a DatabaseError if fetch fails", async () => {
      const mockTxn = {} as any;

      mockFetchFirst.mockRejectedValue(new Error("DB Failure"));

      await expect(
        collectionService.getCollectionByPageId(1, mockTxn),
      ).rejects.toThrow(DatabaseError);
    });
  });

  describe("insertCollectionAndReturnID", () => {
    it("should insert a collection and return the collection ID", async () => {
      mockExecuteTransaction.mockImplementation(async (fn) => {
        return await fn({} as any);
      });
      mockExecuteQuery.mockResolvedValue({} as SQLite.SQLiteRunResult);
      mockGetLastInsertId.mockResolvedValue(1);

      const result = await collectionService.insertCollectionAndReturnID(1, 1);

      expect(result).toBe(1);
      expect(mockExecuteTransaction).toHaveBeenCalled();
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.any(String),
        [1, 1],
        undefined,
      );
      expect(mockGetLastInsertId).toHaveBeenCalled();
    });

    it("should throw an error if the insert fails", async () => {
      mockExecuteQuery.mockRejectedValueOnce(new Error("Insert failed"));

      await expect(
        collectionService.insertCollectionAndReturnID(1, 1),
      ).rejects.toThrow(DatabaseError);
    });

    it("should throw an error if fetching last insert ID fails", async () => {
      mockExecuteQuery.mockResolvedValueOnce({} as SQLite.SQLiteRunResult);
      mockGetLastInsertId.mockRejectedValueOnce(new Error("Fetch failure"));

      await expect(
        collectionService.insertCollectionAndReturnID(1, 1),
      ).rejects.toThrow(DatabaseError);
    });
  });

  describe("saveCollection", () => {
    const mockInsertGeneralPageAndReturnID =
      generalPageService.insertGeneralPageAndReturnID as jest.MockedFunction<
        typeof generalPageService.insertGeneralPageAndReturnID
      >;
    const mockInsertItemTemplateAndReturnID =
      itemTemplateService.insertItemTemplateAndReturnID as jest.MockedFunction<
        typeof itemTemplateService.insertItemTemplateAndReturnID
      >;
    const mockInsertAttribute =
      attributeService.insertAttribute as jest.MockedFunction<
        typeof attributeService.insertAttribute
      >;
    const mockInsertMultiselectOptions =
      attributeService.insertMultiselectOptions as jest.MockedFunction<
        typeof attributeService.insertMultiselectOptions
      >;
    const mockInsertRatingSymbol =
      attributeService.insertRatingSymbol as jest.MockedFunction<
        typeof attributeService.insertRatingSymbol
      >;
    const mockInsertCollectionCategory =
      collectionCategoryService.insertCollectionCategory as jest.MockedFunction<
        typeof collectionCategoryService.insertCollectionCategory
      >;

    it("should save a collection and return the page ID", async () => {
      const mockTxn = {} as any;
      mockExecuteTransaction.mockImplementation(async (fn) => {
        return await fn(mockTxn);
      });

      mockInsertGeneralPageAndReturnID.mockResolvedValue(1);
      mockInsertItemTemplateAndReturnID.mockResolvedValue(1);

      const result = await collectionService.saveCollection(
        mockCollectionDTO,
        mockTemplateDTO,
      );

      expect(result).toBe(1);
      expect(mockInsertGeneralPageAndReturnID).toHaveBeenCalledWith(
        mockCollectionDTO,
        mockTxn,
      );
      expect(mockInsertItemTemplateAndReturnID).toHaveBeenCalledWith(
        mockTemplateDTO,
        mockTxn,
      );
      expect(mockInsertAttribute).toHaveBeenCalledTimes(2);
      expect(mockInsertMultiselectOptions).toHaveBeenCalledTimes(0);
      expect(mockInsertRatingSymbol).toHaveBeenCalledTimes(0);

      expect(mockInsertCollectionCategory).toHaveBeenCalledTimes(2);
    });

    it("should throw DatabaseError if executeTransaction fails", async () => {
      mockExecuteTransaction.mockRejectedValueOnce(
        new Error("Transaction failed"),
      );

      await expect(
        collectionService.saveCollection(mockCollectionDTO, mockTemplateDTO),
      ).rejects.toThrow(DatabaseError);
    });

    it("should throw DatabaseError if insertGeneralPageAndReturnID fails", async () => {
      mockExecuteTransaction.mockImplementation(async (fn) => {
        return await fn({} as any);
      });
      mockInsertGeneralPageAndReturnID.mockRejectedValueOnce(
        new Error("Insert page failed"),
      );

      await expect(
        collectionService.saveCollection(mockCollectionDTO, mockTemplateDTO),
      ).rejects.toThrow(DatabaseError);
    });

    it("should throw DatabaseError if insertItemTemplateAndReturnID fails", async () => {
      mockExecuteTransaction.mockImplementation(async (fn) => {
        return await fn({} as any);
      });
      mockInsertGeneralPageAndReturnID.mockResolvedValueOnce(1);
      mockInsertItemTemplateAndReturnID.mockRejectedValueOnce(
        new Error("Insert template failed"),
      );

      await expect(
        collectionService.saveCollection(mockCollectionDTO, mockTemplateDTO),
      ).rejects.toThrow(DatabaseError);
    });
  });
});
