import { Folder, NewFolder } from "@/backend/domain/entity/Folder";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { folderID, FolderID } from "@/backend/domain/common/IDs";
import { FolderRepository } from "../interfaces/FolderRepository.interface";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import {
  deleteFolderByIDQuery,
  insertFolderQuery,
  selectAllFoldersQuery,
  selectFolderByIDQuery,
} from "../query/FolderQuery";
import { FolderModel } from "../model/FolderModel";
import { FolderMapper } from "@/backend/util/mapper/FolderMapper";

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
      throw new RepositoryError("Failed to insert folder.");
    }
  }

  /**
   * Retrieves all folders from the database.
   *
   * @returns A Promise resolving to an array of `Folder` domain entities.
   * @throws RepositoryError if the query fails.
   */
  async getAllFolders(): Promise<Folder[]> {
    try {
      const result = await this.fetchAll<FolderModel>(selectAllFoldersQuery);
      return result.map(FolderMapper.toEntity);
    } catch (error) {
      throw new RepositoryError("Failed to fetch all folders.");
    }
  }

  /**
   * Retrieves a folder from the database by its ID.
   *
   * @returns A Promise resolving to a `Folder` domain entity.
   * @throws RepositoryError if the fetch fails.
   */
  async getFolderByID(folderId: FolderID): Promise<Folder> {
    try {
      const result = await this.fetchFirst<FolderModel>(selectFolderByIDQuery, [
        folderId,
      ]);
      if (result !== null) {
        return FolderMapper.toEntity(result);
      }
      throw new RepositoryError("Folder not found.");
    } catch (error) {
      throw new RepositoryError("Failed to fetch the folder.");
    }
  }

  /**
   * Deletes a folder by its ID.
   *
   * @param folderId - The ID of the folder to delete.
   * @returns A Promise resolving to `true` if deletion is successful.
   * @throws RepositoryError if the deletion fails.
   */
  async deleteFolderByID(folderId: FolderID): Promise<boolean> {
    try {
      const result = await this.executeTransaction(async (txn) => {
        await this.executeQuery(deleteFolderByIDQuery, [folderId], txn);
        return true;
      });
      return result;
    } catch (error) {
      throw new RepositoryError("Folder not found.");
    }
  }
}

// Singleton instance of the FolderRepository implementation.
export const folderRepository = new FolderRepositoryImpl();
