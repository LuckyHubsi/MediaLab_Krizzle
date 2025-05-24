import { NewTag, Tag } from "@/backend/domain/entity/Tag";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { TagRepository } from "../interfaces/TagRepository.interface";
import {
  deleteTagQuery,
  insertTagQuery,
  selectAllTagsQuery,
  updateTagQuery,
} from "../query/TagQuery";
import { TagMapper } from "@/backend/util/mapper/TagMapper";
import { TagModel } from "../model/TagModel";
import {
  RepositoryError,
  RepositoryErrorNew,
} from "@/backend/util/error/RepositoryError";
import { TagID } from "@/backend/domain/common/IDs";
import * as SQLite from "expo-sqlite";

/**
 * Implementation of the TagRepository interface using SQL queries.
 *
 * Handles the following operations:
 * - Fetching all tags from the database.
 * - Inserting a new tag.
 * - Updating an existing tag.
 * - Deleting a tag by ID.
 */
export class TagRepositoryImpl
  extends BaseRepositoryImpl
  implements TagRepository
{
  // constructor accepts database instace
  constructor(db: SQLite.SQLiteDatabase) {
    super(db);
  }

  /**
   * Retrieves all tags from the database and returns the validated tags.
   *
   * @returns A Promise resolving to an array of `Tag` domain entities.
   * @throws RepositoryErrorNew if the fetch fails.
   */
  async getAllTags(): Promise<Tag[]> {
    try {
      const result = await this.fetchAll<TagModel>(selectAllTagsQuery);
      const validTags: Tag[] = [];

      for (const model of result) {
        try {
          const tag = TagMapper.toEntity(model);
          validTags.push(tag);
        } catch (err) {
          // skipping invalide tags (tags that failed to be mapped to the domain entity)
          continue;
        }
      }

      return validTags;
    } catch (error) {
      throw new RepositoryErrorNew("Fetch Failed");
    }
  }

  /**
   * Inserts a new tag into the database.
   *
   * @param tag - A `NewTag` object containing the tag label.
   * @returns A Promise resolving to `true` if insertion succeeded.
   * @throws RepositoryError if the insertion fails.
   */
  async insertTag(tag: NewTag): Promise<boolean> {
    try {
      await this.executeQuery(insertTagQuery, [tag.tagLabel]);
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to insert tag.");
    }
  }

  /**
   * Deletes a tag from the database by ID.
   *
   * @param tagID - The ID of the tag to delete.
   * @returns A Promise resolving to `true` if deletion succeeded.
   * @throws RepositoryError if the deletion fails.
   */
  async deleteTag(tagID: TagID): Promise<boolean> {
    try {
      await this.executeQuery(deleteTagQuery, [tagID]);
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to delete tag.");
    }
  }

  /**
   * Updates an existing tag in the database.
   *
   * @param tag - A full `Tag` object with updated data.
   * @returns A Promise resolving to `true` if the update succeeded.
   * @throws RepositoryError if the update fails.
   */
  async updateTag(tag: Tag): Promise<boolean> {
    try {
      const model: TagModel = TagMapper.toModel(tag);
      await this.executeQuery(updateTagQuery, [model.tag_label, model.tagID]);
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to update tag.");
    }
  }
}
