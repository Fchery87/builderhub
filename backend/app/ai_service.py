import os
import google.generativeai as genai
from typing import Dict, Any, Optional
import asyncio
from functools import wraps
import time

class RateLimiter:
    def __init__(self, max_calls: int, time_window: int):
        self.max_calls = max_calls
        self.time_window = time_window
        self.calls = []
    
    def is_allowed(self) -> bool:
        now = time.time()
        # Remove old calls outside the time window
        self.calls = [call_time for call_time in self.calls if now - call_time < self.time_window]
        
        if len(self.calls) < self.max_calls:
            self.calls.append(now)
            return True
        return False

def rate_limit(max_calls: int, time_window: int):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            limiter = rate_limiters.get(func.__name__, RateLimiter(max_calls, time_window))
            rate_limiters[func.__name__] = limiter
            
            if not limiter.is_allowed():
                raise Exception(f"Rate limit exceeded for {func.__name__}. Max {max_calls} calls per {time_window} seconds.")
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# Global rate limiters for different AI operations
rate_limiters = {}

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        # Configure Gemini API
        genai.configure(api_key=self.api_key)
        
        # Initialize models
        self.flash_model = genai.GenerativeModel('gemini-2.0-flash')
        self.pro_model = genai.GenerativeModel('gemini-2.0-pro')
    
    @rate_limit(max_calls=10, time_window=60)  # 10 calls per minute
    async def generate_acceptance_criteria(self, task_description: str, task_title: str) -> Dict[str, Any]:
        """Generate acceptance criteria for a task using Gemini 2.5 Flash"""
        try:
            prompt = f"""
            Generate comprehensive acceptance criteria for the following task:
            
            Title: {task_title}
            Description: {task_description}
            
            Please provide:
            1. A clear, testable acceptance criteria list
            2. Definition of done criteria
            3. Any edge cases to consider
            
            Format the response as a structured JSON with the following keys:
            - "acceptance_criteria": Array of strings, each being a specific criterion
            - "definition_of_done": Array of strings defining when the task is complete
            - "edge_cases": Array of strings describing edge cases to consider
            
            Keep the criteria specific, measurable, and testable.
            """
            
            # Generate response using Flash model for speed
            response = await asyncio.to_thread(
                self.flash_model.generate_content,
                prompt
            )
            
            # Parse the response
            text_response = response.text
            
            # Try to extract JSON from the response
            try:
                import json
                # Find JSON in the response
                start_idx = text_response.find('{')
                end_idx = text_response.rfind('}') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_str = text_response[start_idx:end_idx]
                    criteria_data = json.loads(json_str)
                else:
                    # Fallback if JSON parsing fails
                    criteria_data = self._parse_fallback_response(text_response)
                
                return {
                    "success": True,
                    "criteria": criteria_data,
                    "raw_response": text_response
                }
                
            except json.JSONDecodeError:
                # Fallback parsing
                criteria_data = self._parse_fallback_response(text_response)
                return {
                    "success": True,
                    "criteria": criteria_data,
                    "raw_response": text_response
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "criteria": None
            }
    
    @rate_limit(max_calls=5, time_window=60)  # 5 calls per minute for Pro model
    async def generate_code_suggestions(self, task_description: str, context: Optional[str] = None) -> Dict[str, Any]:
        """Generate code suggestions using Gemini 2.5 Pro"""
        try:
            prompt = f"""
            Generate implementation suggestions for the following task:
            
            Task Description: {task_description}
            
            {f"Additional Context: {context}" if context else ""}
            
            Please provide:
            1. High-level implementation approach
            2. Key components or functions needed
            3. Potential challenges and solutions
            4. Best practices to follow
            
            Format the response as structured JSON with these keys:
            - "implementation_approach": String describing the approach
            - "key_components": Array of strings listing components
            - "challenges_and_solutions": Array of objects with "challenge" and "solution" keys
            - "best_practices": Array of strings
            """
            
            # Generate response using Pro model for higher quality
            response = await asyncio.to_thread(
                self.pro_model.generate_content,
                prompt
            )
            
            text_response = response.text
            
            # Try to parse JSON response
            try:
                import json
                start_idx = text_response.find('{')
                end_idx = text_response.rfind('}') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_str = text_response[start_idx:end_idx]
                    suggestions_data = json.loads(json_str)
                else:
                    suggestions_data = self._parse_code_fallback(text_response)
                
                return {
                    "success": True,
                    "suggestions": suggestions_data,
                    "raw_response": text_response
                }
                
            except json.JSONDecodeError:
                suggestions_data = self._parse_code_fallback(text_response)
                return {
                    "success": True,
                    "suggestions": suggestions_data,
                    "raw_response": text_response
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "suggestions": None
            }
    
    def _parse_fallback_response(self, response_text: str) -> Dict[str, Any]:
        """Fallback parsing for acceptance criteria when JSON parsing fails"""
        lines = response_text.split('\n')
        acceptance_criteria = []
        definition_of_done = []
        edge_cases = []
        
        current_section = None
        
        for line in lines:
            line = line.strip()
            if 'acceptance criteria' in line.lower():
                current_section = 'acceptance_criteria'
            elif 'definition of done' in line.lower():
                current_section = 'definition_of_done'
            elif 'edge case' in line.lower():
                current_section = 'edge_cases'
            elif line.startswith('-') or line.startswith('*') or line.startswith('•'):
                item = line.lstrip('-*• ').strip()
                if current_section == 'acceptance_criteria':
                    acceptance_criteria.append(item)
                elif current_section == 'definition_of_done':
                    definition_of_done.append(item)
                elif current_section == 'edge_cases':
                    edge_cases.append(item)
        
        return {
            "acceptance_criteria": acceptance_criteria,
            "definition_of_done": definition_of_done,
            "edge_cases": edge_cases
        }
    
    def _parse_code_fallback(self, response_text: str) -> Dict[str, Any]:
        """Fallback parsing for code suggestions when JSON parsing fails"""
        lines = response_text.split('\n')
        implementation_approach = ""
        key_components = []
        challenges_and_solutions = []
        best_practices = []
        
        current_section = None
        
        for line in lines:
            line = line.strip()
            if 'implementation approach' in line.lower():
                current_section = 'implementation_approach'
            elif 'key component' in line.lower():
                current_section = 'key_components'
            elif 'challenge' in line.lower():
                current_section = 'challenges'
            elif 'best practice' in line.lower():
                current_section = 'best_practices'
            elif line.startswith('-') or line.startswith('*') or line.startswith('•'):
                item = line.lstrip('-*• ').strip()
                if current_section == 'key_components':
                    key_components.append(item)
                elif current_section == 'best_practices':
                    best_practices.append(item)
            elif current_section == 'implementation_approach' and line:
                implementation_approach += line + " "
        
        return {
            "implementation_approach": implementation_approach.strip(),
            "key_components": key_components,
            "challenges_and_solutions": challenges_and_solutions,
            "best_practices": best_practices
        }

# Global AI service instance
ai_service = AIService()