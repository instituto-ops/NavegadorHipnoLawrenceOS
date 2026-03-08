import os
import httpx
from dotenv import load_dotenv
from typing import Any

load_dotenv()


class WordPressService:
    def __init__(self):
        self.url = os.getenv("WP_URL")
        self.username = os.getenv("WP_USERNAME")
        self.password = os.getenv("WP_APP_PASSWORD")
        self.base_api_url = (
            f"{self.url.rstrip('/')}/wp-json/wp/v2" if self.url else None
        )

    def _get_auth(self):
        if not self.username or not self.password:
            return None
        return (self.username, self.password)

    async def get_site_stats(self):
        """Fetch basic stats from WordPress."""
        if not self.base_api_url:
            return {"error": "WP_URL not configured in .env"}

        auth = self._get_auth()
        if not auth:
            return {"error": "WP_USERNAME or WP_APP_PASSWORD not configured."}

        stats = {}
        try:
            async with httpx.AsyncClient() as client:
                # Get total posts
                posts_resp = await client.get(
                    f"{self.base_api_url}/posts?per_page=1", auth=auth
                )
                stats["total_posts"] = posts_resp.headers.get("X-WP-Total", "0")

                # Get total pages
                pages_resp = await client.get(
                    f"{self.base_api_url}/pages?per_page=1", auth=auth
                )
                stats["total_pages"] = pages_resp.headers.get("X-WP-Total", "0")

                # Get total comments
                comments_resp = await client.get(
                    f"{self.base_api_url}/comments?per_page=1", auth=auth
                )
                stats["total_comments"] = comments_resp.headers.get("X-WP-Total", "0")

                # Get recent posts (titles)
                recent_posts_resp = await client.get(
                    f"{self.base_api_url}/posts?per_page=5", auth=auth
                )
                recent_posts = recent_posts_resp.json()
                stats["recent_posts"] = [
                    {"title": p["title"]["rendered"], "date": p["date"]}
                    for p in recent_posts
                ]

            return stats
        except Exception as e:
            return {"error": str(e)}

    async def create_post(
        self,
        title: str,
        content: str,
        status: str = "publish",
        categories: list | None = None,
        tags: list | None = None,
    ):
        """Create a new post in WordPress."""
        if not self.base_api_url:
            return {"error": "WP_URL not configured in .env"}

        auth = self._get_auth()
        if not auth:
            return {"error": "WP_USERNAME or WP_APP_PASSWORD not configured."}

        payload: dict[str, Any] = {"title": title, "content": content, "status": status}
        if categories:
            payload["categories"] = categories
        if tags:
            payload["tags"] = tags

        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    f"{self.base_api_url}/posts", json=payload, auth=auth
                )
                # Check for errors before trying to parse json
                if resp.status_code >= 400:
                    return {
                        "error": f"WordPress API error: {resp.status_code}",
                        "details": resp.text,
                    }
                return resp.json()
        except Exception as e:
            return {"error": str(e)}


# Singleton instance
wp_service = WordPressService()
