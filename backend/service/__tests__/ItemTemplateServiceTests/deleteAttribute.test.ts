import { ItemTemplateService } from "../../ItemTemplateService";
import { success } from "@/shared/result/Result";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { TemplateErrorMessages } from "@/shared/error/ErrorMessages";
import { attributeID } from "@/backend/domain/common/IDs";
import { ZodError } from "zod";
import {
  mockTemplateRepository,
  mockAttributeRepository,
  mockItemRepository,
  mockGeneralPageRepository,
} from "../ServiceTest.setup";

jest.mock("@/backend/domain/common/IDs", () => {
  const actual = jest.requireActual("@/backend/domain/common/IDs");
  return {
    ...actual,
    attributeID: {
      parse: jest.fn(() => 1 as any),
    },
  };
});

describe("ItemTemplateService - deleteAttribute", () => {
  let itemTemplateService: ItemTemplateService;

  beforeAll(() => {
    itemTemplateService = new ItemTemplateService(
      mockTemplateRepository,
      mockAttributeRepository,
      mockItemRepository,
      mockGeneralPageRepository,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a success Result containing true", async () => {
    (attributeID.parse as jest.Mock).mockReturnValue(1);
    mockTemplateRepository.executeTransaction.mockImplementation(
      async (callback) => {
        return await callback({} as any);
      },
    );

    const result = await itemTemplateService.deleteAttribute(1, 1);

    expect(result).toEqual(success(true));
    expect(mockTemplateRepository.executeTransaction).toHaveBeenCalledTimes(1);
    expect(attributeID.parse as jest.Mock).toHaveBeenCalledWith(1);
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (attributeID.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await itemTemplateService.deleteAttribute(1, 1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Validation Error");
      expect(result.error.message).toBe(
        TemplateErrorMessages.validateAttributeToDelete,
      );
    } else {
      throw new Error("Expected failure result, but got success");
    }
    expect(attributeID.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(mockTemplateRepository.executeTransaction).toHaveBeenCalledTimes(0);
  });

  it("should return failure Result if RepositoryError('Transaction Failed') is thrown", async () => {
    (attributeID.parse as jest.Mock).mockReturnValue(1);
    mockTemplateRepository.executeTransaction.mockRejectedValue(
      new RepositoryError("Transaction Failed"),
    );

    const result = await itemTemplateService.deleteAttribute(1, 1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Delete Failed");
      expect(result.error.message).toBe(TemplateErrorMessages.deleteAttribute);
    } else {
      throw new Error("Expected failure result, but got success");
    }
    expect(attributeID.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(mockTemplateRepository.executeTransaction).toHaveBeenCalledTimes(1);
  });

  it("should return failure Result if other Error besides ZodError or RepositoryError('Delete Failed') is thrown", async () => {
    (attributeID.parse as jest.Mock).mockReturnValue(1);
    mockTemplateRepository.executeTransaction.mockRejectedValue(new Error());

    const result = await itemTemplateService.deleteAttribute(1, 1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Unknown Error");
      expect(result.error.message).toBe(TemplateErrorMessages.unknown);
    } else {
      throw new Error("Expected failure result, but got success");
    }
    expect(attributeID.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(mockTemplateRepository.executeTransaction).toHaveBeenCalledTimes(1);
  });
});
