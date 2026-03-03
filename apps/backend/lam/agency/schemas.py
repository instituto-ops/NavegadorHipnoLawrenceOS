from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# Represents the high-level task from the user
class MarketingTask(BaseModel):
    task_description: str = Field(
        description="The marketing goal, e.g., 'Launch a new Hypnotherapy campaign for Adults'"
    )
    target_audience: Optional[str] = Field(
        default=None, description="The target audience"
    )


# Represents the generated ad copy
class CopyAsset(BaseModel):
    headline: str = Field(description="The main headline for the ad")
    body: str = Field(description="The body text of the ad")
    call_to_action: str = Field(description="The call to action text")


# Represents structured Ads metrics and budget/keyword optimizations
class AdsAsset(BaseModel):
    suggested_budget: float = Field(description="Suggested budget allocation")
    keywords: List[str] = Field(description="List of suggested keywords")
    optimizations: List[str] = Field(description="Specific optimization suggestions")


# Represents landing page structures and meta-tags
class SEOAsset(BaseModel):
    title_tag: str = Field(description="SEO meta title")
    meta_description: str = Field(description="SEO meta description")
    h1_tag: str = Field(description="Main H1 tag for the landing page")
    content_outline: List[str] = Field(
        description="Suggested sections for the landing page"
    )
