import { GeneralPageMapper } from "@/backend/util/mapper/GeneralPageMapper";
import { GeneralPageService } from "../../GeneralPageService";
import { success } from "@/shared/result/Result";
import { ZodError } from "zod";
import { PageErrorMessages } from "@/shared/error/ErrorMessages";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import {
  mockBaseRepository,
  mockGeneralPageRepository,
} from "../ServiceTest.setup";

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

  beforeAll(() => {
    generalPageService = new GeneralPageService(
      mockGeneralPageRepository,
      mockBaseRepository,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
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

  it("should return failure Result if RepositoryError('Udpate Failed') is thrown", async () => {
    (GeneralPageMapper.toUpdatedEntity as jest.Mock).mockReturnValue(
      mockPageEntity,
    );
    mockGeneralPageRepository.updateGeneralPageData.mockRejectedValue(
      new RepositoryError("Update Failed"),
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

  it("should return failure Result if other Error besides ZodError or RepositoryError('Update Failed') is thrown", async () => {
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
