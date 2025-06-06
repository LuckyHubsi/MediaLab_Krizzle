import { GeneralPageMapper } from "@/backend/util/mapper/GeneralPageMapper";
import { GeneralPageService } from "../../GeneralPageService";
import { GeneralPageRepository } from "@/backend/repository/interfaces/GeneralPageRepository.interface";
import { success } from "@/shared/result/Result";
import { RepositoryErrorNew } from "@/backend/util/error/RepositoryError";
import { PageErrorMessages } from "@/shared/error/ErrorMessages";
import { FolderState } from "@/shared/enum/FolderState";

jest.mock("@/backend/util/mapper/GeneralPageMapper", () => ({
  GeneralPageMapper: {
    toDTO: jest.fn(),
  },
}));

describe("GeneralPageService - getAllFolderGeneralPageData", () => {
  const mockPageEntity = {
    pageID: 1,
    pageTitle: "test page",
  } as any;

  const mockPageDTO = {
    pageID: 1,
    page_title: "test page",
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

  describe("different success cases dependent on page state", () => {
    it("should return a success Result containing an array of GeneralPageDTOs when sorting mode is GeneralModfied", async () => {
      mockGeneralPageRepository.getAllFolderPagesSortedByModified.mockResolvedValue(
        [mockPageEntity],
      );
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(mockPageDTO);

      const result = await generalPageService.getAllFolderGeneralPageData(
        FolderState.GeneralModfied,
        1,
      );

      expect(result).toEqual(success([mockPageDTO]));
      expect(
        mockGeneralPageRepository.getAllFolderPagesSortedByModified,
      ).toHaveBeenCalled();
      expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        mockPageEntity,
      );
    });
    it("should return a success Result containing an array of GeneralPageDTOs when sorting mode is GeneralCreated", async () => {
      mockGeneralPageRepository.getAllFolderPagesSortedByCreated.mockResolvedValue(
        [mockPageEntity],
      );
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(mockPageDTO);

      const result = await generalPageService.getAllFolderGeneralPageData(
        FolderState.GeneralCreated,
        1,
      );

      expect(result).toEqual(success([mockPageDTO]));
      expect(
        mockGeneralPageRepository.getAllFolderPagesSortedByCreated,
      ).toHaveBeenCalled();
      expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        mockPageEntity,
      );
    });
    it("should return a success Result containing an array of GeneralPageDTOs when sorting mode is Alphabet", async () => {
      mockGeneralPageRepository.getAllFolderPagesSortedByAlphabet.mockResolvedValue(
        [mockPageEntity],
      );
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(mockPageDTO);

      const result = await generalPageService.getAllFolderGeneralPageData(
        FolderState.GeneralAlphabet,
        1,
      );

      expect(result).toEqual(success([mockPageDTO]));
      expect(
        mockGeneralPageRepository.getAllFolderPagesSortedByAlphabet,
      ).toHaveBeenCalled();
      expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        mockPageEntity,
      );
    });
  });

  describe("different error cases returning failure containing ServiceErrorType of 'Retrieval Failed'", () => {
    it("should return failure Result if RepositoryErrorNew('Fetch Failed') is thrown for sorting mode modification date", async () => {
      mockGeneralPageRepository.getAllFolderPagesSortedByModified.mockRejectedValue(
        new RepositoryErrorNew("Fetch Failed"),
      );

      const result = await generalPageService.getAllFolderGeneralPageData(
        FolderState.GeneralModfied,
        1,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe("Retrieval Failed");
        expect(result.error.message).toBe(
          PageErrorMessages.loadingAllFolderPagesSortedByModificationDate,
        );
      } else {
        // this would mean an error in the test
        throw new Error("Expected failure result, but got success");
      }
    });
    it("should return failure Result if RepositoryErrorNew('Fetch Failed') is thrown for sorting mode creation date", async () => {
      mockGeneralPageRepository.getAllFolderPagesSortedByCreated.mockRejectedValue(
        new RepositoryErrorNew("Fetch Failed"),
      );

      const result = await generalPageService.getAllFolderGeneralPageData(
        FolderState.GeneralCreated,
        1,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe("Retrieval Failed");
        expect(result.error.message).toBe(
          PageErrorMessages.loadingAllFolderPagesSortedByCreationDate,
        );
      } else {
        // this would mean an error in the test
        throw new Error("Expected failure result, but got success");
      }
    });
    it("should return failure Result if RepositoryErrorNew('Fetch Failed') is thrown for sorting mode alphabet", async () => {
      mockGeneralPageRepository.getAllFolderPagesSortedByAlphabet.mockRejectedValue(
        new RepositoryErrorNew("Fetch Failed"),
      );

      const result = await generalPageService.getAllFolderGeneralPageData(
        FolderState.GeneralAlphabet,
        1,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe("Retrieval Failed");
        expect(result.error.message).toBe(
          PageErrorMessages.loadingAllFolderPagesSortedByAlphabet,
        );
      } else {
        // this would mean an error in the test
        throw new Error("Expected failure result, but got success");
      }
    });
  });

  describe("different error cases returning failure containing ServiceErrorType of 'Unknown Error'", () => {
    it("should return failure Result if Error is thrown is thrown for sorting mode modification date", async () => {
      mockGeneralPageRepository.getAllFolderPagesSortedByModified.mockRejectedValue(
        new Error(),
      );

      const result = await generalPageService.getAllFolderGeneralPageData(
        FolderState.GeneralModfied,
        1,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe("Unknown Error");
        expect(result.error.message).toBe(PageErrorMessages.unknown);
      } else {
        // this would mean an error in the test
        throw new Error("Expected failure result, but got success");
      }
    });
    it("should return failure Result if Error is thrown for sorting mode creation date", async () => {
      mockGeneralPageRepository.getAllFolderPagesSortedByCreated.mockRejectedValue(
        new Error(),
      );

      const result = await generalPageService.getAllFolderGeneralPageData(
        FolderState.GeneralCreated,
        1,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe("Unknown Error");
        expect(result.error.message).toBe(PageErrorMessages.unknown);
      } else {
        // this would mean an error in the test
        throw new Error("Expected failure result, but got success");
      }
    });
    it("should return failure Result if Error is thrown for sorting mode alphabet", async () => {
      mockGeneralPageRepository.getAllFolderPagesSortedByAlphabet.mockRejectedValue(
        new Error(),
      );

      const result = await generalPageService.getAllFolderGeneralPageData(
        FolderState.GeneralAlphabet,
        1,
      );

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
});
