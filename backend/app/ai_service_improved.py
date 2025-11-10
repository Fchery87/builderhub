import os
import json
import httpx
import logging
import asyncio
from typing import Dict, Any, Optional
import google.generativeai as genai
from google.generativeai import GenerativeModel

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        # Configure the API globally
        if self.api_key:
            genai.configure(api_key=self.api_key)

        self.flash_model = GenerativeModel(
            model_name="gemini-2.0-flash"
        )
        self.pro_model = GenerativeModel(
            model_name="gemini-2.0-pro"
        )
        self.timeout = httpx.Timeout(10.0, connect=5.0)  # 10s total, 5s connect
        self.max_retries = 3
        self.retry_delay = 1.0  # seconds between retries

    async def _make_request_with_retry(self, model, prompt: str) -> Any:
        """Make request to AI model with retry logic"""
        for attempt in range(self.max_retries):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.post(
                        f"https://generativelanguage.googleapis.com/v1beta/models/{model.model_name}:generateContent",
                        headers={
                            "Content-Type": "application/json",
                            "x-goog-api-key": self.api_key
                        },
                        json={
                            "contents": [{
                                "parts": [{
                                    "text": prompt
                                }]
                            }]
                        }
                    )
                    
                    if response.status_code == 200:
                        return response.json()
                    elif response.status_code == 429:
                        # Rate limited - wait longer before retry
                        await asyncio.sleep(self.retry_delay * (attempt + 1))
                        continue
                    else:
                        logging.error(f"AI API error: {response.status_code} - {response.text}")
                        if attempt == self.max_retries - 1:
                            raise Exception(f"API request failed after {self.max_retries} attempts: {response.status_code}")
                        continue
                        
            except httpx.TimeoutException:
                logging.warning(f"AI API timeout on attempt {attempt + 1}")
                if attempt == self.max_retries - 1:
                    raise Exception("AI API request timed out")
                await asyncio.sleep(self.retry_delay)
                continue
            except Exception as e:
                logging.error(f"AI API request error on attempt {attempt + 1}: {str(e)}")
                if attempt == self.max_retries - 1:
                    raise
                await asyncio.sleep(self.retry_delay)
                continue

    async def test_connection(self) -> Dict[str, Any]:
        """Test connection to AI service"""
        try:
            test_prompt = "Respond with a simple JSON: {\"status\": \"ok\"}"
            result = await self._make_request_with_retry(self.flash_model, test_prompt)
            
            return {
                "success": True,
                "timestamp": asyncio.get_event_loop().time(),
                "response": result
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "timestamp": asyncio.get_event_loop().time()
            }

    async def generate_acceptance_criteria(self, task_description: str, task_title: str) -> Dict[str, Any]:
        """Generate acceptance criteria for a task using Gemini AI"""
        try:
            prompt = f"""
            Generate clear, actionable acceptance criteria for the following task:
            
            Title: {task_title}
            Description: {task_description}
            
            Requirements:
            - Return exactly 3-5 specific, measurable criteria
            - Each criterion should be testable
            - Focus on what "done" looks like
            - Format as a JSON array of strings
            - Be concise and specific
            """
            
            result = await self._make_request_with_retry(self.flash_model, prompt)
            
            # Parse the response to extract acceptance criteria
            try:
                # Try to parse as JSON first
                if 'candidates' in result and len(result['candidates']) > 0:
                    response_text = result['candidates'][0]['content']['parts'][0]['text']
                else:
                    raise Exception("Invalid response format from AI API")
                
                criteria_text = response_text.strip()
                if criteria_text.startswith('[') or criteria_text.startswith('{'):
                    criteria = json.loads(criteria_text)
                    if isinstance(criteria, list):
                        return {
                            "success": True,
                            "criteria": criteria,
                            "raw_response": response_text
                        }
                    elif isinstance(criteria, dict) and 'criteria' in criteria:
                        return {
                            "success": True,
                            "criteria": criteria['criteria'],
                            "raw_response": response_text
                        }
                
                # Fallback: extract bullet points
                lines = response_text.strip().split('\n')
                criteria = []
                for line in lines:
                    line = line.strip()
                    if line and (line.startswith('-') or line.startswith('•') or line.startswith('*')):
                        criteria.append(line[1:].strip())
                
                return {
                    "success": True,
                    "criteria": criteria,
                    "raw_response": response_text
                }
                
            except (json.JSONDecodeError, KeyError, IndexError) as e:
                logging.error(f"Failed to parse AI response: {str(e)}")
                # Fallback: extract bullet points
                lines = response_text.strip().split('\n')
                criteria = []
                for line in lines:
                    line = line.strip()
                    if line and (line.startswith('-') or line.startswith('•') or line.startswith('*')):
                        criteria.append(line[1:].strip())
                
                return {
                    "success": True,
                    "criteria": criteria,
                    "raw_response": response_text
                }
                
        except Exception as e:
            logging.error(f"Failed to generate acceptance criteria: {str(e)}")
            return {
                "success": False,
                "error": f"Failed to generate acceptance criteria: {str(e)}",
                "criteria": None,
                "raw_response": None
            }

    async def generate_code_suggestions(self, task_description: str, context: Optional[str] = None) -> Dict[str, Any]:
        """Generate code suggestions using Gemini AI"""
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
            
            Format response as structured JSON with these keys:
            - "implementation_approach": String describing the approach
            - "key_components": Array of strings listing components
            - "challenges_and_solutions": Array of objects with "challenge" and "solution" keys
            - "best_practices": Array of strings
            
            Keep suggestions practical and focused on the task requirements.
            """
            
            result = await self._make_request_with_retry(self.pro_model, prompt)
            
            # Parse the response to extract suggestions
            try:
                if 'candidates' in result and len(result['candidates']) > 0:
                    response_text = result['candidates'][0]['content']['parts'][0]['text']
                else:
                    raise Exception("Invalid response format from AI API")
                
                # Try to parse as JSON first
                suggestions_text = response_text.strip()
                if suggestions_text.startswith('[') or suggestions_text.startswith('{'):
                    suggestions = json.loads(suggestions_text)
                    if isinstance(suggestions, dict):
                        return {
                            "success": True,
                            "suggestions": suggestions,
                            "raw_response": response_text
                        }
                
                # Fallback: extract structured information
                lines = response_text.strip().split('\n')
                suggestions = {
                    "implementation_approach": "",
                    "key_components": [],
                    "challenges_and_solutions": [],
                    "best_practices": []
                }
                
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
                            suggestions["key_components"].append(item)
                        elif current_section == 'best_practices':
                            suggestions["best_practices"].append(item)
                        elif current_section == 'implementation_approach' and line:
                            suggestions["implementation_approach"] += line + " "
                
                return {
                    "success": True,
                    "suggestions": suggestions,
                    "raw_response": response_text
                }
                
            except (json.JSONDecodeError, KeyError, IndexError) as e:
                logging.error(f"Failed to parse AI response: {str(e)}")
                return {
                    "success": False,
                    "error": f"Failed to parse AI response: {str(e)}",
                    "suggestions": None,
                    "raw_response": response_text
                }
                
        except Exception as e:
            logging.error(f"Failed to generate code suggestions: {str(e)}")
            return {
                "success": False,
                "error": f"Failed to generate code suggestions: {str(e)}",
                "suggestions": None,
                "raw_response": None
            }

# Global AI service instance
ai_service = AIService()