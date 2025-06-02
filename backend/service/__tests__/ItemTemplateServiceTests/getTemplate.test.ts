import { ItemTemplateMapper } from "@/backend/util/mapper/ItemTemplateMapper";
import { ItemTemplateService } from "../../ItemTemplateService";
import { ItemTemplateRepository } from "@/backend/repository/interfaces/ItemTemplateRepository.interface";
import { AttributeRepository } from "@/backend/repository/interfaces/AttributeRepository.interface";
import { ItemRepository } from "@/backend/repository/interfaces/ItemRepository.interface";
import { success } from "@/shared/result/Result";
import { RepositoryErrorNew } from "@/backend/util/error/RepositoryError";
import { TemplateErrorMessages } from "@/shared/error/ErrorMessages";
import { itemTemplateID } from "@/backend/domain/common/IDs";
import { ZodError } from "zod";
import { ItemTemplate } from "@/backend/domain/entity/ItemTemplate";
import { ItemTemplateDTO } from "@/shared/dto/ItemTemplateDTO";

jest.mock("@/backend/util/mapper/ItemTemplateMapper", () => ({
  ItemTemplateMapper: {
    toDTO: jest.fn(),
  },
}));

jest.mock("@/backend/domain/common/IDs", () => ({
  itemTemplateID: {
    parse: jest.fn(() => 1 as any),
  },
}));

describe("ItemTemplateService - getTemplate", () => {
  const mockTemplateEntity: ItemTemplate = {
    itemTemplateID: 1 as any,
    templateName: "Test Template",
    attributes: [],
  } as ItemTemplate;

  const mockTemplateDTO: ItemTemplateDTO = {
    itemTemplateID: 1 as any,
    template_name: "Test Template",
    attributes: [],
  } as ItemTemplateDTO;

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

  it("should return a success Result containing an ItemTemplateDTO", async () => {
    (itemTemplateID.parse as jest.Mock).mockReturnValue(1);
    mockTemplateRepository.getItemTemplateById.mockResolvedValue(
      mockTemplateEntity,
    );
    (ItemTemplateMapper.toDTO as jest.Mock).mockReturnValue(mockTemplateDTO);

    const result = await itemTemplateService.getTemplate(1);

    expect(result).toEqual(success(mockTemplateDTO));
    expect(mockTemplateRepository.getItemTemplateById).toHaveBeenCalledWith(1);
    expect(itemTemplateID.parse as jest.Mock).toHaveBeenCalledWith(1);
    expect(ItemTemplateMapper.toDTO).toHaveBeenCalledWith(mockTemplateEntity);
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (itemTemplateID.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await itemTemplateService.getTemplate(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Not Found");
      expect(result.error.message).toBe(TemplateErrorMessages.notFound);
    } else {
      throw new Error("Expected failure result, but got success");
    }
    expect(itemTemplateID.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(mockTemplateRepository.getItemTemplateById).toHaveBeenCalledTimes(0);
  });

  it("should return failure Result if RepositoryErrorNew('Not Found') is thrown", async () => {
    (itemTemplateID.parse as jest.Mock).mockReturnValue(1);
    mockTemplateRepository.getItemTemplateById.mockRejectedValue(
      new RepositoryErrorNew("Not Found"),
    );

    const result = await itemTemplateService.getTemplate(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Not Found");
      expect(result.error.message).toBe(TemplateErrorMessages.notFound);
    } else {
      throw new Error("Expected failure result, but got success");
    }
    expect(mockTemplateRepository.getItemTemplateById).toHaveBeenCalledWith(1);
  });

  it("should return failure Result if RepositoryErrorNew('Fetch Failed') is thrown", async () => {
    (itemTemplateID.parse as jest.Mock).mockReturnValue(1);
    mockTemplateRepository.getItemTemplateById.mockRejectedValue(
      new RepositoryErrorNew("Fetch Failed"),
    );

    const result = await itemTemplateService.getTemplate(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Retrieval Failed");
      expect(result.error.message).toBe(TemplateErrorMessages.loadingTemplate);
    } else {
      throw new Error("Expected failure result, but got success");
    }
    expect(mockTemplateRepository.getItemTemplateById).toHaveBeenCalledWith(1);
  });

  it("should return failure Result if any other Error is thrown", async () => {
    (itemTemplateID.parse as jest.Mock).mockReturnValue(1);
    mockTemplateRepository.getItemTemplateById.mockRejectedValue(new Error());

    const result = await itemTemplateService.getTemplate(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Unknown Error");
      expect(result.error.message).toBe(TemplateErrorMessages.unknown);
    } else {
      throw new Error("Expected failure result, but got success");
    }
    expect(mockTemplateRepository.getItemTemplateById).toHaveBeenCalledWith(1);
  });
});
