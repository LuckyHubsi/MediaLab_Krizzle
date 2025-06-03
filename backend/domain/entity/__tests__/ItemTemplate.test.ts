import { AttributeType } from "@/shared/enum/AttributeType";
import {
  createNewItemTemplateSchema,
  itemTemplateSchema,
} from "../ItemTemplate";

describe("ItemTemplate Schema Validation", () => {
  const validAttribute = {
    attributeID: 1,
    attributeLabel: "test label",
    type: AttributeType.Text,
    preview: true,
    options: null,
    symbol: null,
  };
  const validNewAttribute = {
    attributeLabel: "test label",
    type: AttributeType.Text,
    preview: true,
    options: null,
    symbol: null,
  };

  const validTemplate = {
    itemTemplateID: 1,
    templateName: "test template",
    attributes: [validAttribute],
  };
  let testingTemplate: any;

  const validNewTemplate = {
    templateName: "test template",
    attributes: [validNewAttribute],
  };
  let testingNewTemplate: any;

  beforeEach(() => {
    jest.clearAllMocks();
    testingTemplate = { ...validTemplate };
    testingNewTemplate = { ...validNewTemplate };
  });

  describe("itemTemplateSchema", () => {
    it("accepts a valid item template", () => {
      const result = itemTemplateSchema.safeParse(testingTemplate);
      expect(result.success).toBe(true);
    });

    it("fails if less than 1 attribute", () => {
      testingTemplate.attributes = [];
      const invalidTemplate = testingTemplate;
      const result = itemTemplateSchema.safeParse(invalidTemplate);
      expect(result.success).toBe(false);
    });

    it("fails if more than 10 attributes", () => {
      testingTemplate.attributes = Array(11).fill(validAttribute);
      const invalidTemplate = testingTemplate;
      const result = itemTemplateSchema.safeParse(invalidTemplate);
      expect(result.success).toBe(false);
    });

    it("fails with invalid attribute inside array", () => {
      const invalidAttribute = { ...validAttribute, type: "invalid" };
      testingTemplate.attributes = [invalidAttribute];
      const result = itemTemplateSchema.safeParse(testingTemplate);
      expect(result.success).toBe(false);
    });

    it("fails with missing template name", () => {
      testingTemplate.templateName = undefined;
      const result = itemTemplateSchema.safeParse(testingTemplate);
      expect(result.success).toBe(false);
    });
  });

  describe("createNewItemTemplateSchema", () => {
    it("accepts a valid new item template", () => {
      const result = createNewItemTemplateSchema.safeParse(validNewTemplate);
      expect(result.success).toBe(true);
    });

    it("fails if fewer than 1 attribute", () => {
      testingNewTemplate.attributes = [];
      const result = createNewItemTemplateSchema.safeParse(testingNewTemplate);
      expect(result.success).toBe(false);
    });

    it("fails if more than 10 attributes", () => {
      testingNewTemplate.attributes = Array(11).fill(validNewAttribute);
      const result = createNewItemTemplateSchema.safeParse(testingNewTemplate);
      expect(result.success).toBe(false);
    });

    it("fails with invalid attribute (missing type)", () => {
      const invalidNewAttribute = { ...validNewAttribute, type: "invalid" };
      testingNewTemplate.attributes = [invalidNewAttribute];
      const result = createNewItemTemplateSchema.safeParse(testingNewTemplate);
      expect(result.success).toBe(false);
    });

    it("fails with invalid template name", () => {
      testingNewTemplate.templateName = "";
      const result = createNewItemTemplateSchema.safeParse(testingNewTemplate);
      expect(result.success).toBe(false);
    });
  });
});
