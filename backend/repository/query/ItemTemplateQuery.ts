const insertItemTemplateQuery: string = `
    INSERT INTO item_template (title) VALUES (?)
`;

const selectItemTemplateByTemplateIDQuery: string = `
    SELECT 
    it.*,
    json_group_array(
        json_object(
            'attributeID', a.attributeID,
            'attribute_label', a.attribute_label,
            'type', a.type,
            'preview', a.preview,
            'options', 
                CASE 
                    WHEN a.type = 'multi-select' THEN (
                        SELECT mo.options
                        FROM multiselect_options mo
                        WHERE mo.attributeID = a.attributeID
                        LIMIT 1
                    )
                    ELSE NULL 
                END,
            'symbol', 
                CASE 
                    WHEN a.type = 'rating' THEN (
                        SELECT rs.symbol
                        FROM rating_symbol rs
                        WHERE rs.attributeID = a.attributeID
                        LIMIT 1
                    ) 
                    ELSE NULL 
                END
            )
        ) AS attributes
    FROM item_template it
    LEFT JOIN attribute a ON it.item_templateID = a.item_templateID
    WHERE it.item_templateID = ?;
`;

export { insertItemTemplateQuery, selectItemTemplateByTemplateIDQuery };
