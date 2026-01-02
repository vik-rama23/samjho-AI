import os
import requests
from app.services.ai_service import _call_gpt
from dotenv import load_dotenv

load_dotenv()

SEARXNG_URL = os.getenv("SEARXNG_URL")

def answer_from_internet(question: str):
    params = {
        "q": question,
        "format": "json",
        "language": "en",
        "categories": "general",
        "engines": "google,bing,duckduckgo",
        "safesearch": 1,
    }

    try:
        res = requests.get(SEARXNG_URL, params=params, timeout=10)
        res.raise_for_status()
        data = res.json()
    except Exception:
        return {
           "answer": (
                "I could not find this information in your uploaded documents, "
                "and internet search is currently unavailable."
            ),
            "source_type": "none",
            "sources": [],
        }

    results = data.get("results", [])[:3]
    if not results:
        return {
           "answer": (
                "This information is not available in your uploaded documents "
                "and could not be found on the internet."
            ),
            "source_type": "none",
            "sources": [],
        }

    context = "\n\n".join(
        f"{r.get('content', '')}\nSource: {r.get('url')}"
        for r in results
    )

    prompt = f"""
        Answer the question using the information below.
        Use simple language for Indian users.
        Cite facts accurately.

        Information:
        {context}

        Question:
        {question}
    """

    answer = _call_gpt(prompt)

    return {
        "answer": answer,
        "source_type": "internet",
        "sources": [r["url"] for r in results if r.get("url")],
    }
