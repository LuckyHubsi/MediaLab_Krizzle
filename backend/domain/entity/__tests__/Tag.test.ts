import { createNewTagSchema, tagSchema } from "../Tag";

describe("Tag Schema Validation", () => {
  const validTag = {
    tagID: 1,
    tagLabel: "test tag",
    usageCount: 1,
  };
  let invalidTag: any;

  const validNewTag = {
    tagLabel: "test tag",
  };
  let invalidNewTag: any;

  beforeEach(() => {
    jest.clearAllMocks();
    invalidTag = { ...validTag };
    invalidNewTag = { ...validNewTag };
  });

  describe("tagSchema", () => {
    it("should validate a correct Tag object", () => {
      const result = tagSchema.safeParse(validTag);
      expect(result.success).toBe(true);
    });

    // invalidated Tag object cases
    it("should invalidate when incorrect tagID", () => {
      invalidTag.tagID = -1;
      const result = tagSchema.safeParse(invalidTag);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect tagLabel", () => {
      invalidTag.tagLabel = "";
      const result = tagSchema.safeParse(invalidTag);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect itemCount", () => {
      invalidTag.usageCount = "";
      const result = tagSchema.safeParse(invalidTag);
      expect(result.success).toBe(false);
    });
  });

  describe("createNewGeneralPage", () => {
    it("should validate a correct GeneralPage object", () => {
      const result = createNewTagSchema.safeParse(validNewTag);
      expect(result.success).toBe(true);
    });

    // invalidated GeneralPage object cases
    it("should invalidate when incorrect tagLabel", () => {
      invalidNewTag.tagLabel = "";
      const result = createNewTagSchema.safeParse(invalidNewTag);
      expect(result.success).toBe(false);
    });
  });
});
