/**
 * Data Transfer Object for a folder.
 * Used for transferring folder data between the backend and frontend.
 *
 * @property folderD - Unique identifier of the folder.
 * @property folderName - The name of the folder.
 * @property itemcount - The number of widgets that are grouped in the folder.
 */
export type FolderDTO = {
  folderID?: number;
  folderName: string;
  itemCount?: number;
};
