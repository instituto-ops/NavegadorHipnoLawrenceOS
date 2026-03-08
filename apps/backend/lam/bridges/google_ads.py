from typing import List, Optional, Any
from pydantic import BaseModel, Field


class AdsKeyword(BaseModel):
    text: str = Field(..., description="The keyword or search term")
    match_type: Optional[str] = Field(
        default=None, description="Exact, Phrase, or Broad match"
    )
    clicks: Optional[int] = Field(default=0, description="Total clicks")
    impressions: Optional[int] = Field(default=0, description="Total impressions")
    ctr: Optional[float] = Field(
        default=0.0, description="Click-through rate (percentage)"
    )
    cpc: Optional[float] = Field(default=0.0, description="Cost per click")
    cpa: Optional[float] = Field(default=0.0, description="Cost per acquisition")


class AdsCampaign(BaseModel):
    name: str = Field(..., description="Campaign name")
    status: str = Field(default="Active", description="Campaign status")
    keywords: List[AdsKeyword] = Field(
        default_factory=list, description="Keywords in the campaign"
    )
    total_cost: Optional[float] = Field(default=0.0, description="Total spend")


async def read_ads_campaigns(page: Any, url: str) -> str:
    """
    Safely navigates the Google Ads dashboard to extract campaign metrics.
    Returns serialized list of AdsCampaigns or a FAIL string on timeout.
    """
    try:
        response = await page.goto(url, wait_until="networkidle", timeout=20000)
        if not response or not response.ok:
            return f"FAIL: Failed to load Google Ads dashboard at {url}"

        # DOM verification (stealthly wait for typical data tables)
        try:
            await page.wait_for_selector(".campaign-table", timeout=10000)
        except Exception:
            return f"FAIL: Google Ads visual verification failed (table not found) at {url}"

        # Extract campaign names and basic metrics (placeholders)
        campaigns: List[AdsCampaign] = []
        rows = await page.query_selector_all(".campaign-table tr.data-row")
        for row in rows:
            name_el = await row.query_selector(".campaign-name")
            status_el = await row.query_selector(".campaign-status")
            name = await name_el.inner_text() if name_el else "Unnamed Campaign"
            status = await status_el.inner_text() if status_el else "Unknown"

            campaigns.append(AdsCampaign(name=name, status=status))

        # Serialize list
        return "[" + ",".join([c.model_dump_json() for c in campaigns]) + "]"

    except Exception as e:
        return f"FAIL: Google Ads data extraction exception: {str(e)}"
