from app.services.duckduckgo_service import duckduckgo_search
from app.services.ai_service import _call_gpt
from app.services.prompt_templates import QA_SYSTEM_PROMPT, FINANCE_SYSTEM_PROMPT

def answer_from_internet(question: str, domain: str):
    search_results = duckduckgo_search(question)

    if not search_results:
        return {
            "answer": "Unable to fetch information from the internet.",
            "source_type": "internet",
            "source_name": None,
            "sources": [],
            "role": "assistant"
        }

    context = "\n\n".join(
        f"{r['title']}\n{r['snippet']}"
        for r in search_results
        if r.get("snippet")
    )

    prompt = f"""
        Answer the question using the information below
        Keep the answer simple and factual.
        Show sources in English only.


        Context:
        {context}

        Question:
        {question}
    """

    system_prompt = QA_SYSTEM_PROMPT
    if domain and domain.lower() == "finance":
        system_prompt = FINANCE_SYSTEM_PROMPT
    else:
        system_prompt = QA_SYSTEM_PROMPT
    answer = _call_gpt(prompt, system_prompt)

    return {
        "answer": answer,
        "role": "assistant",
        "source_type": "internet",
        "source_name": "DuckDuckGo",
        "sources": [
            {"title": r["title"], "url": r["url"]}
            for r in search_results
        ],
    }
