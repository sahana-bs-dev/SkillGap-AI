from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.mongo_client import db
from app.routes.auth_routes import router as auth_router
from app.routes.upload_routes import router as upload_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(upload_router, prefix="/upload", tags=["Upload"])

@app.get("/")
def root():
    return {"message": "SkillGap AI backend is running"}

@app.get("/test-db")
def test_db():
    return {"collections": db.list_collection_names()}