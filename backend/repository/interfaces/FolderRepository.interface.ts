import { Folder, NewFolder } from "@/backend/domain/entity/Folder";
import { BaseRepository } from "./BaseRepository.interface";
import { FolderID } from "@/backend/domain/common/IDs";

/**
 * FolderRepository defines CRUD operations for `Folder` entities.
 *
 * Extends the base repository interface for common infrastructure.
 */
export interface FolderRepository extends BaseRepository {
  insertFolder(folder: NewFolder): Promise<boolean>;
  getAllFolders(): Promise<Folder[]>;
  getFolderByID(folderId: FolderID): Promise<Folder>;
}
