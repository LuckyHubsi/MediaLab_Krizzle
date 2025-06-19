import { ItemTemplateMapper } from "@/backend/util/mapper/ItemTemplateMapper";
import { ItemTemplateService } from "../../ItemTemplateService";
import { success } from "@/shared/result/Result";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { TemplateErrorMessages } from "@/shared/error/ErrorMessages";
import { itemTemplateID } from "@/backend/domain/common/IDs";
import { ZodError } from "zod";
import { ItemTemplate } from "@/backend/domain/entity/ItemTemplate";
import { ItemTemplateDTO } from "@/shared/dto/ItemTemplateDTO";
import {
  mockTemplateRepository,
  mockAttributeRepository,
  mockItemRepository,
  mockGeneralPageRepository,
} from "../ServiceTest.setup";

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

  beforeEach(() => {
    jest.clearAllMocks();

    itemTemplateService = new ItemTemplateService(
      mockTemplateRepository,
      mockAttributeRepository,
      mockItemRepository,
      mockGeneralPageRepository,
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

  it("should return failure Result if RepositoryError('Not Found') is thrown", async () => {
    (itemTemplateID.parse as jest.Mock).mockReturnValue(1);
    mockTemplateRepository.getItemTemplateById.mockRejectedValue(
      new RepositoryError("Not Found"),
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

  it("should return failure Result if RepositoryError('Fetch Failed') is thrown", async () => {
    (itemTemplateID.parse as jest.Mock).mockReturnValue(1);
    mockTemplateRepository.getItemTemplateById.mockRejectedValue(
      new RepositoryError("Fetch Failed"),
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
