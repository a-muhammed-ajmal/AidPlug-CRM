# watcher.py (FINAL CORRECTED VERSION)

import os
import smtplib
from dotenv import load_dotenv
from supabase import create_client, Client

# --- CONFIGURATION ---
# This uses the secrets you have set in your GitHub repository
GH_PAT = os.getenv("GH_PAT")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
ALERT_EMAIL_SENDER = os.getenv("ALERT_EMAIL_SENDER")
ALERT_EMAIL_PASSWORD = os.getenv("ALERT_EMAIL_PASSWORD")
ALERT_EMAIL_RECIPIENT = os.getenv("ALERT_EMAIL_RECIPIENT")

def get_supabase_performance_warnings(supabase: Client):
    """
    Checks the Supabase database for performance issues like slow queries.
    Returns a string with a list of warnings or a success message.
    """
    try:
        # This is the SQL query that will be executed.
        sql_query_to_run = """
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
        
        # Call the 'eval' function in Supabase, passing the SQL query
        # as the 'query_text' parameter, which matches the final SQL function.
        response = supabase.rpc('eval', {'query_text': sql_query_to_run}).execute()
        
        if not response.data:
            return "✅ No significant performance issues found in the top queries."
        
        warnings = "Found potential performance issues:\n\n"
        for i, row in enumerate(response.data, 1):
            warnings += (
                # Use the 'query' column name, which matches the final SQL function's output.
                f"{i}. Query Snippet: `{row['query'][:100]}...`\n"
                f"   - Average Time: {row['avg_ms']:.2f} ms\n"
                f"   - Total Time Consumed: {row['total_minutes']:.2f} minutes\n"
                f"   - Total Calls: {row['calls']}\n"
                f"   - Suggestion: Consider adding a database index to the columns used in its 'WHERE' or 'JOIN' clauses.\n\n"
            )
        return warnings
    except Exception as e:
        return f"❌ An error occurred while checking database performance: {e}"

def send_alert(subject, body):
    """Sends an email alert using Gmail."""
    if not all([ALERT_EMAIL_SENDER, ALERT_EMAIL_PASSWORD, ALERT_EMAIL_RECIPIENT]):
        print("Email credentials are not fully configured in GitHub Secrets. Cannot send alert.")
        return

    message = f"Subject: {subject}\n\n{body}"
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(ALERT_EMAIL_SENDER, ALERT_EMAIL_PASSWORD)
            server.sendmail(ALERT_EMAIL_SENDER, ALERT_EMAIL_RECIPIENT, message.encode('utf-8'))
        print(f"✅ Alert successfully sent to {ALERT_EMAIL_RECIPIENT}")
    except Exception as e:
        print(f"❌ Failed to send email alert: {e}")

def run_checks():
    """Main function to run all proactive checks."""
    print("--- Starting Proactive Monitor ---")
    
    if not all([SUPABASE_URL, SUPABASE_KEY]):
        print("Supabase URL or Key is missing in GitHub Secrets. Aborting.")
        return

    supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("\nChecking Supabase database performance...")
    perf_warnings = get_supabase_performance_warnings(supabase_client)
    
    if "❌" in perf_warnings or "Found potential performance issues" in perf_warnings:
        print(f"Issue found: {perf_warnings}")
        send_alert("AI Assistant Alert: Supabase Performance Warning", perf_warnings)
    else:
        print(perf_warnings)

    print("\n--- Proactive Monitor Finished ---")

if __name__ == "__main__":
    load_dotenv() 
    run_checks()
