import { PageID, pageID } from "@/backend/domain/entity/GeneralPage";
import { GeneralPageRepository } from "@/backend/repository/interfaces/GeneralPageRepository.interface";
import { generalPageService } from "@/backend/service/GeneralPageService";
import { ServiceError } from "@/backend/util/error/ServiceError";
import { GeneralPageMapper } from "@/backend/util/mapper/GeneralPageMapper";
import { GeneralPageState } from "@/shared/enum/GeneralPageState";

jest.mock(
  "@/backend/repository/implementation/GeneralPageRepository.implementation",
  () => ({
    generalPageRepository: {
      getAllPagesSortedByModified: jest.fn(),
      getAllPagesSortedByAlphabet: jest.fn(),
      getAllPinnedPages: jest.fn(),
      getAllArchivedPages: jest.fn(),
      getByPageID: jest.fn(),
      updateGeneralPageData: jest.fn(),
      deletePage: jest.fn(),
    },
  }),
);

jest.mock("@/backend/domain/entity/GeneralPage", () => ({
  pageID: {
    parse: jest.fn(() => 1 as PageID),
  },
}));

jest.mock("@/backend/util/mapper/GeneralPageMapper", () => ({
  GeneralPageMapper: {
    toDTO: jest.fn(),
    toNewEntity: jest.fn(),
  },
}));

