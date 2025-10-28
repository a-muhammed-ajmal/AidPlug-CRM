# github_tools.py

import os
from github import Github, GithubException
from langchain.tools import tool

# Initialize the Github object once using the token from the .env file
try:
    g = Github(os.getenv("GH_ACCESS_TOKEN"))
    user = g.get_user()
    print("GitHub connected as: {}".format(user.login))
except Exception as e:
    print("Error initializing GitHub client: {}".format(e))
    g = None
    user = None

@tool
def list_github_repositories(filter_type: str = "all"):
    """
    Lists the user's GitHub repositories with details.
    
    Args:
        filter_type (str): Filter repos by 'all', 'public', 'private', or 'sources' (excludes forks). Defaults to 'all'.
    """
    if not user: return "GitHub client not initialized. Check your access token."
    try:
        repos = user.get_repos(type=filter_type)
        repo_list = [f"• {repo.name} ({'🔒private' if repo.private else '🌐public'}) ⭐{repo.stargazers_count}" for repo in repos]
        return "\n".join(repo_list) if repo_list else f"No {filter_type} repositories found."
    except Exception as e: return f"Error listing repositories: {e}"

@tool
def get_repo_file_content(repo_name: str, file_path: str, branch: str = "main"):
    """
    Reads the content of a specific file from a GitHub repository.
    
    Args:
        repo_name (str): Repository name (e.g., 'my-website').
        file_path (str): Full path to the file (e.g., 'README.md' or 'src/main.py').
        branch (str): Branch name, defaults to 'main'.
    """
    if not user: return "GitHub client not initialized."
    try:
        repo = g.get_repo(f"{user.login}/{repo_name}")
        content = repo.get_contents(file_path, ref=branch)
        return content.decoded_content.decode('utf-8')
    except GithubException as e:
        if e.status == 404: return f"❌ File '{file_path}' or repository '{repo_name}' not found."
        return f"GitHub error: {e}"
    except Exception as e: return f"Unexpected error: {e}"

@tool
def list_repo_files(repo_name: str, path: str = "", branch: str = "main"):
    """
    Lists all files and folders in a repository directory.
    
    Args:
        repo_name (str): Repository name (e.g., 'my-website').
        path (str): Directory path within repo (empty string for root).
        branch (str): Branch name, defaults to 'main'.
    """
    if not user: return "GitHub client not initialized."
    try:
        repo = g.get_repo(f"{user.login}/{repo_name}")
        contents = repo.get_contents(path, ref=branch)
        file_list = [f"📄 {c.name}" if c.type == 'file' else f"📁 {c.name}/" for c in contents]
        return "\n".join(file_list)
    except GithubException as e:
        if e.status == 404: return f"❌ Path '{path}' not found in '{repo_name}'."
        return f"GitHub error: {e}"
    except Exception as e: return f"Unexpected error: {e}"

@tool
def get_repo_info(repo_name: str):
    """
    Gets detailed information about a specific repository.
    
    Args:
        repo_name (str): Repository name (e.g., 'my-website').
    """
    if not user: return "GitHub client not initialized."
    try:
        repo = g.get_repo(f"{user.login}/{repo_name}")
        info = (
            f"📂 Repository: {repo.full_name}\n"
            f"Description: {repo.description}\n"
            f"Language: {repo.language}, Stars: ⭐{repo.stargazers_count}, Forks: {repo.forks_count}"
        )
        return info
    except GithubException as e:
        if e.status == 404: return f"❌ Repository '{repo_name}' not found."
        return f"GitHub error: {e}"
    except Exception as e: return f"Unexpected error: {e}"

@tool
def get_recent_commits(repo_name: str, limit: int = 5):
    """
    Gets recent commits from a repository.
    
    Args:
        repo_name (str): Repository name (e.g., 'my-website').
        limit (int): Maximum number of commits to return (default: 5).
    """
    if not user: return "GitHub client not initialized."
    try:
        repo = g.get_repo(f"{user.login}/{repo_name}")
        commits = repo.get_commits()
        commit_list = []
        for i, commit in enumerate(commits):
            if i >= limit: break
            msg = commit.commit.message.split('\n')[0]
            author = commit.commit.author.name
            date = commit.commit.author.date.strftime('%Y-%m-%d')
            commit_list.append(f"[{date}] {msg} - by {author}")
        return "\n".join(commit_list)
    except GithubException as e: return f"GitHub error: {e}"
    except Exception as e: return f"Unexpected error: {e}"
