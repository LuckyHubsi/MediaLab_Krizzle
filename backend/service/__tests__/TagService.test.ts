import { TagRepository } from "@/backend/repository/interfaces/TagRepository.interface";
import { tagService, TagService } from "@/backend/service/TagService";
import { ServiceError } from "@/backend/util/error/ServiceError";
import { TagMapper } from "@/backend/util/TagMapper";

jest.mock(
  "@/backend/repository/implementation/TagRepository.implementation",
  () => ({
    tagRepository: {
      getAllTags: jest.fn(),
    },
  }),
);

jest.mock("@/backend/util/TagMapper", () => ({
  TagMapper: {
    toDTO: jest.fn(),
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
});
