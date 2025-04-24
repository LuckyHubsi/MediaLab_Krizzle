import { getItemById } from "../ItemService";
import { itemSelectByIdQuery } from "@/queries/ItemQuery";
import { fetchFirst } from "@/utils/QueryHelper";
import { ItemMapper } from "@/utils/mapper/ItemMapper";

jest.mock('@/queries/ItemQuery', () => ({
    itemSelectByIdQuery: jest.fn()
}))

jest.mock('@/utils/QueryHelper', () => ({
    fetchFirst: jest.fn()
}))

jest.mock('@/utils/mapper/ItemMapper', () => {
  const actual = jest.requireActual('@/utils/mapper/ItemMapper');
  return {
    ...actual,
    ItemMapper: {
      ...actual.ItemMapper,
      toDTO: jest.fn(),
    },
  };
});

describe('ItemService', () => {
    describe('getItemById', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return null when item does not exist', async () => {
            (itemSelectByIdQuery as jest.Mock).mockReturnValue('SELECT query');
            (fetchFirst as jest.Mock).mockResolvedValue(null);

            const result = await getItemById(1);

            expect(itemSelectByIdQuery).toHaveBeenCalledWith(1);
            expect(fetchFirst).toHaveBeenCalledWith('SELECT query', [1]);
            expect(result).toBeNull();
        });

        it('should return an item when found', async () => {
            const mockRawResult = {
                itemID: 1,
                collectionID: 2,
                category: 'Books',
                attributeValues: JSON.stringify([
                    {
                        attributeID: 1,
                        attributeLabel: 'Title',
                        attributeType: 'text',
                        value: 'Sleeping Beauties'
                    },
                    {
                        attributeID: 2,
                        attributeLabel: 'Published',
                        attributeType: 'date',
                        value: '2025-04-24'
                    },
                    {
                        attributeID: 3,
                        attributeLabel: 'Genre',
                        attributeType: 'date',
                        value: '[Fantasy, Romance]'
                    }
                ])
            };

            const expectedModel = {
                itemID: 1,
                collectionID: 2,
                category: 'Books',
                values: [
                    {
                        attributeID: 1,
                        attributeLabel: 'Title',
                        attributeType: 'text',
                        value: 'Sleeping Beauties'
                    },
                    {
                        attributeID: 2,
                        attributeLabel: 'Published',
                        attributeType: 'date',
                        value: '2025-04-24'
                    },
                    {
                        attributeID: 3,
                        attributeLabel: 'Genre',
                        attributeType: 'date',
                        value: '[Fantasy, Romance]'
                    }
                ]
            };

            const expectedDTO = {
                itemID: 1,
                collectionID: 2,
                category: 'Books',
                values: [
                    {
                        attributeID: 1,
                        attributeLabel: 'Title',
                        attributeType: 'text',
                        value: 'Sleeping Beauties'
                    },
                    {
                        attributeID: 2,
                        attributeLabel: 'Published',
                        attributeType: 'date',
                        value: '2025-04-24'
                    },
                    {
                        attributeID: 3,
                        attributeLabel: 'Genre',
                        attributeType: 'date',
                        value: '[Fantasy, Romance]'
                    }
                ]
            };

            (itemSelectByIdQuery as jest.Mock).mockReturnValue('SELECT query');
            (fetchFirst as jest.Mock).mockResolvedValue(mockRawResult);
            (ItemMapper.toDTO as jest.Mock).mockReturnValue(expectedDTO);

            const result = await getItemById(1);
            
            expect(itemSelectByIdQuery).toHaveBeenCalledWith(1);
            expect(fetchFirst).toHaveBeenCalledWith('SELECT query', [1]);
            expect(ItemMapper.toDTO).toHaveBeenCalledWith(expectedModel);
            expect(result).toEqual(expectedDTO);
        })
    })
})