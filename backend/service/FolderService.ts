import { FolderDTO } from "@/shared/dto/FolderDTO";
import { folderRepository } from "../repository/implementation/FolderRepository.implentation";
import { FolderRepository } from "../repository/interfaces/FolderRepository.interface";
import { NewFolder } from "../domain/entity/Folder";
import { FolderMapper } from "../util/mapper/FolderMapper";
import { ServiceError } from "../util/error/ServiceError";

/**
 * FolderService encapsulates all folder-related application logic.
 *
 * Responsibilities:
 * - Validates and maps incoming FolderDTOs.
 * - Delegates persistence operations to FolderRepository.
 * - Handles and wraps errors in service-specific error types.
 */
export class FolderService {
  constructor(private folderRepo: FolderRepository = folderRepository) {}

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
}

// Singleton instance of the FolderService.
export const folderService = new FolderService();
