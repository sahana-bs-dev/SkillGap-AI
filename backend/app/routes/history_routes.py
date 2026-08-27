from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.db.mongo_client import history_collection
from app.utils.auth_utils import get_current_user

router = APIRouter()

def serialize(doc):
    return {
        "id": str(doc["_id"]),
        "jobTitle": doc.get("job_title", "Resume analysis"),
        "company": doc.get("company", ""),
        "date": doc.get("date"),
        "score": doc.get("match_score"),
        "matched": doc.get("matching_points", []),
        "missing": [m["skill"] for m in doc.get("missing_points", [])],
    }

@router.get("")
def get_history(user_email: str = Depends(get_current_user)):
    docs = history_collection.find({"user_email": user_email}).sort("date", -1)
    return [serialize(d) for d in docs]

@router.get("/{attempt_id}")
def get_history_item(attempt_id: str, user_email: str = Depends(get_current_user)):
    try:
        obj_id = ObjectId(attempt_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid id")

    doc = history_collection.find_one({"_id": obj_id, "user_email": user_email})
    if not doc:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return serialize(doc)