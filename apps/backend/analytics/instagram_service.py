import os
import httpx
from dotenv import load_dotenv

load_dotenv()


class InstagramService:
    def __init__(self):
        self.page_id = os.getenv("INSTAGRAM_PAGE_ID")
        self.access_token = os.getenv("INSTAGRAM_ACCESS_TOKEN")
        self.base_url = (
            f"https://graph.facebook.com/v19.0/{self.page_id}" if self.page_id else None
        )

    async def get_messages(self):
        """Fetch Instagram DMs."""
        if not self.base_url or not self.access_token:
            return {"error": "Instagram credentials not configured."}

        try:
            async with httpx.AsyncClient() as client:
                # Graph API for IG DMs
                resp = await client.get(
                    f"https://graph.facebook.com/v19.0/me/conversations?fields=messages{{message,from,created_time}}&access_token={self.access_token}"
                )
                resp.raise_for_status()
                return resp.json()
        except Exception as e:
            return {"error": str(e)}

    async def reply_to_message(self, recipient_id: str, message_text: str):
        """Send a DM reply via Instagram Graph API."""
        if not self.access_token:
            return {"error": "Instagram access token not configured."}

        # Meta Messaging API endpoint
        url = f"https://graph.facebook.com/v19.0/me/messages?access_token={self.access_token}"

        payload = {"recipient": {"id": recipient_id}, "message": {"text": message_text}}

        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(url, json=payload)
                resp.raise_for_status()
                return resp.json()
        except Exception as e:
            return {"error": str(e)}


# Singleton instance
instagram_service = InstagramService()
