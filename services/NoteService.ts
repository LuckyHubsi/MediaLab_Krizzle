import {
  insertNoteQuery,
  selectPageIDByNoteIDQuery,
  updateNoteContentQuery,
} from "@/queries/NoteQuery";
import { insertGeneralPageAndReturnID } from "./GeneralPageService";
import { executeQuery, fetchFirst } from "@/utils/QueryHelper";
import { NoteDTO } from "@/dto/NoteDTO";
import { NoteMapper } from "@/utils/mapper/NoteMapper";
import {
  selectNoteByPageIDQuery,
  updateDateModifiedByPageIDQuery,
} from "@/queries/GeneralPageQuery";
import { NoteModel } from "@/models/NoteModel";
import { PageType } from "@/utils/enums/PageType";
import * as SQLite from "expo-sqlite";

/**
 * Inserts a new note into the database.
 *
 * @param {NoteDTO} NoteDTO - The DTO representing the note to insert.
 * @returns {Promise<number | null>} A promise that resolves to the inserted note's ID, or null if the insertion fails.
 */
const insertNote = async (
  noteDTO: NoteDTO,
  txn?: SQLite.SQLiteDatabase,
): Promise<number | null> => {
  try {
    // first inserts the general page data and returns the pageID
    const pageID = await insertGeneralPageAndReturnID(noteDTO, txn);

    await executeQuery(insertNoteQuery, [noteDTO.note_content, pageID], txn);

    return pageID;
  } catch (error) {
    console.error("Error inserting note:", error);
    return null;
  }
};

/**
 * Retrieves a note's data by its associated page ID.
 * Fetches the NoteModel from the database and maps it to a NoteDTO if the page type is 'note'.
 *
 * @param pageID - The unique identifier of the page to retrieve.
 * @returns A Promise that resolves to a NoteDTO if the page is a note, or null if not found or not a note.
 */
const getNoteDataByPageID = async (
  pageID: number,
  txn?: SQLite.SQLiteDatabase,
): Promise<NoteDTO | null> => {
  const noteData = await fetchFirst<NoteModel>(
    selectNoteByPageIDQuery,
    [pageID],
    txn,
  );

  if (!noteData) return null;
  if (noteData.page_type === PageType.Note) {
    return NoteMapper.toDTO(noteData);
  }
  return null;
};

/**
 * Updates the content of a note and updates the corresponding page's `date_modified` timestamp.
 *
 * @param noteID - The unique identifier of the note to update.
 * @param newNoteContent - The new content to save for the note.
 * @returns A Promise that resolves to `true` if the update was successful, or `false` if an error occurred.
 */
const updateNoteContent = async (
  pageID: number,
  newNoteContent: string,
  txn?: SQLite.SQLiteDatabase,
): Promise<boolean> => {
  try {
    if (!pageID) {
      console.error("Page ID not found for the given note ID");
      return false;
    }

    // update the note content
    await executeQuery(updateNoteContentQuery, [newNoteContent, pageID], txn);

    // update the date_modified for the general page data
    await executeQuery(
      updateDateModifiedByPageIDQuery,
      [new Date().toISOString(), pageID],
      txn,
    );

    return true;
  } catch (error) {
    console.error("Error updating note content:", error);
    return false;
  }
};

/**
 * Retrieves the page ID associated with a given note ID.
 *
 * @param noteID - The unique identifier of the note.
 * @returns A Promise that resolves to the page ID if found, or `null` if not found or an error occurred.
 */
const getPageIDForNote = async (noteID: number): Promise<number | null> => {
  try {
    const result = await fetchFirst<{ pageID: number }>(
      selectPageIDByNoteIDQuery,
      [noteID],
    );
    return result?.pageID ?? null;
  } catch (error) {
    console.error("Error fetching pageID for note:", error);
    return null;
  }
};

export { insertNote, getNoteDataByPageID, updateNoteContent };
