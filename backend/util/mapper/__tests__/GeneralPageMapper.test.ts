import { pageID } from "@/backend/domain/common/IDs";
import {
  GeneralPage,
  NewGeneralPage,
} from "@/backend/domain/entity/GeneralPage";
import { GeneralPageModel } from "@/backend/repository/model/GeneralPageModel";
import { GeneralPageDTO } from "@/shared/dto/GeneralPageDTO";
import { PageType } from "@/shared/enum/PageType";
import { GeneralPageMapper } from "../GeneralPageMapper";
import { ZodError } from "zod";

jest.mock("@/backend/util/mapper/TagMapper", () => ({
  TagMapper: {
    toDTO: jest.fn(),
    toUpdatedEntity: jest.fn(),
    toEntity: jest.fn(),
  },
}));

describe("GeneralPageMapper", () => {
  const brandedPageID = pageID.parse(1);
  const mockedTagID: any = 1;
  const mockedFolderID: any = 1;
  const date: Date = new Date();
  const dateString: string = date.toISOString();

  const generalPageEntity: GeneralPage = {
    pageID: brandedPageID,
    pageType: PageType.Note,
    pageTitle: "Test Page",
    pageIcon: "icon",
    pageColor: "#FFFFFF",
    archived: false,
    pinned: false,
    tag: null,
    createdAt: date,
    updatedAt: date,
    parentID: null,
  };

  const newGeneralPageEntity: NewGeneralPage = {
    pageType: PageType.Note,
    pageTitle: "Test Page",
    pageIcon: "icon",
    pageColor: "#FFFFFF",
    archived: false,
    pinned: false,
    tag: null,
    parentID: null,
    createdAt: date,
    updatedAt: date,
  };

  const generalPageDTO: GeneralPageDTO = {
    pageID: 1,
    page_type: PageType.Note,
    page_title: "Test Page",
    page_icon: "icon",
    page_color: "#FFFFFF",
    archived: false,
    pinned: false,
    tag: null,
    parentID: null,
  };
  let invalidDTO: GeneralPageDTO;

  const generalPageModel: GeneralPageModel = {
    pageID: 1,
    page_type: PageType.Note,
    page_title: "Test Page",
    page_icon: "icon",
    page_color: "#FFFFFF",
    archived: 0,
    pinned: 0,
    tagID: null,
    date_created: dateString,
    date_modified: dateString,
    parentID: null,
  };

  let invalidModel: GeneralPageModel;

  beforeEach(() => {
    jest.clearAllMocks();
    invalidDTO = { ...generalPageDTO };
    invalidModel = { ...generalPageModel };
  });

  describe("toDTO", () => {
    it("should map a GeneralPage entity to a GeneralPageDTO", () => {
      const result = GeneralPageMapper.toDTO(generalPageEntity);
      expect(result).toEqual(generalPageDTO);
    });
  });

  describe("toNewEntity", () => {
    it("should map a GeneralPageDTO to a NewGeneralPage entity", () => {
      const result = GeneralPageMapper.toNewEntity(generalPageDTO);
      expect(result).toEqual(
        expect.objectContaining({
          pageType: newGeneralPageEntity.pageType,
          pageTitle: newGeneralPageEntity.pageTitle,
          pageIcon: newGeneralPageEntity.pageIcon,
          pageColor: newGeneralPageEntity.pageColor,
          archived: newGeneralPageEntity.archived,
          pinned: newGeneralPageEntity.pinned,
          tag: newGeneralPageEntity.tag,
        }),
      );
    });

    it("should throw an error if GeneralPageDTO page title is invalid", () => {
      invalidDTO.page_title = "";
      expect(() => GeneralPageMapper.toNewEntity(invalidDTO)).toThrow(ZodError);
    });

    // Other cases of validation in schema failing - either due to constraints, types or similar
    // are covered in unit tests in @/backend/domain/entity/__tests__/GeneralPage.test.ts
  });

  describe("toEntity", () => {
    it("should map a GeneralPageModel to a GeneralPage entity", () => {
      const result = GeneralPageMapper.toEntity(generalPageModel);
      expect(result).toEqual(
        expect.objectContaining({
          pageID: brandedPageID,
          pageType: generalPageEntity.pageType,
          pageTitle: generalPageEntity.pageTitle,
          pageIcon: generalPageEntity.pageIcon,
          pageColor: generalPageEntity.pageColor,
          archived: generalPageEntity.archived,
          pinned: generalPageEntity.pinned,
          tag: generalPageEntity.tag,
          parentID: generalPageEntity.parentID,
        }),
      );
    });

    it("should throw an error if GeneralPageModel page title is invalid", () => {
      invalidModel.page_title = "";
      expect(() => GeneralPageMapper.toEntity(invalidModel)).toThrow(ZodError);
    });

    // Other cases of validation in schema failing - either due to constraints, types or similar
    // are covered in unit tests in @/backend/domain/entity/__tests__/GeneralPage.test.ts
  });

  describe("toUpdatedEntity", () => {
    it("should map a GeneralPageDTO to a GeneralPage entity", () => {
      const result = GeneralPageMapper.toUpdatedEntity(generalPageDTO);
      expect(result).toEqual(
        expect.objectContaining({
          pageID: brandedPageID,
          pageType: generalPageEntity.pageType,
          pageTitle: generalPageEntity.pageTitle,
          pageIcon: generalPageEntity.pageIcon,
          pageColor: generalPageEntity.pageColor,
          archived: generalPageEntity.archived,
          pinned: generalPageEntity.pinned,
          tag: generalPageEntity.tag,
          parentID: generalPageEntity.parentID,
        }),
      );
    });

    it("should throw an error if GeneralPageDTO page title is invalid", () => {
      invalidDTO.page_title = "";
      expect(() => GeneralPageMapper.toUpdatedEntity(invalidDTO)).toThrow(
        ZodError,
      );
    });

    // Other cases of validation in schema failing - either due to constraints, types or similar
    // are covered in unit tests in @/backend/domain/entity/__tests__/GeneralPage.test.ts
  });
});
