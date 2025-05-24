import { TagDTO } from "@/shared/dto/TagDTO";
import { TagRepository } from "../repository/interfaces/TagRepository.interface";
import { TagMapper } from "../util/mapper/TagMapper";
import { NewTag, Tag } from "../domain/entity/Tag";
import { tagID, TagID } from "../domain/common/IDs";
import { failure, Result, success } from "@/shared/result/Result";
import { RepositoryErrorNew } from "../util/error/RepositoryError";
import errorMap from "zod/lib/locales/en";
import { TagErrorMessages } from "@/shared/error/ErrorMessages";
import { ServiceError } from "../util/error/ServiceError";
import { ServiceErrorType } from "@/shared/error/ServiceError";

/**
 * TagService encapsulates all tag-related application logic.
 *
 * Responsibilities:
 * - Validates and maps incoming TagDTOs.
 * - Delegates persistence operations to TagRepository.
 * - Handles and wraps errors in service-specific error types.
 */
export class TagService {
  // constructor accepts repo instace
  constructor(private tagRepo: TagRepository) {}

  /**
   * Retrieves all tags and maps them to DTOs.
   *
   * @returns A Promise resolving to a `Result` containing either an array of `TagDTO`s or a `ServiceErrorType`.
   */
  async getAllTags(): Promise<Result<TagDTO[], ServiceErrorType>> {
    try {
      const tags = await this.tagRepo.getAllTags();
      return success(tags.map(TagMapper.toDTO));
    } catch (error) {
      if (
        error instanceof RepositoryErrorNew &&
        error.type === "Fetch Failed"
      ) {
        return failure({
          type: "Retrieval Failed",
          message: TagErrorMessages.loadingAllTags,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: TagErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Inserts a new tag based on the provided DTO.
   *
   * @param tagDTO - The data transfer object containing the tag label.
   * @returns A Promise resolving to `true` if the operation succeeds.
   * @throws ServiceError if insertion fails or validation fails.
   */
  async insertTag(tagDTO: TagDTO): Promise<boolean> {
    try {
      const tag: NewTag = TagMapper.toNewEntity(tagDTO);
      await this.tagRepo.insertTag(tag);
      return true;
    } catch (error) {
      throw new ServiceError("Error inserting tag.");
    }
  }

  /**
   * Deletes a tag by its numeric ID.
   *
   * Converts the ID to a branded `TagID` and delegates to the repository.
   *
   * @param tagId - The numeric ID of the tag to delete.
   * @returns A Promise resolving to `true` if the deletion succeeds.
   * @throws ServiceError if parsing or deletion fails.
   */
  async deleteTagByID(tagId: number): Promise<boolean> {
    try {
      const brandedId: TagID = tagID.parse(tagId);
      await this.tagRepo.deleteTag(brandedId);
      return true;
    } catch (error) {
      throw new ServiceError("Error deleting tag.");
    }
  }

  /**
   * Updates an existing tag using data from a DTO.
   *
   * @param tagDTO - The full `TagDTO` with updated label and usage count.
   * @returns A Promise resolving to `true` if the update succeeds.
   * @throws ServiceError if validation or persistence fails.
   */
  async updateTag(tagDTO: TagDTO): Promise<boolean> {
    try {
      const tag: Tag = TagMapper.toUpdatedEntity(tagDTO);

      await this.tagRepo.updateTag(tag);
      return true;
    } catch (error) {
      throw new ServiceError("Error updating tag.");
    }
  }
}
