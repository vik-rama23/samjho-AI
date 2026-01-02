import os
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

from app.services.ai_service import _call_gpt
from app.services.internet_service import answer_from_internet
DOCUMENT_CONFIDENCE_THRESHOLD = 0.9


def _load_vector_db(domain: str):
    """
    Safely load FAISS DB for a domain.
    Returns None if vectors do not exist.
    """
    vector_path = f"vectors/{domain}"

    if not os.path.exists(os.path.join(vector_path, "index.faiss")):
        return None

    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

    return FAISS.load_local(
        vector_path,
        embeddings,
        allow_dangerous_deserialization=True
    )


def answer_from_domain(question: str, domain: str):
    """
    1. Try answering from uploaded documents (FAISS)
    2. If low confidence or not found → fallback to internet (SearXNG)
    3. Always return answer + source
    """

    db = _load_vector_db(domain)

    if not db:
        return answer_from_internet(question)

        print(f"question {question}")

    results = db.similarity_search_with_score(question, k=3)

    if not results:
        return answer_from_internet(question)

    best_doc, best_score = results[0]

    if best_score > DOCUMENT_CONFIDENCE_THRESHOLD:
        return answer_from_internet(question)

    context = "\n\n".join(doc.page_content for doc, _ in results)

    prompt = f"""
        You are Samjho AI.
        Answer ONLY using the context below.
        If the answer is not present, respond with: NOT FOUND

        Context:
        {context}

        Question:
        {question}
    """

    answer = _call_gpt(prompt)
    if "NOT FOUND" in answer.upper():
        return answer_from_internet(question)

    return {
        "answer": answer,
        "source_type": "document",
        "source_name": best_doc.metadata.get(
            "title",
            "Uploaded Document"
        ),
    }
