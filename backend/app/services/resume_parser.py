import io
import pdfplumber
from docx import Document


def parse_pdf(file_bytes: bytes) -> str:
    """Extract plain text from a PDF file's raw bytes."""
    text_parts = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts).strip()


def parse_docx(file_bytes: bytes) -> str:
    """Extract plain text from a DOCX file's raw bytes."""
    document = Document(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in document.paragraphs if p.text.strip()]
    return "\n".join(paragraphs).strip()


def extract_resume_text(filename: str, file_bytes: bytes) -> str:
    """
    Detects file type from its extension and routes to the right parser.
    Raises ValueError if the file type isn't supported.
    """
    lower_name = filename.lower()

    if lower_name.endswith(".pdf"):
        return parse_pdf(file_bytes)
    elif lower_name.endswith(".docx"):
        return parse_docx(file_bytes)
    else:
        raise ValueError("Unsupported file type. Please upload a PDF or DOCX file.")
    
    