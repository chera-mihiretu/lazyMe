from fastapi import FastAPI
from pydantic import BaseModel
from src.tag_extractor.extractor import predict_tags

app = FastAPI(title="Real-Time Blog Tag Extractor")

class BlogRequest(BaseModel):
    title: str
    body: str

class TagResponse(BaseModel):
    tags: list

@app.post("/extract-tags", response_model=TagResponse)
def extract_tags(blog: BlogRequest):
    tags = predict_tags(blog.title, blog.body)
    return {"tags": tags}
@app.get("/")
def read_root():
    return {"message": "Welcome to the Real-Time Blog Tag Extractor API"}