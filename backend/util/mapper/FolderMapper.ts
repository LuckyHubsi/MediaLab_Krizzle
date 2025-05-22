import {
  createNewFolderSchema,
  Folder,
  folderSchema,
  NewFolder,
} from "@/backend/domain/entity/Folder";
import { FolderModel } from "@/backend/repository/model/FolderModel";
import { FolderDTO } from "@/shared/dto/FolderDTO";

/**
 * Mapper class for converting between Folder domain entities, DTOs, and database models:
 * - DTO → NewFolder (for creation)
 * - DB Model → Folder
 * - Domain Entity → DTO
 *
 * This utility handles transformations and validation using Zod schemas,
 * ensuring consistent data structures across layers.
 */

export class FolderMapper {
  /**
   * Maps a Folder domain entity to a FolderDTO.
   *
   * @param entity - The `Folder` domain entity.
   * @returns A corresponding `FolderDTO` object.
   */
  static toDTO(entity: Folder): FolderDTO {
    return {
      folderID: entity.folderID,
      folderName: entity.folderName,
      itemCount: entity.itemCount,
    };
  }

  /**
   * Maps a FolderDTO to a NewFolder, used when creating a new Folder.
   *
   * @param dto - The incoming DTO.
   * @returns A validated `NewFolder` object.
   * @throws Error if validation fails.
   */
  static toNewEntity(dto: FolderDTO): NewFolder {
    try {
      return createNewFolderSchema.parse({
        folderName: dto.folderName,
      });
    } catch (error: any) {
      console.error("Error mapping FolderDTO to New Entity:", error.issues);
      throw new Error("Failed to map FolderDTO to New Entity");
    }
  }

  /**
   * Maps a FolderModel from the db to a Folder domain entity.
   *
   * @param model - The raw FolderModel from the DB.
   * @returns A validated `Folder` domain entity.
   * @throws Error if validation fails.
   */
  static toEntity(model: FolderModel): Folder {
    try {
      return folderSchema.parse({
        folderID: model.folderID,
        folderName: model.folder_name,
        itemCount: model.item_count,
      });
    } catch (error: any) {
      console.error("Error mapping FolderModel to Entity:", error.issues);
      throw new Error("Failed to map FolderModel to Entity");
    }
  }
}
