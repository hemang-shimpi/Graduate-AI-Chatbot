import argparse
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_community.llms.ollama import Ollama
from langchain_ollama import OllamaLLM

from get_embedding_function import get_embedding_function

CHROMA_PATH = "chroma"
PROMPT_TEMPLATE = """
You are Georgia State University's Computer Science Graduate Program AI assistant answering students and prospective student's quesstions based on the Context given. You have to answer the qustions as if your are responding directly to the user.

Guidelines:
- If the question is a greeting (e.g., "hello", "hi", "hey"), respond with a friendly greeting.
- If the context contains a direct answer, use it.
- If the answer requires synthesis, provide a clear and structured explanation.
- If the answer involves steps or best practices, list them numerically.
- If no relevant information is found, say: "I'm sorry that is out of my scope. I can assist you with any questions related to the CS Program"

Context:
{context} 

Question:
{question}

"""



def main():
    # Create CLI.
    parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type=str, help="The query text.")
    args = parser.parse_args()
    query_text = args.query_text
    query_rag(query_text)

def query_rag(query_text: str):
    # Prepare the DB.
    embedding_function = get_embedding_function()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)
    print(f"Number of documents in the DB: {len(db.get())}")

    # Search the DB.
    results = db.similarity_search_with_score(query_text, k=5)

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    print("Contextttttt")
    print(context_text)
    print('Donee------------e')
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)
    # print(prompt)

    model = OllamaLLM(model="gemma2:2b")
    print("A")
    response_text = model.invoke(prompt)
    print("B")

    #sources = [doc.metadata.get("id", None) for doc, _score in results]
    #formatted_response = f"Response: {response_text}\nSources: {sources}"
    return response_text


if __name__ == "__main__":
    main()
