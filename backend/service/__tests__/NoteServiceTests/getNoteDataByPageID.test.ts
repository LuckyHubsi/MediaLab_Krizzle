import { NoteService } from "../../NoteService";
import { pageID } from "@/backend/domain/common/IDs";
import { NoteMapper } from "@/backend/util/mapper/NoteMapper";
import { success } from "@/shared/result/Result";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { NoteErrorMessages } from "@/shared/error/ErrorMessages";
import { ZodError } from "zod";
import { mockNoteRepository } from "../ServiceTest.setup";

jest.mock("@/backend/util/mapper/NoteMapper", () => ({
  NoteMapper: {
    toDTO: jest.fn(),
  },
}));

jest.mock("@/backend/domain/common/IDs", () => ({
  pageID: {
    parse: jest.fn(() => 1 as any),
  },
}));

describe("noteService - getNoteDataByPageID", () => {
  const mockNoteEntity = {
    pageID: 1,
    noteContent: "test content",
  } as any;

  const mockNoteDTO = {
    pageID: 1,
    noteContent: "test content",
  } as any;

  let noteService: NoteService;

  beforeAll(() => {
    noteService = new NoteService(mockNoteRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a success Result containing a NoteDTO", async () => {
    (pageID.parse as jest.Mock).mockReturnValue(1);
    mockNoteRepository.getByPageId.mockResolvedValue(mockNoteEntity);
    (NoteMapper.toDTO as jest.Mock).mockReturnValue(mockNoteDTO);

    const result = await noteService.getNoteDataByPageID(1);

    expect(result).toEqual(success(mockNoteDTO));
    expect(mockNoteRepository.getByPageId).toHaveBeenCalledWith(1);
    expect((NoteMapper.toDTO as jest.Mock).mock.calls[0][0]).toEqual(
      mockNoteDTO,
    );
  });

  it("should return failure Result if RepositoryError('Not Found') is thrown", async () => {
    (pageID.parse as jest.Mock).mockReturnValue(1);
    mockNoteRepository.getByPageId.mockRejectedValue(
      new RepositoryError("Not Found"),
    );

    const result = await noteService.getNoteDataByPageID(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Not Found");
      expect(result.error.message).toBe(NoteErrorMessages.notFound);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }

    expect(mockNoteRepository.getByPageId).toHaveBeenCalled();
  });

  it("should return failure Result if ZodError is thrown", async () => {
    (pageID.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await noteService.getNoteDataByPageID(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Not Found");
      expect(result.error.message).toBe(NoteErrorMessages.notFound);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
  });

  it("should return failure Result if any Error besides RepositoryError('Fetch Failed') is thrown", async () => {
    (pageID.parse as jest.Mock).mockReturnValue(1);
    mockNoteRepository.getByPageId.mockRejectedValue(new Error());

    const result = await noteService.getNoteDataByPageID(1);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Unknown Error");
      expect(result.error.message).toBe(NoteErrorMessages.unknown);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }

    expect(mockNoteRepository.getByPageId).toHaveBeenCalled();
  });
});
