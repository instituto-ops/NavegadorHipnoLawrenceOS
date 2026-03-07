import os
import httpx
from dotenv import load_dotenv

load_dotenv()

class PageSpeedService:
    def __init__(self):
        self.api_key = os.getenv("PAGESPEED_API_KEY")
        self.base_url = "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed"

    async def run_analysis(self, url: str, strategy: str = "MOBILE", categories: list | None = None):
        """
        Runs PageSpeed analysis on a specific URL.
        :param url: The URL to analyze.
        :param strategy: 'MOBILE' or 'DESKTOP'.
        :param categories: List of categories (PERFORMANCE, ACCESSIBILITY, BEST_PRACTICES, SEO).
        """
        if not url:
            return {"error": "URL is required for analysis."}

        # Default categories if none provided
        if not categories:
            categories = ["PERFORMANCE", "ACCESSIBILITY", "BEST_PRACTICES", "SEO"]

        params = {
            "url": url,
            "strategy": strategy,
            "category": categories
        }

        if self.api_key:
            params["key"] = self.api_key

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.get(self.base_url, params=params)

                if response.status_code != 200:
                    return {
                        "error": f"PageSpeed API call failed with status {response.status_code}",
                        "details": response.text
                    }

                data = response.json()

                # Extract main scores for quick dashboard view
                result = {
                    "id": data.get("id"),
                    "fetchTime": data.get("analysisUTCTimestamp"),
                    "scores": {}
                }

                lighthouse_res = data.get("lighthouseResult", {})
                categories_res = lighthouse_res.get("categories", {})

                for cat_id, cat_data in categories_res.items():
                    result["scores"][cat_id] = round(cat_data.get("score", 0) * 100)

                # Full report can also be returned or stored
                # result["full_report"] = data

                return result
        except Exception as e:
            return {"error": str(e)}

# Singleton instance
pagespeed_service = PageSpeedService()
