import re

def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/analytics/wordpress_service.py', [
    ('def create_post(self, title: str, content: str, status: str = "draft", categories: list | None = None, tags: list | None = None):', 'def create_post(self, title: str, content: str, status: str = "draft", categories: list[int] | None = None, tags: list[int] | None = None):'),
    ('categories_str: list = categories if categories else []', 'categories_str: list[int] = categories if categories else []'),
    ('tags_str: list = tags if tags else []', 'tags_str: list[int] = tags if tags else []'),
    ('"categories": categories_str,', '"categories": categories_str,'),
    ('"tags": tags_str', '"tags": tags_str')
])

modify_file('apps/backend/main.py', [
    ('snapshot = await orchestrator.graph.aget_state(config)', 'snapshot = await orchestrator.graph.aget_state(hitl_config)')
])
