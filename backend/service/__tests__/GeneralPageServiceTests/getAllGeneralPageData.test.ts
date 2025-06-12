import { GeneralPageMapper } from "@/backend/util/mapper/GeneralPageMapper";
import { GeneralPageService } from "../../GeneralPageService";
import { GeneralPageRepository } from "@/backend/repository/interfaces/GeneralPageRepository.interface";
import { GeneralPageState } from "@/shared/enum/GeneralPageState";
import { success } from "@/shared/result/Result";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { PageErrorMessages } from "@/shared/error/ErrorMessages";

jest.mock("@/backend/util/mapper/GeneralPageMapper", () => ({
  GeneralPageMapper: {
    toDTO: jest.fn(),
  },
}));

describe("GeneralPageService - getAllGeneralPageData", () => {
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
      getAllPagesSortedByModified: jest.fn(),
      getAllPagesSortedByCreated: jest.fn(),
      getAllPagesSortedByAlphabet: jest.fn(),
      getAllFolderPagesSortedByModified: jest.fn(),
      getAllFolderPagesSortedByCreated: jest.fn(),
      getAllFolderPagesSortedByAlphabet: jest.fn(),
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
    it("should return a success Result containing an array of GeneralPageDTOs when pageState GeneralModfied", async () => {
      mockGeneralPageRepository.getAllPagesSortedByModified.mockResolvedValue([
        mockPageEntity,
      ]);
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(mockPageDTO);

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.GeneralModfied,
      );

      expect(result).toEqual(success([mockPageDTO]));
      expect(
        mockGeneralPageRepository.getAllPagesSortedByModified,
      ).toHaveBeenCalled();
      expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        mockPageEntity,
      );
    });
    it("should return a success Result containing an array of GeneralPageDTOs when pageState GeneralCreated", async () => {
      mockGeneralPageRepository.getAllPagesSortedByCreated.mockResolvedValue([
        mockPageEntity,
      ]);
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(mockPageDTO);

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.GeneralCreated,
      );

      expect(result).toEqual(success([mockPageDTO]));
      expect(
        mockGeneralPageRepository.getAllPagesSortedByCreated,
      ).toHaveBeenCalled();
      expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        mockPageEntity,
      );
    });
    it("should return a success Result containing an array of GeneralPageDTOs when pageState GeneralAlphabet", async () => {
      mockGeneralPageRepository.getAllPagesSortedByAlphabet.mockResolvedValue([
        mockPageEntity,
      ]);
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(mockPageDTO);

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.GeneralAlphabet,
      );

      expect(result).toEqual(success([mockPageDTO]));
      expect(
        mockGeneralPageRepository.getAllPagesSortedByAlphabet,
      ).toHaveBeenCalled();
      expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        mockPageEntity,
      );
    });
    it("should return a success Result containing an array of GeneralPageDTOs when pageState Archived", async () => {
      mockGeneralPageRepository.getAllArchivedPages.mockResolvedValue([
        mockPageEntity,
      ]);
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(mockPageDTO);

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.Archived,
      );

      expect(result).toEqual(success([mockPageDTO]));
      expect(mockGeneralPageRepository.getAllArchivedPages).toHaveBeenCalled();
      expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        mockPageEntity,
      );
    });
    it("should return a success Result containing an array of GeneralPageDTOs when pageState Pinned", async () => {
      mockGeneralPageRepository.getAllPinnedPages.mockResolvedValue([
        mockPageEntity,
      ]);
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(mockPageDTO);

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.Pinned,
      );

      expect(result).toEqual(success([mockPageDTO]));
      expect(mockGeneralPageRepository.getAllPinnedPages).toHaveBeenCalled();
      expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        mockPageEntity,
      );
    });
  });

  describe("different error cases returning failure containing ServiceErrorType of 'Retrieval Failed'", () => {
    it("should return failure Result if RepositoryError('Fetch Failed') is thrown for sorting mode modification date", async () => {
      mockGeneralPageRepository.getAllPagesSortedByModified.mockRejectedValue(
        new RepositoryError("Fetch Failed"),
      );

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.GeneralModfied,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe("Retrieval Failed");
        expect(result.error.message).toBe(
          PageErrorMessages.loadingAllPagesSortedByModificationDate,
        );
      } else {
        // this would mean an error in the test
        throw new Error("Expected failure result, but got success");
      }
    });
    it("should return failure Result if RepositoryError('Fetch Failed') is thrown for sorting mode creation date", async () => {
      mockGeneralPageRepository.getAllPagesSortedByCreated.mockRejectedValue(
        new RepositoryError("Fetch Failed"),
      );

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.GeneralCreated,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe("Retrieval Failed");
        expect(result.error.message).toBe(
          PageErrorMessages.loadingAllPagesSortedByCreationDate,
        );
      } else {
        // this would mean an error in the test
        throw new Error("Expected failure result, but got success");
      }
    });
    it("should return failure Result if RepositoryError('Fetch Failed') is thrown for sorting mode alphabet", async () => {
      mockGeneralPageRepository.getAllPagesSortedByAlphabet.mockRejectedValue(
        new RepositoryError("Fetch Failed"),
      );

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.GeneralAlphabet,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe("Retrieval Failed");
        expect(result.error.message).toBe(
          PageErrorMessages.loadingAllPagesSortedByAlphabet,
        );
      } else {
        // this would mean an error in the test
        throw new Error("Expected failure result, but got success");
      }
    });
    it("should return failure Result if RepositoryError('Fetch Failed') is thrown for pinned state", async () => {
      mockGeneralPageRepository.getAllPinnedPages.mockRejectedValue(
        new RepositoryError("Fetch Failed"),
      );

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.Pinned,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe("Retrieval Failed");
        expect(result.error.message).toBe(
          PageErrorMessages.loadingAllPinnedPages,
        );
      } else {
        // this would mean an error in the test
        throw new Error("Expected failure result, but got success");
      }
    });
    it("should return failure Result if RepositoryError('Fetch Failed') is thrown for archived state", async () => {
      mockGeneralPageRepository.getAllArchivedPages.mockRejectedValue(
        new RepositoryError("Fetch Failed"),
      );

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.Archived,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe("Retrieval Failed");
        expect(result.error.message).toBe(
          PageErrorMessages.loadingAllArchivedPages,
        );
      } else {
        // this would mean an error in the test
        throw new Error("Expected failure result, but got success");
      }
    });
  });

  describe("different error cases returning failure containing ServiceErrorType of 'Unknown Error'", () => {
    it("should return failure Result if Error is thrown is thrown for sorting mode modification date", async () => {
      mockGeneralPageRepository.getAllPagesSortedByModified.mockRejectedValue(
        new Error(),
      );

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.GeneralModfied,
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
      mockGeneralPageRepository.getAllPagesSortedByCreated.mockRejectedValue(
        new Error(),
      );

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.GeneralCreated,
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
      mockGeneralPageRepository.getAllPagesSortedByAlphabet.mockRejectedValue(
        new Error(),
      );

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.GeneralAlphabet,
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
    it("should return failure Result if Error is thrown for pinned state", async () => {
      mockGeneralPageRepository.getAllPinnedPages.mockRejectedValue(
        new Error(),
      );

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.Pinned,
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
    it("should return failure Result if Error is thrown for archived state", async () => {
      mockGeneralPageRepository.getAllArchivedPages.mockRejectedValue(
        new Error(),
      );

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.Archived,
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
