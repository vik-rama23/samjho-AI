def normalize_answer(result, role="assistant"):
    """
    Ensures all services return the same structure
    """
    if isinstance(result, dict):
        return {
            "role": role,
            "answer": result.get("answer", ""),
            "source_type": result.get("source_type", "none"),
            "source_name": result.get("source_name"),
            "sources": result.get("sources", []),
            "found": result.get("found", False),
        }

    return {
        "answer": str(result),
        "source_type": "none",
        "source_name": None,
        "sources": [],
        "role": role
    }
