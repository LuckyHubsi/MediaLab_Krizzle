import { FolderMapper } from "@/backend/util/mapper/FolderMapper";
import { FolderService } from "../../FolderService";
import { success } from "@/shared/result/Result";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { FolderErrorMessages } from "@/shared/error/ErrorMessages";
import { folderID } from "@/backend/domain/common/IDs";
import { ZodError } from "zod";
import { mockFolderRepository } from "../ServiceTest.setup";

jest.mock("@/backend/util/mapper/FolderMapper", () => ({
  FolderMapper: {
    toDTO: jest.fn(),
  },
}));

jest.mock("@/backend/domain/common/IDs", () => ({
  folderID: {
    parse: jest.fn(() => 1 as any),
  },
}));

describe("folderService - getFolder", () => {
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

  it("should return a success Result containing a FolderDTO", async () => {
    (folderID.parse as jest.Mock).mockReturnValue(1);
    mockFolderRepository.getFolderByID.mockResolvedValue(mockFolderEntity);
    (FolderMapper.toDTO as jest.Mock).mockReturnValue(mockFolderDTO);

    const result = await folderService.getFolder(1);

    expect(result).toEqual(success(mockFolderDTO));
    expect(mockFolderRepository.getFolderByID).toHaveBeenCalledWith(1);
    expect((FolderMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
      mockFolderDTO,
    );
  });

  it("should return failure Result if RepositoryError('Not Found') is thrown", async () => {
    (folderID.parse as jest.Mock).mockReturnValue(1);
    mockFolderRepository.getFolderByID.mockRejectedValue(
      new RepositoryError("Not Found"),
    );

    const result = await folderService.getFolder(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Not Found");
      expect(result.error.message).toBe(FolderErrorMessages.notFound);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }

    expect(mockFolderRepository.getFolderByID).toHaveBeenCalled();
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (folderID.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await folderService.getFolder(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Not Found");
      expect(result.error.message).toBe(FolderErrorMessages.notFound);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if any Error besides RepositoryError('Fetch Failed') is thrown", async () => {
    (folderID.parse as jest.Mock).mockReturnValue(1);
    mockFolderRepository.getFolderByID.mockRejectedValue(new Error());

    const result = await folderService.getFolder(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Unknown Error");
      expect(result.error.message).toBe(FolderErrorMessages.unknown);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }

    expect(mockFolderRepository.getFolderByID).toHaveBeenCalled();
  });
});
