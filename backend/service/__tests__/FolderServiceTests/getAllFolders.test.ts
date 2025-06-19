import { FolderMapper } from "@/backend/util/mapper/FolderMapper";
import { FolderService } from "../../FolderService";
import { success } from "@/shared/result/Result";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { FolderErrorMessages } from "@/shared/error/ErrorMessages";
import { mockFolderRepository } from "../ServiceTest.setup";

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

  beforeAll(() => {
    folderService = new FolderService(mockFolderRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
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

  it("should return failure Result if RepositoryError('Fetch Failed') is thrown", async () => {
    mockFolderRepository.getAllFolders.mockRejectedValue(
      new RepositoryError("Fetch Failed"),
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

  it("should return failure Result if any Error besides RepositoryError('Fetch Failed') is thrown", async () => {
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
