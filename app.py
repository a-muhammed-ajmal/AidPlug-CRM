# app.py

import streamlit as st
from main import get_agent_executor

# --- PAGE CONFIG ---
st.set_page_config(page_title="GitHub & Supabase AI Assistant", layout="wide")
st.title("🤖 GitHub & Supabase AI Assistant")
st.write("Your personal AI-powered developer assistant. Ask me anything about your repos or database!")

# --- AGENT INITIALIZATION ---
# Initialize the agent executor only once and store it in session state
if 'agent_executor' not in st.session_state:
    st.session_state.agent_executor = get_agent_executor()

# --- CHAT HISTORY ---
# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# --- USER INPUT & RESPONSE ---
if prompt := st.chat_input("Ask me about your GitHub repos or Supabase data..."):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)

    # Display assistant response in chat message container
    with st.chat_message("assistant"):
        # Show a thinking spinner while the agent works
        with st.spinner("🧠 Thinking..."):
            if st.session_state.agent_executor:
                try:
                    response_obj = st.session_state.agent_executor.invoke({"input": prompt})
                    response = response_obj['output']
                except Exception as e:
                    response = f"An error occurred: {e}"
            else:
                response = "Agent not initialized. Please check the terminal for errors."
            
            st.markdown(response)
    
    # Add assistant response to chat history
    st.session_state.messages.append({"role": "assistant", "content": response})