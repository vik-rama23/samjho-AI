import tempfile
from app.database import SessionLocal
from app.models.document import Document
from app.utils.text_extractor import extract_text_from_pdf
from app.services.vector_service import build_vectors
from app.services.eligibility_rule_extractor import extract_rules_from_document
from app.services.eligibility_rule_repository import save_eligibility_rules

async def upload_document(
    file,
    title: str,
    domain: str,
    source: str,
    category: str,
    year: int,
    user_id: int
):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        path = tmp.name

    text = extract_text_from_pdf(path)

    if not text:
        raise ValueError(
            "This PDF appears to be scanned or image-based. "
            "Please upload a text-based PDF."
        )

    db = SessionLocal()
    document = Document(
        title=title,
        domain=domain,
        source=source,
        category=category,
        year=year,
        content=text,
        user_id=user_id
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    chunks = build_vectors(text, document.id, domain)

    if domain == "eligibility":
        rules = extract_rules_from_document(document.content)
        save_eligibility_rules(
            document_id=document.id,
            rules_json=rules
        )

    return {
        "document_id": document.id,
        "domain": domain,
        "chunks": chunks
    }

    return {
        "document_id": document.id,
        "domain": domain,
        "chunks": chunks
    }
