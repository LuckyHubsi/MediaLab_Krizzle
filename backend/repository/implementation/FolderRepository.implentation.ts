import { NewFolder } from "@/backend/domain/entity/Folder";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { folderID, FolderID } from "@/backend/domain/common/IDs";
import { FolderRepository } from "../interfaces/FolderRepository.interface";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { insertFolderQuery } from "../query/FolderQuery";

/**
 * Implementation of the FolderRepository interface using SQL queries.
 *
 * Handles the following operations:
 * - Inserting a new folder.
 */
export class FolderRepositoryImpl
  extends BaseRepositoryImpl
  implements FolderRepository
{
  /**
   * Inserts a new folder into the database.
   *
   * @param folder - A `NewFolder` object containing the tag label.
   * @returns A Promise resolving to `true` if insertion succeeded.
   * @throws RepositoryError if the insertion fails.
   */
  async insertFolder(folder: NewFolder): Promise<boolean> {
    try {
      const folderId = await this.executeTransaction(async (txn) => {
        await this.executeQuery(insertFolderQuery, [folder.folderName], txn);

        const lastInsertedID = await this.getLastInsertId(txn);
        return lastInsertedID;
      });
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to insert tag.");
    }
  }
}

// Singleton instance of the FolderRepository implementation.
export const folderRepository = new FolderRepositoryImpl();
