import { FolderDTO } from "@/shared/dto/FolderDTO";
import { FolderRepository } from "../repository/interfaces/FolderRepository.interface";
import { NewFolder } from "../domain/entity/Folder";
import { FolderMapper } from "../util/mapper/FolderMapper";
import { folderID } from "../domain/common/IDs";
import { ServiceErrorType } from "@/shared/error/ServiceError";
import { failure, Result, success } from "@/shared/result/Result";
import { ZodError } from "zod";
import { FolderErrorMessages } from "@/shared/error/ErrorMessages";
import { RepositoryError } from "../util/error/RepositoryError";

/**
 * FolderService encapsulates all folder-related application logic.
 *
 * Responsibilities:
 * - Validates and maps incoming FolderDTOs.
 * - Delegates persistence operations to FolderRepository.
 * - Handles and wraps errors in service-specific error types.
 */
export class FolderService {
  // constructor accepts repo instace
  constructor(private folderRepo: FolderRepository) {}

  /**
   * Inserts a new folder based on the provided DTO.
   *
   * @param folderDTO - The data transfer object containing the folder label.
   * @returns A Promise resolving to a `Result` containing either `true` or a `ServiceErrorType`.
   */
  async insertFolder(
    folderDTO: FolderDTO,
  ): Promise<Result<boolean, ServiceErrorType>> {
    try {
      const folder: NewFolder = FolderMapper.toNewEntity(folderDTO);
      await this.folderRepo.insertFolder(folder);
      return success(true);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: FolderErrorMessages.validateNewFolder,
        });
      } else if (
        error instanceof RepositoryError &&
        error.type === "Insert Failed"
      ) {
        return failure({
          type: "Creation Failed",
          message: FolderErrorMessages.insertNewFolder,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: FolderErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Retrieves all folders and maps them to DTOs.
   *
   * @returns A Promise resolving to a `Result` containing either an array of `FolderDTO`s or a `ServiceErrorType`.
   */
  async getAllFolders(): Promise<Result<FolderDTO[], ServiceErrorType>> {
    try {
      const folders = await this.folderRepo.getAllFolders();
      return success(folders.map(FolderMapper.toDTO));
    } catch (error) {
      if (error instanceof RepositoryError && error.type === "Fetch Failed") {
        return failure({
          type: "Retrieval Failed",
          message: FolderErrorMessages.loadingAllFolders,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: FolderErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Retrieves a folder and maps it to a FolderDTO.
   *
   * @returns A Promise resolving to a `Result` containing either a `FolderDTO` or a `ServiceErrorType`.
   */
  async getFolder(
    folderId: number,
  ): Promise<Result<FolderDTO, ServiceErrorType>> {
    try {
      const brandedID = folderID.parse(folderId);
      const folder = await this.folderRepo.getFolderByID(brandedID);
      return success(FolderMapper.toDTO(folder));
    } catch (error) {
      if (
        error instanceof ZodError ||
        (error instanceof RepositoryError && error.type === "Not Found")
      ) {
        return failure({
          type: "Not Found",
          message: FolderErrorMessages.notFound,
        });
      } else if (
        error instanceof RepositoryError &&
        error.type === "Fetch Failed"
      ) {
        return failure({
          type: "Retrieval Failed",
          message: FolderErrorMessages.loadingFolder,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: FolderErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Updates a folder.
   *
   * @param folderDTO - `FolderDTO` representing the updated folder data.
   * @returns A Promise resolving to a `Result` containing either `true` or a `ServiceErrorType`.
   */
  async updateFolder(
    folderDTO: FolderDTO,
  ): Promise<Result<boolean, ServiceErrorType>> {
    try {
      const updatedFolder = FolderMapper.toUpdatedEntity(folderDTO);
      await this.folderRepo.updateFolderByID(
        updatedFolder.folderID,
        updatedFolder.folderName,
      );
      return success(true);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: FolderErrorMessages.validateFolderToUpdate,
        });
      } else if (
        error instanceof RepositoryError &&
        error.type === "Update Failed"
      ) {
        return failure({
          type: "Update Failed",
          message: FolderErrorMessages.updateFolder,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: FolderErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Deletes a folder.
   *
   * @param folderId - Number representing the folderID.
   * @returns A Promise resolving to a `Result` containing either `true` or a `ServiceErrorType`.
   */
  async deleteFolder(
    folderId: number,
  ): Promise<Result<boolean, ServiceErrorType>> {
    try {
      const brandedFolderID = folderID.parse(folderId);
      await this.folderRepo.deleteFolderByID(brandedFolderID);
      return success(true);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: FolderErrorMessages.validateFolderToDelete,
        });
      } else if (
        error instanceof RepositoryError &&
        error.type === "Delete Failed"
      ) {
        return failure({
          type: "Delete Failed",
          message: FolderErrorMessages.deleteFolder,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: FolderErrorMessages.unknown,
        });
      }
    }
  }
}
