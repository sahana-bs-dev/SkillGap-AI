from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from app.services.resume_parser import extract_resume_text
from app.utils.auth_utils import get_current_user
from app.services.ai_matcher import analyze_resume_vs_jd

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
    job description text. Extracts the resume text, runs it against the JD
    through the AI matcher, and returns the full structured analysis.
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

    try:
        analysis_result = analyze_resume_vs_jd(
            resume_text=final_resume_text, jd_text=jd_text.strip()
        )
    except ValueError as e:
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {str(e)}")

    from datetime import datetime
    from app.db.mongo_client import history_collection

    def derive_job_title(text: str) -> str:
        words = text.strip().split()
        if not words:
            return "Resume analysis"
        short = " ".join(words[:8])
        return short + ("..." if len(words) > 8 else "")

    record = {
        "user_email": user_email,
        "job_title": derive_job_title(jd_text),
        "resume_text": final_resume_text,
        "jd_text": jd_text.strip(),
        "date": datetime.utcnow().isoformat(),
        "match_score": analysis_result["match_score"],
        "matching_points": analysis_result["matching_points"],
        "missing_points": analysis_result["missing_points"],
        "suggestions": analysis_result["suggestions"],
    }
    inserted = history_collection.insert_one(record)

    return {
        "id": str(inserted.inserted_id),
        "user_email": user_email,
        "resume_text": final_resume_text,
        "jd_text": jd_text.strip(),
        **analysis_result,
    }