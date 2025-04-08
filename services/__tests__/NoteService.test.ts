import { PageType } from "@/utils/enums/PageType";
import { insertGeneralPageAndReturnID } from "../GeneralPageService";
import { getNoteDataByPageID, insertNote } from "../NoteService";
import { executeQuery, fetchFirst } from "@/utils/QueryHelper";

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

  describe("getNoteDataByPageID", () => {
    it("should return NoteDTO when valid data and correct page_type", async () => {
      (fetchFirst as jest.Mock).mockResolvedValue({
        pageID: 1,
        page_type: PageType.Note,
        page_title: "Note Title",
        note_content: "Content here",
        date_created: "",
        date_modified: "",
        archived: 0,
        pinned: 1,
      });

      const noteDTO = await getNoteDataByPageID(1);

      expect(noteDTO?.note_content).toBe("Content here");
      expect(noteDTO?.page_type).toBe(PageType.Note);
    });

    it("should return null when no data is found", async () => {
      (fetchFirst as jest.Mock).mockResolvedValue(null);
      const noteDTO = await getNoteDataByPageID(1);
      expect(noteDTO).toBeNull();
    });

    it("should return null if page_type is not Note", async () => {
      (fetchFirst as jest.Mock).mockResolvedValue({
        page_type: PageType.Collection,
      });
      const noteDTO = await getNoteDataByPageID(1);
      expect(noteDTO).toBeNull();
    });
  });

});
