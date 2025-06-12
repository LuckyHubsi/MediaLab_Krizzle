import { BaseRepository } from "@/backend/repository/interfaces/BaseRepository.interface";
import { FolderRepository } from "@/backend/repository/interfaces/FolderRepository.interface";
import { GeneralPageRepository } from "@/backend/repository/interfaces/GeneralPageRepository.interface";
import { NoteRepository } from "@/backend/repository/interfaces/NoteRepository.interface";
import { TagRepository } from "@/backend/repository/interfaces/TagRepository.interface";

let mockBaseRepository: jest.Mocked<BaseRepository>;
let mockFolderRepository: jest.Mocked<FolderRepository>;
let mockTagRepository: jest.Mocked<TagRepository>;
let mockGeneralPageRepository: jest.Mocked<GeneralPageRepository>;
let mockNoteRepository: jest.Mocked<NoteRepository>;

mockBaseRepository = {
  executeQuery: jest.fn(),
  fetchFirst: jest.fn(),
  fetchAll: jest.fn(),
  executeTransaction: jest.fn(),
  getLastInsertId: jest.fn(),
};

mockFolderRepository = {
  getAllFolders: jest.fn(),
  getFolderByID: jest.fn(),
  insertFolder: jest.fn(),
  deleteFolderByID: jest.fn(),
  updateFolderByID: jest.fn(),
  ...mockBaseRepository,
};
mockTagRepository = {
  getAllTags: jest.fn(),
  insertTag: jest.fn(),
  deleteTag: jest.fn(),
  updateTag: jest.fn(),
  ...mockBaseRepository,
};
mockGeneralPageRepository = {
  getAllFolderPagesSortedByModified: jest.fn(),
  getAllFolderPagesSortedByCreated: jest.fn(),
  getAllFolderPagesSortedByAlphabet: jest.fn(),
  getAllPagesSortedByModified: jest.fn(),
  getAllPagesSortedByCreated: jest.fn(),
  getAllPagesSortedByAlphabet: jest.fn(),
  getAllPinnedPages: jest.fn(),
  getAllArchivedPages: jest.fn(),
  getByPageID: jest.fn(),
  updateGeneralPageData: jest.fn(),
  insertPage: jest.fn(),
  deletePage: jest.fn(),
  updatePin: jest.fn(),
  updateArchive: jest.fn(),
  updateDateModified: jest.fn(),
  updateParentID: jest.fn(),
  ...mockBaseRepository,
};
mockNoteRepository = {
  insertNote: jest.fn(),
  updateContent: jest.fn(),
  getByPageId: jest.fn(),
  ...mockGeneralPageRepository,
  ...mockBaseRepository,
};

export {
  mockBaseRepository,
  mockFolderRepository,
  mockTagRepository,
  mockGeneralPageRepository,
  mockNoteRepository,
};
