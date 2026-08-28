
from fastapi import APIRouter, HTTPException
from app.models.user_model import UserSignup, UserLogin
from app.db.mongo_client import users_collection
from app.utils.auth_utils import hash_password, verify_password, create_access_token
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

router = APIRouter()

@router.post("/signup")
def signup(user: UserSignup):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_pw
    }
    users_collection.insert_one(new_user)

    token = create_access_token({"email": user.email})
    return {"access_token": token, "token_type": "bearer", "name": user.name}


@router.post("/login")
def login(user: UserLogin):
    existing_user = users_collection.find_one({"email": user.email})
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({"email": user.email})
    return {"access_token": token, "token_type": "bearer", "name": existing_user.get("name", "")}

GOOGLE_CLIENT_ID = "300780407407-7jjg4l0bf745obkfl8danar40pm6ldcj.apps.googleusercontent.com"

@router.post("/google")
def google_auth(payload: dict):
    token = payload.get("credential")
    try:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Google token")

    email = idinfo["email"]
    name = idinfo.get("name", "")

    existing_user = users_collection.find_one({"email": email})
    if not existing_user:
        users_collection.insert_one({"name": name, "email": email, "password": None})

    access_token = create_access_token({"email": email})
    return {"access_token": access_token, "token_type": "bearer", "name": name}