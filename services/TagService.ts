import { fetchAll } from "@/utils/QueryHelper";
import { selectAllTagsQuery } from "@/queries/TagQuery";
import { TagModel } from "@/models/TagModel";
import { TagDTO } from "@/dto/TagDTO";
import { TagMapper } from "@/utils/mapper/TagMapper";
import * as SQLite from "expo-sqlite";

class TagService {
  /**
   * Retrieves all tags from the database.
   *
   * @returns {Promise<GeneralPageDTO[]>} A promise that resolves to an array of TagDTO objects.
   */
  getAllTags = async (txn?: SQLite.SQLiteDatabase): Promise<TagDTO[]> => {
    const rawTags = await fetchAll<TagModel>(selectAllTagsQuery, [], txn);
    return rawTags.map(TagMapper.toDTO);
  };
}

export const tagService = new TagService();
