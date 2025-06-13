import {
  ItemTemplate,
  NewItemTemplate,
} from "@/backend/domain/entity/ItemTemplate";
import { ItemTemplateModel } from "@/backend/repository/model/ItemTemplateModel";
import { ItemTemplateMapper } from "../ItemTemplateMapper";
import { itemTemplateID } from "@/backend/domain/common/IDs";
import { ItemTemplateDTO } from "@/shared/dto/ItemTemplateDTO";

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

  const itemTemplateDTO: ItemTemplateDTO = {
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
        expect.anything(),
      );
    });
  });
});
