import { TagDTO } from "@/dto/TagDTO";
import { TagModel } from "@/models/TagModel";
import { TagMapper } from "@/utils/mapper/TagMapper";
import { executeQuery, fetchAll } from "@/utils/QueryHelper";
import * as TagService from "../TagService";
import { DatabaseError } from "@/utils/DatabaseError";

// mock the QueryHelper functions
jest.mock("@/utils/QueryHelper", () => ({
  fetchAll: jest.fn(),
  executeQuery: jest.fn(),
}));

jest.mock("@/utils/mapper/TagMapper", () => ({
  TagMapper: {
    toDTO: jest.fn(),
  },
}));

describe("TagService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const tagModel = {
    tagID: 1,
    tag_label: "label 1",
  } as TagModel;

  const tagDTO = {
    tagID: 1,
    tag_label: "label 1",
  } as TagDTO;

  const mockExecuteQuery = executeQuery as jest.MockedFunction<
    typeof executeQuery
  >;
  const mockFetchAll = fetchAll as jest.MockedFunction<typeof fetchAll>;

  describe("getAllTags", () => {
    it("should fetch all tags and return an array of TagDTO", async () => {
      mockFetchAll.mockResolvedValue([tagModel]);
      (TagMapper.toDTO as jest.Mock).mockReturnValue(tagDTO);

      const result = await TagService.getAllTags();

      expect(result).toEqual([tagDTO]);
      expect(mockFetchAll).toHaveBeenCalled();
      expect(mockFetchAll).toHaveBeenCalledTimes(1);

      expect((TagMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
        expect.objectContaining({
          tagID: 1,
          tag_label: "label 1",
        }),
      );
    });

    it("should throw a DatabaseError when executeQuery fails", async () => {
      mockFetchAll.mockRejectedValue(new Error());

      await expect(TagService.getAllTags()).rejects.toThrow(DatabaseError);

      expect(mockFetchAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("insertTag", () => {
    it("should insert a tag and return true", async () => {
      const result = await TagService.insertTag(tagDTO, undefined);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.any(String),
        ["label 1"],
        undefined,
      );
      expect(result).toBe(true);
    });

    it("should throw a DatabaseError when executeQuery fails", async () => {
      mockExecuteQuery.mockRejectedValue(new Error());

      await expect(TagService.insertTag(tagDTO)).rejects.toThrow(DatabaseError);

      expect(mockExecuteQuery).toHaveBeenCalledTimes(1);
    });
  });
});
