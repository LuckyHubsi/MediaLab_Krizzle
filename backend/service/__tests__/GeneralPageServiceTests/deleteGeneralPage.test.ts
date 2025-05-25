import { GeneralPageRepository } from "@/backend/repository/interfaces/GeneralPageRepository.interface";
import { GeneralPageService } from "../../GeneralPageService";
import { pageID } from "@/backend/domain/common/IDs";
import { success } from "@/shared/result/Result";
import { ZodError } from "zod";
import { PageErrorMessages } from "@/shared/error/ErrorMessages";
import { RepositoryErrorNew } from "@/backend/util/error/RepositoryError";

jest.mock("@/backend/domain/common/IDs", () => {
  const actual = jest.requireActual("@/backend/domain/common/IDs");
  return {
    ...actual,
    pageID: {
      parse: jest.fn(() => 1 as any),
    },
  };
});

describe("GeneralPageService - deleteGeneralPage", () => {
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
    mockGeneralPageRepository.deletePage.mockResolvedValue(true);
    (pageID.parse as jest.Mock).mockReturnValue(1);

    const result = await generalPageService.deleteGeneralPage(1);

    expect(result).toEqual(success(true));
    expect(mockGeneralPageRepository.deletePage).toHaveBeenCalledWith(1);
    expect(pageID.parse as jest.Mock).toHaveBeenCalledWith(1);
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (pageID.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await generalPageService.deleteGeneralPage(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Validation Error");
      expect(result.error.message).toBe(PageErrorMessages.validatePageToUpdate);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if RepositoryErrorNew('Delete Failed') is thrown", async () => {
    (pageID.parse as jest.Mock).mockReturnValue(1);
    mockGeneralPageRepository.deletePage.mockRejectedValue(
      new RepositoryErrorNew("Delete Failed"),
    );

    const result = await generalPageService.deleteGeneralPage(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Delete Failed");
      expect(result.error.message).toBe(PageErrorMessages.deletePage);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if other Error besides ZodError or RepositoryErrorNew('Delete Failed') is thrown", async () => {
    (pageID.parse as jest.Mock).mockReturnValue(1);
    mockGeneralPageRepository.deletePage.mockRejectedValue(new Error());

    const result = await generalPageService.deleteGeneralPage(1);

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
