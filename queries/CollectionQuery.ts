const collectionSelectByPageIdQuery: string = `
  SELECT
    p.*,
    c.collectionID,
    it.item_templateID AS templateID,
    it.title AS template_name,
    json_group_array(
      DISTINCT json_patch(
        json_object(
            'attributeID', a.attributeID,
                'attribute_label', a.attribute_label,
                'type', a.type,
                'preview', a.preview
            ),
            CASE
                WHEN a.type = 'multiselect' THEN json_object(
                    'options', (
                        SELECT
                            json_group_array(mo.options)
                        FROM
                            multiselect_options mo
                        WHERE
                            mo.attributeID = a.attributeID
                    )
                )
                ELSE json_object()
            END
        )
    ) AS attributes,
    json_group_array(
        DISTINCT json_object(
            'collection_categoryID', cc.collection_categoryID,
            'category_name', cc.category_name,
            'collectionID', cc.collectionID
        )
    ) AS categories
FROM general_page_data p
JOIN collection c ON p.pageID = c.pageID
JOIN item_template it ON c.item_templateID = it.item_templateID
LEFT JOIN attribute a ON it.item_templateID = a.item_templateID
LEFT JOIN collection_category cc ON c.collectionID = cc.collectionID
WHERE p.pageID = ?
GROUP BY p.pageID, c.collectionID, it.item_templateID, it.title;
`;

const insertCollection: string = `
    INSERT INTO collection (pageID, item_templateID) 
    VALUES (?, ?)
`;

export { collectionSelectByPageIdQuery, insertCollection };
