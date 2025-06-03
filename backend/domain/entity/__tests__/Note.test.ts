import { z } from "zod";
import { noteSchema, createNewNote } from "@/backend/domain/entity/Note";
import { PageType } from "@/shared/enum/PageType";

describe("Note Schema Validation", () => {
  const now = new Date();

  const validNote = {
    pageID: 1,
    pageType: PageType.Note,
    pageTitle: "test title",
    pageIcon: "icon",
    pageColor: "#FFFFFF",
    archived: false,
    pinned: false,
    tag: null,
    parentID: null,
    createdAt: now,
    updatedAt: now,
    noteID: 1,
    noteContent: "valid note content",
    pinCount: 0,
  };

  const validNewNoteInput = {
    pageType: PageType.Note,
    pageTitle: "test title",
    pageIcon: "icon",
    pageColor: "#FFFFFF",
    archived: false,
    pinned: false,
    tag: null,
    parentID: null,
    noteContent: "new note content",
  };

  let invalidNote: any;
  let invalidNewNoteInput: any;

  beforeEach(() => {
    invalidNote = { ...validNote };
    invalidNewNoteInput = { ...validNewNoteInput };
  });

  describe("noteSchema", () => {
    it("should validate a correct Note", () => {
      const result = noteSchema.safeParse(validNote);
      expect(result.success).toBe(true);
    });

    it("should invalidate negative noteID", () => {
      invalidNote.noteID = -1;
      const result = noteSchema.safeParse(invalidNote);
      expect(result.success).toBe(false);
    });
    it("should invalidate pinCount over limit", () => {
      invalidNote.pinCount = 5;
      const result = noteSchema.safeParse(invalidNote);
      expect(result.success).toBe(false);
    });
    it("should invalidate pinCount under limit", () => {
      invalidNote.pinCount = -1;
      const result = noteSchema.safeParse(invalidNote);
      expect(result.success).toBe(false);
    });
  });

  describe("createNewNote", () => {
    it("should transform a valid input to a NewNote object", () => {
      const result = createNewNote.safeParse(validNewNoteInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toMatchObject({
          ...validNewNoteInput,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });
      }
    });

    it("should invalidate invalid pageTitle", () => {
      invalidNewNoteInput.pageTitle = "";
      const result = createNewNote.safeParse(invalidNewNoteInput);
      expect(result.success).toBe(false);
    });
    it("should invalidate bad color format", () => {
      invalidNewNoteInput.pageColor = "red";
      const result = createNewNote.safeParse(invalidNewNoteInput);
      expect(result.success).toBe(false);
    });
    it("should invalidate parentID if negative", () => {
      invalidNewNoteInput.parentID = -1;
      const result = createNewNote.safeParse(invalidNewNoteInput);
      expect(result.success).toBe(false);
    });
  });
});
