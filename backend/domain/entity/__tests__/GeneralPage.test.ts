import { z } from "zod";
import {
  generalPageSchema,
  createNewGeneralPage,
  GeneralPage,
} from "@/backend/domain/entity/GeneralPage";
import { PageType } from "@/shared/enum/PageType";

describe("GeneralPage Schema Validation", () => {
  const validGeneralPage = {
    pageID: 1,
    pageType: PageType.Note,
    pageTitle: "valid title",
    pageIcon: "icon",
    pageColor: "#FFFFFF",
    archived: false,
    pinned: false,
    tag: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    parentID: null,
  };
  let invalidGeneralPage: any;

  const validNewGeneralPage = {
    pageType: PageType.Note,
    pageTitle: "Valid Page",
    pageIcon: "icon",
    pageColor: "#FFFFFF",
    archived: false,
    pinned: false,
    tag: null,
    parentID: null,
  };
  let invalidNewGeneralPage: any;

  beforeEach(() => {
    jest.clearAllMocks();
    invalidGeneralPage = { ...validGeneralPage };
    invalidNewGeneralPage = { ...validNewGeneralPage };
  });

  describe("generalPageSchema", () => {
    it("should validate a correct GeneralPage object", () => {
      const result = generalPageSchema.safeParse(validGeneralPage);
      expect(result.success).toBe(true);
    });

    // invalidated GeneralPage object cases
    it("should invalidate when incorrect pageID", () => {
      invalidGeneralPage.pageID = -1;
      const result = generalPageSchema.safeParse(invalidGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect pageType", () => {
      invalidGeneralPage.pageType = "wrong";
      const result = generalPageSchema.safeParse(invalidGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect pageTitle", () => {
      invalidGeneralPage.pageTitle = "";
      const result = generalPageSchema.safeParse(invalidGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect pageIcon", () => {
      invalidGeneralPage.pageIcon = 1;
      const result = generalPageSchema.safeParse(invalidGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect pageColor", () => {
      invalidGeneralPage.pageColor = "blue";
      const result = generalPageSchema.safeParse(invalidGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect archived", () => {
      invalidGeneralPage.archived = "";
      const result = generalPageSchema.safeParse(invalidGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect pinned", () => {
      invalidGeneralPage.pinned = "";
      const result = generalPageSchema.safeParse(invalidGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect tag", () => {
      invalidGeneralPage.tag = "";
      const result = generalPageSchema.safeParse(invalidGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect creation date", () => {
      invalidGeneralPage.createdAt = "not a date";
      const result = generalPageSchema.safeParse(invalidGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect modification date", () => {
      invalidGeneralPage.updatedAt = "not a date";
      const result = generalPageSchema.safeParse(invalidGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect parentID", () => {
      invalidGeneralPage.parent_folderID = -1;
      const result = generalPageSchema.safeParse(invalidGeneralPage);
      expect(result.success).toBe(false);
    });
  });

  describe("createNewGeneralPage", () => {
    it("should validate a correct NewGeneralPage object", () => {
      const result = createNewGeneralPage.safeParse(validGeneralPage);
      expect(result.success).toBe(true);
    });

    // invalidated NewGeneralPage object cases
    it("should invalidate when incorrect pageType", () => {
      invalidNewGeneralPage.pageType = "wrong";
      const result = createNewGeneralPage.safeParse(invalidNewGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect pageTitle", () => {
      invalidNewGeneralPage.pageTitle = "";
      const result = createNewGeneralPage.safeParse(invalidNewGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect pageIcon", () => {
      invalidNewGeneralPage.pageIcon = 1;
      const result = createNewGeneralPage.safeParse(invalidNewGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect pageColor", () => {
      invalidNewGeneralPage.pageColor = "blue";
      const result = createNewGeneralPage.safeParse(invalidNewGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect archived", () => {
      invalidNewGeneralPage.archived = "";
      const result = generalPageSchema.safeParse(invalidNewGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect pinned", () => {
      invalidNewGeneralPage.pinned = "";
      const result = generalPageSchema.safeParse(invalidNewGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect tag", () => {
      invalidNewGeneralPage.tag = "";
      const result = createNewGeneralPage.safeParse(invalidNewGeneralPage);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect parentID", () => {
      invalidNewGeneralPage.parent_folderID = -1;
      const result = createNewGeneralPage.safeParse(invalidNewGeneralPage);
      expect(result.success).toBe(false);
    });
  });
});
