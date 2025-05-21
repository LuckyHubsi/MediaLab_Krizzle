import { TagID } from "@/backend/domain/entity/Tag";
import { TagRepository } from "@/backend/repository/interfaces/TagRepository.interface";
import { tagService, TagService } from "@/backend/service/TagService";
import { ServiceError } from "@/backend/util/error/ServiceError";
import { TagMapper } from "@/backend/util/mapper/TagMapper";

jest.mock(
  "@/backend/repository/implementation/TagRepository.implementation",
  () => ({
    tagRepository: {
      getAllTags: jest.fn(),
      insertTag: jest.fn(),
      deleteTag: jest.fn(),
      updateTag: jest.fn(),
    },
  }),
);

jest.mock("@/backend/util/mapper/TagMapper", () => ({
  TagMapper: {
    toDTO: jest.fn(),
    toNewEntity: jest.fn(),
  },
}));

jest.mock("@/backend/domain/entity/Tag", () => ({
  tagID: {
    parse: jest.fn(() => 1 as TagID),
  },
}));

describe("TagService", () => {
  const mockTag = {
    tagID: 1,
    tagLabel: "Test Tag",
  } as any;

  const mockTagDTO = {
    tagID: 1,
    tag_label: "Test Tag",
  } as any;

  const mockNewTag = {
    tag_label: "Test Tag",
  } as any;

  const mockTagRepository = tagService["tagRepo"] as jest.Mocked<TagRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTags", () => {
    it("should return an array of TagDTO objects", async () => {
      mockTagRepository.getAllTags.mockResolvedValue([mockTag]);
      (TagMapper.toDTO as jest.Mock).mockReturnValue(mockTagDTO);

      const result = await tagService.getAllTags();

      expect(result).toEqual([mockTagDTO]);
      expect(mockTagRepository.getAllTags).toHaveBeenCalled();
      expect((TagMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(mockTag);
    });

    it("should throw ServiceError if getAllTags fails", async () => {
      mockTagRepository.getAllTags.mockRejectedValue(
        new Error("Repository error"),
      );

      await expect(tagService.getAllTags()).rejects.toThrow(ServiceError);
      expect(mockTagRepository.getAllTags).toHaveBeenCalled();
    });
  });

  describe("insertTag", () => {
    it("should return true if insertion was successful", async () => {
      mockTagRepository.insertTag.mockResolvedValue(true);
      (TagMapper.toNewEntity as jest.Mock).mockReturnValue(mockTagDTO);

      const result = await tagService.insertTag(mockTagDTO);

      expect(result).toEqual(true);
    });

    it("should throw ServiceError if insertTag fails", async () => {
      mockTagRepository.insertTag.mockRejectedValue(
        new Error("Repository error"),
      );

      await expect(tagService.insertTag(mockTagDTO)).rejects.toThrow(
        ServiceError,
      );
      expect(mockTagRepository.insertTag).toHaveBeenCalled();
    });
  });

  describe("deleteTagByID", () => {
    it("should return true if deletion was successful", async () => {
      mockTagRepository.deleteTag.mockResolvedValue(true);

      const result = await tagService.deleteTagByID(1);

      expect(result).toEqual(true);
      expect(mockTagRepository.deleteTag).toHaveBeenCalled();
    });

    it("should throw ServiceError if deleteTag fails", async () => {
      mockTagRepository.deleteTag.mockRejectedValue(
        new Error("Repository error"),
      );

      await expect(tagService.deleteTagByID(1)).rejects.toThrow(ServiceError);
      expect(mockTagRepository.deleteTag).toHaveBeenCalled();
    });
  });

  describe("updateTag", () => {
    it("should return true if update was successful", async () => {
      mockTagRepository.updateTag.mockResolvedValue(true);

      const result = await tagService.updateTag(mockTagDTO);

      expect(result).toEqual(true);
      expect(mockTagRepository.updateTag).toHaveBeenCalled();
    });

    it("should throw ServiceError if updateTag fails", async () => {
      mockTagRepository.updateTag.mockRejectedValue(
        new Error("Repository error"),
      );

      await expect(tagService.updateTag(mockTagDTO)).rejects.toThrow(
        ServiceError,
      );
      expect(mockTagRepository.updateTag).toHaveBeenCalled();
    });
  });
});
