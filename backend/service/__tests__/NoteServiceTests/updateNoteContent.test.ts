import { NoteService } from "../../NoteService";
import { string50000 } from "@/backend/domain/common/types";
import { success } from "@/shared/result/Result";
import { pageID } from "@/backend/domain/common/IDs";
import { ZodError } from "zod";
import { NoteErrorMessages } from "@/shared/error/ErrorMessages";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { mockNoteRepository } from "../ServiceTest.setup";

jest.mock("@/backend/domain/common/IDs", () => {
  const actual = jest.requireActual("@/backend/domain/common/IDs");
  return {
    ...actual,
    pageID: {
      parse: jest.fn(() => 1 as any),
    },
  };
});

jest.mock("@/backend/domain/common/types", () => {
  const actual = jest.requireActual("@/backend/domain/common/types");
  return {
    ...actual,
    string50000: {
      parse: jest.fn(() => "content" as any),
    },
  };
});

describe("NoteService - updateNoteContent", () => {
  let noteService: NoteService;

  beforeAll(() => {
    noteService = new NoteService(mockNoteRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a success Result containing undefined/void", async () => {
    mockNoteRepository.executeTransaction.mockResolvedValue(true);

    const result = await noteService.updateNoteContent(1, "content");

    expect(result).toEqual(success(undefined));
    expect(pageID.parse as jest.Mock).toHaveBeenCalledWith(1);
    expect(string50000.parse as jest.Mock).toHaveBeenCalledWith("content");
  });

  it("should return failure Result if ZodError is thrown pt.1", async () => {
    (pageID.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await noteService.updateNoteContent(1, "content");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Validation Error");
      expect(result.error.message).toBe(NoteErrorMessages.validateNoteToUpdate);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
    expect(pageID.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(string50000.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(mockNoteRepository.executeTransaction).toHaveBeenCalledTimes(0);
  });

  it("should return failure Result if ZodError is thrown pt.2", async () => {
    (string50000.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const result = await noteService.updateNoteContent(1, "content");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Validation Error");
      expect(result.error.message).toBe(NoteErrorMessages.validateNoteToUpdate);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
    expect(string50000.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(pageID.parse as jest.Mock).toHaveBeenCalledTimes(0);
    expect(mockNoteRepository.executeTransaction).toHaveBeenCalledTimes(0);
  });

  it("should return failure Result if RepositoryError('Udpate Failed') is thrown", async () => {
    (string50000.parse as jest.Mock).mockImplementation(() => "content");
    (pageID.parse as jest.Mock).mockImplementation(() => 1);
    mockNoteRepository.executeTransaction.mockRejectedValue(
      new RepositoryError("Update Failed"),
    );

    const result = await noteService.updateNoteContent(1, "content");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Update Failed");
      expect(result.error.message).toBe(NoteErrorMessages.updateNoteContent);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
    expect(string50000.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(pageID.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(mockNoteRepository.executeTransaction).toHaveBeenCalledTimes(1);
  });

  it("should return failure Result if other Error besides ZodError or RepositoryError('Update Failed') is thrown", async () => {
    (string50000.parse as jest.Mock).mockImplementation(() => "content");
    (pageID.parse as jest.Mock).mockImplementation(() => 1);
    mockNoteRepository.executeTransaction.mockRejectedValue(new Error());

    const result = await noteService.updateNoteContent(1, "content");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.type).toBe("Unknown Error");
      expect(result.error.message).toBe(NoteErrorMessages.unknown);
    } else {
      // this would mean an error in the test
      throw new Error("Expected failure result, but got success");
    }
    expect(string50000.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(pageID.parse as jest.Mock).toHaveBeenCalledTimes(1);
    expect(mockNoteRepository.executeTransaction).toHaveBeenCalledTimes(1);
  });
});
