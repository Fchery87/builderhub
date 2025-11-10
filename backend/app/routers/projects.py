from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.auth import get_optional_user
from app.database import db_service
from app.performance import monitor_performance
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/projects", tags=["projects"])

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    description: str
    owner_id: str
    created_at: int
    task_count: Optional[int] = 0

class ProjectListResponse(BaseModel):
    projects: List[ProjectResponse]

@router.get("/", response_model=ProjectListResponse)
@monitor_performance
async def get_projects(
    current_user: Dict[str, Any] = Depends(get_optional_user)
):
    """Get all projects"""
    try:
        db = db_service.get_client()
        result = await db.query({
            "projects": {}
        })

        projects = result.get("projects", [])

        # Add task count to each project (mock for now)
        for project in projects:
            project["task_count"] = 0

        return {"projects": projects}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get projects: {str(e)}"
        )

@router.post("/", response_model=ProjectResponse)
@monitor_performance
async def create_project(
    project_data: ProjectCreate,
    current_user: Dict[str, Any] = Depends(get_optional_user)
):
    """Create a new project"""
    try:
        db = db_service.get_client()

        project_id = str(uuid.uuid4())
        now = int(datetime.now().timestamp())

        await db.transact([
            {
                "projects": {
                    "create": {
                        "id": project_id,
                        "name": project_data.name,
                        "description": project_data.description or "",
                        "owner_id": current_user["id"],
                        "created_at": now
                    }
                }
            }
        ])

        return {
            "id": project_id,
            "name": project_data.name,
            "description": project_data.description or "",
            "owner_id": current_user["id"],
            "created_at": now,
            "task_count": 0
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create project: {str(e)}"
        )

@router.get("/{project_id}", response_model=ProjectResponse)
@monitor_performance
async def get_project(
    project_id: str,
    current_user: Dict[str, Any] = Depends(get_optional_user)
):
    """Get a specific project"""
    try:
        db = db_service.get_client()

        result = await db.query({
            "projects": {
                "where": {"id": project_id}
            }
        })

        projects = result.get("projects", [])
        if not projects:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )

        project = projects[0]
        project["task_count"] = 0
        return project

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get project: {str(e)}"
        )

@router.put("/{project_id}", response_model=ProjectResponse)
@monitor_performance
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    current_user: Dict[str, Any] = Depends(get_optional_user)
):
    """Update a project"""
    try:
        db = db_service.get_client()

        # Check if project exists
        result = await db.query({
            "projects": {
                "where": {"id": project_id}
            }
        })

        projects = result.get("projects", [])
        if not projects:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )

        project = projects[0]

        # Check permission - only owner can update
        if project["owner_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to update this project"
            )

        # Prepare update data
        update_data = {}
        if project_data.name is not None:
            update_data["name"] = project_data.name
        if project_data.description is not None:
            update_data["description"] = project_data.description

        if update_data:
            await db.transact([
                {
                    "projects": {
                        "update": {
                            "where": {"id": project_id},
                            "data": update_data
                        }
                    }
                }
            ])

        # Return updated project
        project.update(update_data)
        project["task_count"] = 0
        return project

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update project: {str(e)}"
        )

@router.delete("/{project_id}")
@monitor_performance
async def delete_project(
    project_id: str,
    current_user: Dict[str, Any] = Depends(get_optional_user)
):
    """Delete a project"""
    try:
        db = db_service.get_client()

        # Check if project exists
        result = await db.query({
            "projects": {
                "where": {"id": project_id}
            }
        })

        projects = result.get("projects", [])
        if not projects:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )

        project = projects[0]

        # Check permission - only owner can delete
        if project["owner_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to delete this project"
            )

        # Delete project
        await db.transact([
            {
                "projects": {
                    "delete": {
                        "where": {"id": project_id}
                    }
                }
            }
        ])

        return {"message": "Project deleted successfully", "project_id": project_id}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete project: {str(e)}"
        )
