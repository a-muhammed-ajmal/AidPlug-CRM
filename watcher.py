# In watcher.py, replace the get_supabase_performance_warnings function with this:

def get_supabase_performance_warnings(supabase: Client):
    """
    Checks the Supabase database for performance issues like slow queries.
    """
    try:
        # The query text itself remains the same
        query = """
        SELECT
            (total_exec_time / 1000 / 60) as total_minutes,
            (total_exec_time/calls) as avg_ms,
            calls,
            query
        FROM pg_stat_statements
        WHERE total_exec_time > 60000 
        ORDER BY total_exec_time DESC
        LIMIT 5;
        """
        # We call the function with the parameter name 'query_text'
        response = supabase.rpc('eval', {'query_text': query}).execute()
        
        if not response.data:
            return "✅ No significant performance issues found in the top queries."
        
        warnings = "Found potential performance issues:\n\n"
        for i, row in enumerate(response.data, 1):
            warnings += (
                # Use the 'query' column name again
                f"{i}. Query Snippet: `{row['query'][:100]}...`\n"
                f"   - Average Time: {row['avg_ms']:.2f} ms\n"
                f"   - Total Time Consumed: {row['total_minutes']:.2f} minutes\n"
                f"   - Total Calls: {row['calls']}\n"
                f"   - Suggestion: Consider adding a database index.\n\n"
            )
        return warnings
    except Exception as e:
        return f"❌ An error occurred while checking database performance: {e}"
