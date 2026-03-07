import re

# analytics/wordpress_service.py
with open("apps/backend/analytics/wordpress_service.py", "r") as f:
    content = f.read()

content = content.replace("def create_post(self, title: str, content: str, status: str = 'draft', categories: list = None, tags: list = None):", "def create_post(self, title: str, content: str, status: str = 'draft', categories: list | None = None, tags: list | None = None):")
content = content.replace("categories: list | None = None", "categories: list | None = None") # already done actually?
content = re.sub(r"def create_post\(self,\s*title:\s*str,\s*content:\s*str,\s*status:\s*str\s*=\s*'draft',\s*categories:\s*list\s*=\s*None,\s*tags:\s*list\s*=\s*None\):", "def create_post(self, title: str, content: str, status: str = 'draft', categories: list | None = None, tags: list | None = None):", content)
content = re.sub(r"def create_post\(self,\s*title:\s*str,\s*content:\s*str,\s*status:\s*str\s*=\s*'draft',\s*categories:\s*list\s*\|\s*None\s*=\s*None,\s*tags:\s*list\s*\|\s*None\s*=\s*None\):", "def create_post(self, title: str, content: str, status: str = 'draft', categories: list | None = None, tags: list | None = None):", content)

with open("apps/backend/analytics/wordpress_service.py", "w") as f:
    f.write(content)

# Use sed for reliable replacement
