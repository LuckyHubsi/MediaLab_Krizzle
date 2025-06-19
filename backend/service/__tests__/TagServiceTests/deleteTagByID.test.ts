import { TagService } from "../../TagService";
import { success } from "@/shared/result/Result";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { TagErrorMessages } from "@/shared/error/ErrorMessages";
import { ZodError } from "zod";
import { tagID } from "@/backend/domain/common/IDs";
import { mockTagRepository } from "../ServiceTest.setup";

jest.mock("@/backend/domain/common/IDs", () => ({
  tagID: {
    parse: jest.fn(() => 1 as any),
  },
}));

describe("TagService - deleteTagByID", () => {
  let tagService: TagService;

  beforeAll(() => {
    tagService = new TagService(mockTagRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return success Result containing true", async () => {
    const mockBrandedId = 1 as any;
    mockTagRepository.deleteTag.mockResolvedValue(true);
    (tagID.parse as jest.Mock).mockReturnValue(mockBrandedId);

    const result = await tagService.deleteTagByID(1);

    expect(result).toEqual(success(true));
    expect(tagID.parse).toHaveBeenCalledWith(1);
    expect(mockTagRepository.deleteTag).toHaveBeenCalledWith(mockBrandedId);
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (tagID.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await tagService.deleteTagByID(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Validation Error");
      expect(result.error.message).toBe(TagErrorMessages.validateTagToDelete);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if RepositoryError('Delete Failed') is thrown", async () => {
    const mockBrandedId = 1 as any;
    (tagID.parse as jest.Mock).mockReturnValue(mockBrandedId);
    mockTagRepository.deleteTag.mockRejectedValue(
      new RepositoryError("Delete Failed"),
    );

    const result = await tagService.deleteTagByID(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Delete Failed");
      expect(result.error.message).toBe(TagErrorMessages.deleteTag);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if other Error besides ZodError or RepositoryError('Delete Failed') is thrown", async () => {
    const mockBrandedId = 1 as any;
    (tagID.parse as jest.Mock).mockReturnValue(mockBrandedId);
    mockTagRepository.deleteTag.mockRejectedValue(new Error());

    const result = await tagService.deleteTagByID(1);

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
