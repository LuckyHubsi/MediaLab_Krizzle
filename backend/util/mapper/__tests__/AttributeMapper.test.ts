import { Attribute, NewAttribute } from "@/backend/domain/common/Attribute";
import { attributeID } from "@/backend/domain/common/IDs";
import { AttributeModel } from "@/backend/repository/model/AttributeModel";
import { AttributeDTO } from "@/shared/dto/AttributeDTO";
import { AttributeType } from "@/shared/enum/AttributeType";
import { AttributeMapper } from "../AttributeMapper";
import { ZodError } from "zod";

describe("AttributeMapper", () => {
  const brandedAttributeID = attributeID.parse(1);

  const attributeEntity: Attribute = {
    attributeID: brandedAttributeID,
    attributeLabel: "test label",
    type: AttributeType.Multiselect,
    preview: false,
    options: ["opt 1", "opt 2"],
    symbol: null,
  };

  const newAttributeEntity: NewAttribute = {
    attributeLabel: "test label",
    type: AttributeType.Multiselect,
    preview: false,
    options: ["opt 1", "opt 2"],
  };

  const attributeDTO: AttributeDTO = {
    attributeID: brandedAttributeID,
    attributeLabel: "test label",
    type: AttributeType.Multiselect,
    preview: false,
    options: ["opt 1", "opt 2"],
  };
  let invalidAttributeDTO: any;

  const attributeModel: AttributeModel = {
    attributeID: brandedAttributeID,
    attribute_label: "test label",
    type: AttributeType.Multiselect,
    preview: 0,
    options: JSON.stringify(["opt 1", "opt 2"]),
    symbol: null,
  };
  let invalidAttributeModel: any;

  beforeEach(() => {
    jest.clearAllMocks();
    invalidAttributeDTO = { ...attributeDTO };
    invalidAttributeModel = { ...attributeModel };
  });

  describe("toDTO", () => {
    it("should map an Attribute entity to an AttributeDTO", () => {
      const result = AttributeMapper.toDTO(attributeEntity);
      expect(result).toEqual(attributeDTO);
    });
  });

  describe("toNewEntity", () => {
    it("should map a AttributeDTO to a NewAttribute entity", () => {
      const result = AttributeMapper.toNewEntity(attributeDTO);
      expect(result).toEqual(newAttributeEntity);
    });

    it("should throw an error if AttributeDTO is invalid", () => {
      invalidAttributeDTO.attributeLabel = "";
      expect(() => AttributeMapper.toNewEntity(invalidAttributeDTO)).toThrow(
        ZodError,
      );
    });
    // other validation errors covered in schema unit tests under '@backend/domain/entity/__tests__'
  });

  describe("toEntity", () => {
    it("should map a AttributeModel to a Attribute entity", () => {
      const result = AttributeMapper.toEntity(attributeModel);
      expect(result).toEqual(attributeEntity);
    });

    it("should throw an error if AttributeModelis invalid", () => {
      invalidAttributeModel.attribute_label = "";
      expect(() => AttributeMapper.toEntity(invalidAttributeModel)).toThrow(
        ZodError,
      );
    });
    // other validation errors covered in schema unit tests under '@backend/domain/entity/__tests__'
  });
});
