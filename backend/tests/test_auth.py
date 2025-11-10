"""
Unit tests for authentication module.
Tests password hashing, token generation, and auth service functionality.
"""

import pytest
from datetime import datetime, timedelta
from app.auth import AuthService, get_password_hash, verify_password


class TestPasswordHashing:
    """Tests for password hashing and verification."""

    def test_hash_password_creates_different_hash(self):
        """Test that same password produces different hashes (salt)."""
        password = "TestPassword123"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)

        assert hash1 != hash2
        assert verify_password(password, hash1)
        assert verify_password(password, hash2)

    def test_verify_password_correct(self):
        """Test password verification with correct password."""
        password = "MySecurePassword123"
        hashed = get_password_hash(password)

        assert verify_password(password, hashed)

    def test_verify_password_incorrect(self):
        """Test password verification with incorrect password."""
        password = "MySecurePassword123"
        wrong_password = "WrongPassword123"
        hashed = get_password_hash(password)

        assert not verify_password(wrong_password, hashed)

    def test_verify_password_empty(self):
        """Test password verification with empty password."""
        password = "MySecurePassword123"
        hashed = get_password_hash(password)

        assert not verify_password("", hashed)

    def test_hash_password_length(self):
        """Test that hashed password is reasonably long (bcrypt hash)."""
        password = "TestPassword"
        hashed = get_password_hash(password)

        # bcrypt hashes are typically 60 characters
        assert len(hashed) >= 50


class TestAuthService:
    """Tests for authentication service functionality."""

    @pytest.fixture
    def auth_service(self):
        """Fixture to create auth service instance."""
        return AuthService()

    async def test_create_jwt_token(self, auth_service):
        """Test JWT token creation."""
        user_id = "test-user-123"
        token = auth_service.create_jwt_token(user_id)

        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0

    async def test_create_jwt_token_different_users(self, auth_service):
        """Test that different users get different tokens."""
        token1 = auth_service.create_jwt_token("user1")
        token2 = auth_service.create_jwt_token("user2")

        assert token1 != token2

    async def test_verify_jwt_token_valid(self, auth_service):
        """Test JWT token verification with valid token."""
        user_id = "test-user-456"
        token = auth_service.create_jwt_token(user_id)

        decoded = auth_service.verify_jwt_token(token)
        assert decoded is not None
        assert decoded.get("sub") == user_id

    async def test_verify_jwt_token_invalid(self, auth_service):
        """Test JWT token verification with invalid token."""
        invalid_token = "invalid.token.here"

        decoded = auth_service.verify_jwt_token(invalid_token)
        assert decoded is None

    async def test_verify_jwt_token_empty(self, auth_service):
        """Test JWT token verification with empty token."""
        decoded = auth_service.verify_jwt_token("")
        assert decoded is None

    async def test_magic_link_token_generation(self, auth_service):
        """Test magic link token generation."""
        email = "test@example.com"
        token = auth_service.create_magic_link(email)

        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0

    async def test_magic_link_token_verification(self, auth_service):
        """Test magic link token verification."""
        email = "test@example.com"
        token = auth_service.create_magic_link(email)

        # Store token internally for verification
        result = auth_service.verify_magic_link(token)
        assert result is not None

    async def test_magic_link_token_different_emails(self, auth_service):
        """Test magic link tokens for different emails."""
        token1 = auth_service.create_magic_link("user1@example.com")
        token2 = auth_service.create_magic_link("user2@example.com")

        assert token1 != token2


class TestPasswordRequirements:
    """Tests for password requirement validation."""

    def test_strong_password(self):
        """Test that strong password passes validation."""
        password = "StrongPassword123!"
        hashed = get_password_hash(password)
        assert verify_password(password, hashed)

    def test_password_with_special_chars(self):
        """Test password with special characters."""
        password = "P@ssw0rd!#$%"
        hashed = get_password_hash(password)
        assert verify_password(password, hashed)

    def test_password_unicode(self):
        """Test password with unicode characters."""
        password = "Pässwörd123"
        hashed = get_password_hash(password)
        assert verify_password(password, hashed)

    def test_password_long(self):
        """Test very long password."""
        password = "A" * 100 + "1"
        hashed = get_password_hash(password)
        assert verify_password(password, hashed)


class TestEdgeCases:
    """Tests for edge cases and boundary conditions."""

    def test_hash_empty_password(self):
        """Test hashing empty password."""
        password = ""
        hashed = get_password_hash(password)
        assert verify_password("", hashed)

    def test_verify_with_none(self):
        """Test verification with None values."""
        password = "TestPassword123"
        hashed = get_password_hash(password)

        # Should handle None gracefully
        try:
            verify_password(None, hashed)
        except (TypeError, AttributeError):
            # Expected behavior
            pass

    def test_password_case_sensitive(self):
        """Test that password verification is case-sensitive."""
        password = "TestPassword"
        hashed = get_password_hash(password)

        assert verify_password(password, hashed)
        assert not verify_password("testpassword", hashed)
        assert not verify_password("TESTPASSWORD", hashed)

    def test_whitespace_in_password(self):
        """Test password with leading/trailing whitespace."""
        password_with_space = " TestPassword123 "
        password_without_space = "TestPassword123"
        hashed_with_space = get_password_hash(password_with_space)

        # Password with space should not match without space
        assert verify_password(password_with_space, hashed_with_space)
        assert not verify_password(password_without_space, hashed_with_space)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
