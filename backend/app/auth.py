from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
import jwt
import os
from datetime import datetime, timedelta
from app.database import db_service
from passlib.context import CryptContext

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self):
        self.db = db_service.get_client()

    async def create_user(self, email: str, name: str) -> Dict[str, Any]:
        """Create a new user account"""
        try:
            # Check if user already exists
            existing_user = await self.db.query({
                "users": {
                    "where": {"email": email}
                }
            })

            if existing_user.get("users"):
                return {
                    "success": False,
                    "error": "User with this email already exists"
                }

            # Create new user
            user_id = self.generate_user_id()
            await self.db.transact([
                {
                    "users": {
                        "create": {
                            "id": user_id,
                            "email": email,
                            "role": "developer",  # Default role
                            "created_at": int(datetime.now().timestamp())
                        }
                    }
                }
            ])

            return {
                "success": True,
                "user_id": user_id,
                "email": email
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to create user: {str(e)}"
            }

    async def create_magic_link(self, email: str) -> str:
        """Create a magic link for email-based authentication"""
        try:
            # Check if user exists
            existing_user = await self.db.query({
                "users": {
                    "where": {"email": email}
                }
            })
            
            # If user doesn't exist, create them with default role
            if not existing_user.get("users"):
                await self.db.transact([
                    {
                        "users": {
                            "create": {
                                "id": self.generate_user_id(),
                                "email": email,
                                "role": "developer",  # Default role
                                "created_at": int(datetime.now().timestamp())
                            }
                        }
                    }
                ])
            
            # Generate magic link token
            token_data = {
                "email": email,
                "exp": datetime.utcnow() + timedelta(hours=1),  # Magic link expires in 1 hour
                "type": "magic_link"
            }
            
            token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
            
            # In a real implementation, you would send this via email
            # For now, we'll return the token directly
            magic_link = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/auth/magic?token={token}"
            
            return magic_link
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create magic link: {str(e)}"
            )
    
    async def verify_magic_link(self, token: str) -> Dict[str, Any]:
        """Verify magic link token and return user info"""
        try:
            # Decode token
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            
            # Check if it's a magic link token
            if payload.get("type") != "magic_link":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type"
                )
            
            # Get user from database
            user_result = await self.db.query({
                "users": {
                    "where": {"email": payload["email"]}
                }
            })
            
            users = user_result.get("users", [])
            if not users:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            user = users[0]
            
            # Generate access token
            access_token_data = {
                "sub": user["id"],
                "email": user["email"],
                "role": user["role"],
                "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
                "type": "access_token"
            }
            
            access_token = jwt.encode(access_token_data, SECRET_KEY, algorithm=ALGORITHM)
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                    "role": user["role"]
                }
            }
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Magic link has expired"
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to verify magic link: {str(e)}"
            )
    
    async def get_current_user(self, credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
        """Get current user from JWT token"""
        try:
            # Decode token
            payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
            
            # Check if it's an access token
            if payload.get("type") != "access_token":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type"
                )
            
            # Get user from database
            user_result = await self.db.query({
                "users": {
                    "where": {"id": payload["sub"]}
                }
            })
            
            users = user_result.get("users", [])
            if not users:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            user = users[0]
            
            return {
                "id": user["id"],
                "email": user["email"],
                "role": user["role"]
            }
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to authenticate: {str(e)}"
            )
    
    def generate_user_id(self) -> str:
        """Generate a unique user ID"""
        import uuid
        return str(uuid.uuid4())

    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        return pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)

    async def signup_with_password(self, email: str, name: str, password: str) -> Dict[str, Any]:
        """Sign up with email and password"""
        try:
            # Check if user already exists
            existing_user = await self.db.query({
                "users": {
                    "where": {"email": email}
                }
            })

            if existing_user.get("users"):
                return {
                    "success": False,
                    "error": "User with this email already exists"
                }

            # Hash password
            hashed_password = self.hash_password(password)

            # Create new user with password
            user_id = self.generate_user_id()
            await self.db.transact([
                {
                    "users": {
                        "create": {
                            "id": user_id,
                            "email": email,
                            "name": name,
                            "password_hash": hashed_password,
                            "role": "developer",
                            "created_at": int(datetime.now().timestamp())
                        }
                    }
                }
            ])

            return {
                "success": True,
                "user_id": user_id,
                "email": email
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to create account: {str(e)}"
            }

    async def login_with_password(self, email: str, password: str) -> Dict[str, Any]:
        """Login with email and password"""
        try:
            # Get user from database
            user_result = await self.db.query({
                "users": {
                    "where": {"email": email}
                }
            })

            users = user_result.get("users", [])
            if not users:
                return {
                    "success": False,
                    "error": "Invalid email or password"
                }

            user = users[0]

            # Check if user has password (not magic link only)
            if "password_hash" not in user or not user.get("password_hash"):
                return {
                    "success": False,
                    "error": "This account uses magic link authentication. Please use the magic link instead."
                }

            # Verify password
            if not self.verify_password(password, user["password_hash"]):
                return {
                    "success": False,
                    "error": "Invalid email or password"
                }

            # Generate access token
            access_token_data = {
                "sub": user["id"],
                "email": user["email"],
                "role": user["role"],
                "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
                "type": "access_token"
            }

            access_token = jwt.encode(access_token_data, SECRET_KEY, algorithm=ALGORITHM)

            return {
                "success": True,
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                    "role": user["role"]
                }
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Login failed: {str(e)}"
            }

# Global auth service instance
auth_service = AuthService()

# Dependency for protected routes
async def get_current_user_dependency(current_user: Dict[str, Any] = Depends(auth_service.get_current_user)):
    return current_user

# Optional authentication - returns a test user if no token is provided
async def get_optional_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))) -> Dict[str, Any]:
    """Get current user, or return a test user if no credentials provided"""
    if not credentials:
        # Return a test/demo user for development
        return {
            "id": "test-user-123",
            "email": "test@example.com",
            "role": "developer"
        }

    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("type") != "access_token":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )

        return {
            "id": payload.get("sub"),
            "email": payload.get("email"),
            "role": payload.get("role", "developer")
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

# Role-based access control decorator
def require_role(required_role: str):
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user_dependency)):
        if current_user["role"] != required_role and current_user["role"] != "project_manager":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker