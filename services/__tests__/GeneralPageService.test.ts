import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { GeneralPageModel } from "@/models/GeneralPageModel";
import { PageType } from "@/utils/enums/PageType";
import { GeneralPageMapper } from "@/utils/mapper/GeneralPageMapper";
import { fetchAll } from "@/utils/QueryHelper";
import { getAllGeneralPageData } from "../GeneralPageService";

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
});