describe("GeneralPageService", () => {
  const mockGeneralPage = {
    pageID: 1,
    pageType: "note",
    pageTitle: "test page",
    pageIcon: "test icon",
    pageColor: "test color",
    archived: false,
    pinned: true,
    tag: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  const mockNewGeneralPage = {
    pageType: "note",
    pageTitle: "test page",
    pageIcon: "test icon",
    pageColor: "test color",
    archived: false,
    pinned: true,
    tag: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  const mockGeneralPageDTO = {
    pageID: 1,
    page_type: "note",
    page_title: "test page",
    page_icon: "test icon",
    page_color: "test color",
    archived: false,
    pinned: true,
    tag: null,
  } as any;

  const mockGeneralPageRepository = generalPageService[
    "generalPageRepo"
  ] as jest.Mocked<GeneralPageRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllPages", () => {
    it("should return an array of GeneralPageDTO objects for sorted by last modified", async () => {
      mockGeneralPageRepository.getAllPagesSortedByModified.mockResolvedValue([
        mockGeneralPage,
      ]);
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(
        mockGeneralPageDTO,
      );

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.GeneralModfied,
      );

      expect(result).toEqual([mockGeneralPageDTO]);
      expect(
        mockGeneralPageRepository.getAllPagesSortedByModified,
      ).toHaveBeenCalled();
      expect(
        mockGeneralPageRepository.getAllPagesSortedByAlphabet,
      ).toHaveBeenCalledTimes(0);
      expect(mockGeneralPageRepository.getAllPinnedPages).toHaveBeenCalledTimes(
        0,
      );
      expect(
        mockGeneralPageRepository.getAllArchivedPages,
      ).toHaveBeenCalledTimes(0);
      expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        mockGeneralPage,
      );
    });

    it("should return an array of GeneralPageDTO objects for sorted by alphabet", async () => {
      mockGeneralPageRepository.getAllPagesSortedByAlphabet.mockResolvedValue([
        mockGeneralPage,
      ]);
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(
        mockGeneralPageDTO,
      );

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.GeneralAlphabet,
      );

      expect(result).toEqual([mockGeneralPageDTO]);
      expect(
        mockGeneralPageRepository.getAllPagesSortedByAlphabet,
      ).toHaveBeenCalled();
      expect(
        mockGeneralPageRepository.getAllPagesSortedByModified,
      ).toHaveBeenCalledTimes(0);
      expect(mockGeneralPageRepository.getAllPinnedPages).toHaveBeenCalledTimes(
        0,
      );
      expect(
        mockGeneralPageRepository.getAllArchivedPages,
      ).toHaveBeenCalledTimes(0);
      expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        mockGeneralPage,
      );
    });

    it("should return an array of GeneralPageDTO objects for pinned pages", async () => {
      mockGeneralPageRepository.getAllPinnedPages.mockResolvedValue([
        mockGeneralPage,
      ]);
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(
        mockGeneralPageDTO,
      );

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.Pinned,
      );

      expect(result).toEqual([mockGeneralPageDTO]);
      expect(mockGeneralPageRepository.getAllPinnedPages).toHaveBeenCalled();
      expect(
        mockGeneralPageRepository.getAllPagesSortedByModified,
      ).toHaveBeenCalledTimes(0);
      expect(
        mockGeneralPageRepository.getAllPagesSortedByAlphabet,
      ).toHaveBeenCalledTimes(0);
      expect(
        mockGeneralPageRepository.getAllArchivedPages,
      ).toHaveBeenCalledTimes(0);
      expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        mockGeneralPage,
      );
    });

    it("should return an array of GeneralPageDTO objects for archived pages", async () => {
      mockGeneralPageRepository.getAllArchivedPages.mockResolvedValue([
        mockGeneralPage,
      ]);
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(
        mockGeneralPageDTO,
      );

      const result = await generalPageService.getAllGeneralPageData(
        GeneralPageState.GeneralAlphabet,
      );

      expect(result).toEqual([mockGeneralPageDTO]);
      expect(
        mockGeneralPageRepository.getAllPagesSortedByAlphabet,
      ).toHaveBeenCalled();
      expect(
        mockGeneralPageRepository.getAllPagesSortedByModified,
      ).toHaveBeenCalledTimes(0);
      expect(mockGeneralPageRepository.getAllPinnedPages).toHaveBeenCalledTimes(
        0,
      );
      expect(
        mockGeneralPageRepository.getAllPagesSortedByModified,
      ).toHaveBeenCalledTimes(0);
      expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        mockGeneralPage,
      );
    });

    it("should throw ServiceError if getAllPages fails", async () => {
      mockGeneralPageRepository.getAllPagesSortedByModified.mockRejectedValue(
        new Error("Repository error"),
      );

      await expect(
        generalPageService.getAllGeneralPageData(
          GeneralPageState.GeneralModfied,
        ),
      ).rejects.toThrow(ServiceError);
      expect(
        mockGeneralPageRepository.getAllPagesSortedByModified,
      ).toHaveBeenCalled();
    });
  });

  describe("getGeneralPageByID", () => {
    it("should return a GeneralPageDTO object by ID", async () => {
      const mockPageID = 1;
      mockGeneralPageRepository.getByPageID.mockResolvedValue(mockGeneralPage);
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(
        mockGeneralPageDTO,
      );

      const result = await generalPageService.getGeneralPageByID(mockPageID);

      expect(result).toEqual(mockGeneralPageDTO);
      expect(GeneralPageMapper.toDTO).toHaveBeenCalledWith(mockGeneralPage);
    });

    it("should throw ServiceError if fetch page fails", async () => {
      const mockPageID = 1;
      mockGeneralPageRepository.getByPageID.mockRejectedValue(
        new Error("Repository error"),
      );

      await expect(
        generalPageService.getGeneralPageByID(mockPageID),
      ).rejects.toThrow(ServiceError);
      expect(mockGeneralPageRepository.getByPageID).toHaveBeenCalledWith(
        pageID.parse(mockPageID),
      );
    });
  });

  describe("updateGeneralPageData", () => {
    it("should return true if update was successful", async () => {
      const mockPageID = 1;
      mockGeneralPageRepository.getByPageID.mockResolvedValue(mockGeneralPage);
      (GeneralPageMapper.toNewEntity as jest.Mock).mockReturnValue(
        mockNewGeneralPage,
      );

      const result =
        await generalPageService.updateGeneralPageData(mockGeneralPageDTO);

      expect(result).toEqual(true);
      expect(GeneralPageMapper.toNewEntity).toHaveBeenCalledWith(
        mockGeneralPageDTO,
      );
    });

    it("should throw ServiceError if update page fails", async () => {
      mockGeneralPageRepository.updateGeneralPageData.mockRejectedValue(
        new Error("Repository error"),
      );

      await expect(
        generalPageService.updateGeneralPageData(mockGeneralPageDTO),
      ).rejects.toThrow(ServiceError);
      expect(
        mockGeneralPageRepository.updateGeneralPageData,
      ).toHaveBeenCalledWith(1 as any, mockNewGeneralPage);
    });
  });

  describe("deletePage", () => {
    it("should delete the page and return true", async () => {
      const mockPageID = 1;
      mockGeneralPageRepository.deletePage.mockResolvedValue(true);

      const result = await generalPageService.deletePage(mockPageID);

      expect(result).toBe(true);
      expect(mockGeneralPageRepository.deletePage).toHaveBeenCalledWith(
        pageID.parse(mockPageID),
      );
    });

    it("should throw ServiceError if deletePage fails", async () => {
      const mockPageID = 1;
      mockGeneralPageRepository.deletePage.mockRejectedValue(
        new Error("Repository error"),
      );

      await expect(generalPageService.deletePage(mockPageID)).rejects.toThrow(
        ServiceError,
      );
      expect(mockGeneralPageRepository.deletePage).toHaveBeenCalledWith(
        pageID.parse(mockPageID),
      );
    });
  });
});
