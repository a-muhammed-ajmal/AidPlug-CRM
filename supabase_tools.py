# supabase_tools.py

import os
import json
from supabase import create_client, Client
from langchain.tools import tool

# Initialize the Supabase client once using credentials from the .env file
try:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    supabase: Client = create_client(url, key)
    print("Supabase client initialized for URL: {}".format(url))
except Exception as e:
    print("Error initializing Supabase client: {}".format(e))
    supabase = None

@tool
def query_supabase_table(table_name: str, select_query: str = "*", limit: int = 10):
    """
    Queries a specified table in Supabase.
    
    Args:
        table_name (str): The name of the table to query.
        select_query (str): The columns to select (e.g., 'id, name'). Defaults to '*'.
        limit (int): Max number of rows to return.
    """
    if not supabase: return "Supabase client not initialized."
    try:
        response = supabase.table(table_name).select(select_query).limit(limit).execute()
        return f"📊 Query results from '{table_name}':\n" + json.dumps(response.data, indent=2)
    except Exception as e: return f"❌ Error querying '{table_name}': {e}"

@tool
def insert_into_supabase(table_name: str, data_json: str):
    """
    Inserts a new record into a Supabase table.
    
    Args:
        table_name (str): The name of the table.
        data_json (str): A JSON string representing the data to insert (e.g., '{"name": "Bob", "email": "bob@example.com"}').
    """
    if not supabase: return "Supabase client not initialized."
    try:
        data_to_insert = json.loads(data_json)
        response = supabase.table(table_name).insert(data_to_insert).execute()
        return f"✅ Successfully inserted into '{table_name}':\n" + json.dumps(response.data, indent=2)
    except Exception as e: return f"❌ Error inserting into '{table_name}': {e}"

@tool
def update_supabase_record(table_name: str, filter_column: str, filter_value: str, update_data_json: str):
    """
    Updates an existing record in a Supabase table based on a filter.
    
    Args:
        table_name (str): The name of the table.
        filter_column (str): The column to filter by (e.g., 'id').
        filter_value (str): The value to match in the filter column (e.g., '5').
        update_data_json (str): A JSON string with the data to update (e.g., '{"status": "inactive"}').
    """
    if not supabase: return "Supabase client not initialized."
    try:
        update_data = json.loads(update_data_json)
        response = supabase.table(table_name).update(update_data).eq(filter_column, filter_value).execute()
        return f"✅ Successfully updated record(s) in '{table_name}':\n" + json.dumps(response.data, indent=2)
    except Exception as e: return f"❌ Error updating '{table_name}': {e}"

@tool
def delete_supabase_record(table_name: str, filter_column: str, filter_value: str):
    """
    Deletes a record from a Supabase table based on a filter.
    
    Args:
        table_name (str): The name of the table.
        filter_column (str): The column to filter by (e.g., 'id').
        filter_value (str): The value to match for deletion (e.g., '10').
    """
    if not supabase: return "Supabase client not initialized."
    try:
        response = supabase.table(table_name).delete().eq(filter_column, filter_value).execute()
        return f"🗑️ Successfully deleted {len(response.data)} record(s) from '{table_name}'."
    except Exception as e: return f"❌ Error deleting from '{table_name}': {e}"

@tool
def search_supabase_table(table_name: str, filter_column: str, filter_value: str):
    """
    Searches for records in a Supabase table where a column matches a specific value.
    
    Args:
        table_name (str): The name of the table.
        filter_column (str): The column to search in (e.g., 'email').
        filter_value (str): The value to search for (e.g., 'alice@example.com').
    """
    if not supabase: return "Supabase client not initialized."
    try:
        response = supabase.table(table_name).select().eq(filter_column, filter_value).execute()
        return f"🔍 Found {len(response.data)} record(s) in '{table_name}':\n" + json.dumps(response.data, indent=2)
    except Exception as e: return f"❌ Error searching '{table_name}': {e}"

@tool
def count_supabase_records(table_name: str, filter_column: str = None, filter_value: str = None):
    """
    Counts records in a Supabase table, optionally with a filter.

    Args:
        table_name (str): The name of the table.
        filter_column (str): Optional column to filter by.
        filter_value (str): Optional value to match in the filter column.
    """
    if not supabase: return "Supabase client not initialized."
    try:
        query = supabase.table(table_name).select('*', count='exact')
        if filter_column and filter_value:
            query = query.eq(filter_column, filter_value)
        response = query.execute()
        return f"🔢 '{table_name}' has {response.count} record(s)."
    except Exception as e: return f"❌ Error counting records in '{table_name}': {e}"

@tool
def get_supabase_performance_warnings():
    """
    Useful for checking the Supabase database for performance issues.
    It looks for slow queries that might be missing an index or are inefficient.
    Returns a list of potential problems or a message saying everything looks okay.
    """
    if not supabase: return "Supabase client not initialized."
    try:
        # This query checks for queries that have a high total execution time
        # and are called frequently, which often indicates a performance bottleneck.
        query = """
        SELECT
            (total_exec_time / 1000 / 60) as total_minutes,
            (total_exec_time/calls) as avg_ms,
            calls,
            query
        FROM pg_stat_statements
        WHERE total_exec_time > 60000 -- More than 1 minute total
        ORDER BY total_exec_time DESC
        LIMIT 5;
        """
        # We use rpc() to call a raw SQL function. We wrap our query in a function.
        response = supabase.rpc('eval', {'query': query}).execute()

        if not response.data:
            return "✅ No significant performance issues found in the top queries."

        warnings = "Found potential performance issues:\n"
        for row in response.data:
            warnings += (
                f"- Query: `{row['query'][:100]}...`\n"
                f"  - Average Time: {row['avg_ms']:.2f} ms\n"
                f"  - Total Time: {row['total_minutes']:.2f} minutes\n"
                f"  - Called: {row['calls']} times\n"
                f"  - Suggestion: This query is slow or called often. Consider adding an index to the columns in the 'WHERE' or 'JOIN' clauses.\n"
            )
        return warnings
    except Exception as e:
        return f"❌ Error checking performance: {e}"
