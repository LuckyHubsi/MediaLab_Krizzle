import { NoteMapper } from "../NoteMapper";
import { NoteDTO } from "@/shared/dto/NoteDTO";
import { NoteModel } from "@/backend/repository/model/NoteModel";
import { Note, NewNote } from "@/backend/domain/entity/Note";
import { PageType } from "@/shared/enum/PageType";
import { noteID, pageID } from "@/backend/domain/common/IDs";
import { GeneralPageMapper } from "../GeneralPageMapper";
import { ZodError } from "zod";

jest.mock("@/backend/util/mapper/TagMapper", () => ({
  TagMapper: {
    toDTO: jest.fn(() => ({ tagID: 1, name: "mock tag" })),
    toEntity: jest.fn(() => ({ tagID: 1, name: "mock tag" })),
  },
}));

jest.mock("@/backend/util/mapper/GeneralPageMapper", () => ({
  GeneralPageMapper: {
    toDTO: jest.fn(),
    toNewEntity: jest.fn(),
    toEntity: jest.fn(),
  },
}));

describe("NoteMapper", () => {
  const date = new Date();
  const dateString: string = date.toISOString();
  const brandedPageID = pageID.parse(1);
  const brandedNoteID = noteID.parse(1);

  const baseGeneralPage = {
    pageID: brandedPageID,
    pageType: PageType.Note,
    pageTitle: "test title",
    pageIcon: "icon",
    pageColor: "#FFFFFF",
    archived: false,
    pinned: false,
    tag: null,
    parentID: null,
    createdAt: date,
    updatedAt: date,
  };

  const noteEntity: Note = {
    ...baseGeneralPage,
    noteID: brandedNoteID,
    noteContent: "note content",
    pinCount: 0,
  };

  const newNoteEntity: NewNote = {
    ...baseGeneralPage,
    noteContent: "note content",
  };

  const noteDTO: NoteDTO = {
    pageID: 1,
    page_type: PageType.Note,
    page_title: "test title",
    page_icon: "icon",
    page_color: "#FFFFFF",
    archived: false,
    pinned: false,
    tag: null,
    noteID: 1,
    note_content: "note content",
    pin_count: 0,
    parentID: null,
  };

  const noteModel: NoteModel = {
    pageID: 1,
    page_type: PageType.Note,
    page_title: "test title",
    page_icon: "icon",
    page_color: "#FFFFFF",
    archived: 0,
    pinned: 0,
    tagID: null,
    date_created: dateString,
    date_modified: dateString,
    parentID: null,
    noteID: 1,
    note_content: "note content",
    pin_count: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("toDTO", () => {
    it("should map a Note entity to a NoteDTO", () => {
      const result = NoteMapper.toDTO(noteEntity);
      expect(result).toEqual(noteDTO);
    });
  });

  describe("toNewEntity", () => {
    it("should map a NoteDTO to a NewNote entity", () => {
      const mockGeneralPage = { ...baseGeneralPage };
      const dto = { ...noteDTO };

      (GeneralPageMapper.toNewEntity as jest.Mock).mockReturnValue(
        mockGeneralPage,
      );

      const result = NoteMapper.toNewEntity(dto as NoteDTO);
      expect(result).toEqual(
        expect.objectContaining({
          pageType: newNoteEntity.pageType,
          pageTitle: newNoteEntity.pageTitle,
          pageIcon: newNoteEntity.pageIcon,
          pageColor: newNoteEntity.pageColor,
          archived: newNoteEntity.archived,
          pinned: newNoteEntity.pinned,
          tag: newNoteEntity.tag,
          noteContent: newNoteEntity.noteContent,
        }),
      );
    });

    it("should throw if the note content is invalid", () => {
      const invalidDTO = { ...noteDTO };
      invalidDTO.note_content = 1 as any;
      (GeneralPageMapper.toNewEntity as jest.Mock).mockReturnValue(
        baseGeneralPage,
      );
      expect(() => NoteMapper.toNewEntity(invalidDTO)).toThrow(ZodError);
    });
  });

  describe("toEntity", () => {
    it("should map a NoteModel to a Note entity", () => {
      (GeneralPageMapper.toEntity as jest.Mock).mockReturnValue(
        baseGeneralPage,
      );
      const result = NoteMapper.toEntity(noteModel);
      expect(result).toEqual(expect.objectContaining(noteEntity));
    });

    it("should throw if the model contains invalid content", () => {
      const invalidModel = { ...noteModel };
      invalidModel.note_content = 1 as any;
      (GeneralPageMapper.toEntity as jest.Mock).mockReturnValue(
        baseGeneralPage,
      );
      expect(() => NoteMapper.toEntity(invalidModel)).toThrow(ZodError);
    });
  });
});
