import {
  createNewFolderSchema,
  NewFolder,
} from "@/backend/domain/entity/Folder";
import { FolderDTO } from "@/shared/dto/FolderDTO";

/**
 * Mapper class for converting between Folder domain entities, DTOs, and database models:
 * - DTO → NewFolder (for creation)
 *
 * This utility handles transformations and validation using Zod schemas,
 * ensuring consistent data structures across layers.
 */

export class FolderMapper {
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
}
