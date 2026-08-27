from pydantic import BaseModel
from typing import List, Optional

class MissingPoint(BaseModel):
    skill: str
    importance: str

class Suggestion(BaseModel):
    missing_skill: str
    suggestion: str

class AnalysisRecord(BaseModel):
    user_email: str
    job_title: Optional[str] = "Resume analysis"
    resume_text: str
    jd_text: str
    match_score: int
    matching_points: List[str]
    missing_points: List[MissingPoint]
    suggestions: List[Suggestion]