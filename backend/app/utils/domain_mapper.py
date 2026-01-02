def map_domain_to_feature(domain: str) -> str:
    domain = domain.lower()

    if domain in ["education", "policy", "general"]:
        return "qa"

    if domain == "finance":
        return "finance"

    if domain == "eligibility":
        return "eligibility"
    return "qa"
