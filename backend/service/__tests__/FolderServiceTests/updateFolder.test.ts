import { FolderService } from "../../FolderService";
import { FolderMapper } from "@/backend/util/mapper/FolderMapper";
import { success } from "@/shared/result/Result";
import { ZodError } from "zod";
import { FolderErrorMessages } from "@/shared/error/ErrorMessages";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { mockFolderRepository } from "../ServiceTest.setup";

jest.mock("@/backend/util/mapper/FolderMapper", () => ({
  FolderMapper: {
    toUpdatedEntity: jest.fn(),
  },
}));

describe("FolderService - updateFolder", () => {
  const mockFolderEntity = {
    folderID: 1,
    folderName: "Test Folder",
  } as any;

  const mockFolderDTO = {
    folderID: 1,
    folderName: "Test Folder",
  } as any;

  let folderService: FolderService;

  beforeAll(() => {
    folderService = new FolderService(mockFolderRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a success Result containing true", async () => {
    mockFolderRepository.updateFolderByID.mockResolvedValue(true);
    (FolderMapper.toUpdatedEntity as jest.Mock).mockReturnValue(
      mockFolderEntity,
    );

    const result = await folderService.updateFolder(mockFolderDTO);

    expect(result).toEqual(success(true));
    expect(mockFolderRepository.updateFolderByID).toHaveBeenCalledWith(
      1,
      "Test Folder",
    );
    expect(FolderMapper.toUpdatedEntity as jest.Mock).toHaveBeenCalledWith(
      mockFolderDTO,
    );
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (FolderMapper.toUpdatedEntity as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await folderService.updateFolder(mockFolderDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Validation Error");
      expect(result.error.message).toBe(
        FolderErrorMessages.validateFolderToUpdate,
      );
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if RepositoryError('Udpate Failed') is thrown", async () => {
    (FolderMapper.toUpdatedEntity as jest.Mock).mockReturnValue(
      mockFolderEntity,
    );
    mockFolderRepository.updateFolderByID.mockRejectedValue(
      new RepositoryError("Update Failed"),
    );

    const result = await folderService.updateFolder(mockFolderDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Update Failed");
      expect(result.error.message).toBe(FolderErrorMessages.updateFolder);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if other Error besides ZodError or RepositoryError('Update Failed') is thrown", async () => {
    (FolderMapper.toUpdatedEntity as jest.Mock).mockReturnValue(
      mockFolderEntity,
    );
    mockFolderRepository.updateFolderByID.mockRejectedValue(new Error());

    const result = await folderService.updateFolder(mockFolderDTO);

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
