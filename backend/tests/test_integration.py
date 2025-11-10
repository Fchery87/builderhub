"""
Integration tests for BuilderHub core features.
Tests critical paths for authentication, project management, and task management.
"""

import pytest
import json
from httpx import AsyncClient
from app.main import app
from app.database import db_service


@pytest.fixture
def client():
    """Fixture for creating a test client."""
    return AsyncClient(app=app, base_url="http://test")


@pytest.fixture
async def auth_token(client):
    """Fixture to create a user and return an auth token."""
    # Sign up with password
    response = await client.post(
        "/api/auth/signup-password",
        json={
            "email": "testuser@example.com",
            "name": "Test User",
            "password": "TestPassword123",
        }
    )

    if response.status_code == 200:
        data = response.json()
        return data.get("access_token")

    raise Exception("Failed to create test user")


class TestAuthentication:
    """Tests for authentication endpoints."""

    async def test_signup_with_password(self, client):
        """Test password-based signup."""
        response = await client.post(
            "/api/auth/signup-password",
            json={
                "email": "newuser@example.com",
                "name": "New User",
                "password": "SecurePassword123",
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data

    async def test_signup_invalid_email(self, client):
        """Test signup with invalid email."""
        response = await client.post(
            "/api/auth/signup-password",
            json={
                "email": "not-an-email",
                "name": "Invalid User",
                "password": "SecurePassword123",
            }
        )

        assert response.status_code >= 400

    async def test_signup_short_password(self, client):
        """Test signup with password that's too short."""
        response = await client.post(
            "/api/auth/signup-password",
            json={
                "email": "user@example.com",
                "name": "Test User",
                "password": "short",
            }
        )

        assert response.status_code >= 400

    async def test_login_with_password(self, client):
        """Test password-based login."""
        # First, sign up
        signup_response = await client.post(
            "/api/auth/signup-password",
            json={
                "email": "logintest@example.com",
                "name": "Login Test",
                "password": "TestPassword123",
            }
        )

        assert signup_response.status_code == 200

        # Then try to login
        login_response = await client.post(
            "/api/auth/login-password",
            json={
                "email": "logintest@example.com",
                "password": "TestPassword123",
            }
        )

        assert login_response.status_code == 200
        data = login_response.json()
        assert "access_token" in data

    async def test_login_invalid_password(self, client):
        """Test login with invalid password."""
        # First, sign up
        await client.post(
            "/api/auth/signup-password",
            json={
                "email": "badpass@example.com",
                "name": "Bad Pass Test",
                "password": "CorrectPassword123",
            }
        )

        # Try to login with wrong password
        response = await client.post(
            "/api/auth/login-password",
            json={
                "email": "badpass@example.com",
                "password": "WrongPassword123",
            }
        )

        assert response.status_code >= 400

    async def test_get_current_user(self, client, auth_token):
        """Test getting current user information."""
        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "email" in data
        assert "role" in data

    async def test_get_current_user_without_token(self, client):
        """Test getting current user without token."""
        response = await client.get("/api/auth/me")

        assert response.status_code >= 400


class TestProjectManagement:
    """Tests for project management endpoints."""

    async def test_create_project(self, client, auth_token):
        """Test creating a new project."""
        response = await client.post(
            "/api/projects",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "name": "Test Project",
                "description": "A test project for integration testing",
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Project"
        assert data["description"] == "A test project for integration testing"
        assert "id" in data
        assert "owner_id" in data

    async def test_get_projects(self, client, auth_token):
        """Test getting all projects."""
        # First create a project
        await client.post(
            "/api/projects",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "name": "Project to List",
                "description": "Test listing",
            }
        )

        # Then get projects
        response = await client.get(
            "/api/projects",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "projects" in data
        assert isinstance(data["projects"], list)

    async def test_get_project_by_id(self, client, auth_token):
        """Test getting a specific project."""
        # Create a project
        create_response = await client.post(
            "/api/projects",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "name": "Specific Project",
                "description": "Test getting by ID",
            }
        )

        project_id = create_response.json()["id"]

        # Get the project
        get_response = await client.get(
            f"/api/projects/{project_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert get_response.status_code == 200
        data = get_response.json()
        assert data["id"] == project_id
        assert data["name"] == "Specific Project"

    async def test_update_project(self, client, auth_token):
        """Test updating a project."""
        # Create a project
        create_response = await client.post(
            "/api/projects",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "name": "Original Name",
                "description": "Original description",
            }
        )

        project_id = create_response.json()["id"]

        # Update the project
        update_response = await client.put(
            f"/api/projects/{project_id}",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "name": "Updated Name",
                "description": "Updated description",
            }
        )

        assert update_response.status_code == 200
        data = update_response.json()
        assert data["name"] == "Updated Name"
        assert data["description"] == "Updated description"

    async def test_delete_project(self, client, auth_token):
        """Test deleting a project."""
        # Create a project
        create_response = await client.post(
            "/api/projects",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "name": "Project to Delete",
                "description": "Will be deleted",
            }
        )

        project_id = create_response.json()["id"]

        # Delete the project
        delete_response = await client.delete(
            f"/api/projects/{project_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert delete_response.status_code == 200

        # Verify it's deleted
        get_response = await client.get(
            f"/api/projects/{project_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert get_response.status_code == 404

    async def test_update_project_not_owner(self, client):
        """Test that non-owners can't update projects."""
        # Create a project with one user
        token1_response = await client.post(
            "/api/auth/signup-password",
            json={
                "email": "owner@example.com",
                "name": "Owner",
                "password": "Password123",
            }
        )
        token1 = token1_response.json()["access_token"]

        create_response = await client.post(
            "/api/projects",
            headers={"Authorization": f"Bearer {token1}"},
            json={
                "name": "Owner's Project",
                "description": "Only owner can modify",
            }
        )

        project_id = create_response.json()["id"]

        # Try to update with a different user
        token2_response = await client.post(
            "/api/auth/signup-password",
            json={
                "email": "other@example.com",
                "name": "Other User",
                "password": "Password123",
            }
        )
        token2 = token2_response.json()["access_token"]

        update_response = await client.put(
            f"/api/projects/{project_id}",
            headers={"Authorization": f"Bearer {token2}"},
            json={
                "name": "Hacked Name",
            }
        )

        assert update_response.status_code == 403


class TestTaskManagement:
    """Tests for task management endpoints."""

    async def test_create_task(self, client, auth_token):
        """Test creating a new task."""
        # First create a project
        project_response = await client.post(
            "/api/projects",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "name": "Task Project",
                "description": "For task testing",
            }
        )

        project_id = project_response.json()["id"]

        # Create a task
        task_response = await client.post(
            "/api/tasks",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "project_id": project_id,
                "title": "Test Task",
                "description": "A test task",
                "status": "todo",
                "acceptance_criteria": "Task should be created",
            }
        )

        assert task_response.status_code == 200
        data = task_response.json()
        assert data["title"] == "Test Task"
        assert data["project_id"] == project_id
        assert data["status"] == "todo"

    async def test_get_tasks(self, client, auth_token):
        """Test getting all tasks."""
        response = await client.get(
            "/api/tasks",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "tasks" in data
        assert isinstance(data["tasks"], list)

    async def test_update_task_status(self, client, auth_token):
        """Test updating task status."""
        # Create a project and task
        project_response = await client.post(
            "/api/projects",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "name": "Status Project",
                "description": "For status testing",
            }
        )

        project_id = project_response.json()["id"]

        task_response = await client.post(
            "/api/tasks",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "project_id": project_id,
                "title": "Status Test Task",
                "description": "Test status updates",
                "status": "todo",
                "acceptance_criteria": "Status should change",
            }
        )

        task_id = task_response.json()["id"]

        # Update status
        update_response = await client.put(
            f"/api/tasks/{task_id}",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "status": "in_progress",
            }
        )

        assert update_response.status_code == 200
        data = update_response.json()
        assert data["status"] == "in_progress"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
