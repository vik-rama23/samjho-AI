import os
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from app.services.ai_service import _call_gpt
from app.services.answer_schema import normalize_answer
from app.services.prompt_templates import QA_SYSTEM_PROMPT, FINANCE_SYSTEM_PROMPT
from app.services.internet_answer_service import answer_from_internet

def _load_vector_db(domain: str):
    path = f"vectors/{domain}"
    if not os.path.exists(os.path.join(path, "index.faiss")):
        return None

    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    return FAISS.load_local(path, embeddings, allow_dangerous_deserialization=True)


def answer_from_domain(question: str, domain: str):
    db = _load_vector_db(domain)

    if not db:
        return normalize_answer({
            "answer": f"No documents uploaded for '{domain}'.",
            "source_type": "none",
            "source_name": None,
            "sources": [],
            "found": False,
        })

    docs = db.similarity_search(question, k=3)

    if not docs:
        return normalize_answer({
            "answer": "Information not found in uploaded documents.",
            "source_type": "none",
            "source_name": None,
            "sources": [],
            "found": False,
        })

    context = "\n\n".join(d.page_content for d in docs)

    prompt = f"""
        Answer ONLY using the context below.
        
        STRICT RULES:
        - If the answer is NOT present in the context,
        reply with EXACTLY this text:
        >>> ANSWER_NOT_FOUND <<<

        Context:
        {context}

        Question:
        {question}
    """
    # choose system prompt based on domain
    system_prompt = QA_SYSTEM_PROMPT
    if domain and domain.lower() == "finance":
        system_prompt = FINANCE_SYSTEM_PROMPT
    else:
        system_prompt = QA_SYSTEM_PROMPT

    answer = _call_gpt(prompt, system_prompt)

    if "ANSWER_NOT_FOUND" in answer.upper():
        return answer_from_internet(question, domain)

    print 

    return normalize_answer({
        "answer": answer,
        "source_type": "document",
        "source_name": "Uploaded Document",
        "sources": [],
        "found":True,
        "role": "assistant"
    })
