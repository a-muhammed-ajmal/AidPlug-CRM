# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Stack
- Python 3.13+ AI assistant using LangChain and Ollama
- Integrates with GitHub API and Supabase database
- Uses llama3 model for local AI processing

## Key Commands
- Run assistant: `python main.py`
- Setup (Windows): `setup.bat`
- Setup (Mac/Linux): `bash setup.sh`

## Non-Obvious Patterns
- Environment variables loaded from .env file using python-dotenv
- GitHub client initialized once at module level in github_tools.py
- Supabase client initialized once at module level in supabase_tools.py
- All tools use @tool decorator from langchain.tools
- Agent uses hwchase17/react prompt from LangChain Hub
- Verbose mode enabled for debugging AI thoughts
- Max iterations set to 10 to prevent infinite loops
- Handle parsing errors gracefully in agent executor

## Code Style
- Functions use descriptive docstrings with Args and return descriptions
- Error handling with try/except blocks and specific error messages
- Print statements for initialization status and user feedback
- Consistent emoji usage in status messages (✅, ❌, 🤖, etc.)
- Tool functions return formatted strings with emojis and structured data