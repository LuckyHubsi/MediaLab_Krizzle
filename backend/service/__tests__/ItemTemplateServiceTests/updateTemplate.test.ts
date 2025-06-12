import { AttributeMapper } from "@/backend/util/mapper/AttributeMapper";
import { ItemTemplateService } from "../../ItemTemplateService";
import { ItemTemplateRepository } from "@/backend/repository/interfaces/ItemTemplateRepository.interface";
import { AttributeRepository } from "@/backend/repository/interfaces/AttributeRepository.interface";
import { ItemRepository } from "@/backend/repository/interfaces/ItemRepository.interface";
import { success } from "@/shared/result/Result";
import { RepositoryErrorNew } from "@/backend/util/error/RepositoryError";
import { TemplateErrorMessages } from "@/shared/error/ErrorMessages";
import { itemTemplateID, pageID } from "@/backend/domain/common/IDs";
import { ZodError } from "zod";
import { AttributeDTO } from "@/shared/dto/AttributeDTO";
import { Attribute, NewAttribute } from "@/backend/domain/common/Attribute";
import { AttributeType } from "@/shared/enum/AttributeType";

jest.mock("@/backend/util/mapper/AttributeMapper", () => ({
  AttributeMapper: {
    toUpdatedEntity: jest.fn(),
    toNewEntity: jest.fn(),
  },
}));

jest.mock("@/backend/domain/common/IDs", () => ({
  itemTemplateID: {
    parse: jest.fn(() => 1 as any),
  },
  pageID: {
    parse: jest.fn(() => 2 as any),
  },
}));

