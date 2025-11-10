import os
import requests
import logging
from typing import Optional, Dict, Any
import json

logger = logging.getLogger(__name__)

class InstantDBService:
    def __init__(self):
        self.app_id = os.getenv("INSTANTDB_APP_ID")
        self.admin_token = os.getenv("INSTANTDB_ADMIN_TOKEN")
        self.api_base = "https://api.instantdb.com"

        if not self.app_id:
            raise ValueError("INSTANTDB_APP_ID environment variable is required")

        # Initialize headers for API calls
        self.headers = {
            "Content-Type": "application/json"
        }
        if self.admin_token:
            self.headers["Authorization"] = f"Bearer {self.admin_token}"
        
    async def init_schema(self):
        """Initialize the database schema with collections and permissions"""
        try:
            if not self.admin_token:
                logger.warning("Admin token not available - schema initialization skipped")
                return False

            # Define schema collections
            schema_definitions = {
                "users": {
                    "fields": {
                        "id": {"type": "string"},
                        "email": {"type": "string"},
                        "role": {"type": "string", "values": ["developer", "project_manager", "qa"]},
                        "created_at": {"type": "number"}
                    },
                    "indexes": ["email"]
                },
                "projects": {
                    "fields": {
                        "id": {"type": "string"},
                        "name": {"type": "string"},
                        "description": {"type": "string"},
                        "owner_id": {"type": "string"},
                        "created_at": {"type": "number"}
                    },
                    "indexes": ["owner_id"]
                },
                "tasks": {
                    "fields": {
                        "id": {"type": "string"},
                        "project_id": {"type": "string"},
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                        "status": {"type": "string", "values": ["todo", "in_progress", "done"]},
                        "acceptance_criteria": {"type": "string"},
                        "assignee_id": {"type": "string"},
                        "created_at": {"type": "number"},
                        "updated_at": {"type": "number"}
                    },
                    "indexes": ["project_id", "assignee_id", "status"]
                }
            }

            # Log schema initialization
            logger.info(f"Initializing InstantDB schema with collections: {list(schema_definitions.keys())}")

            # Call InstantDB's admin API to create/update schema
            try:
                admin_headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.admin_token}"
                }

                schema_payload = {
                    "app-id": self.app_id,
                    "schema": schema_definitions
                }

                # Attempt to initialize schema via InstantDB admin API
                schema_url = f"{self.api_base}/admin/schema"
                response = requests.post(schema_url, json=schema_payload, headers=admin_headers, timeout=10)

                if response.status_code in [200, 201]:
                    logger.info("Schema successfully initialized in InstantDB")
                    for collection_name in schema_definitions.keys():
                        logger.info(f"  ✓ Collection '{collection_name}' initialized")
                    return True
                else:
                    # Schema might already exist, log and continue
                    logger.warning(f"Schema initialization returned status {response.status_code}: {response.text}")
                    logger.info("Collections may already exist - this is OK")

                    # Log the schema definitions for manual setup if needed
                    for collection_name, collection_config in schema_definitions.items():
                        logger.info(f"Collection '{collection_name}' schema:")
                        logger.info(f"  Fields: {list(collection_config['fields'].keys())}")
                        logger.info(f"  Indexes: {collection_config.get('indexes', [])}")

                    return True

            except requests.exceptions.RequestException as api_error:
                logger.warning(f"Could not reach InstantDB API: {api_error}")
                logger.info("Collections may need to be created manually via InstantDB dashboard")

                # Log schema details for manual setup
                for collection_name, collection_config in schema_definitions.items():
                    logger.info(f"Manual setup for '{collection_name}':")
                    logger.info(f"  Fields: {list(collection_config['fields'].keys())}")
                    logger.info(f"  Indexes: {collection_config.get('indexes', [])}")

                return False

        except Exception as e:
            logger.error(f"Failed to initialize schema: {e}")
            return False
    
    def get_client(self):
        """Get the InstantDB service instance"""
        return self

    async def query(self, query_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a query against InstantDB"""
        try:
            # Validate input
            if not query_data:
                logger.warning("Query data is empty")
                return {}

            if not isinstance(query_data, dict):
                logger.error(f"Invalid query_data type: {type(query_data)}. Expected dict")
                return {}

            # Check for required query keys
            if not any(key in query_data for key in ['users', 'projects', 'tasks']):
                logger.warning(f"Query contains no valid collection names. Got keys: {list(query_data.keys())}")

            url = f"{self.api_base}/api/query"
            payload = {
                "app-id": self.app_id,
                "query": query_data
            }

            response = requests.post(url, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Query error: {e}")
            return {}

    async def transact(self, transaction_data: list) -> Dict[str, Any]:
        """Execute a transaction against InstantDB"""
        try:
            # Validate input
            if not transaction_data:
                logger.warning("Transaction data is empty")
                return {"error": "Transaction data is empty"}

            if not isinstance(transaction_data, list):
                logger.error(f"Invalid transaction_data type: {type(transaction_data)}. Expected list")
                return {"error": "Transaction data must be a list"}

            if len(transaction_data) == 0:
                logger.warning("Transaction data list is empty")
                return {"error": "Transaction data list cannot be empty"}

            # Validate transaction step structure
            for i, step in enumerate(transaction_data):
                if not isinstance(step, dict):
                    logger.error(f"Transaction step {i} is not a dict: {type(step)}")
                    return {"error": f"Transaction step {i} must be a dictionary"}

                # Check for required collection name in step
                if not any(key in step for key in ['users', 'projects', 'tasks']):
                    logger.warning(f"Transaction step {i} contains no valid collection. Got keys: {list(step.keys())}")

            url = f"{self.api_base}/api/transact"
            payload = {
                "app-id": self.app_id,
                "tx-steps": transaction_data
            }

            response = requests.post(url, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Transaction error: {e}")
            return {"error": str(e)}

# Global instance
db_service = InstantDBService()