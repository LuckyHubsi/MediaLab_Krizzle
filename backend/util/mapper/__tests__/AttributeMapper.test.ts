import {
  Attribute,
  attributeID,
  NewAttribute,
} from "@/backend/domain/common/Attribute";
import { AttributeType } from "../../../../shared/enum/AttributeType";
import { AttributeModel } from "@/backend/repository/model/AttributeModel";
import { AttributeMapper } from "../AttributeMapper";
import { AttributeDTORestructure } from "@/shared/dto/AttributeDTO";

describe("AttributeMapper", () => {
  const brandedAttributeID = attributeID.parse(1);
  const attributeEntity: Attribute = {
    attributeID: brandedAttributeID,
    attributeLabel: "attribute label",
    type: AttributeType.Multiselect,
    preview: false,
    options: ["option 1", "option 2", "option 3"],
    symbol: null,
  };

  const attributeDTO: AttributeDTORestructure = {
    attributeID: 1,
    attributeLabel: "attribute label",
    type: AttributeType.Multiselect,
    preview: false,
    options: ["option 1", "option 2", "option 3"],
  };

  const attributeModel: AttributeModel = {
    attributeID: 1,
    attribute_label: "attribute label",
    type: AttributeType.Multiselect,
    preview: 0,
    options: JSON.stringify(["option 1", "option 2", "option 3"]),
    symbol: null,
  };

  const newAttributeEntity: NewAttribute = {
    attributeLabel: "attribute label",
    type: AttributeType.Multiselect,
    preview: false,
    options: ["option 1", "option 2", "option 3"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("toDTO", () => {
    it("should map an Attribute entity to an AttributeDTO", () => {
      const result = AttributeMapper.toDTO(attributeEntity);
      expect(result).toEqual(attributeDTO);
    });
  });

  describe("toModel", () => {
    it("should map an Attribute entity to an AttributeModel", () => {
      const result = AttributeMapper.toModel(attributeEntity);

      expect(result).toEqual(attributeModel);
    });
  });

  describe("toInsertModel", () => {
    it("should map a NewAttribute entity to a GeneralPageModel", () => {
      const result = AttributeMapper.toInsertModel(newAttributeEntity);

      expect(result).toEqual(
        expect.objectContaining({
          attribute_label: "attribute label",
          type: AttributeType.Multiselect,
          preview: 0,
          options: JSON.stringify(["option 1", "option 2", "option 3"]),
          symbol: null,
        }),
      );
    });
  });

  describe("toNewEntity", () => {
    it("should map a AttributeDTO to a NewAttribute entity", () => {
      const result = AttributeMapper.toNewEntity(attributeDTO);

      expect(result).toEqual(
        expect.objectContaining({
          attributeLabel: "attribute label",
          type: AttributeType.Multiselect,
          preview: false,
          options: ["option 1", "option 2", "option 3"],
        }),
      );
    });

    it("should throw an error if AttributeDTO is invalid", () => {
      const invalidAttributeDTO: AttributeDTORestructure = {
        attributeLabel: "",
        type: AttributeType.Multiselect,
        preview: false,
        options: ["option 1", "option 2", "option 3"],
      };

      expect(() => AttributeMapper.toNewEntity(invalidAttributeDTO)).toThrow(
        "Failed to map AttributeDTO to New Entity",
      );
    });
  });

  describe("toEntity", () => {
    it("should map an AttributeModel to an Attribute entity", () => {
      const result = AttributeMapper.toEntity(attributeModel);
      expect(result).toEqual(attributeEntity);
    });

    it("should throw an error if AttributeModel is invalid", () => {
      const invalidAttributeModel: AttributeModel = {
        attributeID: -1,
        attribute_label: "attribute label",
        type: AttributeType.Multiselect,
        preview: 0,
        options: JSON.stringify(["option 1", "option 2", "option 3"]),
        symbol: null,
      };

      expect(() => AttributeMapper.toEntity(invalidAttributeModel)).toThrow(
        "Failed to map AttributeModel to Entity",
      );
    });
  });
});
