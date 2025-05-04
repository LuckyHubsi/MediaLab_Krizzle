import { NewTag, Tag, tagID } from "@/backend/domain/entity/Tag";
import { TagModel } from "@/backend/repository/model/TagModel";
import { TagDTO } from "@/dto/TagDTO";
import { TagMapper } from "../TagMapper";

describe("TagMapper", () => {
  const mockTagID = tagID.parse(1);

  const mockTag: Tag = {
    tagID: mockTagID,
    tagLabel: "test tag",
  };

  const mockTagDTO: TagDTO = {
    tagID: 1,
    tag_label: "test tag",
  };

  const mockTagModel: TagModel = {
    tagID: 1,
    tag_label: "test tag",
  };

  const mockNewTag: NewTag = {
    tagLabel: "test tag",
  };

  describe("toDTO", () => {
    it("should map a Tag entity to a TagDTO", () => {
      const result = TagMapper.toDTO(mockTag);
      expect(result).toEqual(mockTagDTO);
    });
  });

  describe("toModel", () => {
    it("should map a Tag entity to a TagModel", () => {
      const result = TagMapper.toModel(mockTag);
      expect(result).toEqual(mockTagModel);
    });
  });

  describe("toNewEntity", () => {
    it("should map a TagDTO to a NewTag entity", () => {
      const result = TagMapper.toNewEntity(mockTagDTO);
      expect(result).toEqual(mockNewTag);
    });

    it("should throw an error if TagDTO tag label is invalid", () => {
      const invalidTagDTO: TagDTO = {
        tagID: 1,
        tag_label: "",
      };

      expect(() => TagMapper.toNewEntity(invalidTagDTO)).toThrow(
        "Failed to map TagDTO to New Entity",
      );
    });
  });

  describe("toEntity", () => {
    it("should map a TagModel to a Tag entity", () => {
      const result = TagMapper.toEntity(mockTagModel);
      expect(result).toEqual(mockTag);
    });

    it("should throw an error if TagModel tag id is invalid", () => {
      const invalidTagModel: TagModel = {
        tagID: -1,
        tag_label: "test tag",
      };

      expect(() => TagMapper.toEntity(invalidTagModel)).toThrow(
        "Failed to map TagModel to Entity",
      );
    });

    it("should throw an error if TagModel tag label is invalid", () => {
      const invalidTagModel: TagModel = {
        tagID: 1,
        tag_label: "",
      };

      expect(() => TagMapper.toEntity(invalidTagModel)).toThrow(
        "Failed to map TagModel to Entity",
      );
    });
  });
});
