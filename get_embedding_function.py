from langchain_ollama import OllamaEmbeddings
from langchain_community.embeddings.bedrock import BedrockEmbeddings
from langchain_ollama import OllamaLLM
import chromadb.utils.embedding_functions as embedding_functions



def get_embedding_function():
    embeddings = OllamaEmbeddings(model="snowflake-arctic-embed2")
    return embeddings