describe("ItemTemplateService - updateTemplate", () => {
  let itemTemplateService: ItemTemplateService;
  let mockTemplateRepository: jest.Mocked<ItemTemplateRepository>;
  let mockAttributeRepository: jest.Mocked<AttributeRepository>;
  let mockItemRepository: jest.Mocked<ItemRepository>;

  const mockExistingAttributeDTOs: AttributeDTO[] = [
    {
      attributeID: 1 as any,
      attributeLabel: "Existing Text Attribute",
      type: AttributeType.Text,
      preview: true,
      options: null,
      symbol: undefined,
    },
    {
      attributeID: 2 as any,
      attributeLabel: "Existing Multiselect Attribute",
      type: AttributeType.Multiselect,
      preview: false,
      options: ["Option 1", "Option 2", "Option 3"],
      symbol: undefined,
    },
    {
      attributeID: 3 as any,
      attributeLabel: "Existing Rating Attribute",
      type: AttributeType.Rating,
      preview: true,
      options: null,
      symbol: "star",
    },
  ];

  const mockNewAttributeDTOs: AttributeDTO[] = [
    {
      attributeLabel: "New Date Attribute",
      type: AttributeType.Date,
      preview: true,
      options: null,
      symbol: undefined,
    },
    {
      attributeLabel: "New Image Attribute",
      type: AttributeType.Image,
      preview: false,
      options: null,
      symbol: undefined,
    },
  ];

  const mockExistingAttributeEntities: Attribute[] = [
    {
      attributeID: 1 as any,
      attributeLabel: "Existing Text Attribute",
      type: AttributeType.Text,
      preview: true,
      options: null,
      symbol: undefined,
    },
    {
      attributeID: 2 as any,
      attributeLabel: "Existing Multiselect Attribute",
      type: AttributeType.Multiselect,
      preview: false,
      options: ["Option 1", "Option 2", "Option 3"],
      symbol: undefined,
    },
    {
      attributeID: 3 as any,
      attributeLabel: "Existing Rating Attribute",
      type: AttributeType.Rating,
      preview: true,
      options: null,
      symbol: "star",
    },
  ];

  const mockNewAttributeEntities: NewAttribute[] = [
    {
      attributeLabel: "New Date Attribute",
      type: AttributeType.Date,
      preview: true,
      options: null,
      symbol: undefined,
    },
    {
      attributeLabel: "New Image Attribute",
      type: AttributeType.Image,
      preview: false,
      options: null,
      symbol: undefined,
    },
  ];

  const mockItemIDs = [1 as any, 2 as any, 3 as any];

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

  it("should return success Result when template is updated successfully", async () => {
    (itemTemplateID.parse as jest.Mock).mockReturnValue(1);
    (pageID.parse as jest.Mock).mockReturnValue(2);
    (AttributeMapper.toUpdatedEntity as jest.Mock)
      .mockReturnValueOnce(mockExistingAttributeEntities[0])
      .mockReturnValueOnce(mockExistingAttributeEntities[1])
      .mockReturnValueOnce(mockExistingAttributeEntities[2]);
    (AttributeMapper.toNewEntity as jest.Mock)
      .mockReturnValueOnce(mockNewAttributeEntities[0])
      .mockReturnValueOnce(mockNewAttributeEntities[1]);

    mockTemplateRepository.executeTransaction.mockImplementation(
      async (callback) => {
        const mockTxn = {} as any;

        mockItemRepository.getItemIDs.mockResolvedValue(mockItemIDs);
        mockItemRepository.getMultiselectValues.mockResolvedValue([
          "Option 1",
          "Option 2",
        ]);
        mockAttributeRepository.insertAttribute
          .mockResolvedValueOnce(4 as any)
          .mockResolvedValueOnce(5 as any);

        return await callback(mockTxn);
      },
    );

    const result = await itemTemplateService.updateTemplate(
      1,
      mockExistingAttributeDTOs,
      mockNewAttributeDTOs,
      2,
    );

    expect(result).toEqual(success(true));
    expect(itemTemplateID.parse as jest.Mock).toHaveBeenCalledWith(1);
    expect(pageID.parse as jest.Mock).toHaveBeenCalledWith(2);
    expect(mockTemplateRepository.executeTransaction).toHaveBeenCalledTimes(1);
  });

  it("should handle multiselect options update correctly", async () => {
    (itemTemplateID.parse as jest.Mock).mockReturnValue(1);
    (pageID.parse as jest.Mock).mockReturnValue(2);
    (AttributeMapper.toUpdatedEntity as jest.Mock).mockReturnValueOnce(
      mockExistingAttributeEntities[1],
    );
    (AttributeMapper.toNewEntity as jest.Mock).mockReturnValue([]);

    mockTemplateRepository.executeTransaction.mockImplementation(
      async (callback) => {
        const mockTxn = {} as any;

        mockItemRepository.getItemIDs.mockResolvedValue(mockItemIDs);
        mockItemRepository.getMultiselectValues.mockResolvedValue([
          "Option 1",
          "Option 2",
          "Option 4",
        ]);

        return await callback(mockTxn);
      },
    );

    await itemTemplateService.updateTemplate(
      1,
      [mockExistingAttributeDTOs[1]],
      [],
      2,
    );

    expect(
      mockAttributeRepository.updateMultiselectOptions,
    ).toHaveBeenCalledWith(
      ["Option 1", "Option 2", "Option 3"],
      2 as any,
      expect.any(Object),
    );
    expect(mockItemRepository.updateMultiselectValue).toHaveBeenCalledWith(
      1 as any,
      2 as any,
      JSON.stringify(["Option 1", "Option 2"]),
      expect.any(Object),
    );
  });

  it("should handle rating symbol update correctly", async () => {
    (itemTemplateID.parse as jest.Mock).mockReturnValue(1);
    (pageID.parse as jest.Mock).mockReturnValue(2);
    (AttributeMapper.toUpdatedEntity as jest.Mock).mockReturnValueOnce(
      mockExistingAttributeEntities[2],
    );
    (AttributeMapper.toNewEntity as jest.Mock).mockReturnValue([]);

    mockTemplateRepository.executeTransaction.mockImplementation(
      async (callback) => {
        const mockTxn = {} as any;

        mockItemRepository.getItemIDs.mockResolvedValue(mockItemIDs);

        return await callback(mockTxn);
      },
    );

    await itemTemplateService.updateTemplate(
      1,
      [mockExistingAttributeDTOs[2]],
      [],
      2,
    );

    expect(mockAttributeRepository.updateRatingSymbol).toHaveBeenCalledWith(
      "star",
      3 as any,
      expect.any(Object),
    );
  });

  it("should insert default values for new attributes", async () => {
    (itemTemplateID.parse as jest.Mock).mockReturnValue(1);
    (pageID.parse as jest.Mock).mockReturnValue(2);
    (AttributeMapper.toUpdatedEntity as jest.Mock).mockReturnValue([]);
    (AttributeMapper.toNewEntity as jest.Mock)
      .mockReturnValueOnce(mockNewAttributeEntities[0])
      .mockReturnValueOnce(mockNewAttributeEntities[1]);

    mockTemplateRepository.executeTransaction.mockImplementation(
      async (callback) => {
        const mockTxn = {} as any;

        mockItemRepository.getItemIDs.mockResolvedValue(mockItemIDs);
        mockAttributeRepository.insertAttribute
          .mockResolvedValueOnce(4 as any)
          .mockResolvedValueOnce(5 as any);

        return await callback(mockTxn);
      },
    );

    await itemTemplateService.updateTemplate(1, [], mockNewAttributeDTOs, 2);

    expect(mockItemRepository.insertDateValue).toHaveBeenCalledTimes(3);
    expect(mockItemRepository.insertImageValue).toHaveBeenCalledTimes(3);
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (itemTemplateID.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await itemTemplateService.updateTemplate(
      1,
      mockExistingAttributeDTOs,
      mockNewAttributeDTOs,
      2,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Retrieval Failed");
      expect(result.error.message).toBe(TemplateErrorMessages.editTemplate);
    } else {
      throw new Error("Expected failure result, but got success");
    }
    expect(mockTemplateRepository.executeTransaction).not.toHaveBeenCalled();
  });

  it("should return failure Result if RepositoryErrorNew('Update Failed') is thrown", async () => {
    (itemTemplateID.parse as jest.Mock).mockReturnValue(1);
    (pageID.parse as jest.Mock).mockReturnValue(2);
    (AttributeMapper.toUpdatedEntity as jest.Mock).mockReturnValue(
      mockExistingAttributeEntities,
    );
    (AttributeMapper.toNewEntity as jest.Mock).mockReturnValue(
      mockNewAttributeEntities,
    );

    mockTemplateRepository.executeTransaction.mockRejectedValue(
      new RepositoryErrorNew("Update Failed"),
    );

    const result = await itemTemplateService.updateTemplate(
      1,
      mockExistingAttributeDTOs,
      mockNewAttributeDTOs,
      2,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Retrieval Failed");
      expect(result.error.message).toBe(TemplateErrorMessages.editTemplate);
    } else {
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if RepositoryErrorNew('Transaction Failed') is thrown", async () => {
    (itemTemplateID.parse as jest.Mock).mockReturnValue(1);
    (pageID.parse as jest.Mock).mockReturnValue(2);
    (AttributeMapper.toUpdatedEntity as jest.Mock).mockReturnValue(
      mockExistingAttributeEntities,
    );
    (AttributeMapper.toNewEntity as jest.Mock).mockReturnValue(
      mockNewAttributeEntities,
    );

    mockTemplateRepository.executeTransaction.mockRejectedValue(
      new RepositoryErrorNew("Transaction Failed"),
    );

    const result = await itemTemplateService.updateTemplate(
      1,
      mockExistingAttributeDTOs,
      mockNewAttributeDTOs,
      2,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Retrieval Failed");
      expect(result.error.message).toBe(TemplateErrorMessages.editTemplate);
    } else {
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if any other Error is thrown", async () => {
    (itemTemplateID.parse as jest.Mock).mockReturnValue(1);
    (pageID.parse as jest.Mock).mockReturnValue(2);
    (AttributeMapper.toUpdatedEntity as jest.Mock).mockReturnValue(
      mockExistingAttributeEntities,
    );
    (AttributeMapper.toNewEntity as jest.Mock).mockReturnValue(
      mockNewAttributeEntities,
    );

    mockTemplateRepository.executeTransaction.mockRejectedValue(new Error());

    const result = await itemTemplateService.updateTemplate(
      1,
      mockExistingAttributeDTOs,
      mockNewAttributeDTOs,
      2,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Unknown Error");
      expect(result.error.message).toBe(TemplateErrorMessages.unknown);
    } else {
      throw new Error("Expected failure result, but got success");
    }
  });
});
