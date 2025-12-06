from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import os
from dotenv import load_dotenv

from app.services.github_client import GitHubClient
from app.services.cache import cache
from app.services.ai_narrator import get_narrator
from app.utils.scoring import enrich_wrapped_data
from app.models.wrapped_response import WrappedResponse, ErrorResponse, HealthResponse

# Load environment variables
load_dotenv()

# Validate environment variables
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
if not GITHUB_TOKEN:
    raise RuntimeError("GITHUB_TOKEN environment variable is required")

# Initialize FastAPI app
app = FastAPI(
    title="GitHub Wrapped API",
    description="Backend API for GitHub Wrapped 2025",
    version="1.0.0"
)

# CORS configuration
CORS_ORIGINS = os.getenv("CORS_ORIGIN", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)

# Initialize GitHub client
github_client = GitHubClient(GITHUB_TOKEN)


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "GitHub Wrapped API",
        "version": "1.0.0",
        "endpoints": {
            "wrapped": "/api/wrapped/{username}?year=YYYY",
            "narrative": "/api/narrative/{username}?year=YYYY",
            "health": "/health"
        },
        "documentation": "/docs"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    cache_stats = cache.get_stats()
    
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "cache": cache_stats,
        "github": {
            "configured": bool(GITHUB_TOKEN)
        }
    }


@app.get("/api/wrapped/{username}", response_model=WrappedResponse)
async def get_wrapped(
    username: str,
    year: int = Query(default=datetime.now().year, ge=2008, le=datetime.now().year)
):
    """
    Get GitHub Wrapped data for a user.
    
    Args:
        username: GitHub username
        year: Year to analyze (default: current year)
    
    Returns:
        WrappedResponse with user statistics and scores
    """
    try:
        # Validate username format
        if not username or len(username) > 39:
            raise HTTPException(
                status_code=400,
                detail="Invalid username format"
            )
        
        # Check cache first
        cached_data = cache.get(username, year)
        if cached_data:
            print(f"Cache hit for {username}:{year}")
            return {**cached_data, "cached": True}
        
        print(f"Fetching data for {username}:{year}")
        
        # Fetch data from GitHub
        wrapped_data = await github_client.get_wrapped_data(username, year)
        
        # Enrich with scores and titles
        enriched_data = enrich_wrapped_data(wrapped_data)
        
        # Cache the result (10 minutes)
        cache.set(username, year, enriched_data, ttl=600)
        
        return {**enriched_data, "cached": False}
        
    except ValueError as e:
        if str(e) == "USER_NOT_FOUND":
            raise HTTPException(
                status_code=404,
                detail="The specified GitHub user does not exist"
            )
        raise HTTPException(status_code=400, detail=str(e))
    
    except Exception as e:
        error_msg = str(e)
        
        # Handle rate limiting
        if "rate limit" in error_msg.lower() or "403" in error_msg:
            raise HTTPException(
                status_code=429,
                detail="GitHub API rate limit exceeded. Please try again later."
            )
        
        # Handle authentication errors
        if "401" in error_msg or "Unauthorized" in error_msg:
            raise HTTPException(
                status_code=500,
                detail="Invalid GitHub token configuration"
            )
        
        # Generic error
        print(f"Error fetching wrapped data: {error_msg}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while fetching data from GitHub"
        )


@app.get("/api/narrative/{username}")
async def get_narrative(
    username: str,
    year: int = Query(default=datetime.now().year, ge=2008, le=datetime.now().year)
):
    """
    Get AI-generated narrative (Spotify Wrapped-style story) for a user's GitHub activity.
    
    Args:
        username: GitHub username
        year: Year to analyze (default: current year)
    
    Returns:
        AI-generated narrative slides
    """
    try:
        # Validate username format
        if not username or len(username) > 39:
            raise HTTPException(
                status_code=400,
                detail="Invalid username format"
            )
        
        # Check if OpenAI is configured
        openai_key = os.getenv("OPENAI_API_KEY")
        if not openai_key:
            raise HTTPException(
                status_code=503,
                detail="AI narrative feature is not configured. Please set OPENAI_API_KEY."
            )
        
        # Check cache for narrative
        narrative_cache_key = f"{username}:{year}:narrative"
        cached_narrative = cache.get(narrative_cache_key, year)
        if cached_narrative:
            print(f"Narrative cache hit for {username}:{year}")
            return {**cached_narrative, "cached": True}
        
        print(f"Generating AI narrative for {username}:{year}")
        
        # First, get wrapped data (might be cached)
        wrapped_cache = cache.get(username, year)
        if wrapped_cache:
            wrapped_data = wrapped_cache
        else:
            # Fetch fresh data
            wrapped_data = await github_client.get_wrapped_data(username, year)
            enriched_data = enrich_wrapped_data(wrapped_data)
            cache.set(username, year, enriched_data, ttl=600)
            wrapped_data = enriched_data
        
        # Generate AI narrative
        narrator = get_narrator()
        narrative_result = await narrator.generate_narrative(wrapped_data)
        
        if not narrative_result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=narrative_result.get("error", "Failed to generate narrative")
            )
        
        # Cache the narrative (10 minutes)
        cache.set(narrative_cache_key, year, narrative_result, ttl=600)
        
        return {**narrative_result, "cached": False}
        
    except HTTPException:
        raise
    except ValueError as e:
        if str(e) == "USER_NOT_FOUND":
            raise HTTPException(
                status_code=404,
                detail="The specified GitHub user does not exist"
            )
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        error_msg = str(e)
        print(f"Error generating narrative: {error_msg}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while generating the narrative"
        )


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "message": exc.detail
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    
    print("╔════════════════════════════════════════╗")
    print("║   GitHub Wrapped API Server            ║")
    print("╚════════════════════════════════════════╝")
    print(f"🚀 Server running on port {port}")
    print(f"🌍 Environment: {os.getenv('ENVIRONMENT', 'development')}")
    print(f"📦 Cache TTL: {cache.default_ttl}s")
    print(f"🔑 GitHub Token: {'✓ Configured' if GITHUB_TOKEN else '✗ Missing'}")
    print("════════════════════════════════════════")
    print(f"API: http://localhost:{port}/api/wrapped/:username?year=2025")
    print(f"Docs: http://localhost:{port}/docs")
    print("════════════════════════════════════════\n")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
