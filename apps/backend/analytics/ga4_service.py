import os
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
)
from dotenv import load_dotenv

load_dotenv()

class GA4Service:
    def __init__(self):
        self.property_id = os.getenv("GA4_PROPERTY_ID", "YOUR-GA4-PROPERTY-ID")
        # The client will use GOOGLE_APPLICATION_CREDENTIALS env var automatically
        try:
            self.client = BetaAnalyticsDataClient()
        except Exception as e:
            print(f"Error initializing GA4 Client: {e}")
            self.client = None

    def run_city_report(self):
        """Runs a simple report on a Google Analytics 4 property."""
        if not self.client:
            return {"error": "GA4 Client not initialized"}

        if self.property_id == "YOUR-GA4-PROPERTY-ID":
            return {"error": "GA4_PROPERTY_ID not set in .env"}

        try:
            request = RunReportRequest(
                property=f"properties/{self.property_id}",
                dimensions=[Dimension(name="city")],
                metrics=[Metric(name="activeUsers")],
                date_ranges=[DateRange(start_date="2020-03-31", end_date="today")],
            )
            response = self.client.run_report(request)

            results = []
            for row in response.rows:
                results.append({
                    "city": row.dimension_values[0].value,
                    "activeUsers": row.metric_values[0].value
                })

            return results
        except Exception as e:
            return {"error": str(e)}

# Singleton instance
ga4_service = GA4Service()
