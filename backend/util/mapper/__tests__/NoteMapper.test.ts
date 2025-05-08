import { pageID } from "@/backend/domain/entity/GeneralPage";
import { NoteDTO } from "@/dto/NoteDTO";
import { PageType } from "../../../../shared/enum/PageType";
import { NewNote, Note, noteID } from "@/backend/domain/entity/Note";
import { NoteModel } from "@/backend/repository/model/NoteModel";
import { TagMapper } from "../TagMapper";
import { NoteMapper } from "../NoteMapper";

jest.mock("@/backend/util/mapper/TagMapper", () => ({
  TagMapper: {
    toDTO: jest.fn(),
    toNewEntity: jest.fn(),
    toEntity: jest.fn(),
  },
}));

describe("NoteMapper", () => {
  const mockPageID = pageID.parse(1);
  const mockTagID: any = 1;
  const mockNoteID = noteID.parse(1);
  const date: Date = new Date();
  const dateString: string = date.toISOString();

  const mockNote: Note = {
    pageID: mockPageID,
    pageType: PageType.Note,
    pageTitle: "test note",
    pageIcon: "test icon",
    pageColor: "test color",
    archived: false,
    pinned: true,
    tag: {
      tagID: mockTagID,
      tagLabel: "test tag",
    },
    createdAt: date,
    updatedAt: date,
    noteID: mockNoteID,
    noteContent: "test content",
  };

  const mockNoteDTO: NoteDTO = {
    pageID: 1,
    page_type: PageType.Note,
    page_title: "test note",
    page_icon: "test icon",
    page_color: "test color",
    archived: false,
    pinned: true,
    tag: {
      tagID: mockTagID,
      tag_label: "test tag",
    },
    noteID: 1,
    note_content: "test content",
  };

  const mockNoteModel: NoteModel = {
    pageID: 1,
    page_type: PageType.Note,
    page_title: "test note",
    page_icon: "test icon",
    page_color: "test color",
    date_created: dateString,
    date_modified: dateString,
    archived: 0,
    pinned: 1,
    tagID: mockTagID,
    tag_label: "test tag",
    noteID: 1,
    note_content: "test content",
  };

  const mockNewNote: NewNote = {
    pageType: PageType.Note,
    pageTitle: "test note",
    pageIcon: "test icon",
    pageColor: "test color",
    archived: false,
    pinned: true,
    tag: {
      tagID: mockTagID,
      tagLabel: "test tag",
    },
    createdAt: date,
    updatedAt: date,
    noteContent: "test content",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("toDTO", () => {
    it("should map a Note entity to a NoteDTO", () => {
      (TagMapper.toDTO as jest.Mock).mockReturnValue(mockNoteDTO.tag);

      const result = NoteMapper.toDTO(mockNote);

      expect(result).toEqual(mockNoteDTO);
      expect(TagMapper.toDTO).toHaveBeenCalledWith(mockNote.tag);
    });
  });

  describe("toModel", () => {
    it("should map a Note entity to a NoteModel", () => {
      const result = NoteMapper.toModel(mockNote);

      expect(result).toEqual({
        ...mockNoteModel,
        date_created: mockNote.createdAt.toISOString(),
        date_modified: mockNote.updatedAt.toISOString(),
      });
    });
  });

  describe("toInsertModel", () => {
    it("should map a NewNote entity to a NoteModel", () => {
      const result = NoteMapper.toInsertModel(mockNewNote);

      expect(result).toEqual({
        pageID: 0,
        page_type: PageType.Note,
        page_title: "test note",
        page_icon: "test icon",
        page_color: "test color",
        date_created: mockNewNote.createdAt.toISOString(),
        date_modified: mockNewNote.updatedAt.toISOString(),
        archived: 0,
        pinned: 1,
        tagID: 1,
        tag_label: "test tag",
        noteID: 0,
        note_content: "test content",
      });
    });
  });

  describe("toNewEntity", () => {
    it("should map a NoteDTO to a NewNote entity", () => {
      (TagMapper.toNewEntity as jest.Mock).mockReturnValue(mockNewNote.tag);

      const result = NoteMapper.toNewEntity(mockNoteDTO);

      expect(result).toEqual(
        expect.objectContaining({
          pageType: mockNewNote.pageType,
          pageTitle: mockNewNote.pageTitle,
          pageIcon: mockNewNote.pageIcon,
          pageColor: mockNewNote.pageColor,
          archived: false,
          pinned: true,
          tag: mockNewNote.tag,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          noteContent: mockNewNote.noteContent,
        }),
      );
      expect(TagMapper.toNewEntity).toHaveBeenCalledWith(mockNoteDTO.tag);
    });

    it("should throw an error if NoteDTO is invalid", () => {
      const invalidNoteDTO: NoteDTO = {
        ...mockNoteDTO,
        page_title: "",
      };

      expect(() => NoteMapper.toNewEntity(invalidNoteDTO)).toThrow(
        "Failed to map NoteDTO to New Entity",
      );
    });
  });

  describe("toEntity", () => {
    it("should map a NoteModel to a Note entity", () => {
      (TagMapper.toEntity as jest.Mock).mockReturnValue(mockNote.tag);

      const result = NoteMapper.toEntity(mockNoteModel);

      expect(result).toEqual({
        ...mockNote,
        createdAt: new Date(mockNoteModel.date_created),
        updatedAt: new Date(mockNoteModel.date_modified),
      });
      expect(TagMapper.toEntity).toHaveBeenCalledWith({
        tagID: mockNoteModel.tagID,
        tag_label: mockNoteModel.tag_label!,
      });
    });

    it("should throw an error if NoteModel is invalid", () => {
      const invalidNoteModel: NoteModel = {
        ...mockNoteModel,
        pageID: -1,
      };

      expect(() => NoteMapper.toEntity(invalidNoteModel)).toThrow(
        "Failed to map NoteModel to Entity",
      );
    });
  });
});
