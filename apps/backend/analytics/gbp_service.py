import os
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from dotenv import load_dotenv

load_dotenv()

class GBPService:
    def __init__(self):
        self.scopes = ['https://www.googleapis.com/auth/business.manage']
        self.client_id = os.getenv("GOOGLE_CLIENT_ID")
        self.client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        self.refresh_token = os.getenv("GBP_REFRESH_TOKEN")
        self.account_id = os.getenv("GBP_ACCOUNT_ID")
        self.location_id = os.getenv("GBP_LOCATION_ID")
        self.service = None

    def _get_credentials(self):
        if not self.refresh_token or not self.client_id or not self.client_secret:
            return None
        
        creds = Credentials(
            None,
            refresh_token=self.refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=self.client_id,
            client_secret=self.client_secret,
            scopes=self.scopes
        )
        
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        
        return creds

    def get_performance_data(self):
        """
        Fetches business performance data.
        Note: Requires API approval from Google (Support ticket pending).
        """
        creds = self._get_credentials()
        if not creds:
            return {"error": "GBP Credentials not configured. Refresh token missing."}

        if not self.account_id or not self.location_id:
            return {"error": "GBP Account ID or Location ID not set in .env"}

        try:
            # Performance API: businessprofileperformance
            _service = build('businessprofileperformance', 'v1', credentials=creds)
            
            # Example: Fetching impressions
            # This will fail until the API access is approved
            _location_name = f"locations/{self.location_id}"
            
            # Simplified placeholder response for now
            return {
                "status": "connected",
                "message": "GBP Service ready. Waiting for API approval for location: " + self.location_id
            }
        except Exception as e:
            return {"error": str(e)}

# Singleton instance
gbp_service = GBPService()
