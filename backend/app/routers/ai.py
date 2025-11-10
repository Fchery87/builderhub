from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.auth import get_current_user_dependency
from app.ai_service_improved import ai_service
from app.rate_limiter import RateLimitMiddleware, ai_rate_limiter, extract_user_key
from app.performance import monitor_performance

router = APIRouter(prefix="/api/ai", tags=["ai"])

class AcceptanceCriteriaRequest(BaseModel):
    task_title: str
    task_description: str

class CodeSuggestionsRequest(BaseModel):
    task_description: str
    context: Optional[str] = None

class AcceptanceCriteriaResponse(BaseModel):
    success: bool
    criteria: Optional[Dict[str, Any]] = None
    raw_response: Optional[str] = None
    error: Optional[str] = None

class CodeSuggestionsResponse(BaseModel):
    success: bool
    suggestions: Optional[Dict[str, Any]] = None
    raw_response: Optional[str] = None
    error: Optional[str] = None

@router.post("/generate-acceptance-criteria", response_model=AcceptanceCriteriaResponse)
@monitor_performance
async def generate_acceptance_criteria(
    request: AcceptanceCriteriaRequest,
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Generate acceptance criteria for a task using AI"""
    try:
        # Validate input
        if not request.task_title or not request.task_title.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task title is required"
            )
        
        if not request.task_description or not request.task_description.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task description is required"
            )
        
        # Check content length limits
        if len(request.task_title) > 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task title must be less than 200 characters"
            )
        
        if len(request.task_description) > 2000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task description must be less than 2000 characters"
            )
        
        result = await ai_service.generate_acceptance_criteria(
            request.task_description,
            request.task_title
        )
        
        # Validate AI service response
        if not result.get("success", False):
            error_msg = result.get("error", "Unknown error occurred")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"AI service error: {error_msg}"
            )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        # Log the error for debugging
        import logging
        logging.error(f"Unexpected error in generate_acceptance_criteria: {str(e)}")
        
        return {
            "success": False,
            "error": "An unexpected error occurred while generating acceptance criteria",
            "criteria": None,
            "raw_response": None
        }

@router.post("/generate-code-suggestions", response_model=CodeSuggestionsResponse)
@monitor_performance
async def generate_code_suggestions(
    request: CodeSuggestionsRequest,
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Generate code suggestions for a task using AI"""
    try:
        # Validate input
        if not request.task_description or not request.task_description.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task description is required"
            )
        
        # Check content length limits
        if len(request.task_description) > 2000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Task description must be less than 2000 characters"
            )
        
        if request.context and len(request.context) > 5000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Context must be less than 5000 characters"
            )
        
        result = await ai_service.generate_code_suggestions(
            request.task_description,
            request.context
        )
        
        # Validate AI service response
        if not result.get("success", False):
            error_msg = result.get("error", "Unknown error occurred")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"AI service error: {error_msg}"
            )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        # Log the error for debugging
        import logging
        logging.error(f"Unexpected error in generate_code_suggestions: {str(e)}")
        
        return {
            "success": False,
            "error": "An unexpected error occurred while generating code suggestions",
            "suggestions": None,
            "raw_response": None
        }

@router.get("/health")
@monitor_performance
async def ai_health_check():
    """Check if AI service is properly configured"""
    try:
        # Check if API key is configured
        if not ai_service.api_key:
            return {
                "status": "unhealthy",
                "error": "Gemini API key not configured"
            }
        
        # Test API connectivity with a simple request
        test_result = await ai_service.test_connection()
        
        if test_result["success"]:
            return {
                "status": "healthy",
                "service": "ai_service",
                "models": {
                    "flash": "gemini-2.0-flash-exp",
                    "pro": "gemini-2.0-pro-exp"
                },
                "last_test": test_result.get("timestamp")
            }
        else:
            return {
                "status": "degraded",
                "error": f"API connectivity issue: {test_result.get('error', 'Unknown error')}",
                "service": "ai_service"
            }
        
    except Exception as e:
        import logging
        logging.error(f"AI health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "service": "ai_service"
        }