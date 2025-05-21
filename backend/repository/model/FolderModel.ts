/**
 * Represents a folder used to group content.
 *
 * @property folderID - The unique identifier for the folder.
 * @property folder_name - The name of the folder.
 * @property item_count - The number of widgets that are grouped in the folder.
 *
 */
export type FolderModel = {
  folderID: number;
  folder_name: string;
  item_count: number;
};
