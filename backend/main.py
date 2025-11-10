from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging
from dotenv import load_dotenv

# Load environment variables BEFORE importing app modules
load_dotenv()

from app.database import db_service
from app.routers import auth, tasks, ai, projects
from app.performance import performance_monitor, PerformanceMiddleware
from app.rate_limiter import RateLimitMiddleware, ai_rate_limiter, extract_user_key

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Task Board API starting up...")
    # Initialize database schema
    await db_service.init_schema()
    yield
    # Shutdown
    logger.info("Task Board API shutting down...")

app = FastAPI(
    title="Task Board API",
    description="Real-time collaborative task board with AI integration",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add performance monitoring middleware
app.add_middleware(PerformanceMiddleware)

# Add rate limiting middleware for AI endpoints
app.add_middleware(
    RateLimitMiddleware,
    rate_limiter=ai_rate_limiter,
    key_extractor=extract_user_key
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(ai.router)
app.include_router(projects.router)

@app.get("/")
async def root():
    return {"message": "Task Board API is running", "status": "healthy"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "task-board-api"}

@app.get("/api/performance/stats")
async def get_performance_stats():
    """Get performance statistics and metrics"""
    return performance_monitor.get_stats()

@app.post("/api/performance/reset")
async def reset_performance_stats():
    """Reset performance metrics (for testing/admin)"""
    performance_monitor.reset_metrics()
    return {"message": "Performance metrics reset"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)