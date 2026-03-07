with open("apps/backend/agent/jules.py", "r") as f:
    content = f.read()
content = content.replace("import json\n", "")
content = content.replace("audit_parser = subparsers.add_parser(\"audit-ads\", help=\"Audit visibility across specific Google Ads pages\")", "subparsers.add_parser(\"audit-ads\", help=\"Audit visibility across specific Google Ads pages\")")
with open("apps/backend/agent/jules.py", "w") as f:
    f.write(content)

with open("apps/backend/analytics/ads_service.py", "r") as f:
    content = f.read()
content = content.replace("import sys\n", "")
with open("apps/backend/analytics/ads_service.py", "w") as f:
    f.write(content)

with open("apps/backend/analytics/__init__.py", "w") as f:
    f.write("""from .ga4_service import ga4_service as ga4_service
from .ads_service import ads_service as ads_service
from .gbp_service import gbp_service as gbp_service
from .wordpress_service import wp_service as wp_service
from .n8n_service import n8n_service as n8n_service
from .instagram_service import instagram_service as instagram_service
from .pagespeed_service import pagespeed_service as pagespeed_service

__all__ = [
    "ga4_service",
    "ads_service",
    "gbp_service",
    "wp_service",
    "n8n_service",
    "instagram_service",
    "pagespeed_service"
]
""")

with open("apps/backend/analytics/gbp_service.py", "r") as f:
    content = f.read()
content = content.replace("service = build('businessprofileperformance', 'v1', credentials=creds)", "build('businessprofileperformance', 'v1', credentials=creds)")
content = content.replace("location_name = f\"locations/{self.location_id}\"", "f\"locations/{self.location_id}\"")
with open("apps/backend/analytics/gbp_service.py", "w") as f:
    f.write(content)
