from dotenv import load_dotenv
load_dotenv()

from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
import os

print("Splitter OK")

PDF_PATH = "C:/Users/Dell/Desktop/ABSS_2025_Concept_Note.pdf"
VECTOR_DIR = "vectors/abss_2025"


def extract_text_from_pdf(pdf_path: str) -> str:
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text


def build_vector_store():
    if not os.path.exists(PDF_PATH):
        raise FileNotFoundError("ABSS_2025.pdf not found")

    print("Extracting text from PDF...")
    text = extract_text_from_pdf(PDF_PATH)

    if not text.strip():
        raise ValueError("PDF text extraction failed")

    print("Splitting text into chunks...")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100
    )
    chunks = splitter.split_text(text)

    print(f"Total chunks: {len(chunks)}")

    print("Creating embeddings...")
    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-small"
    )

    db = FAISS.from_texts(chunks, embeddings)

    os.makedirs(VECTOR_DIR, exist_ok=True)
    db.save_local(VECTOR_DIR)

    print("Vector store saved successfully")


if __name__ == "__main__":
    build_vector_store()
