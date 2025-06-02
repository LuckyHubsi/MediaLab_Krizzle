import { ItemTemplateService } from "../../ItemTemplateService";
import { ItemTemplateRepository } from "@/backend/repository/interfaces/ItemTemplateRepository.interface";
import { AttributeRepository } from "@/backend/repository/interfaces/AttributeRepository.interface";
import { ItemRepository } from "@/backend/repository/interfaces/ItemRepository.interface";
import { success } from "@/shared/result/Result";
import { RepositoryErrorNew } from "@/backend/util/error/RepositoryError";
import { TemplateErrorMessages } from "@/shared/error/ErrorMessages";
import { attributeID } from "@/backend/domain/common/IDs";
import { ZodError } from "zod";

jest.mock("@/backend/domain/common/IDs", () => ({
  attributeID: {
    parse: jest.fn(() => 1 as any),
  },
}));

describe("ItemTemplateService - deleteAttribute", () => {
  let itemTemplateService: ItemTemplateService;
  let mockTemplateRepository: jest.Mocked<ItemTemplateRepository>;
  let mockAttributeRepository: jest.Mocked<AttributeRepository>;
  let mockItemRepository: jest.Mocked<ItemRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTemplateRepository = {
      getItemTemplateById: jest.fn(),
      insertTemplateAndReturnID: jest.fn(),
      executeQuery: jest.fn(),
      fetchFirst: jest.fn(),
      fetchAll: jest.fn(),
      executeTransaction: jest.fn(),
      getLastInsertId: jest.fn(),
    };

    mockAttributeRepository = {
      insertAttribute: jest.fn(),
      insertMultiselectOptions: jest.fn(),
      insertRatingSymbol: jest.fn(),
      getPreviewAttributes: jest.fn(),
      updateAttribute: jest.fn(),
      updateMultiselectOptions: jest.fn(),
      updateRatingSymbol: jest.fn(),
      deleteAttribute: jest.fn(),
      executeQuery: jest.fn(),
      fetchFirst: jest.fn(),
      fetchAll: jest.fn(),
      executeTransaction: jest.fn(),
      getLastInsertId: jest.fn(),
    };

    mockItemRepository = {
      getItemByID: jest.fn(),
      getItemsByID: jest.fn(),
      getItemIDs: jest.fn(),
      getMultiselectValues: jest.fn(),
      insertItemAndReturnID: jest.fn(),
      insertTextValue: jest.fn(),
      insertDateValue: jest.fn(),
      insertRatingValue: jest.fn(),
      insertMultiselectValue: jest.fn(),
      insertImageValue: jest.fn(),
      insertLinkValue: jest.fn(),
      updateItem: jest.fn(),
      updateTextValue: jest.fn(),
      updateDateValue: jest.fn(),
      updateRatingValue: jest.fn(),
      updateMultiselectValue: jest.fn(),
      updateImageValue: jest.fn(),
      updateLinkValue: jest.fn(),
      deleteItem: jest.fn(),
      deleteItemValues: jest.fn(),
      executeQuery: jest.fn(),
      fetchFirst: jest.fn(),
      fetchAll: jest.fn(),
      executeTransaction: jest.fn(),
      getLastInsertId: jest.fn(),
    };

    itemTemplateService = new ItemTemplateService(
      mockTemplateRepository,
      mockAttributeRepository,
      mockItemRepository,
    );
  });

  it("should return a success Result containing true", async () => {
    (attributeID.parse as jest.Mock).mockReturnValue(1);
    mockAttributeRepository.deleteAttribute.mockResolvedValue(true);

    const result = await itemTemplateService.deleteAttribute(1);

    expect(result).toEqual(success(true));
    expect(mockAttributeRepository.deleteAttribute).toHaveBeenCalledWith(1);
    expect(attributeID.parse as jest.Mock).toHaveBeenCalledWith(1);
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (attributeID.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await itemTemplateService.deleteAttribute(1);

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
    expect(mockAttributeRepository.deleteAttribute).toHaveBeenCalledTimes(0);
  });

  it("should return failure Result if RepositoryErrorNew('Delete Failed') is thrown", async () => {
    (attributeID.parse as jest.Mock).mockReturnValue(1);
    mockAttributeRepository.deleteAttribute.mockRejectedValue(
      new RepositoryErrorNew("Delete Failed"),
    );

    const result = await itemTemplateService.deleteAttribute(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Delete Failed");
      expect(result.error.message).toBe(TemplateErrorMessages.deleteAttribute);
    } else {
      throw new Error("Expected failure result, but got success");
    }
    expect(attributeID.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(mockAttributeRepository.deleteAttribute).toHaveBeenCalledTimes(1);
  });

  it("should return failure Result if other Error besides ZodError or RepositoryErrorNew('Delete Failed') is thrown", async () => {
    (attributeID.parse as jest.Mock).mockReturnValue(1);
    mockAttributeRepository.deleteAttribute.mockRejectedValue(new Error());

    const result = await itemTemplateService.deleteAttribute(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Unknown Error");
      expect(result.error.message).toBe(TemplateErrorMessages.unknown);
    } else {
      throw new Error("Expected failure result, but got success");
    }
    expect(attributeID.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(mockAttributeRepository.deleteAttribute).toHaveBeenCalledTimes(1);
  });
});
