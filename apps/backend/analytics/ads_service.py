import os
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from dotenv import load_dotenv

load_dotenv()

class GoogleAdsService:
    def __init__(self):
        self.developer_token = os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN")
        self.customer_id = os.getenv("GOOGLE_ADS_CUSTOMER_ID", "").replace("-", "")
        self.json_key_file = os.getenv("GOOGLE_ADS_JSON_KEY_FILE")
        self.client = None

    def _initialize_client(self):
        if self.client:
            return True

        if not self.developer_token:
            return False

        try:
            if self.json_key_file and os.path.exists(self.json_key_file):
                # Service Account Flow
                config = {
                    "developer_token": self.developer_token,
                    "json_key_file_path": self.json_key_file,
                    "use_proto_plus": True
                }
                self.client = GoogleAdsClient.load_from_dict(config)
            else:
                # OAuth2 Flow (Fallback)
                config = {
                    "developer_token": self.developer_token,
                    "client_id": os.getenv("GOOGLE_ADS_CLIENT_ID"),
                    "client_secret": os.getenv("GOOGLE_ADS_CLIENT_SECRET"),
                    "refresh_token": os.getenv("GOOGLE_ADS_REFRESH_TOKEN"),
                    "login_customer_id": os.getenv("GOOGLE_ADS_LOGIN_CUSTOMER_ID"),
                    "use_proto_plus": True
                }
                if not config["refresh_token"]:
                    return False
                self.client = GoogleAdsClient.load_from_dict(config)
            return True
        except Exception as e:
            print(f"Error initializing Google Ads Client: {e}")
            return False

    def get_campaign_performance(self):
        """Fetches performance metrics for campaigns."""
        if not self._initialize_client():
            return {"error": "Google Ads Client not initialized. Check your credentials in .env"}

        if not self.customer_id:
            return {"error": "GOOGLE_ADS_CUSTOMER_ID not set in .env"}

        ga_service = self.client.get_service("GoogleAdsService")
        query = """
            SELECT
              campaign.name,
              metrics.clicks,
              metrics.impressions,
              metrics.cost_micros,
              metrics.conversions,
              metrics.conversions_value
            FROM campaign
            WHERE segments.date DURING LAST_30_DAYS
        """

        try:
            stream = ga_service.search_stream(customer_id=self.customer_id, query=query)
            results = []
            for batch in stream:
                for row in batch.results:
                    results.append({
                        "campaign": row.campaign.name,
                        "clicks": row.metrics.clicks,
                        "impressions": row.metrics.impressions,
                        "cost": row.metrics.cost_micros / 1000000,
                        "conversions": row.metrics.conversions,
                        "value": row.metrics.conversions_value
                    })
            return results
        except GoogleAdsException as ex:
            print(f"Request with ID '{ex.request_id}' failed with status "
                  f"'{ex.error.code().name}' and includes the following errors:")
            error_msgs = []
            for error in ex.failure.errors:
                print(f"\tError with message '{error.message}'.")
                error_msgs.append(error.message)
                if error.location:
                    for field_path_element in error.location.field_path_elements:
                        print(f"\t\tOn field: {field_path_element.field_name}")
            return {"error": ", ".join(error_msgs)}
        except Exception as e:
            return {"error": str(e)}

# Singleton instance
ads_service = GoogleAdsService()
