from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from validator import validate_python
from ai_service import generate_comments

app = FastAPI(title="AutoDocAI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str
    mode: str

@app.get("/")
def home():
    return {
        "message": "AutoDocAI Backend Running Successfully"
    }

@app.post("/generate")
def generate(request: CodeRequest):

    valid, message = validate_python(request.code)

    if not valid:
        return {
            "success": False,
            "message": message
        }

    result = generate_comments(request.code, request.mode)

    return {
        "success": True,
        "commented_code": result
    }