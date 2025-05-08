import { executeQuery, fetchAll } from "@/utils/QueryHelper";
import {
  deleteTagQuery,
  insertTagQuery,
  selectAllTagsQuery,
  updateTagQuery,
} from "@/queries/TagQuery";
import { TagModel } from "@/models/TagModel";
import { TagDTO } from "@/dto/TagDTO";
import { TagMapper } from "@/utils/mapper/TagMapper";
import * as SQLite from "expo-sqlite";
import { DatabaseError } from "@/utils/DatabaseError";

class TagService {
  /**
   * Retrieves all tags from the database.
   *
   * @param {SQLite.SQLiteDatabase} txn - Optional SQLite transaction object when its called inside a transaction.
   * @returns {Promise<GeneralPageDTO[]>} A promise that resolves to an array of TagDTO objects.
   */
  getAllTags = async (txn?: SQLite.SQLiteDatabase): Promise<TagDTO[]> => {
    try {
      const rawTags = await fetchAll<TagModel>(selectAllTagsQuery, [], txn);
      return rawTags.map(TagMapper.toDTO);
    } catch (error) {
      throw new DatabaseError("Failed to fetch all tags.");
    }
  };

  /**
   * Insert a tag into the database with a user-input tag label.
   *
   * @param {TagDTO} tag - The TagDTO sent from the frontend.
   * @param {SQLite.SQLiteDatabase} txn - Optional SQLite transaction object when its called inside a transaction.
   * @returns {Promise<boolean>} A promise that resolves to true upon successful insertion.
   */
  insertTag = async (
    tag: TagDTO,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<boolean> => {
    try {
      await executeQuery(insertTagQuery, [tag.tag_label], txn);
      return true;
    } catch (error) {
      throw new DatabaseError("Failed to insert add new tag.");
    }
  };

  deleteTagByID = async (tagID: number): Promise<boolean> => {
    try {
      await executeQuery(deleteTagQuery, [tagID]);
      return true;
    } catch (error) {
      throw new DatabaseError("Failed to delete tag.");
    }
  };

  updateTag = async (
    tag: TagDTO,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<boolean> => {
    try {
      await executeQuery(updateTagQuery, [tag.tag_label, tag.tagID], txn);
      return true;
    } catch (error) {
      throw new DatabaseError("Failed to update tag.");
    }
  };
}

export const tagService = new TagService();
