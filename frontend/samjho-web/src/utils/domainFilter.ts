export type Feature = "qa" | "finance" | "eligibility";

export function filterDocumentsByFeature(
  documents: any[],
  feature: Feature
) {
  if (feature === "qa") {
    return documents.filter((doc) =>
      ["education", "policy", "general"].includes(doc.domain)
    );
  }

  if (feature === "finance") {
    return documents.filter((doc) => doc.domain === "finance");
  }

  if (feature === "eligibility") {
    return documents.filter((doc) => doc.domain === "eligibility");
  }

  return [];
}
