from enum import Enum
from typing import List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class InsightCategory(str, Enum):
    PRIORITY = "Priority"
    RISK = "Risk"
    OPPORTUNITY = "Opportunity"
    TREND = "Trend"

class IntelligenceSource(BaseModel):
    id: str = Field(..., description="Unique identifier for the source")
    type: str = Field(..., description="Type of source data, e.g., 'review', 'campaign', 'ad_copy', 'metric'")
    origin: str = Field(..., description="Origin URL, platform, or source location")
    timestamp: datetime = Field(..., description="When the data was captured")
    freshness: float = Field(..., ge=0.0, le=1.0, description="Freshness score from 0.0 to 1.0")
    reliability: float = Field(..., ge=0.0, le=1.0, description="Reliability score from 0.0 to 1.0")
    raw_data: Dict[str, Any] = Field(default_factory=dict, description="Raw unstructured data from the source")

class NeuroInsight(BaseModel):
    id: str = Field(..., description="Unique identifier for the insight")
    source_id: str = Field(..., description="Reference to the IntelligenceSource id")
    category: InsightCategory = Field(..., description="Category of the insight: Priority, Risk, Opportunity, or Trend")
    title: str = Field(..., description="Short descriptive title of the insight")
    description: str = Field(..., description="Detailed explanation of the insight")
    actionable_items: List[str] = Field(default_factory=list, description="List of suggested actions based on this insight")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Confidence score from 0.0 to 1.0")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="When the insight was generated")
