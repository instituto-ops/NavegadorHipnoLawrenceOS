import re

# analytics/wordpress_service.py
with open("apps/backend/analytics/wordpress_service.py", "r") as f:
    content = f.read()

content = content.replace("def create_post(self, title: str, content: str, status: str = 'draft', categories: list = None, tags: list = None):", "def create_post(self, title: str, content: str, status: str = 'draft', categories: list | None = None, tags: list | None = None):")

with open("apps/backend/analytics/wordpress_service.py", "w") as f:
    f.write(content)

# analytics/pagespeed_service.py
with open("apps/backend/analytics/pagespeed_service.py", "r") as f:
    content = f.read()

content = content.replace("def get_pagespeed_insights(self, url: str, strategy: str = 'mobile', categories: list = None):", "def get_pagespeed_insights(self, url: str, strategy: str = 'mobile', categories: list | None = None):")

with open("apps/backend/analytics/pagespeed_service.py", "w") as f:
    f.write(content)
