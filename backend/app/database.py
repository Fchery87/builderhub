import os
import requests
from typing import Optional, Dict, Any
import json

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
        # For now, we'll use a simplified approach
        # In a real implementation, you'd use InstantDB's admin API
        print("Schema initialization would happen here with InstantDB admin API")
        return True
    
    def get_client(self):
        """Get the InstantDB service instance"""
        return self

    async def query(self, query_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a query against InstantDB"""
        try:
            url = f"{self.api_base}/api/query"
            payload = {
                "app-id": self.app_id,
                "query": query_data
            }

            response = requests.post(url, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Query error: {e}")
            return {}

    async def transact(self, transaction_data: list) -> Dict[str, Any]:
        """Execute a transaction against InstantDB"""
        try:
            url = f"{self.api_base}/api/transact"
            payload = {
                "app-id": self.app_id,
                "tx-steps": transaction_data
            }

            response = requests.post(url, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Transaction error: {e}")
            return {"error": str(e)}

# Global instance
db_service = InstantDBService()