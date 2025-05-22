const insertFolderQuery = `
  INSERT INTO folder (folder_name) VALUES (?);
`;

const selectAllFoldersQuery = `
  SELECT folder.*, COUNT(general_page_data.parent_folderID) AS item_count
  FROM folder
  LEFT JOIN general_page_data ON folder.folderID = general_page_data.parent_folderID
  GROUP BY folder.folderID;
`;

const selectFolderByIDQuery = `
  SELECT folder.*, COUNT(general_page_data.parent_folderID) AS item_count
  FROM folder
  LEFT JOIN general_page_data ON folder.folderID = general_page_data.parent_folderID
  WHERE folder.folderID = ?
  GROUP BY folder.folderID;
`;

const deleteFolderByIDQuery = `
  DELETE FROM folder WHERE folderID = ?;
`;

export {
  insertFolderQuery,
  selectAllFoldersQuery,
  selectFolderByIDQuery,
  deleteFolderByIDQuery,
};
