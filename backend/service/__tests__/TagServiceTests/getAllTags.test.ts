import { TagMapper } from "@/backend/util/mapper/TagMapper";
import { TagService } from "../../TagService";
import { success } from "@/shared/result/Result";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { TagErrorMessages } from "@/shared/error/ErrorMessages";
import { mockTagRepository } from "../ServiceTest.setup";

jest.mock("@/backend/util/mapper/TagMapper", () => ({
  TagMapper: {
    toDTO: jest.fn(),
    toNewEntity: jest.fn(),
  },
}));

jest.mock("@/backend/domain/common/IDs", () => ({
  tagID: {
    parse: jest.fn(() => 1 as any),
  },
}));

describe("TagService - getAllTags", () => {
  const mockTagEntity = {
    tagID: 1,
    tagLabel: "Test Tag",
  } as any;

  const mockTagDTO = {
    tagID: 1,
    tag_label: "Test Tag",
  } as any;

  let tagService: TagService;

  beforeAll(() => {
    tagService = new TagService(mockTagRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a success Result containing an array of TagDTOs", async () => {
    mockTagRepository.getAllTags.mockResolvedValue([mockTagEntity]);
    (TagMapper.toDTO as jest.Mock).mockReturnValue(mockTagDTO);

    const result = await tagService.getAllTags();

    expect(result).toEqual(success([mockTagDTO]));
    expect(mockTagRepository.getAllTags).toHaveBeenCalled();
    expect((TagMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
      mockTagEntity,
    );
  });

  it("should return failure Result if RepositoryError('Fetch Failed') is thrown", async () => {
    mockTagRepository.getAllTags.mockRejectedValue(
      new RepositoryError("Fetch Failed"),
    );

    const result = await tagService.getAllTags();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Retrieval Failed");
      expect(result.error.message).toBe(TagErrorMessages.loadingAllTags);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }

    expect(mockTagRepository.getAllTags).toHaveBeenCalled();
  });

  it("should return failure Result if any Error besides RepositoryError('Fetch Failed') is thrown", async () => {
    mockTagRepository.getAllTags.mockRejectedValue(new Error());

    const result = await tagService.getAllTags();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Unknown Error");
      expect(result.error.message).toBe(TagErrorMessages.unknown);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }

    expect(mockTagRepository.getAllTags).toHaveBeenCalled();
  });
});
