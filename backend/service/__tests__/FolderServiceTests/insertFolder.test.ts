import { FolderRepository } from "@/backend/repository/interfaces/FolderRepository.interface";
import { FolderService } from "../../FolderService";
import { FolderMapper } from "@/backend/util/mapper/FolderMapper";
import { success } from "@/shared/result/Result";
import { ZodError } from "zod";
import { FolderErrorMessages } from "@/shared/error/ErrorMessages";
import { RepositoryError } from "@/backend/util/error/RepositoryError";

jest.mock("@/backend/util/mapper/FolderMapper", () => ({
  FolderMapper: {
    toDTO: jest.fn(),
    toNewEntity: jest.fn(),
  },
}));

describe("FolderService - insertNewFolder", () => {
  const mockNewFolderEntity = {
    folderName: "Test Folder",
  } as any;

  const mockNewFolderDTO = {
    folderName: "Test Folder",
  } as any;

  let folderService: FolderService;
  let mockFolderRepository: jest.Mocked<FolderRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFolderRepository = {
      getAllFolders: jest.fn(),
      getFolderByID: jest.fn(),
      insertFolder: jest.fn(),
      deleteFolderByID: jest.fn(),
      updateFolderByID: jest.fn(),
      executeQuery: jest.fn(),
      fetchFirst: jest.fn(),
      fetchAll: jest.fn(),
      executeTransaction: jest.fn(),
      getLastInsertId: jest.fn(),
    };
    folderService = new FolderService(mockFolderRepository);
  });

  it("should return a success Result containing true", async () => {
    mockFolderRepository.insertFolder.mockResolvedValue(true);
    (FolderMapper.toNewEntity as jest.Mock).mockReturnValue(
      mockNewFolderEntity,
    );

    const result = await folderService.insertFolder(mockNewFolderDTO);

    expect(result).toEqual(success(true));
    expect(mockFolderRepository.insertFolder).toHaveBeenCalledWith(
      mockNewFolderEntity,
    );
    expect(FolderMapper.toNewEntity as jest.Mock).toHaveBeenCalledWith(
      mockNewFolderDTO,
    );
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (FolderMapper.toNewEntity as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await folderService.insertFolder(mockNewFolderDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Validation Error");
      expect(result.error.message).toBe(FolderErrorMessages.validateNewFolder);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if RepositoryError('Insert Failed') is thrown", async () => {
    (FolderMapper.toNewEntity as jest.Mock).mockReturnValue(
      mockNewFolderEntity,
    );
    mockFolderRepository.insertFolder.mockRejectedValue(
      new RepositoryError("Insert Failed"),
    );

    const result = await folderService.insertFolder(mockNewFolderDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Creation Failed");
      expect(result.error.message).toBe(FolderErrorMessages.insertNewFolder);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if other Error besides ZodError or RepositoryError('Insert Failed') is thrown", async () => {
    (FolderMapper.toNewEntity as jest.Mock).mockReturnValue(
      mockNewFolderEntity,
    );
    mockFolderRepository.insertFolder.mockRejectedValue(new Error());

    const result = await folderService.insertFolder(mockNewFolderDTO);

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
