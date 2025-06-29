import { TagMapper } from "@/backend/util/mapper/TagMapper";
import { TagService } from "../../TagService";
import { success } from "@/shared/result/Result";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { TagErrorMessages } from "@/shared/error/ErrorMessages";
import { ZodError } from "zod";
import { mockTagRepository } from "../ServiceTest.setup";

jest.mock("@/backend/util/mapper/TagMapper", () => ({
  TagMapper: {
    toDTO: jest.fn(),
    toNewEntity: jest.fn(),
  },
}));

describe("TagService - insertNewTag", () => {
  const mockNewTagEntity = {
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
    mockTagRepository.insertTag.mockResolvedValue(true);
    (TagMapper.toNewEntity as jest.Mock).mockReturnValue(mockNewTagEntity);

    const result = await tagService.insertTag(mockNewTagDTO);

    expect(result).toEqual(success(true));
    expect(mockTagRepository.insertTag).toHaveBeenCalledWith(mockNewTagEntity);
    expect(TagMapper.toNewEntity as jest.Mock).toHaveBeenCalledWith(
      mockNewTagDTO,
    );
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (TagMapper.toNewEntity as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await tagService.insertTag(mockNewTagDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Validation Error");
      expect(result.error.message).toBe(TagErrorMessages.validateNewTag);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if RepositoryError('Insert Failed') is thrown", async () => {
    (TagMapper.toNewEntity as jest.Mock).mockReturnValue(mockNewTagEntity);
    mockTagRepository.insertTag.mockRejectedValue(
      new RepositoryError("Insert Failed"),
    );

    const result = await tagService.insertTag(mockNewTagDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Creation Failed");
      expect(result.error.message).toBe(TagErrorMessages.insertNewTag);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if other Error besides ZodError or RepositoryError('Insert Failed') is thrown", async () => {
    (TagMapper.toNewEntity as jest.Mock).mockReturnValue(mockNewTagEntity);
    mockTagRepository.insertTag.mockRejectedValue(new Error());

    const result = await tagService.insertTag(mockNewTagDTO);

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
