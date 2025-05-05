import { NoteDTO } from "@/dto/NoteDTO";
import { Note } from "@/backend/domain/entity/Note";
import { pageID } from "@/backend/domain/entity/GeneralPage";
import * as common from "../../domain/common/types";
import { generalPageService } from "../GeneralPageService";
import { GeneralPageRepository } from "@/backend/repository/interfaces/GeneralPageRepository.interface";
import { NoteRepository } from "@/backend/repository/interfaces/NoteRepository.interface";
import { noteService } from "../NoteService";
import { NoteMapper } from "@/backend/util/mapper/NoteMapper";
import { ServiceError } from "@/backend/util/error/ServiceError";

jest.mock(
  "@/backend/repository/implementation/NoteRepository.implementation",
  () => ({
    noteRepository: {
      getByPageId: jest.fn(),
      insertNote: jest.fn(),
      updateContent: jest.fn(),
      executeTransaction: jest.fn(),
    },
  }),
);

jest.mock(
  "@/backend/repository/implementation/GeneralPageRepository.implementation",
  () => ({
    generalPageRepository: {
      insertPage: jest.fn(),
    },
  }),
);

jest.mock("@/backend/util/mapper/NoteMapper", () => ({
  NoteMapper: {
    toDTO: jest.fn(),
    toNewEntity: jest.fn(),
  },
}));

describe("NoteService", () => {
  const date = new Date();
  const mockNote = {
    pageID: 1,
    noteID: 1,
    pageType: "note",
    pageTitle: "test note",
    pageIcon: "test icon",
    pageColor: "testcolor",
    archived: false,
    pinned: true,
    noteContent: "test content",
    createdAt: date,
    updatedAt: date,
  } as any;

  const mockNoteDTO = {
    pageID: 1,
    noteID: 1,
    pageType: "note",
    pageTitle: "test note",
    pageIcon: "testicon",
    pageColor: "test color",
    archived: false,
    pinned: true,
    noteContent: "test content",
  } as any;

  const mockNoteRepository = noteService[
    "noteRepo"
  ] as jest.Mocked<NoteRepository>;
  const mockGeneralPageRepository = noteService[
    "generalPageRepo"
  ] as jest.Mocked<GeneralPageRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getNoteByPageId", () => {
    it("should return a NoteDTO object", async () => {
      mockNoteRepository.getByPageId.mockResolvedValue(mockNote);
      (NoteMapper.toDTO as jest.Mock).mockReturnValue(mockNoteDTO);

      const result = await noteService.getNoteByPageId(1);

      expect(result).toEqual(mockNoteDTO);
      expect(mockNoteRepository.getByPageId).toHaveBeenCalledWith(
        pageID.parse(1),
      );
      expect(NoteMapper.toDTO).toHaveBeenCalledWith(mockNote);
    });

    it("should throw ServiceError if getByPageId fails", async () => {
      mockNoteRepository.getByPageId.mockRejectedValue(
        new Error("Repository error"),
      );

      await expect(noteService.getNoteByPageId(1)).rejects.toThrow(
        ServiceError,
      );
      expect(mockNoteRepository.getByPageId).toHaveBeenCalledWith(
        pageID.parse(1),
      );
    });
  });

  describe("insertNoteData", () => {
    it("should insert a note and return its ID", async () => {
      (NoteMapper.toNewEntity as jest.Mock).mockReturnValue(mockNote);
      mockGeneralPageRepository.insertPage.mockResolvedValue(1);
      mockNoteRepository.insertNote.mockResolvedValue(1);
      mockNoteRepository.executeTransaction.mockImplementation(async (fn) => {
        return await fn({} as any);
      });

      const result = await noteService.insertNoteData(mockNoteDTO);

      expect(result).toBe(1);
      expect(NoteMapper.toNewEntity).toHaveBeenCalledWith(mockNoteDTO);
      expect(mockGeneralPageRepository.insertPage).toHaveBeenCalledWith(
        mockNote,
        expect.any(Object),
      );
      expect(mockNoteRepository.insertNote).toHaveBeenCalledWith(
        mockNote,
        pageID.parse(1),
        expect.any(Object),
      );
    });

    it("should throw ServiceError if insertNoteData fails", async () => {
      (NoteMapper.toNewEntity as jest.Mock).mockReturnValue(mockNote);
      mockGeneralPageRepository.insertPage.mockRejectedValue(
        new Error("Repository error"),
      );
      mockNoteRepository.executeTransaction.mockImplementation(async (fn) => {
        return await fn({} as any);
      });

      await expect(noteService.insertNoteData(mockNoteDTO)).rejects.toThrow(
        ServiceError,
      );
      expect(NoteMapper.toNewEntity).toHaveBeenCalledWith(mockNoteDTO);
      expect(mockGeneralPageRepository.insertPage).toHaveBeenCalledWith(
        mockNote,
        expect.any(Object),
      );
    });
  });

  describe("updateNoteContent", () => {
    it("should update the note content", async () => {
      const newContent = "Updated content";
      const parsedContent = common.string20000.parse(newContent);

      mockNoteRepository.updateContent.mockResolvedValue(true);

      await noteService.updateNoteContent(1, newContent);

      expect(mockNoteRepository.updateContent).toHaveBeenCalledWith(
        pageID.parse(1),
        parsedContent,
      );
    });

    it("should throw ServiceError if newContent is null", async () => {
      await expect(
        noteService.updateNoteContent(1, null as any),
      ).rejects.toThrow(ServiceError);
    });

    it("should throw ServiceError if updateContent fails", async () => {
      const newContent = "Updated content";
      const parsedContent = common.string20000.parse(newContent);

      mockNoteRepository.updateContent.mockRejectedValue(
        new Error("Repository error"),
      );

      await expect(
        noteService.updateNoteContent(1, newContent),
      ).rejects.toThrow(ServiceError);
      expect(mockNoteRepository.updateContent).toHaveBeenCalledWith(
        pageID.parse(1),
        parsedContent,
      );
    });
  });
});
