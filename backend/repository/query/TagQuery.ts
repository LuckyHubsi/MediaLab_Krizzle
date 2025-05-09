const selectAllTagsQuery = `
  SELECT tag.*, COUNT(general_page_data.tagID) AS usage_count
  FROM tag
  LEFT JOIN general_page_data ON tag.tagID = general_page_data.tagID
  GROUP BY tag.tagID
  ORDER BY usage_count DESC;
`;

export { selectAllTagsQuery };
