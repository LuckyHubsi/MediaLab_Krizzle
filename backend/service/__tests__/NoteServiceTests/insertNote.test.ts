import { NoteService } from "../../NoteService";
import { NoteMapper } from "@/backend/util/mapper/NoteMapper";
import { success } from "@/shared/result/Result";
import { ZodError } from "zod";
import { NoteErrorMessages } from "@/shared/error/ErrorMessages";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { mockNoteRepository } from "../ServiceTest.setup";

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

  beforeAll(() => {
    noteService = new NoteService(mockNoteRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
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

  it("should return failure Result if RepositoryError('Insert Failed') is thrown pt.1", async () => {
    (NoteMapper.toNewEntity as jest.Mock).mockReturnValue(mockNewNoteEntity);
    mockNoteRepository.executeTransaction.mockImplementation(
      async (callback) => {
        return await callback({} as any);
      },
    );
    mockNoteRepository.insertPage.mockRejectedValue(
      new RepositoryError("Insert Failed"),
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

  it("should return failure Result if RepositoryError('Insert Failed') is thrown pt.2", async () => {
    (NoteMapper.toNewEntity as jest.Mock).mockReturnValue(mockNewNoteEntity);
    mockNoteRepository.executeTransaction.mockImplementation(
      async (callback) => {
        return await callback({} as any);
      },
    );
    mockNoteRepository.insertPage.mockReturnValue(pageId);
    mockNoteRepository.insertNote.mockRejectedValue(
      new RepositoryError("Insert Failed"),
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

  it("should return failure Result if other Error besides ZodError or RepositoryError('Insert Failed') is thrown", async () => {
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
