import { TagMapper } from "@/backend/util/mapper/TagMapper";
import { TagService } from "../../TagService";
import { success } from "@/shared/result/Result";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { TagErrorMessages } from "@/shared/error/ErrorMessages";
import { ZodError } from "zod";
import { mockTagRepository } from "../ServiceTest.setup";

jest.mock("@/backend/util/mapper/TagMapper", () => ({
  TagMapper: {
    toUpdatedEntity: jest.fn(),
  },
}));

describe("TagService - updateTag", () => {
  const mockUpdatedTagEntity = {
    tagLabel: "Test Tag",
  } as any;

  const mockNewTagDTO = {
    tag_label: "Test Tag",
  } as any;

  let tagService: TagService;

  beforeAll(() => {
    tagService = new TagService(mockTagRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a success Result containing true", async () => {
    mockTagRepository.updateTag.mockResolvedValue(true);
    (TagMapper.toUpdatedEntity as jest.Mock).mockReturnValue(
      mockUpdatedTagEntity,
    );

    const result = await tagService.updateTag(mockNewTagDTO);

    expect(result).toEqual(success(true));
    expect(mockTagRepository.updateTag).toHaveBeenCalledWith(
      mockUpdatedTagEntity,
    );
    expect(TagMapper.toUpdatedEntity as jest.Mock).toHaveBeenCalledWith(
      mockNewTagDTO,
    );
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (TagMapper.toUpdatedEntity as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await tagService.updateTag(mockNewTagDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Validation Error");
      expect(result.error.message).toBe(TagErrorMessages.validateTagToUpdate);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if RepositoryError('Update Failed') is thrown", async () => {
    (TagMapper.toUpdatedEntity as jest.Mock).mockReturnValue(
      mockUpdatedTagEntity,
    );
    mockTagRepository.updateTag.mockRejectedValue(
      new RepositoryError("Update Failed"),
    );

    const result = await tagService.updateTag(mockNewTagDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Update Failed");
      expect(result.error.message).toBe(TagErrorMessages.updateTag);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if other Error besides ZodError or RepositoryError('Update Failed') is thrown", async () => {
    (TagMapper.toUpdatedEntity as jest.Mock).mockReturnValue(
      mockUpdatedTagEntity,
    );
    mockTagRepository.updateTag.mockRejectedValue(new Error());

    const result = await tagService.updateTag(mockNewTagDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Unknown Error");
      expect(result.error.message).toBe(TagErrorMessages.unknown);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });
});
