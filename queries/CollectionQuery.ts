// add multiselect options to query
// add categories to query
const collectionSelectByPageIdQuery: string = `
    SELECT 
    p.*, 
    c.collectionID, 
    it.item_templateID AS templateID, 
    it.title AS template_name,
    json_group_array(
      json_object(
        'attributeID', a.attributeID,
        'attribute_label', a.attribute_label,
        'type', a.type,
        'preview', a.preview
      )
    ) AS attributes
    FROM general_page_data p
    JOIN collection c ON p.pageID = c.pageID
    JOIN item_template it ON c.item_templateID = it.item_templateID
    LEFT JOIN attribute a ON it.item_templateID = a.item_templateID
    WHERE p.pageID = ?
    GROUP BY p.pageID
`;

const insertCollection: string = `
    INSERT INTO collection (pageID, item_templateID) 
    VALUES (?, ?)
`;

export {
    collectionSelectByPageIdQuery,
    insertCollection
}