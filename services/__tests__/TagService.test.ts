import { TagDTO } from "@/dto/TagDTO";
import { TagModel } from "@/models/TagModel";
import { TagMapper } from "@/utils/mapper/TagMapper";
import { executeQuery } from "@/utils/QueryHelper";
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
    tagID: undefined,
    tag_label: "label 1",
  } as TagDTO;

  const mockExecuteQuery = executeQuery as jest.MockedFunction<
    typeof executeQuery
  >;

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
