import { NoteRepository } from "@/backend/repository/interfaces/NoteRepository.interface";
import { NoteService } from "../../NoteService";
import { NoteMapper } from "@/backend/util/mapper/NoteMapper";
import { success } from "@/shared/result/Result";
import { ZodError } from "zod";
import { NoteErrorMessages } from "@/shared/error/ErrorMessages";
import { RepositoryErrorNew } from "@/backend/util/error/RepositoryError";

jest.mock("@/backend/util/mapper/NoteMapper", () => ({
  NoteMapper: {
    toNewEntity: jest.fn(),
  },
}));

describe("NoteService - insertNewNote", () => {
  const pageId = 1 as any;

  const mockNewNoteEntity = {
    pageID: pageId,
    noteContent: "note content",
  } as any;

  const mockNewNoteDTO = {
    pageID: pageId,
    noteContent: "note content",
  } as any;

  let noteService: NoteService;
  let mockNoteRepository: jest.Mocked<NoteRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNoteRepository = {
      insertNote: jest.fn(),
      updateContent: jest.fn(),
      executeQuery: jest.fn(),
      fetchFirst: jest.fn(),
      fetchAll: jest.fn(),
      executeTransaction: jest.fn(),
      getLastInsertId: jest.fn(),
      getAllFolderPagesSortedByModified: jest.fn(),
      getAllFolderPagesSortedByCreated: jest.fn(),
      getAllFolderPagesSortedByAlphabet: jest.fn(),
      getAllPagesSortedByModified: jest.fn(),
      getAllPagesSortedByCreated: jest.fn(),
      getAllPagesSortedByAlphabet: jest.fn(),
      getAllPinnedPages: jest.fn(),
      getAllArchivedPages: jest.fn(),
      getByPageID: jest.fn(),
      getByPageId: jest.fn(),
      updateGeneralPageData: jest.fn(),
      insertPage: jest.fn(),
      deletePage: jest.fn(),
      updatePin: jest.fn(),
      updateArchive: jest.fn(),
      updateDateModified: jest.fn(),
      updateParentID: jest.fn(),
    };
    noteService = new NoteService(mockNoteRepository);
  });

  it("should return a success Result containing a number", async () => {
    (NoteMapper.toNewEntity as jest.Mock).mockReturnValue(mockNewNoteEntity);
    mockNoteRepository.executeTransaction.mockImplementation(
      async (callback) => {
        return await callback({} as any);
      },
    );
    mockNoteRepository.insertPage.mockResolvedValue(pageId);
    mockNoteRepository.insertNote.mockResolvedValue();

    const result = await noteService.insertNote(mockNewNoteDTO);

    expect(result).toEqual(success(pageId));
    expect(mockNoteRepository.insertPage).toHaveBeenCalledWith(
      mockNewNoteEntity,
      {} as any,
    );
    expect(mockNoteRepository.insertNote).toHaveBeenCalledWith(
      mockNewNoteEntity,
      pageId,
      {} as any,
    );
    expect(NoteMapper.toNewEntity as jest.Mock).toHaveBeenCalledWith(
      mockNewNoteDTO,
    );
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (NoteMapper.toNewEntity as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await noteService.insertNote(mockNewNoteDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Validation Error");
      expect(result.error.message).toBe(NoteErrorMessages.validateNewNote);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
    expect(mockNoteRepository.executeTransaction).toHaveBeenCalledTimes(0);
    expect(mockNoteRepository.insertPage).toHaveBeenCalledTimes(0);
    expect(mockNoteRepository.insertNote).toHaveBeenCalledTimes(0);
  });

  it("should return failure Result if RepositoryErrorNew('Insert Failed') is thrown pt.1", async () => {
    (NoteMapper.toNewEntity as jest.Mock).mockReturnValue(mockNewNoteEntity);
    mockNoteRepository.executeTransaction.mockImplementation(
      async (callback) => {
        return await callback({} as any);
      },
    );
    mockNoteRepository.insertPage.mockRejectedValue(
      new RepositoryErrorNew("Insert Failed"),
    );
    mockNoteRepository.insertNote.mockResolvedValue();

    const result = await noteService.insertNote(mockNewNoteDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Creation Failed");
      expect(result.error.message).toBe(NoteErrorMessages.insertNewNote);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
    expect(mockNoteRepository.executeTransaction).toHaveBeenCalledTimes(1);
    expect(mockNoteRepository.insertPage).toHaveBeenCalledTimes(1);
    expect(mockNoteRepository.insertNote).toHaveBeenCalledTimes(0);
  });

  it("should return failure Result if RepositoryErrorNew('Insert Failed') is thrown pt.2", async () => {
    (NoteMapper.toNewEntity as jest.Mock).mockReturnValue(mockNewNoteEntity);
    mockNoteRepository.executeTransaction.mockImplementation(
      async (callback) => {
        return await callback({} as any);
      },
    );
    mockNoteRepository.insertPage.mockReturnValue(pageId);
    mockNoteRepository.insertNote.mockRejectedValue(
      new RepositoryErrorNew("Insert Failed"),
    );

    const result = await noteService.insertNote(mockNewNoteDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Creation Failed");
      expect(result.error.message).toBe(NoteErrorMessages.insertNewNote);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
    expect(mockNoteRepository.executeTransaction).toHaveBeenCalledTimes(1);
    expect(mockNoteRepository.insertPage).toHaveBeenCalledTimes(1);
    expect(mockNoteRepository.insertNote).toHaveBeenCalledTimes(1);
  });

  it("should return failure Result if other Error besides ZodError or RepositoryErrorNew('Insert Failed') is thrown", async () => {
    (NoteMapper.toNewEntity as jest.Mock).mockReturnValue(mockNewNoteEntity);
    mockNoteRepository.executeTransaction.mockRejectedValue(new Error());

    const result = await noteService.insertNote(mockNewNoteDTO);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Unknown Error");
      expect(result.error.message).toBe(NoteErrorMessages.unknown);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }

    expect(mockNoteRepository.executeTransaction).toHaveBeenCalledTimes(1);
    expect(mockNoteRepository.insertPage).toHaveBeenCalledTimes(0);
    expect(mockNoteRepository.insertNote).toHaveBeenCalledTimes(0);
  });
});
