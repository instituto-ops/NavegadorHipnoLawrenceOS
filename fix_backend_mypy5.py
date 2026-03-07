import re

# analytics/wordpress_service.py
with open("apps/backend/analytics/wordpress_service.py", "r") as f:
    content = f.read()

content = "from typing import Any\n" + content

with open("apps/backend/analytics/wordpress_service.py", "w") as f:
    f.write(content)

# main.py
with open("apps/backend/main.py", "r") as f:
    content = f.read()

content = content.replace("config: Any = {\"configurable\": {\"thread_id\": thread_id}}", "_config: Any = {\"configurable\": {\"thread_id\": thread_id}}")
content = content.replace("config, {\"hitl_approved\"", "_config, {\"hitl_approved\"")
content = content.replace("None, config, thread_id", "None, _config, thread_id")

with open("apps/backend/main.py", "w") as f:
    f.write(content)
