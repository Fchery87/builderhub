import time
import asyncio
from typing import Dict, Optional
from collections import defaultdict, deque
from fastapi import HTTPException, Request, status
from starlette.middleware.base import BaseHTTPMiddleware

class RateLimiter:
    def __init__(self, max_requests: int, time_window: int):
        """
        Initialize rate limiter
        
        Args:
            max_requests: Maximum number of requests allowed
            time_window: Time window in seconds
        """
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests: Dict[str, deque] = defaultdict(deque)
    
    def is_allowed(self, key: str) -> bool:
        """Check if request is allowed for given key"""
        now = time.time()
        request_times = self.requests[key]
        
        # Remove old requests outside the time window
        while request_times and request_times[0] <= now - self.time_window:
            request_times.popleft()
        
        # Check if under the limit
        if len(request_times) >= self.max_requests:
            return False
        
        # Add current request
        request_times.append(now)
        return True
    
    def get_reset_time(self, key: str) -> Optional[float]:
        """Get time when rate limit will reset"""
        request_times = self.requests[key]
        if not request_times:
            return None
        
        oldest_request = request_times[0]
        return oldest_request + self.time_window

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, rate_limiter: RateLimiter, key_extractor: callable):
        super().__init__(app)
        self.rate_limiter = rate_limiter
        self.key_extractor = key_extractor
    
    async def dispatch(self, request: Request, call_next):
        # Extract rate limit key (e.g., user ID, IP address)
        key = self.key_extractor(request)
        
        if not self.rate_limiter.is_allowed(key):
            reset_time = self.rate_limiter.get_reset_time(key)
            retry_after = int(reset_time - time.time()) if reset_time else self.rate_limiter.time_window
            
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
                headers={
                    "Retry-After": str(retry_after),
                    "X-RateLimit-Limit": str(self.rate_limiter.max_requests),
                    "X-RateLimit-Remaining": str(0),
                    "X-RateLimit-Reset": str(int(reset_time)) if reset_time else ""
                }
            )
        
        # Get remaining requests
        request_times = self.rate_limiter.requests[key]
        remaining = max(0, self.rate_limiter.max_requests - len(request_times))
        reset_time = self.rate_limiter.get_reset_time(key)
        
        response = await call_next(request)
        
        # Add rate limit headers to successful responses
        response.headers["X-RateLimit-Limit"] = str(self.rate_limiter.max_requests)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(int(reset_time)) if reset_time else ""
        
        return response

# Rate limiters for different use cases
ai_rate_limiter = RateLimiter(max_requests=10, time_window=60)  # 10 requests per minute for AI
auth_rate_limiter = RateLimiter(max_requests=20, time_window=300)  # 20 requests per 5 minutes for auth
general_rate_limiter = RateLimiter(max_requests=100, time_window=60)  # 100 requests per minute for general API

def extract_user_key(request: Request) -> str:
    """Extract user-based rate limit key"""
    # Try to get user ID from request state (set by auth middleware)
    if hasattr(request.state, "user") and request.state.user:
        return f"user:{request.state.user.get('id', 'anonymous')}"
    
    # Fallback to IP address
    return f"ip:{request.client.host if request.client else 'unknown'}"

def extract_ip_key(request: Request) -> str:
    """Extract IP-based rate limit key"""
    return f"ip:{request.client.host if request.client else 'unknown'}"