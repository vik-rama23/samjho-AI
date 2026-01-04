from duckduckgo_search import DDGS
from typing import List, Dict


def duckduckgo_search(query: str, max_results: int = 5) -> List[Dict]:
    results = []

    try:
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=max_results):
                results.append({
                    "title": r.get("title"),
                    "url": r.get("href"),
                    "snippet": r.get("body"),
                })
    except Exception:
        return []

    return results