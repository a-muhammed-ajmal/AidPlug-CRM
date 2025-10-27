# build_vector_db.py

import os
import shutil
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from git import Repo

# --- CONFIGURATION ---
REPO_URL = "https://github.com/a-muhammed-ajmal/AidPlug-CRM"
REPO_PATH = "./AidPlug-CRM"
DB_PATH = "./chroma_db"
EMBEDDING_MODEL = "all-MiniLM-L6-v2" # A good, small, fast model

def ingest_codebase():
    """Clones a GitHub repo, loads its files, and embeds them into a Chroma vector database."""

    # 1. Clone the repo (or pull latest changes)
    if os.path.exists(REPO_PATH):
        print(f"Pulling latest changes from {REPO_URL}...")
        repo = Repo(REPO_PATH)
        repo.remotes.origin.pull()
    else:
        print(f"Cloning {REPO_URL}...")
        Repo.clone_from(REPO_URL, REPO_PATH)

    # 2. Load all relevant files from the cloned repo
    print("Loading documents from the repository...")
    # You can add more glob patterns to include other file types
    loader = DirectoryLoader(REPO_PATH, glob="**/*.{py,js,html,md}", loader_cls=TextLoader)
    documents = loader.load()

    # 3. Split documents into smaller chunks
    print("Splitting documents into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.split_documents(documents)

    # 4. Create embeddings and store in ChromaDB
    print(f"Creating embeddings with '{EMBEDDING_MODEL}'...")
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

    # If the DB already exists, delete it to rebuild fresh
    if os.path.exists(DB_PATH):
        print("Removing old vector database...")
        shutil.rmtree(DB_PATH)

    print(f"Ingesting {len(texts)} chunks into ChromaDB at {DB_PATH}...")
    db = Chroma.from_documents(texts, embeddings, persist_directory=DB_PATH)
    print("✅ Ingestion complete!")

if __name__ == "__main__":
    ingest_codebase()