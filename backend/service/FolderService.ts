import { FolderDTO } from "@/shared/dto/FolderDTO";
import { FolderRepository } from "../repository/interfaces/FolderRepository.interface";
import { NewFolder } from "../domain/entity/Folder";
import { FolderMapper } from "../util/mapper/FolderMapper";
import { ServiceError } from "../util/error/ServiceError";
import { folderID } from "../domain/common/IDs";

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
   * @returns A Promise resolving to the id of the isnerted page if the operation succeeds.
   * @throws ServiceError if insertion fails or validation fails.
   */
  async insertFolder(folderDTO: FolderDTO): Promise<true> {
    try {
      const folder: NewFolder = FolderMapper.toNewEntity(folderDTO);
      await this.folderRepo.insertFolder(folder);
      return true;
    } catch (error) {
      throw new ServiceError("Error inserting folder.");
    }
  }

  /**
   * Retrieves all folders and maps them to DTOs.
   *
   * @returns A Promise resolving to an array of `FolderDTO` objects.
   * @throws ServiceError if retrieval fails.
   */
  async getAllFolders(): Promise<FolderDTO[]> {
    try {
      const folders = await this.folderRepo.getAllFolders();
      return folders.map(FolderMapper.toDTO);
    } catch (error) {
      throw new ServiceError("Error retrieving all folders.");
    }
  }

  /**
   * Retrieves a folder and maps it to a FolderDTO.
   *
   * @returns A Promise resolving to a `FolderDTO` object.
   * @throws ServiceError if retrieval fails.
   */
  async getFolder(folderId: number): Promise<FolderDTO> {
    try {
      const brandedID = folderID.parse(folderId);
      const folder = await this.folderRepo.getFolderByID(brandedID);
      return FolderMapper.toDTO(folder);
    } catch (error) {
      throw new ServiceError("Error retrieving folder.");
    }
  }

  /**
   * Updates a folder.
   *
   * @param folderDTO - `FolderDTO` representing the updated folder data.
   * @returns A Promise resolving to true on success.
   * @throws ServiceError if update fails.
   */
  async updateFolder(folderDTO: FolderDTO): Promise<boolean> {
    try {
      const updatedFolder = FolderMapper.toUpdatedEntity(folderDTO);
      await this.folderRepo.updateFolderByID(
        updatedFolder.folderID,
        updatedFolder.folderName,
      );
      return true;
    } catch (error) {
      throw new ServiceError("Error updating folder.");
    }
  }

  /**
   * Deletes a folder.
   *
   * @param folderId - Number representing the folderID.
   * @returns A Promise resolving to true on success.
   * @throws ServiceError if delete fails.
   */
  async deleteFolder(folderId: number): Promise<boolean> {
    try {
      const brandedFolderID = folderID.parse(folderId);
      await this.folderRepo.deleteFolderByID(brandedFolderID);
      return true;
    } catch (error) {
      throw new ServiceError("Error deleting folder.");
    }
  }
}
