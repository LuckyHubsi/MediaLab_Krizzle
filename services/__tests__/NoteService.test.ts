import { PageType } from "@/utils/enums/PageType";
import { insertGeneralPageAndReturnID } from "../GeneralPageService";
import { insertNote } from "../NoteService";
import { executeQuery } from "@/utils/QueryHelper";

// mock the QueryHelper functions
jest.mock("@/utils/QueryHelper", () => ({
  fetchFirst: jest.fn(),
  executeQuery: jest.fn(),
}));

// mock the GeneralPageService
jest.mock("@/services/GeneralPageService", () => ({
  insertGeneralPageAndReturnID: jest.fn(),
}));

describe("NoteService", () => {
  const mockNoteDTO = {
    page_type: PageType.Note,
    page_title: "Test Note",
    archived: false,
    pinned: true,
    tag: null,
    note_content: "This is a test note",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe("insertNote", () => {
    it("should insert a general page and a note, then return the pageID", async () => {
      (insertGeneralPageAndReturnID as jest.Mock).mockResolvedValue(123);

      const result = await insertNote(mockNoteDTO);

      expect(insertGeneralPageAndReturnID).toHaveBeenCalledWith(mockNoteDTO);
      expect(executeQuery).toHaveBeenCalledWith(expect.any(String), [
        mockNoteDTO.note_content,
        123,
      ]);
      expect(result).toBe(123);
    });

    it("should return null if general page insertion fails", async () => {
      (insertGeneralPageAndReturnID as jest.Mock).mockResolvedValue(null);

      const result = await insertNote(mockNoteDTO);

      expect(result).toBeNull();
    });
  });
});
