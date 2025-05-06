const selectAllTagsQuery = `
  SELECT tag.*, COUNT(general_page_data.tagID) AS usage_count
  FROM tag
  LEFT JOIN general_page_data ON tag.tagID = general_page_data.tagID
  GROUP BY tag.tagID
  ORDER BY usage_count DESC;
`;

const insertTagQuery = `
  INSERT INTO tag (tag_label) VALUES (?);
`;

const deleteTagQuery = `
  DELETE FROM tag WHERE tagID = ?
`;

const updateTagQuery = `
  UPDATE tag
  SET tag_label = ?
  WHERE tagID = ?;
`;

export { selectAllTagsQuery, insertTagQuery, deleteTagQuery, updateTagQuery };
