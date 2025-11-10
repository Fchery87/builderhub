import time
import functools
from typing import Callable, Any, Dict
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class PerformanceMonitor:
    def __init__(self):
        self.metrics: Dict[str, list] = {
            "response_times": [],
            "endpoint_counts": {},
            "error_counts": {},
            "slow_queries": []
        }
    
    def record_response_time(self, endpoint: str, response_time: float, status_code: int):
        """Record response time for an endpoint"""
        self.metrics["response_times"].append({
            "endpoint": endpoint,
            "response_time": response_time,
            "status_code": status_code,
            "timestamp": time.time()
        })
        
        # Track endpoint counts
        if endpoint not in self.metrics["endpoint_counts"]:
            self.metrics["endpoint_counts"][endpoint] = 0
        self.metrics["endpoint_counts"][endpoint] += 1
        
        # Track errors
        if status_code >= 400:
            if endpoint not in self.metrics["error_counts"]:
                self.metrics["error_counts"][endpoint] = 0
            self.metrics["error_counts"][endpoint] += 1
        
        # Track slow queries (>500ms)
        if response_time > 0.5:  # 500ms threshold
            self.metrics["slow_queries"].append({
                "endpoint": endpoint,
                "response_time": response_time,
                "timestamp": time.time()
            })
    
    def get_stats(self) -> Dict[str, Any]:
        """Get performance statistics"""
        response_times = [r["response_time"] for r in self.metrics["response_times"]]
        
        if not response_times:
            return {
                "total_requests": 0,
                "avg_response_time": 0,
                "p95_response_time": 0,
                "p99_response_time": 0,
                "slow_requests": 0,
                "error_rate": 0,
                "endpoint_stats": {}
            }
        
        # Calculate percentiles
        sorted_times = sorted(response_times)
        p95_index = int(len(sorted_times) * 0.95)
        p99_index = int(len(sorted_times) * 0.99)
        
        return {
            "total_requests": len(response_times),
            "avg_response_time": sum(response_times) / len(response_times),
            "p95_response_time": sorted_times[p95_index] if p95_index < len(sorted_times) else sorted_times[-1],
            "p99_response_time": sorted_times[p99_index] if p99_index < len(sorted_times) else sorted_times[-1],
            "slow_requests": len([t for t in response_times if t > 0.5]),
            "error_rate": sum(self.metrics["error_counts"].values()) / len(response_times) if response_times else 0,
            "endpoint_stats": self._get_endpoint_stats()
        }
    
    def _get_endpoint_stats(self) -> Dict[str, Any]:
        """Get statistics per endpoint"""
        endpoint_stats = {}
        
        for endpoint in self.metrics["endpoint_counts"]:
            endpoint_times = [
                r["response_time"] for r in self.metrics["response_times"] 
                if r["endpoint"] == endpoint
            ]
            
            if endpoint_times:
                endpoint_stats[endpoint] = {
                    "request_count": self.metrics["endpoint_counts"][endpoint],
                    "avg_response_time": sum(endpoint_times) / len(endpoint_times),
                    "error_count": self.metrics["error_counts"].get(endpoint, 0),
                    "slow_requests": len([t for t in endpoint_times if t > 0.5])
                }
        
        return endpoint_stats
    
    def reset_metrics(self):
        """Reset all metrics"""
        self.metrics = {
            "response_times": [],
            "endpoint_counts": {},
            "error_counts": {},
            "slow_queries": []
        }

# Global performance monitor instance
performance_monitor = PerformanceMonitor()

def monitor_performance(func: Callable) -> Callable:
    """Decorator to monitor function performance"""
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
            end_time = time.time()
            
            # Extract endpoint name from function or request
            endpoint = func.__name__
            if args and hasattr(args[0], 'url'):
                endpoint = args[0].url.path
            
            performance_monitor.record_response_time(
                endpoint, 
                end_time - start_time, 
                200  # Success status
            )
            
            return result
        except Exception as e:
            end_time = time.time()
            
            # Extract endpoint name
            endpoint = func.__name__
            if args and hasattr(args[0], 'url'):
                endpoint = args[0].url.path
            
            performance_monitor.record_response_time(
                endpoint, 
                end_time - start_time, 
                500  # Error status
            )
            
            raise e
    
    return wrapper

class PerformanceMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()
        
        response = await call_next(request)
        
        end_time = time.time()
        response_time = end_time - start_time
        
        # Record performance metrics
        performance_monitor.record_response_time(
            request.url.path,
            response_time,
            response.status_code
        )
        
        # Add performance headers
        response.headers["X-Response-Time"] = f"{response_time:.3f}s"
        
        return response