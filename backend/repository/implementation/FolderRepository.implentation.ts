import { Folder, NewFolder } from "@/backend/domain/entity/Folder";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { folderID, FolderID } from "@/backend/domain/common/IDs";
import { FolderRepository } from "../interfaces/FolderRepository.interface";
import { RepositoryErrorNew } from "@/backend/util/error/RepositoryError";
import {
  deleteFolderByIDQuery,
  insertFolderQuery,
  selectAllFoldersQuery,
  selectFolderByIDQuery,
  updateFolderByIDQuery,
} from "../query/FolderQuery";
import { FolderModel } from "../model/FolderModel";
import { FolderMapper } from "@/backend/util/mapper/FolderMapper";
import * as SQLite from "expo-sqlite";

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
  // constructor accepts database instace
  constructor(db: SQLite.SQLiteDatabase) {
    super(db);
  }

  /**
   * Inserts a new folder into the database.
   *
   * @param folder - A `NewFolder` object containing the tag label.
   * @returns A Promise resolving to `true` if insertion succeeded.
   * @throws RepositoryErrorNew if the insertion fails.
   */
  async insertFolder(folder: NewFolder): Promise<boolean> {
    try {
      await this.executeQuery(insertFolderQuery, [folder.folderName]);
      return true;
    } catch (error) {
      throw new RepositoryErrorNew("Insert Failed");
    }
  }

  /**
   * Retrieves all folders from the database.
   *
   * @returns A Promise resolving to an array of `Folder` domain entities.
   * @throws RepositoryErrorNew if the fetch fails.
   */
  async getAllFolders(): Promise<Folder[]> {
    try {
      const result = await this.fetchAll<FolderModel>(selectAllFoldersQuery);
      const validFolders: Folder[] = [];

      for (const model of result) {
        try {
          const folder = FolderMapper.toEntity(model);
          validFolders.push(folder);
        } catch (err) {
          // skipping invalide folders (folders that failed to be mapped to the domain entity)
          continue;
        }
      }

      return validFolders;
    } catch (error) {
      throw new RepositoryErrorNew("Fetch Failed");
    }
  }

  /**
   * Retrieves a folder from the database by its ID.
   *
   * @returns A Promise resolving to a `Folder` domain entity.
   * @throws RepositoryErrorNew if the fetch fails or if the folder was not found.
   */
  async getFolderByID(folderId: FolderID): Promise<Folder> {
    try {
      const result = await this.fetchFirst<FolderModel>(selectFolderByIDQuery, [
        folderId,
      ]);
      if (result !== null) {
        return FolderMapper.toEntity(result);
      }
      throw new RepositoryErrorNew("Not Found");
    } catch (error) {
      throw new RepositoryErrorNew("Fetch Failed");
    }
  }

  /**
   * Updates a folder's name by its ID.
   *
   * @param folderId - The ID of the folder to update.
   * @param folderName - The new name for the folder.
   * @returns A Promise resolving to `true` if update succeeded.
   * @throws RepositoryErrorNew if the update fails.
   */
  async updateFolderByID(
    folderId: FolderID,
    folderName: string,
  ): Promise<boolean> {
    try {
      await this.executeQuery(updateFolderByIDQuery, [folderName, folderId]);
      return true;
    } catch (error) {
      throw new RepositoryErrorNew("Update Failed");
    }
  }

  /**
   * Deletes a folder by its ID.
   *
   * @param folderId - The ID of the folder to delete.
   * @returns A Promise resolving to `true` if deletion is successful.
   * @throws RepositoryErrorNew if the deletion fails.
   */
  async deleteFolderByID(folderId: FolderID): Promise<boolean> {
    try {
      await this.executeQuery(deleteFolderByIDQuery, [folderId]);
      return true;
    } catch (error) {
      throw new RepositoryErrorNew("Delete Failed");
    }
  }
}
