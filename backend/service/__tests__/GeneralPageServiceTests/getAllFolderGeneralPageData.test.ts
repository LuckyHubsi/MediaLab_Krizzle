import { GeneralPageMapper } from "@/backend/util/mapper/GeneralPageMapper";
import { GeneralPageService } from "../../GeneralPageService";
import { success } from "@/shared/result/Result";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { PageErrorMessages } from "@/shared/error/ErrorMessages";
import { FolderState } from "@/shared/enum/FolderState";
import {
  mockGeneralPageRepository,
  mockBaseRepository,
} from "../ServiceTest.setup";

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

  beforeAll(() => {
    generalPageService = new GeneralPageService(
      mockGeneralPageRepository,
      mockBaseRepository,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
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
    it("should return failure Result if RepositoryError('Fetch Failed') is thrown for sorting mode modification date", async () => {
      mockGeneralPageRepository.getAllFolderPagesSortedByModified.mockRejectedValue(
        new RepositoryError("Fetch Failed"),
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
    it("should return failure Result if RepositoryError('Fetch Failed') is thrown for sorting mode creation date", async () => {
      mockGeneralPageRepository.getAllFolderPagesSortedByCreated.mockRejectedValue(
        new RepositoryError("Fetch Failed"),
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
    it("should return failure Result if RepositoryError('Fetch Failed') is thrown for sorting mode alphabet", async () => {
      mockGeneralPageRepository.getAllFolderPagesSortedByAlphabet.mockRejectedValue(
        new RepositoryError("Fetch Failed"),
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
