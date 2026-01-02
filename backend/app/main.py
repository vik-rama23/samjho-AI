from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# API Routers
from app.api import documents
from app.api import qa
from app.api import finance
from app.api import eligibility
from app.api import auth
from app.api import cleanup


app = FastAPI(
    title="Samjho AI Backend",
    description="Document-based AI for Q&A, Finance, and Eligibility",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Document upload & management
app.include_router(
    documents.router,
    prefix="/documents",
    tags=["Documents"]
)

# Document-based Q&A (Education, Policy, etc.)
app.include_router(
    qa.router,
    prefix="/qa",
    tags=["Q&A"]
)

# Finance explanations (general + finance documents)
app.include_router(
    finance.router,
    prefix="/finance",
    tags=["Finance"]
)

# Eligibility checking (document-driven rules)
app.include_router(
    eligibility.router,
    prefix="/eligibility",
    tags=["Eligibility"]
)

app.include_router(auth.router)

@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "service": "Samjho AI Backend"
    }


app.include_router(
    cleanup.router,
    prefix="/cleanup",
    tags=["Cleanup"]
)

# Expose `main` to support uvicorn invocation like `uvicorn app.main:main`
main = app
