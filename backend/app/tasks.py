from typing import Dict, Any, List, Optional
from datetime import datetime
from app.database import db_service
from app.auth import auth_service
import uuid

class TaskService:
    def __init__(self):
        self.db = db_service.get_client()
    
    async def create_task(self, task_data: Dict[str, Any], current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new task"""
        try:
            # Generate task ID and timestamps
            task_id = str(uuid.uuid4())
            now = int(datetime.now().timestamp())
            
            # Prepare task data
            new_task = {
                "id": task_id,
                "project_id": task_data.get("project_id"),
                "title": task_data.get("title"),
                "description": task_data.get("description", ""),
                "status": "todo",
                "acceptance_criteria": task_data.get("acceptance_criteria", ""),
                "assignee_id": task_data.get("assignee_id", current_user["id"]),
                "created_at": now,
                "updated_at": now
            }
            
            # Create task in database
            result = await self.db.transact([
                {
                    "tasks": {
                        "create": new_task
                    }
                }
            ])
            
            return {
                "success": True,
                "task": new_task,
                "result": result
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_tasks(self, project_id: Optional[str] = None, current_user: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Get tasks, optionally filtered by project"""
        try:
            query = {"tasks": {}}
            
            if project_id:
                query["tasks"]["where"] = {"project_id": project_id}
            
            result = await self.db.query(query)
            return result.get("tasks", [])
            
        except Exception as e:
            print(f"Error getting tasks: {e}")
            return []
    
    async def get_task(self, task_id: str, current_user: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Get a specific task by ID"""
        try:
            result = await self.db.query({
                "tasks": {
                    "where": {"id": task_id}
                }
            })
            
            tasks = result.get("tasks", [])
            if tasks:
                return tasks[0]
            return None
            
        except Exception as e:
            print(f"Error getting task {task_id}: {e}")
            return None
    
    async def update_task(self, task_id: str, update_data: Dict[str, Any], current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Update a task"""
        try:
            # Get existing task to check permissions
            existing_task = await self.get_task(task_id, current_user)
            if not existing_task:
                return {
                    "success": False,
                    "error": "Task not found"
                }
            
            # Check if user has permission to update
            if (current_user["id"] != existing_task.get("assignee_id") and 
                current_user["id"] != existing_task.get("owner_id") and
                current_user["role"] != "project_manager"):
                return {
                    "success": False,
                    "error": "Insufficient permissions to update this task"
                }
            
            # Prepare update data
            update_fields = {
                "updated_at": int(datetime.now().timestamp())
            }
            
            # Only update provided fields
            for field in ["title", "description", "status", "acceptance_criteria", "assignee_id"]:
                if field in update_data:
                    update_fields[field] = update_data[field]
            
            # Update task in database
            result = await self.db.transact([
                {
                    "tasks": {
                        "update": {
                            "where": {"id": task_id},
                            "set": update_fields
                        }
                    }
                }
            ])
            
            return {
                "success": True,
                "updated_fields": update_fields,
                "result": result
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def delete_task(self, task_id: str, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Delete a task"""
        try:
            # Get existing task to check permissions
            existing_task = await self.get_task(task_id, current_user)
            if not existing_task:
                return {
                    "success": False,
                    "error": "Task not found"
                }
            
            # Check if user has permission to delete (only project managers or task owners)
            if (current_user["id"] != existing_task.get("owner_id") and
                current_user["role"] != "project_manager"):
                return {
                    "success": False,
                    "error": "Insufficient permissions to delete this task"
                }
            
            # Delete task from database
            result = await self.db.transact([
                {
                    "tasks": {
                        "delete": {
                            "where": {"id": task_id}
                        }
                    }
                }
            ])
            
            return {
                "success": True,
                "result": result
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_tasks_by_status(self, status: str, project_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get tasks filtered by status"""
        try:
            query = {
                "tasks": {
                    "where": {"status": status}
                }
            }
            
            if project_id:
                query["tasks"]["where"]["project_id"] = project_id
            
            result = await self.db.query(query)
            return result.get("tasks", [])
            
        except Exception as e:
            print(f"Error getting tasks by status {status}: {e}")
            return []

# Global task service instance
task_service = TaskService()