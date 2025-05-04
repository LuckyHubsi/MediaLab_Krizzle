import { pageID } from "@/backend/domain/entity/GeneralPage";
import { GeneralPageRepository } from "@/backend/repository/interfaces/GeneralPageRepository.interface";
import { generalPageService } from "@/backend/service/GeneralPageService";
import { ServiceError } from "@/backend/util/error/ServiceError";
import { GeneralPageMapper } from "@/backend/util/mapper/GeneralPageMapper";

jest.mock(
  "@/backend/repository/implementation/GeneralPageRepository.implementation",
  () => ({
    generalPageRepository: {
      getAllPages: jest.fn(),
      deletePage: jest.fn(),
    },
  }),
);

jest.mock("@/backend/util/mapper/GeneralPageMapper", () => ({
  GeneralPageMapper: {
    toDTO: jest.fn(),
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
    it("should return an array of GeneralPageDTO objects", async () => {
      mockGeneralPageRepository.getAllPages.mockResolvedValue([
        mockGeneralPage,
      ]);
      (GeneralPageMapper.toDTO as jest.Mock).mockReturnValue(
        mockGeneralPageDTO,
      );

      const result = await generalPageService.getAllPages();

      expect(result).toEqual([mockGeneralPageDTO]);
      expect(mockGeneralPageRepository.getAllPages).toHaveBeenCalled();
      expect((GeneralPageMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        mockGeneralPage,
      );
    });

    it("should throw ServiceError if getAllPages fails", async () => {
      mockGeneralPageRepository.getAllPages.mockRejectedValue(
        new Error("Repository error"),
      );

      await expect(generalPageService.getAllPages()).rejects.toThrow(
        ServiceError,
      );
      expect(mockGeneralPageRepository.getAllPages).toHaveBeenCalled();
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
