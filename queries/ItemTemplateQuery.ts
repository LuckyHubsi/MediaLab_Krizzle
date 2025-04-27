const insertItemTemplate: string = `
    INSERT INTO item_template (title) VALUES (?)
`;

const selectItemTemplateByTemplateIDQuery: string = `
    SELECT 
        it.*,
        json_group_array(
            DISTINCT json_patch(
                json_object(
                    'attributeID', a.attributeID,
                        'attribute_label', a.attribute_label,
                        'type', a.type,
                        'preview', a.preview
                    ),
                    CASE
                        WHEN a.type = 'multi-select' THEN json_object(
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
        ) AS attributes
    FROM item_template it
    LEFT JOIN attribute a ON it.item_templateID = a.item_templateID
    WHERE it.item_templateID = ?;
`;

export { insertItemTemplate, selectItemTemplateByTemplateIDQuery };
