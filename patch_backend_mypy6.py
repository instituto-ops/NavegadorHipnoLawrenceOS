import re

def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/analytics/wordpress_service.py', [
    ('def create_post(self, title: str, content: str, status: str = "publish", categories: list = None, tags: list = None):', 'def create_post(self, title: str, content: str, status: str = "publish", categories: list[int] | None = None, tags: list[int] | None = None):')
])

modify_file('apps/backend/analytics/pagespeed_service.py', [
    ('async def run_analysis(self, url: str, strategy: str = "MOBILE"):', 'async def run_analysis(self, url: str, strategy: str = "MOBILE"):')
])

modify_file('apps/backend/main.py', [
    ('                current_task = asyncio.create_task(process_lam_stream(initial_state, config, thread_id))', '                current_task = asyncio.create_task(process_lam_stream(initial_state, hitl_config, thread_id))'),
    ('                config: Any = {"configurable": {"thread_id": thread_id}}', '                hitl_config2: Any = {"configurable": {"thread_id": thread_id}}'),
    ('                    await orchestrator.graph.aupdate_state(config, {"hitl_approved": True})', '                    await orchestrator.graph.aupdate_state(hitl_config2, {"hitl_approved": True})'),
    ('                    current_task = asyncio.create_task(process_lam_stream(None, config, thread_id))', '                    current_task = asyncio.create_task(process_lam_stream(None, hitl_config2, thread_id))'),
    ('                    await orchestrator.graph.aupdate_state(config, {"plan": msg.plan, "hitl_approved": True})', '                    await orchestrator.graph.aupdate_state(hitl_config2, {"plan": msg.plan, "hitl_approved": True})'),
    ('                    await orchestrator.graph.aupdate_state(config, {"hitl_approved": False})', '                    await orchestrator.graph.aupdate_state(hitl_config2, {"hitl_approved": False})')
])
