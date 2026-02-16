from pathlib import Path

pdf_path = Path(r"c:\Users\DELL\Downloads\SARS_AI_Training (1) (1).pdf")
out_path = Path(r"c:\Users\DELL\Desktop\SARS Course\_pdf_text.txt")
text = ""
errors = []

try:
    import pypdf
    reader = pypdf.PdfReader(str(pdf_path))
    text = "\n\n".join((page.extract_text() or "") for page in reader.pages)
except Exception as exc:
    errors.append(f"pypdf: {exc}")

if not text.strip():
    try:
        import fitz
        with fitz.open(str(pdf_path)) as doc:
            text = "\n\n".join(page.get_text() for page in doc)
    except Exception as exc:
        errors.append(f"fitz: {exc}")

if not text.strip():
    text = "__EXTRACTION_FAILED__\n" + "\n".join(errors)

out_path.write_text(text, encoding="utf-8", errors="ignore")
print(str(out_path))
