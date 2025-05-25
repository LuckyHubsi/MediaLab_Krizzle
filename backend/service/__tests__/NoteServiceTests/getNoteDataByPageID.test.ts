import { NoteRepository } from "@/backend/repository/interfaces/NoteRepository.interface";
import { NoteService } from "../../NoteService";
import { GeneralPageRepository } from "@/backend/repository/interfaces/GeneralPageRepository.interface";
import { pageID } from "@/backend/domain/common/IDs";
import { NoteMapper } from "@/backend/util/mapper/NoteMapper";
import { success } from "@/shared/result/Result";
import { RepositoryErrorNew } from "@/backend/util/error/RepositoryError";
import { NoteErrorMessages } from "@/shared/error/ErrorMessages";
import { ZodError } from "zod";

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

  it("should return failure Result if RepositoryErrorNew('Not Found') is thrown", async () => {
    (pageID.parse as jest.Mock).mockReturnValue(1);
    mockNoteRepository.getByPageId.mockRejectedValue(
      new RepositoryErrorNew("Not Found"),
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

  it("should return failure Result if any Error besides RepositoryErrorNew('Fetch Failed') is thrown", async () => {
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
