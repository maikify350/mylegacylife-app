-- Add search RPC function for table explorer
-- This allows full-text search across all columns in any table

CREATE OR REPLACE FUNCTION search_table_data(
    p_table_name TEXT,
    p_search_term TEXT,
    p_page INT DEFAULT 1,
    p_per_page INT DEFAULT 10
)
RETURNS JSON AS $$
DECLARE
    v_offset INT;
    v_total BIGINT;
    v_filtered BIGINT;
    v_data JSON;
BEGIN
    -- Calculate offset
    v_offset := (p_page - 1) * p_per_page;
    
    -- Get total count (without filter)
    EXECUTE format('SELECT COUNT(*) FROM %I', p_table_name) INTO v_total;
    
    -- Build and execute search query
    IF p_search_term IS NOT NULL AND p_search_term != '' THEN
        -- Count filtered results
        EXECUTE format(
            'SELECT COUNT(*) FROM %I t WHERE EXISTS (
                SELECT 1 FROM jsonb_each_text(to_jsonb(t.*)) 
                WHERE value ILIKE %L
            )',
            p_table_name,
            '%' || p_search_term || '%'
        ) INTO v_filtered;
        
        -- Get filtered data
        EXECUTE format(
            'SELECT COALESCE(json_agg(t.*), ''[]''::json) FROM (
                SELECT * FROM %I t WHERE EXISTS (
                    SELECT 1 FROM jsonb_each_text(to_jsonb(t.*)) 
                    WHERE value ILIKE %L
                ) ORDER BY created_at DESC LIMIT %s OFFSET %s
            ) t',
            p_table_name,
            '%' || p_search_term || '%',
            p_per_page,
            v_offset
        ) INTO v_data;
    ELSE
        -- No filter
        v_filtered := v_total;
        
        -- Get all data (with COALESCE to handle empty results)
        EXECUTE format(
            'SELECT COALESCE(json_agg(t.*), ''[]''::json) FROM (
                SELECT * FROM %I ORDER BY created_at DESC LIMIT %s OFFSET %s
            ) t',
            p_table_name,
            p_per_page,
            v_offset
        ) INTO v_data;
    END IF;
    
    -- Return combined result
    RETURN json_build_object(
        'data', v_data,
        'total', v_total,
        'filtered', v_filtered
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION search_table_data(TEXT, TEXT, INT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_table_data(TEXT, TEXT, INT, INT) TO anon;
