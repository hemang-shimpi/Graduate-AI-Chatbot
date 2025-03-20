from langchain_ollama import OllamaEmbeddings
from langchain_community.embeddings.bedrock import BedrockEmbeddings
from langchain_ollama import OllamaLLM



def get_embedding_function():
    embeddings = OllamaEmbeddings(model="snowflake-arctic-embed2")
    return embeddings
