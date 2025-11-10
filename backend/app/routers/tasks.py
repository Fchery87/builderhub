from fastapi import APIRouter, HTTPException, status, Depends, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.auth import get_current_user_dependency, require_role
from app.tasks import task_service
from app.performance import monitor_performance

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    project_id: str
    assignee_id: Optional[str] = None
    acceptance_criteria: Optional[str] = ""

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    assignee_id: Optional[str] = None
    acceptance_criteria: Optional[str] = None

class TaskResponse(BaseModel):
    id: str
    project_id: str
    title: str
    description: str
    status: str
    acceptance_criteria: str
    assignee_id: str
    created_at: int
    updated_at: int

class TaskListResponse(BaseModel):
    tasks: List[TaskResponse]

@router.post("/", response_model=TaskResponse)
@monitor_performance
async def create_task(
    task_data: TaskCreate,
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Create a new task"""
    try:
        result = await task_service.create_task(task_data.dict(), current_user)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result["error"]
            )
        
        return result["task"]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create task: {str(e)}"
        )

@router.get("/", response_model=TaskListResponse)
@monitor_performance
async def get_tasks(
    project_id: Optional[str] = Query(None, description="Filter by project ID"),
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Get all tasks, optionally filtered by project"""
    try:
        tasks = await task_service.get_tasks(project_id, current_user)
        return {"tasks": tasks}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get tasks: {str(e)}"
        )

@router.get("/{task_id}", response_model=TaskResponse)
@monitor_performance
async def get_task(
    task_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Get a specific task by ID"""
    try:
        task = await task_service.get_task(task_id, current_user)
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        return task
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get task: {str(e)}"
        )

@router.put("/{task_id}", response_model=TaskResponse)
@monitor_performance
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Update a task"""
    try:
        result = await task_service.update_task(task_id, task_data.dict(exclude_unset=True), current_user)
        
        if not result["success"]:
            if "not found" in result["error"].lower():
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=result["error"]
                )
            elif "permission" in result["error"].lower():
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=result["error"]
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=result["error"]
                )
        
        # Return updated task
        updated_task = await task_service.get_task(task_id, current_user)
        return updated_task
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update task: {str(e)}"
        )

@router.delete("/{task_id}")
@monitor_performance
async def delete_task(
    task_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Delete a task"""
    try:
        result = await task_service.delete_task(task_id, current_user)
        
        if not result["success"]:
            if "not found" in result["error"].lower():
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=result["error"]
                )
            elif "permission" in result["error"].lower():
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=result["error"]
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=result["error"]
                )
        
        return {"message": "Task deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete task: {str(e)}"
        )

@router.get("/status/{status}", response_model=TaskListResponse)
async def get_tasks_by_status(
    status: str,
    project_id: Optional[str] = Query(None, description="Filter by project ID"),
    current_user: Dict[str, Any] = Depends(get_current_user_dependency)
):
    """Get tasks filtered by status"""
    try:
        if status not in ["todo", "in_progress", "done"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status. Must be one of: todo, in_progress, done"
            )
        
        tasks = await task_service.get_tasks_by_status(status, project_id)
        return {"tasks": tasks}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get tasks by status: {str(e)}"
        )