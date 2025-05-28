import { GeneralPageMapper } from "@/backend/util/mapper/GeneralPageMapper";
import { GeneralPageService } from "../../GeneralPageService";
import { GeneralPageRepository } from "@/backend/repository/interfaces/GeneralPageRepository.interface";
import { success } from "@/shared/result/Result";
import { ZodError } from "zod";
import { PageErrorMessages } from "@/shared/error/ErrorMessages";
import { RepositoryErrorNew } from "@/backend/util/error/RepositoryError";

jest.mock("@/backend/util/mapper/GeneralPageMapper", () => ({
  GeneralPageMapper: {
    toUpdatedEntity: jest.fn(),
  },
}));

describe("GeneralPageService - updateGeneralPageData", () => {
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

  it("should return a success Result containing true", async () => {
    mockGeneralPageRepository.updateGeneralPageData.mockResolvedValue(true);
    (GeneralPageMapper.toUpdatedEntity as jest.Mock).mockReturnValue(
      mockPageEntity,
    );

    const result = await generalPageService.updateGeneralPageData(mockPageDTO);

    expect(result).toEqual(success(true));
    expect(
      mockGeneralPageRepository.updateGeneralPageData,
    ).toHaveBeenCalledWith(1, mockPageDTO);
    expect(GeneralPageMapper.toUpdatedEntity as jest.Mock).toHaveBeenCalledWith(
      mockPageDTO,
    );
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (GeneralPageMapper.toUpdatedEntity as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await generalPageService.updateGeneralPageData(mockPageDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Validation Error");
      expect(result.error.message).toBe(PageErrorMessages.validatePageToUpdate);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if RepositoryErrorNew('Udpate Failed') is thrown", async () => {
    (GeneralPageMapper.toUpdatedEntity as jest.Mock).mockReturnValue(
      mockPageEntity,
    );
    mockGeneralPageRepository.updateGeneralPageData.mockRejectedValue(
      new RepositoryErrorNew("Update Failed"),
    );

    const result = await generalPageService.updateGeneralPageData(mockPageDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Update Failed");
      expect(result.error.message).toBe(PageErrorMessages.updatePage);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if other Error besides ZodError or RepositoryErrorNew('Update Failed') is thrown", async () => {
    (GeneralPageMapper.toUpdatedEntity as jest.Mock).mockReturnValue(
      mockPageEntity,
    );
    mockGeneralPageRepository.updateGeneralPageData.mockRejectedValue(
      new Error(),
    );

    const result = await generalPageService.updateGeneralPageData(mockPageDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Unknown Error");
      expect(result.error.message).toBe(PageErrorMessages.unknown);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });
});
