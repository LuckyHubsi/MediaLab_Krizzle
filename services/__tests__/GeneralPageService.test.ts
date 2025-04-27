import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { GeneralPageModel } from "@/models/GeneralPageModel";
import { PageType } from "@/utils/enums/PageType";
import { GeneralPageMapper } from "@/utils/mapper/GeneralPageMapper";
import {
  executeQuery,
  executeTransaction,
  fetchAll,
  getLastInsertId,
} from "@/utils/QueryHelper";
import {
  deleteGeneralPage,
  getAllGeneralPageData,
  insertGeneralPageAndReturnID,
} from "../GeneralPageService";
import { DatabaseError } from "@/utils/DatabaseError";
import * as SQLite from "expo-sqlite";

// mock the QueryHelper functions
jest.mock("@/utils/QueryHelper", () => ({
  fetchAll: jest.fn(),
  executeQuery: jest.fn(),
  executeTransaction: jest.fn(),
  getLastInsertId: jest.fn(),
}));

// mock the general page mapper
jest.mock("@/utils/mapper/GeneralPageMapper", () => {
  const actual = jest.requireActual("@/utils/mapper/GeneralPageMapper");
  return {
    ...actual,
    GeneralPageMapper: {
      ...actual.GeneralPageMapper,
      toDTO: jest.fn(),
    },
  };
});

describe("GeneralPageService", () => {
  const mockGeneralPageDTO: GeneralPageDTO = {
    page_type: PageType.Note,
    page_title: "Test Page",
    page_icon: "icon",
    page_color: "color",
    archived: false,
    pinned: true,
    tag: null,
  };

  const mockGeneralPageModel: GeneralPageModel = {
    pageID: 1,
    page_type: PageType.Note,
    page_title: "Test Page",
    page_icon: "icon",
    page_color: "color",
    date_created: new Date().toISOString(),
    date_modified: new Date().toISOString(),
    archived: 0,
    pinned: 1,
  };

  const mockExecuteQuery = executeQuery as jest.MockedFunction<
    typeof executeQuery
  >;

  const mockFetchAll = fetchAll as jest.MockedFunction<typeof fetchAll>;

  const mockExecuteTransaction = executeTransaction as jest.MockedFunction<
    typeof executeTransaction
  >;

  const mockGetLastInsertId = getLastInsertId as jest.MockedFunction<
    typeof getLastInsertId
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("getAllGeneralPageData", () => {
    it("should return an array of GeneralPageDTO objects", async () => {
      mockFetchAll.mockResolvedValue([mockGeneralPageModel]);
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(
        mockGeneralPageDTO,
      );

      const result = await getAllGeneralPageData();

      expect(result).toEqual([mockGeneralPageDTO]);
      expect(mockFetchAll).toHaveBeenCalled();
      expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        expect.objectContaining({
          pageID: 1,
          page_type: PageType.Note,
          page_title: "Test Page",
          page_icon: "icon",
          page_color: "color",
          archived: 0,
          pinned: 1,
        }),
      );
    });

    it("should throw DatabaseError if fetchAll fails", async () => {
      mockFetchAll.mockRejectedValue(new Error("Database error"));

      await expect(getAllGeneralPageData()).rejects.toThrow(DatabaseError);
    });
  });

  describe("insertGeneralPageAndReturnID", () => {
    it("should insert a general page and return its ID", async () => {
      const mockInsertedId = 1;

      mockExecuteTransaction.mockImplementation(async (fn) => {
        return await fn({} as any);
      });
      mockExecuteQuery.mockResolvedValue({} as SQLite.SQLiteRunResult);
      mockGetLastInsertId.mockResolvedValue(mockInsertedId);

      const result = await insertGeneralPageAndReturnID(mockGeneralPageDTO);

      expect(mockExecuteTransaction).toHaveBeenCalled();
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.any(String),
        [
          mockGeneralPageDTO.page_type,
          mockGeneralPageDTO.page_title,
          mockGeneralPageDTO.page_icon,
          mockGeneralPageDTO.page_color,
          expect.any(String),
          expect.any(String),
          0,
          1,
        ],
        undefined,
      );
      expect(mockGetLastInsertId).toHaveBeenCalled();
      expect(result).toBe(mockInsertedId);
    });

    it("should throw DatabaseError if insertion fails", async () => {
      mockExecuteQuery.mockRejectedValue(new Error("Insert failed"));

      await expect(
        insertGeneralPageAndReturnID(mockGeneralPageDTO),
      ).rejects.toThrow(DatabaseError);
    });
  });

  describe("deleteGeneralPage", () => {
    it("should delete the general page and return true", async () => {
      const mockPageID = 1;
      mockExecuteQuery.mockResolvedValue({} as SQLite.SQLiteRunResult);

      const result = await deleteGeneralPage(mockPageID);

      expect(executeQuery).toHaveBeenCalledWith(
        expect.any(String),
        [mockPageID],
        undefined,
      );
      expect(result).toBe(true);
    });

    it("should throw DatabaseError if deletion fails", async () => {
      const mockPageID = 1;

      mockExecuteQuery.mockRejectedValue(new Error("Delete failed"));

      await expect(deleteGeneralPage(mockPageID)).rejects.toThrow(
        DatabaseError,
      );
    });
  });
});
