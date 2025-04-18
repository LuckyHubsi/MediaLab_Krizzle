import { fetchAll } from "@/utils/QueryHelper";
import { selectAllTagsQuery } from "@/queries/TagQuery";
import { TagModel } from "@/models/TagModel";
import { TagDTO } from "@/dto/TagDTO";
import { TagMapper } from "@/utils/mapper/TagMapper";

/**
 * Retrieves all tags from the database.
 *
 * @returns {Promise<GeneralPageDTO[]>} A promise that resolves to an array of TagDTO objects.
 */
export const getAllTags = async (): Promise<TagDTO[]> => {
  const rawTags = await fetchAll<TagModel>(selectAllTagsQuery);
  return rawTags.map(TagMapper.toDTO);
};
