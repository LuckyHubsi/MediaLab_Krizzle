import { 
    getItemById,
    getItemsByCollectionId
 } from "../ItemService";
import { 
    itemSelectByIdQuery,
    itemSelectByCollectionIdQuery 
} from "@/queries/ItemQuery";
import { fetchAll, fetchFirst } from "@/utils/QueryHelper";
import { ItemMapper } from "@/utils/mapper/ItemMapper";

jest.mock('@/queries/ItemQuery', () => ({
    itemSelectByIdQuery: jest.fn(),
    itemSelectByCollectionIdQuery: jest.fn()
}))

jest.mock('@/utils/QueryHelper', () => ({
    fetchFirst: jest.fn(),
    fetchAll: jest.fn()
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
    beforeEach(() => {
        jest.clearAllMocks();
    });
        describe('getItemById', () => {

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
    });

    it('should return the found items', async () => {
      const mockRawResult = [
        {
          itemID: 1,
          collectionID: 2,
          category: 'Books',
          attributeValues: JSON.stringify([
            {
              attributeID: 1,
              attributeLabel: 'Title',
              attributeType: 'text',
              value: 'Sleeping Beauties'
            }
          ])
        },
        {
          itemID: 2,
          collectionID: 2,
          category: 'Books',
          attributeValues: JSON.stringify([
            {
              attributeID: 2,
              attributeLabel: 'Published',
              attributeType: 'date',
              value: '2025-04-24'
            }
          ])
        }
      ];

      const expectedModels = [
        {
          itemID: 1,
          collectionID: 2,
          category: 'Books',
          values: [
            {
              attributeID: 1,
              attributeLabel: 'Title',
              attributeType: 'text',
              value: 'Sleeping Beauties'
            }
          ]
        },
        {
          itemID: 2,
          collectionID: 2,
          category: 'Books',
          values: [
            {
              attributeID: 2,
              attributeLabel: 'Published',
              attributeType: 'date',
              value: '2025-04-25'
            }
          ]
        }
      ];

      const expectedDTOs = [
        {
          itemID: 1,
          collectionID: 2,
          category: 'Books',
          attributeValues: [
            {
              attributeID: 1,
              attributeLabel: 'Title',
              attributeType: 'text',
              value: 'Sleeping Beauties'
            }
          ]
        },
        {
          itemID: 2,
          collectionID: 2,
          category: 'Books',
          attributeValues: [
            {
              attributeID: 2,
              attributeLabel: 'Published',
              attributeType: 'date',
              value: '2025-04-25'
            }
          ]
        }
      ];

      (itemSelectByCollectionIdQuery as jest.Mock).mockReturnValue('SELECT query');
      (fetchAll as jest.Mock).mockResolvedValue(mockRawResult);
      (ItemMapper.toDTO as jest.Mock)
        .mockReturnValueOnce(expectedDTOs[0])
        .mockReturnValueOnce(expectedDTOs[1]);

      const result = await getItemsByCollectionId(1);

      expect(itemSelectByCollectionIdQuery).toHaveBeenCalledWith(1);
      expect(fetchAll).toHaveBeenCalledWith('SELECT query', [1]);
      expect(ItemMapper.toDTO).toHaveBeenCalledTimes(2);
      expect(result).toEqual(expectedDTOs);
    });
})