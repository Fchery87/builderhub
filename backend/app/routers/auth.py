from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from typing import Dict, Any
from app.auth import auth_service, get_current_user_dependency

router = APIRouter(prefix="/api/auth", tags=["authentication"])

class MagicLinkRequest(BaseModel):
    email: EmailStr

class MagicLinkResponse(BaseModel):
    magic_link: str
    message: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: str
    email: str
    role: str

class SignupRequest(BaseModel):
    email: EmailStr
    name: str

class PasswordSignupRequest(BaseModel):
    email: EmailStr
    name: str
    password: str

class PasswordLoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup", response_model=MagicLinkResponse)
async def signup(request: SignupRequest):
    """Create a new user account and send magic link"""
    try:
        # Create user in database
        result = await auth_service.create_user(request.email, request.name)

        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )

        # Send magic link
        magic_link = await auth_service.create_magic_link(request.email)
        return {
            "magic_link": magic_link,
            "message": "Account created successfully. Check your email for a magic link."
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create account: {str(e)}"
        )

@router.post("/magic-link", response_model=MagicLinkResponse)
async def create_magic_link(request: MagicLinkRequest):
    """Create a magic link for email-based authentication"""
    try:
        magic_link = await auth_service.create_magic_link(request.email)
        return {
            "magic_link": magic_link,
            "message": "Magic link created successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create magic link: {str(e)}"
        )

@router.post("/verify-magic-link", response_model=TokenResponse)
async def verify_magic_link(token: str):
    """Verify magic link token and return access token"""
    try:
        result = await auth_service.verify_magic_link(token)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to verify magic link: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user(current_user: Dict[str, Any] = Depends(get_current_user_dependency)):
    """Get current authenticated user information"""
    return current_user

@router.post("/logout")
async def logout(current_user: Dict[str, Any] = Depends(get_current_user_dependency)):
    """Logout current user (client-side token removal)"""
    # In a stateless JWT setup, logout is handled client-side
    # Here we could implement token blacklisting if needed
    return {"message": "Successfully logged out"}

@router.post("/signup-password", response_model=TokenResponse)
async def signup_with_password(request: PasswordSignupRequest):
    """Sign up with email and password"""
    try:
        result = await auth_service.signup_with_password(request.email, request.name, request.password)

        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )

        # Auto-login after successful signup
        login_result = await auth_service.login_with_password(request.email, request.password)

        if not login_result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Account created but failed to generate token"
            )

        return login_result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Signup failed: {str(e)}"
        )

@router.post("/login-password", response_model=TokenResponse)
async def login_with_password(request: PasswordLoginRequest):
    """Login with email and password"""
    try:
        result = await auth_service.login_with_password(request.email, request.password)

        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=result["error"]
            )

        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )