# main.py (MODIFIED FOR REUSABILITY)

import os
from dotenv import load_dotenv

# Load environment variables FIRST
load_dotenv()

# Import all our tools and libraries
from github_tools import *
from supabase_tools import *
from langchain_community.llms import Ollama
from langchain.agents import AgentExecutor, create_react_agent
from langchain import hub

def get_agent_executor():
    """
    This function sets up and returns the AI agent executor.
    We can now call this from other scripts.
    """
    print("Initializing AI Agent Executor...")

    try:
        llm = Ollama(model="llama3", temperature=0)
    except Exception as e:
        print(f"\nError: Could not connect to Ollama. {e}")
        return None

    tools = [
        list_github_repositories,
        get_repo_file_content,
        list_repo_files,
        get_repo_info,
        get_recent_commits,
        query_supabase_table,
        insert_into_supabase,
        update_supabase_record,
        delete_supabase_record,
        search_supabase_table,
        count_supabase_records,
        get_supabase_performance_warnings,
    ]

    prompt = hub.pull("hwchase17/react")
    agent = create_react_agent(llm, tools, prompt)
    
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        handle_parsing_errors=True,
        max_iterations=10
    )
    return agent_executor

# This block now only runs if you execute "python main.py" directly
if __name__ == "__main__":
    agent_executor = get_agent_executor()
    
    if agent_executor:
        print("="*60)
        print("CLI Assistant is ready! Welcome to your GitHub & Supabase AI.")
        print("="*60)
        print("Type your requests below, or 'exit' to quit.")
        print("-" * 60)

        while True:
            user_input = input("You: ")
            if user_input.lower() in ["exit", "quit"]:
                print("Goodbye!")
                break
            
            try:
                result = agent_executor.invoke({"input": user_input})
                print(f"AI: {result['output']}")
            except Exception as e:
                print(f"\nAn unexpected error occurred: {e}")
            
            print("-" * 60)