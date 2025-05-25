import { NewTag, Tag } from "@/backend/domain/entity/Tag";
import { TagModel } from "@/backend/repository/model/TagModel";
import { TagDTO } from "@/shared/dto/TagDTO";
import { TagMapper } from "../TagMapper";
import { tagID } from "@/backend/domain/common/IDs";
import { ZodError } from "zod";

describe("TagMapper", () => {
  const brandedTagID = tagID.parse(1);

  const tagEntity: Tag = {
    tagID: brandedTagID,
    tagLabel: "test tag",
    usageCount: 2,
  };

  const updatedTagEntity: Tag = {
    tagID: brandedTagID,
    tagLabel: "test tag",
    usageCount: 0,
  };

  const newTagEntity: NewTag = {
    tagLabel: "test tag",
  };

  const tagDTO: TagDTO = {
    tagID: 1,
    tag_label: "test tag",
    usage_count: 2,
  };

  const invalidTagLabelDTO: TagDTO = {
    tagID: 1,
    tag_label: "",
  };

  const invalidTagIdDTO: TagDTO = {
    tagID: -1,
    tag_label: "test tag",
  };

  const tagModel: TagModel = {
    tagID: 1,
    tag_label: "test tag",
    usage_count: 2,
  };

  const invalidTagLabelModel: TagModel = {
    tagID: -1,
    tag_label: "test tag",
    usage_count: 2,
  };

  const invalidTagIdModel: TagModel = {
    tagID: -1,
    tag_label: "test tag",
    usage_count: 2,
  };

  describe("toDTO", () => {
    it("should map a Tag entity to a TagDTO", () => {
      const result = TagMapper.toDTO(tagEntity);
      expect(result).toEqual(tagDTO);
    });
  });

  describe("toNewEntity", () => {
    it("should map a TagDTO to a NewTag entity", () => {
      const result = TagMapper.toNewEntity(tagDTO);
      expect(result).toEqual(newTagEntity);
    });

    it("should throw an error if TagDTO tag label is invalid", () => {
      expect(() => TagMapper.toNewEntity(invalidTagLabelDTO)).toThrow(ZodError);
    });
  });

  describe("toUpdatedEntity", () => {
    it("should map a TagDTO to an updated Tag entity", () => {
      const result = TagMapper.toUpdatedEntity(tagDTO);
      expect(result).toEqual(updatedTagEntity);
    });

    it("should throw an error if TagDTO tag label is invalid", () => {
      expect(() => TagMapper.toUpdatedEntity(invalidTagLabelDTO)).toThrow(
        ZodError,
      );
    });

    it("should throw an error if TagDTO tag ID is invalid", () => {
      expect(() => TagMapper.toUpdatedEntity(invalidTagIdDTO)).toThrow(
        ZodError,
      );
    });
  });

  describe("toEntity", () => {
    it("should map a TagModel to a Tag entity", () => {
      const result = TagMapper.toEntity(tagModel);
      expect(result).toEqual(tagEntity);
    });

    it("should throw an error if TagModel tag id is invalid", () => {
      expect(() => TagMapper.toEntity(invalidTagIdModel)).toThrow(ZodError);
    });

    it("should throw an error if TagModel tag label is invalid", () => {
      expect(() => TagMapper.toEntity(invalidTagLabelModel)).toThrow(ZodError);
    });
  });
});
