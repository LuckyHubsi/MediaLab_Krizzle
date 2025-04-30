import { executeQuery, fetchAll } from "@/utils/QueryHelper";
import { insertTagQuery, selectAllTagsQuery } from "@/queries/TagQuery";
import { TagModel } from "@/models/TagModel";
import { TagDTO } from "@/dto/TagDTO";
import { TagMapper } from "@/utils/mapper/TagMapper";
import * as SQLite from "expo-sqlite";
import { DatabaseError } from "@/utils/DatabaseError";

/**
 * Retrieves all tags from the database.
 *
 * @returns {Promise<GeneralPageDTO[]>} A promise that resolves to an array of TagDTO objects.
 */
export const getAllTags = async (
  txn?: SQLite.SQLiteDatabase,
): Promise<TagDTO[]> => {
  const rawTags = await fetchAll<TagModel>(selectAllTagsQuery, [], txn);
  return rawTags.map(TagMapper.toDTO);
};

export const insertTag = async (
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
