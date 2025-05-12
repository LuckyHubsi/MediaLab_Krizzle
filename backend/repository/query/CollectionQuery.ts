const collectionSelectByPageIdQuery: string = `
    SELECT
        p.*,
        c.collectionID,
        (
            SELECT COUNT(*)
            FROM general_page_data p
            WHERE p.pinned = 1
        ) AS pin_count,
        c.item_templateID AS templateID,
        json_group_array(
            DISTINCT json_object(
                'collection_categoryID', cc.collection_categoryID,
                'category_name', cc.category_name,
                'collectionID', cc.collectionID
            )
        ) AS categories
    FROM general_page_data p
    JOIN collection c ON p.pageID = c.pageID
    LEFT JOIN collection_category cc ON c.collectionID = cc.collectionID
    WHERE p.pageID = ?
    GROUP BY p.pageID, c.collectionID;
`;

const insertCollectionQuery: string = `
    INSERT INTO collection (pageID, item_templateID) 
    VALUES (?, ?)
`;

export { collectionSelectByPageIdQuery, insertCollectionQuery };
