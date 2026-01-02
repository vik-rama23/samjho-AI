import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

def build_vectors(text: str, document_id: int, domain: str):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100
    )
    chunks = splitter.split_text(text)

    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

    metadatas = [
        {"document_id": document_id, "domain": domain, "chunk": i}
        for i in range(len(chunks))
    ]

    db = FAISS.from_texts(chunks, embeddings, metadatas)
    vector_path = f"vectors/{domain}"

    os.makedirs(vector_path, exist_ok=True)
    db.save_local(vector_path)

    return len(chunks)
