import { FolderMapper } from "@/backend/util/mapper/FolderMapper";
import { FolderService } from "../../FolderService";
import { FolderRepository } from "@/backend/repository/interfaces/FolderRepository.interface";
import { success } from "@/shared/result/Result";
import { RepositoryErrorNew } from "@/backend/util/error/RepositoryError";
import { FolderErrorMessages } from "@/shared/error/ErrorMessages";

jest.mock("@/backend/util/mapper/FolderMapper", () => ({
  FolderMapper: {
    toDTO: jest.fn(),
  },
}));

describe("folderService - getAllFolders", () => {
  const mockFolderEntity = {
    folderID: 1,
    folderName: "Test Folder",
  } as any;

  const mockFolderDTO = {
    folderID: 1,
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

  it("should return a success Result containing an array of FolderDTOs", async () => {
    mockFolderRepository.getAllFolders.mockResolvedValue([mockFolderEntity]);
    (FolderMapper.toDTO as jest.Mock).mockReturnValue(mockFolderDTO);

    const result = await folderService.getAllFolders();

    expect(result).toEqual(success([mockFolderDTO]));
    expect(mockFolderRepository.getAllFolders).toHaveBeenCalled();
    expect((FolderMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
      mockFolderEntity,
    );
  });

  it("should return failure Result if RepositoryErrorNew('Fetch Failed') is thrown", async () => {
    mockFolderRepository.getAllFolders.mockRejectedValue(
      new RepositoryErrorNew("Fetch Failed"),
    );

    const result = await folderService.getAllFolders();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Retrieval Failed");
      expect(result.error.message).toBe(FolderErrorMessages.loadingAllFolders);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }

    expect(mockFolderRepository.getAllFolders).toHaveBeenCalled();
  });

  it("should return failure Result if any Error besides RepositoryErrorNew('Fetch Failed') is thrown", async () => {
    mockFolderRepository.getAllFolders.mockRejectedValue(new Error());

    const result = await folderService.getAllFolders();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Unknown Error");
      expect(result.error.message).toBe(FolderErrorMessages.unknown);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }

    expect(mockFolderRepository.getAllFolders).toHaveBeenCalled();
  });
});
