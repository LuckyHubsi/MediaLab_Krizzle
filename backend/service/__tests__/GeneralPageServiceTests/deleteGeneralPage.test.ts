import { GeneralPageService } from "../../GeneralPageService";
import { pageID } from "@/backend/domain/common/IDs";
import { success } from "@/shared/result/Result";
import { ZodError } from "zod";
import { PageErrorMessages } from "@/shared/error/ErrorMessages";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import {
  mockGeneralPageRepository,
  mockBaseRepository,
} from "../ServiceTest.setup";

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
    (pageID.parse as jest.Mock).mockImplementation(() => 1 as any);
    mockGeneralPageRepository.deletePage.mockResolvedValue(true);

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
    expect(pageID.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(mockGeneralPageRepository.deletePage).toHaveBeenCalledTimes(0);
  });

  it("should return failure Result if RepositoryError('Delete Failed') is thrown", async () => {
    (pageID.parse as jest.Mock).mockImplementation(() => 1 as any);
    mockGeneralPageRepository.deletePage.mockRejectedValue(
      new RepositoryError("Delete Failed"),
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
    expect(pageID.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(mockGeneralPageRepository.deletePage).toHaveBeenCalledTimes(1);
  });

  it("should return failure Result if other Error besides ZodError or RepositoryError('Delete Failed') is thrown", async () => {
    (pageID.parse as jest.Mock).mockImplementation(() => 1 as any);
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
    expect(pageID.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(mockGeneralPageRepository.deletePage).toHaveBeenCalledTimes(1);
  });
});
