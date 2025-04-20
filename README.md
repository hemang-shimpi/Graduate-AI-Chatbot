# 🤖 Graduate AI Chatbot

**An LLM-powered chatbot designed to assist prospective graduate students with application processes and FAQs at Georgia State University.**

![Chatbot Demo](https://github.com/hemang-shimpi/Graduate-AI-Chatbot/blob/main/chatbot%20demo.png?raw=true)

---

## 🔗 Live Demo

🌐 [http://askpounce.me/](http://askpounce.me/)

---

## 🚀 Features

- **Conversational UI** built with React
- **LLM Integration** using Google Gemini via LangChain
- **Semantic Search** with ChromaDB
- **Containerized Deployment** using Docker
- **API Testing** with Postman

---

## 🛠️ Tech Stack

| Logo | Tech |
|------|------|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="24"/> | React (Frontend) |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="24"/> | Python (Backend) |
| <img src="https://www.vectorlogo.zone/logos/langchainai/langchainai-icon.svg" width="24"/> | LangChain |
| <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Gemini_logo.svg" width="24"/> | Google Gemini |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" width="24"/> | Postman |

---

## 🧪 Getting Started

### Prerequisites

- Python 3.x
- Node.js & npm
- (Optional) Docker

### Setup Instructions

# Clone the repo
git clone https://github.com/hemang-shimpi/Graduate-AI-Chatbot.git
cd Graduate-AI-Chatbot

# Set up virtual environment
python -m venv chatbot_venv
source chatbot_venv/bin/activate  # On Windows: chatbot_venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd frontend
npm install
npm start  # Starts the React dev server

# In another terminal, run the backend
cd ..
python app.py
