const collectionSelectByPageIdQuery: string = `
    SELECT
    p.*,
    t.*,
    c.collectionID,
    (
        SELECT COUNT(*)
        FROM general_page_data p2
        WHERE p2.pinned = 1
    ) AS pin_count,
    c.item_templateID AS templateID,
    (
        SELECT json_group_array(json_object(
            'collection_categoryID', cc.collection_categoryID,
            'category_name', cc.category_name,
            'collectionID', cc.collectionID
        ))
        FROM (
            SELECT * FROM collection_category
            WHERE collectionID = c.collectionID
            ORDER BY collection_categoryID ASC
        ) cc
    ) AS categories
    FROM general_page_data p
    JOIN collection c ON p.pageID = c.pageID
    LEFT JOIN tag t ON p.tagID = t.tagID
    WHERE p.pageID = ?
    GROUP BY p.pageID, c.collectionID;
`;

const insertCollectionQuery: string = `
    INSERT INTO collection (pageID, item_templateID) 
    VALUES (?, ?)
`;

export { collectionSelectByPageIdQuery, insertCollectionQuery };
