from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from app.services.resume_parser import extract_resume_text
from app.utils.auth_utils import get_current_user

router = APIRouter()


@router.post("/analyze")
async def analyze(
    jd_text: str = Form(...),
    resume_file: UploadFile = File(None),
    resume_text: str = Form(None),
    user_email: str = Depends(get_current_user),
):
    """
    Accepts either an uploaded resume file OR pasted resume text, plus the
    job description text. Returns the parsed resume text + JD text so the
    frontend (and later, Phase 3's AI matcher) can use it.
    """
    if not jd_text.strip():
        raise HTTPException(status_code=400, detail="Job description is required.")

    final_resume_text = ""

    if resume_file is not None:
        file_bytes = await resume_file.read()
        try:
            final_resume_text = extract_resume_text(resume_file.filename, file_bytes)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    elif resume_text and resume_text.strip():
        final_resume_text = resume_text.strip()
    else:
        raise HTTPException(
            status_code=400,
            detail="Please provide either a resume file or pasted resume text.",
        )

    if not final_resume_text:
        raise HTTPException(
            status_code=400,
            detail="Couldn't extract any text from the resume. Try a different file.",
        )

    return {
        "user_email": user_email,
        "resume_text": final_resume_text,
        "jd_text": jd_text.strip(),
    }