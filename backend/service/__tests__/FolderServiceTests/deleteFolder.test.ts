import { FolderService } from "../../FolderService";
import { folderID } from "@/backend/domain/common/IDs";
import { success } from "@/shared/result/Result";
import { ZodError } from "zod";
import { FolderErrorMessages } from "@/shared/error/ErrorMessages";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { mockFolderRepository } from "../ServiceTest.setup";

jest.mock("@/backend/domain/common/IDs", () => ({
  folderID: {
    parse: jest.fn(() => 1 as any),
  },
}));

describe("FolderService - deleteFolder", () => {
  let folderService: FolderService;

  beforeAll(() => {
    folderService = new FolderService(mockFolderRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a success Result containing true", async () => {
    const mockBrandedId = 1 as any;
    mockFolderRepository.deleteFolderByID.mockResolvedValue(true);
    (folderID.parse as jest.Mock).mockReturnValue(mockBrandedId);

    const result = await folderService.deleteFolder(1);

    expect(result).toEqual(success(true));

    expect(folderID.parse).toHaveBeenCalledWith(1);
    expect(mockFolderRepository.deleteFolderByID).toHaveBeenCalledWith(
      mockBrandedId,
    );
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (folderID.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await folderService.deleteFolder(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Validation Error");
      expect(result.error.message).toBe(
        FolderErrorMessages.validateFolderToDelete,
      );
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if RepositoryError('Delete Failed') is thrown", async () => {
    const mockBrandedId = 1 as any;
    (folderID.parse as jest.Mock).mockReturnValue(mockBrandedId);
    mockFolderRepository.deleteFolderByID.mockRejectedValue(
      new RepositoryError("Delete Failed"),
    );

    const result = await folderService.deleteFolder(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Delete Failed");
      expect(result.error.message).toBe(FolderErrorMessages.deleteFolder);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if other Error besides ZodError or RepositoryError('Delete Failed') is thrown", async () => {
    const mockBrandedId = 1 as any;
    (folderID.parse as jest.Mock).mockReturnValue(mockBrandedId);
    mockFolderRepository.deleteFolderByID.mockRejectedValue(new Error());

    const result = await folderService.deleteFolder(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Unknown Error");
      expect(result.error.message).toBe(FolderErrorMessages.unknown);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });
});
