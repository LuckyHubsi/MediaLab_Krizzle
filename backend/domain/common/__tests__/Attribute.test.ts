import {
  attributeSchema,
  createNewAttributeSchema,
} from "@/backend/domain/common/Attribute";
import { AttributeType } from "@/shared/enum/AttributeType";

describe("Attribute Schema Validation", () => {
  const validLabel = "Some Attribute";
  const validOptions = Array.from({ length: 5 }, (_, i) => `Option ${i + 1}`);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("attributeSchema", () => {
    it("validates a non-multiselect attribute", () => {
      const result = attributeSchema.safeParse({
        attributeID: 1,
        attributeLabel: validLabel,
        type: AttributeType.Text,
        preview: false,
        options: null,
        symbol: null,
      });
      expect(result.success).toBe(true);
    });

    it("validates a valid multiselect attribute", () => {
      const result = attributeSchema.safeParse({
        attributeID: 1,
        attributeLabel: validLabel,
        type: AttributeType.Multiselect,
        preview: false,
        options: validOptions,
        symbol: null,
      });
      expect(result.success).toBe(true);
    });

    it("fails when multiselect has no options", () => {
      const result = attributeSchema.safeParse({
        attributeID: 1,
        attributeLabel: validLabel,
        type: AttributeType.Multiselect,
        preview: false,
        options: [],
        symbol: null,
      });
      expect(result.success).toBe(false);
      expect(result.success ? "" : result.error.issues[0].message).toContain(
        "Multi-select attributes must have",
      );
    });

    it("fails when multiselect has too many options", () => {
      const tooManyOptions = Array.from(
        { length: 21 },
        (_, i) => `Option ${i}`,
      );
      const result = attributeSchema.safeParse({
        attributeID: 1,
        attributeLabel: validLabel,
        type: AttributeType.Multiselect,
        preview: false,
        options: tooManyOptions,
        symbol: null,
      });
      expect(result.success).toBe(false);
    });

    it("allows options to be null or undefined for non-multiselect", () => {
      const result1 = attributeSchema.safeParse({
        attributeID: 1,
        attributeLabel: validLabel,
        type: AttributeType.Image,
        preview: false,
        options: null,
        symbol: null,
      });

      const result2 = attributeSchema.safeParse({
        attributeID: 1,
        attributeLabel: validLabel,
        type: AttributeType.Image,
        preview: false,
        symbol: null,
      });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });
  });

  describe("createNewAttributeSchema", () => {
    it("validates new non-multiselect attribute", () => {
      const result = createNewAttributeSchema.safeParse({
        attributeLabel: validLabel,
        type: AttributeType.Link,
        preview: true,
        symbol: "🔗",
      });
      expect(result.success).toBe(true);
    });

    it("validates new multiselect with 1–20 options", () => {
      const result = createNewAttributeSchema.safeParse({
        attributeLabel: validLabel,
        type: AttributeType.Multiselect,
        preview: true,
        options: validOptions,
        symbol: null,
      });
      expect(result.success).toBe(true);
    });

    it("fails new multiselect with missing options", () => {
      const result = createNewAttributeSchema.safeParse({
        attributeLabel: validLabel,
        type: AttributeType.Multiselect,
        preview: true,
        symbol: null,
      });
      expect(result.success).toBe(false);
    });

    it("fails new multiselect with too many options", () => {
      const tooMany = Array.from({ length: 30 }, (_, i) => `Item ${i}`);
      const result = createNewAttributeSchema.safeParse({
        attributeLabel: validLabel,
        type: AttributeType.Multiselect,
        preview: true,
        options: tooMany,
        symbol: null,
      });
      expect(result.success).toBe(false);
    });

    it("uses default value for preview if not specified", () => {
      const result = createNewAttributeSchema.safeParse({
        attributeLabel: validLabel,
        type: AttributeType.Rating,
        symbol: null,
      });
      expect(result.success).toBe(true);
      expect(result.success && result.data.preview).toBe(false);
    });
  });
});
