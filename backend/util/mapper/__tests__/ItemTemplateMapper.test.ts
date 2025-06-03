import {
  ItemTemplate,
  itemTemplateID,
  NewItemTemplate,
} from "@/backend/domain/entity/ItemTemplate";
import { ItemTemplateModel } from "@/backend/repository/model/ItemTemplateModel";
import { ItemTemplateDTORestructure } from "@/shared/dto/ItemTemplateDTO";
import { ItemTemplateMapper } from "../ItemTemplateMapper";

const mockAttributeEntity = {
  attributeID: 1,
  attributeLabel: "A",
  type: "text",
  preview: false,
  options: null,
  symbol: null,
};

const mockAttributeDTO = {
  attributeID: 1,
  attributeLabel: "A",
  type: "text",
  preview: false,
  options: null,
};

const mockAttributeModel = {
  attributeID: 1,
  attribute_label: "A",
  type: "text",
  preview: 0,
  options: null,
  symbol: null,
};

jest.mock("@/backend/util/mapper/AttributeMapper", () => ({
  __esModule: true,
  AttributeMapper: {
    toDTO: jest.fn(() => mockAttributeDTO),
    toModel: jest.fn(() => mockAttributeModel),
    toInsertModel: jest.fn(() => mockAttributeModel),
    toNewEntity: jest.fn(() => mockAttributeEntity),
    toEntity: jest.fn(() => mockAttributeEntity),
  },
}));

describe("ItemTemplateMapper", () => {
  const brandedId = itemTemplateID.parse(1);

  const itemTemplateEntity: ItemTemplate = {
    itemTemplateID: brandedId,
    templateName: "test template",
    attributes: [mockAttributeEntity as any],
  };

  const itemTemplateDTO: ItemTemplateDTORestructure = {
    item_templateID: 1,
    template_name: "test template",
    attributes: [mockAttributeDTO as any],
  };

  const itemTemplateModel: ItemTemplateModel = {
    item_templateID: 1,
    title: "test template",
    attributes: JSON.stringify([mockAttributeModel]),
  };

  const insertItemTemplateModel: Omit<ItemTemplateModel, "item_templateID"> = {
    title: "test template",
    attributes: JSON.stringify([mockAttributeModel]),
  };

  const newItemTemplate: NewItemTemplate = {
    templateName: "test template",
    attributes: [
      {
        attributeLabel: "A",
        type: "text",
        preview: false,
        options: null,
        symbol: null,
      } as any,
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("toDTO", () => {
    it("should map an ItemTemplatePage entity to a ItemTemplateDTO", () => {
      const result = ItemTemplateMapper.toDTO(itemTemplateEntity);

      expect(result).toEqual({
        ...itemTemplateDTO,
        attributes: [mockAttributeDTO],
      });
    });
  });

  describe("toModel", () => {
    it("should map a ItemTemplatePage entity to a ItemTemplateModel", () => {
      const result = ItemTemplateMapper.toModel(itemTemplateEntity);

      expect(result).toEqual({
        ...itemTemplateModel,
        attributes: JSON.stringify([mockAttributeModel]),
      });
    });
  });

  describe("toInsertModel", () => {
    it("should map a ItemTemplate entity to a ItemTemplateModel", () => {
      const result = ItemTemplateMapper.toInsertModel(newItemTemplate);

      expect(result).toEqual(insertItemTemplateModel);
    });
  });

  describe("toNewEntity", () => {
    it("should map an ItemTemplateDTO to a NewItemTemplate entity", () => {
      const result = ItemTemplateMapper.toNewEntity(itemTemplateDTO);
      expect(result).toEqual(newItemTemplate);
    });

    it("should throw an error if ItemTemplate is invalid", () => {
      const badDTO = { ...itemTemplateDTO, template_name: 1 };
      expect(() => ItemTemplateMapper.toNewEntity(badDTO as any)).toThrow();
    });
  });

  describe("toEntity", () => {
    it("maps DB model to ItemTemplate entity", () => {
      const result = ItemTemplateMapper.toEntity(itemTemplateModel);
      expect(result).toEqual(itemTemplateEntity);
    });

    it("throws if attributes are not valid JSON", () => {
      const badModel: ItemTemplateModel = {
        ...itemTemplateModel,
        attributes: "[INVALID JSON",
      };
      expect(() => ItemTemplateMapper.toEntity(badModel)).toThrow(
        "Failed to map ItemTemplateModel to Entity",
      );
    });
  });
});
