import { GeneralPageRepository } from "@/backend/repository/interfaces/GeneralPageRepository.interface";
import { GeneralPageService } from "../../GeneralPageService";
import { pageID } from "@/backend/domain/common/IDs";
import { GeneralPageMapper } from "@/backend/util/mapper/GeneralPageMapper";
import { success } from "@/shared/result/Result";
import { PageErrorMessages } from "@/shared/error/ErrorMessages";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { ZodError } from "zod";

jest.mock("@/backend/util/mapper/GeneralPageMapper", () => ({
  GeneralPageMapper: {
    toDTO: jest.fn(),
  },
}));

jest.mock("@/backend/domain/common/IDs", () => ({
  pageID: {
    parse: jest.fn(() => 1 as any),
  },
}));

describe("GeneralPageService - getGeneralPageByID", () => {
  const mockPageEntity = {
    pageID: 1,
    pageTitle: "test page",
  } as any;

  const mockPageDTO = {
    pageID: 1,
    pageTitle: "test page",
  } as any;

  let generalPageService: GeneralPageService;
  let mockGeneralPageRepository: jest.Mocked<GeneralPageRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGeneralPageRepository = {
      getAllFolderPagesSortedByModified: jest.fn(),
      getAllFolderPagesSortedByCreated: jest.fn(),
      getAllFolderPagesSortedByAlphabet: jest.fn(),
      getAllPagesSortedByModified: jest.fn(),
      getAllPagesSortedByCreated: jest.fn(),
      getAllPagesSortedByAlphabet: jest.fn(),
      getAllPinnedPages: jest.fn(),
      getAllArchivedPages: jest.fn(),
      getByPageID: jest.fn(),
      updateGeneralPageData: jest.fn(),
      insertPage: jest.fn(),
      deletePage: jest.fn(),
      updatePin: jest.fn(),
      updateArchive: jest.fn(),
      updateDateModified: jest.fn(),
      updateParentID: jest.fn(),
      executeQuery: jest.fn(),
      fetchFirst: jest.fn(),
      fetchAll: jest.fn(),
      executeTransaction: jest.fn(),
      getLastInsertId: jest.fn(),
    };
    generalPageService = new GeneralPageService(mockGeneralPageRepository);
  });

  it("should return a success Result containing a GeneralPageDTO", async () => {
    (pageID.parse as jest.Mock).mockReturnValue(1);
    mockGeneralPageRepository.getByPageID.mockResolvedValue(mockPageEntity);
    (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(mockPageDTO);

    const result = await generalPageService.getGeneralPageByID(1);

    expect(result).toEqual(success(mockPageDTO));
    expect(mockGeneralPageRepository.getByPageID).toHaveBeenCalledWith(1);
    expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
      mockPageDTO,
    );
  });

  it("should return failure Result if RepositoryError('Not Found') is thrown", async () => {
    (pageID.parse as jest.Mock).mockReturnValue(1);
    mockGeneralPageRepository.getByPageID.mockRejectedValue(
      new RepositoryError("Not Found"),
    );

    const result = await generalPageService.getGeneralPageByID(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Not Found");
      expect(result.error.message).toBe(PageErrorMessages.notFound);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }

    expect(mockGeneralPageRepository.getByPageID).toHaveBeenCalled();
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (pageID.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await generalPageService.getGeneralPageByID(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Not Found");
      expect(result.error.message).toBe(PageErrorMessages.notFound);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if any Error besides RepositoryError('Fetch Failed') is thrown", async () => {
    (pageID.parse as jest.Mock).mockReturnValue(1);
    mockGeneralPageRepository.getByPageID.mockRejectedValue(new Error());

    const result = await generalPageService.getGeneralPageByID(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Unknown Error");
      expect(result.error.message).toBe(PageErrorMessages.unknown);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }

    expect(mockGeneralPageRepository.getByPageID).toHaveBeenCalled();
  });
});
