import {
  GeneralPage,
  NewGeneralPage,
  pageID,
} from "@/backend/domain/entity/GeneralPage";
import { GeneralPageDTO } from "@/shared/dto/GeneralPageDTO";
import { GeneralPageModel } from "@/models/GeneralPageModel";
import { PageType } from "@/utils/enums/PageType";
import { TagMapper } from "../TagMapper";
import { GeneralPageMapper } from "../GeneralPageMapper";

jest.mock("@/backend/util/mapper/TagMapper", () => ({
  TagMapper: {
    toDTO: jest.fn(),
    toNewEntity: jest.fn(),
    toEntity: jest.fn(),
  },
}));

describe("GeneralPageMapper", () => {
  const mockPageID = pageID.parse(1);
  const mockTagID: any = 1;
  const date: Date = new Date();
  const dateString: string = date.toISOString();

  const mockGeneralPage: GeneralPage = {
    pageID: mockPageID,
    pageType: PageType.Note,
    pageTitle: "test page",
    pageIcon: "test icon",
    pageColor: "test color",
    archived: false,
    pinned: true,
    tag: {
      tagID: mockTagID,
      tagLabel: "test tag",
    },
    createdAt: date,
    updatedAt: date,
  };

  const mockGeneralPageDTO: GeneralPageDTO = {
    pageID: 1,
    page_type: PageType.Note,
    page_title: "test page",
    page_icon: "test icon",
    page_color: "test color",
    archived: false,
    pinned: true,
    tag: {
      tagID: mockTagID,
      tag_label: "test tag",
    },
  };

  const mockGeneralPageModel: GeneralPageModel = {
    pageID: 1,
    page_type: PageType.Note,
    page_title: "test page",
    page_icon: "test icon",
    page_color: "test color",
    date_created: dateString,
    date_modified: dateString,
    archived: 0,
    pinned: 1,
    tagID: mockTagID,
    tag_label: "test tag",
  };

  const mockNewGeneralPage: NewGeneralPage = {
    pageType: PageType.Note,
    pageTitle: "test page",
    pageIcon: "test icon",
    pageColor: "test color",
    archived: false,
    pinned: true,
    tag: {
      tagID: mockTagID,
      tagLabel: "test tag",
    },
    createdAt: date,
    updatedAt: date,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("toDTO", () => {
    it("should map a GeneralPage entity to a GeneralPageDTO", () => {
      (TagMapper.toDTO as jest.Mock).mockReturnValue(mockGeneralPageDTO.tag);

      const result = GeneralPageMapper.toDTO(mockGeneralPage);

      expect(result).toEqual(mockGeneralPageDTO);
      expect(TagMapper.toDTO).toHaveBeenCalledWith(mockGeneralPage.tag);
    });
  });

  describe("toModel", () => {
    it("should map a GeneralPage entity to a GeneralPageModel", () => {
      const result = GeneralPageMapper.toModel(mockGeneralPage);

      expect(result).toEqual({
        ...mockGeneralPageModel,
        date_created: mockGeneralPage.createdAt.toISOString(),
        date_modified: mockGeneralPage.updatedAt.toISOString(),
      });
    });
  });

  describe("toInsertModel", () => {
    it("should map a NewGeneralPage entity to a GeneralPageModel", () => {
      const result = GeneralPageMapper.toInsertModel(mockNewGeneralPage);

      expect(result).toEqual({
        ...mockGeneralPageModel,
        pageID: 0,
        date_created: mockNewGeneralPage.createdAt.toISOString(),
        date_modified: mockNewGeneralPage.updatedAt.toISOString(),
      });
    });
  });

  describe("toNewEntity", () => {
    it("should map a GeneralPageDTO to a NewGeneralPage entity", () => {
      (TagMapper.toNewEntity as jest.Mock).mockReturnValue(
        mockNewGeneralPage.tag,
      );

      const result = GeneralPageMapper.toNewEntity(mockGeneralPageDTO);

      expect(result).toEqual(
        expect.objectContaining({
          pageType: mockNewGeneralPage.pageType,
          pageTitle: mockNewGeneralPage.pageTitle,
          pageIcon: mockNewGeneralPage.pageIcon,
          pageColor: mockNewGeneralPage.pageColor,
          archived: false,
          pinned: true,
          tag: mockNewGeneralPage.tag,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
      expect(TagMapper.toNewEntity).toHaveBeenCalledWith(
        mockGeneralPageDTO.tag,
      );
    });

    it("should throw an error if GeneralPageDTO is invalid", () => {
      const invalidGeneralPageDTO: GeneralPageDTO = {
        ...mockGeneralPageDTO,
        page_title: "",
      };

      expect(() =>
        GeneralPageMapper.toNewEntity(invalidGeneralPageDTO),
      ).toThrow("Failed to map GeneralPageDTO to New Entity");
    });
  });

  describe("toEntity", () => {
    it("should map a GeneralPageModel to a GeneralPage entity", () => {
      (TagMapper.toEntity as jest.Mock).mockReturnValue(mockGeneralPage.tag);

      const result = GeneralPageMapper.toEntity(mockGeneralPageModel);

      expect(result).toEqual({
        ...mockGeneralPage,
        createdAt: new Date(mockGeneralPageModel.date_created),
        updatedAt: new Date(mockGeneralPageModel.date_modified),
      });
      expect(TagMapper.toEntity).toHaveBeenCalledWith({
        tagID: mockGeneralPageModel.tagID,
        tag_label: mockGeneralPageModel.tag_label!,
      });
    });

    it("should throw an error if GeneralPageModel is invalid", () => {
      const invalidGeneralPageModel: GeneralPageModel = {
        ...mockGeneralPageModel,
        pageID: -1,
      };

      expect(() => GeneralPageMapper.toEntity(invalidGeneralPageModel)).toThrow(
        "Failed to map GeneralPageModel to Entity",
      );
    });
  });
});
