import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { GeneralPageModel } from "@/models/GeneralPageModel";
import { PageType } from "@/utils/enums/PageType";
import { GeneralPageMapper } from "@/utils/mapper/GeneralPageMapper";
import { executeQuery, fetchAll, fetchFirst } from "@/utils/QueryHelper";
import {
  deleteGeneralPage,
  getAllGeneralPageData,
  insertGeneralPageAndReturnID,
} from "../GeneralPageService";

// mock the QueryHelper functions
jest.mock("@/utils/QueryHelper", () => ({
  fetchAll: jest.fn(),
  executeQuery: jest.fn(),
  fetchFirst: jest.fn(),
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

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe("getAllGeneralPageData", () => {
    it("should return an array of GeneralPageDTO objects", async () => {
      (fetchAll as jest.Mock).mockResolvedValue([mockGeneralPageModel]);
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(
        mockGeneralPageDTO,
      );

      const result = await getAllGeneralPageData();

      expect(result).toEqual([mockGeneralPageDTO]);
      expect(fetchAll).toHaveBeenCalled();
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

    it("should return null on database error", async () => {
      (fetchAll as jest.Mock).mockRejectedValue(new Error("Database error"));

      const result = await getAllGeneralPageData();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Error getting all pages note:",
        new Error("Database error"),
      );
    });
  });

  describe("insertGeneralPageAndReturnID", () => {
    it("should return the inserted page ID", async () => {
      (executeQuery as jest.Mock).mockResolvedValue(undefined);
      (fetchFirst as jest.Mock).mockResolvedValue({ id: 1 });

      const result = await insertGeneralPageAndReturnID(mockGeneralPageDTO);

      expect(result).toBe(1);
      expect(executeQuery).toHaveBeenCalledWith(expect.any(String), [
        mockGeneralPageDTO.page_type,
        mockGeneralPageDTO.page_title,
        mockGeneralPageDTO.page_icon,
        mockGeneralPageDTO.page_color,
        expect.any(String),
        expect.any(String),
        mockGeneralPageDTO.archived ? 1 : 0,
        mockGeneralPageDTO.pinned ? 1 : 0,
      ]);
      expect(fetchFirst).toHaveBeenCalledWith(
        "SELECT last_insert_rowid() as id",
      );
    });

    it("should return null on insertion failure", async () => {
      (executeQuery as jest.Mock).mockRejectedValue(
        new Error("Insertion error"),
      );

      const result = await insertGeneralPageAndReturnID(mockGeneralPageDTO);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Error inserting note:",
        new Error("Insertion error"),
      );
    });

    it("should return null if fetching inserted page ID fails", async () => {
      (executeQuery as jest.Mock).mockResolvedValue(undefined);
      (fetchFirst as jest.Mock).mockResolvedValue(null);

      const result = await insertGeneralPageAndReturnID(mockGeneralPageDTO);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch inserted page ID",
      );
    });
  });

  describe("deleteGeneralPage", () => {
    it("should call executeQuery with correct query and pageID", async () => {
      const mockPageID = 1;
      await deleteGeneralPage(mockPageID);

      expect(executeQuery).toHaveBeenCalledWith(expect.any(String), [
        mockPageID,
      ]);
    });

    it("should log an error if deletion fails", async () => {
      const mockPageID = 1;
      const mockError = new Error("Delete failed");
      (executeQuery as jest.Mock).mockRejectedValueOnce(mockError);

      await deleteGeneralPage(mockPageID);

      expect(console.error).toHaveBeenCalledWith(
        "Error deleting note:",
        mockError,
      );
    });
  });
});
