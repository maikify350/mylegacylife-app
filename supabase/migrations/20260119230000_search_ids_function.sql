-- Simplified search function that only returns matching IDs
-- This is used by the two-stage query approach
-- Searches by converting all columns to text and concatenating them

CREATE OR REPLACE FUNCTION search_table_ids(
    p_table_name TEXT,
    p_search_term TEXT
)
RETURNS TABLE(id UUID) AS $$
BEGIN
    -- Simple approach: cast entire row to text and search
    RETURN QUERY EXECUTE format(
        'SELECT t.id FROM %I t WHERE t::text ILIKE %L',
        p_table_name,
        '%' || p_search_term || '%'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION search_table_ids(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_table_ids(TEXT, TEXT) TO anon;
