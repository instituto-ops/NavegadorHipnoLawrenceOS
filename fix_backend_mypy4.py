import re

# analytics/wordpress_service.py
with open("apps/backend/analytics/wordpress_service.py", "r") as f:
    content = f.read()

content = content.replace("payload[\"categories\"] = categories", "payload[\"categories\"] = str(categories)") # Dict might be strictly typed or payload is typed as Dict[str, str]? Actually wait.
content = content.replace("payload[\"tags\"] = tags", "payload[\"tags\"] = str(tags)")

# Let's just set the type hint for payload to Any to avoid these issues.
content = content.replace("payload = {", "payload: dict[str, Any] = {")

with open("apps/backend/analytics/wordpress_service.py", "w") as f:
    f.write(content)
