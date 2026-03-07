def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/analytics/wordpress_service.py', [
    ('def create_post(self, title: str, content: str, status: str = "draft", categories: list = None, tags: list = None):', 'def create_post(self, title: str, content: str, status: str = "draft", categories: list | None = None, tags: list | None = None):'),
    ('categories_str = categories if categories else []', 'categories_str: list = categories if categories else []'),
    ('tags_str = tags if tags else []', 'tags_str: list = tags if tags else []')
])

modify_file('apps/backend/analytics/pagespeed_service.py', [
    ('async def run_analysis(self, url: str, strategy: str = "MOBILE", categories: list = None):', 'async def run_analysis(self, url: str, strategy: str = "MOBILE", categories: list | None = None):')
])

modify_file('apps/backend/main.py', [
    ('                config: Any = {"configurable": {"thread_id": thread_id}}', '                hitl_config: Any = {"configurable": {"thread_id": thread_id}}'),
    ('await orchestrator.graph.aupdate_state(config, {"hitl_approved": True})', 'await orchestrator.graph.aupdate_state(hitl_config, {"hitl_approved": True})'),
    ('current_task = asyncio.create_task(process_lam_stream(None, config, thread_id))', 'current_task = asyncio.create_task(process_lam_stream(None, hitl_config, thread_id))'),
    ('await orchestrator.graph.aupdate_state(config, {"plan": msg.plan, "hitl_approved": True})', 'await orchestrator.graph.aupdate_state(hitl_config, {"plan": msg.plan, "hitl_approved": True})'),
    ('await orchestrator.graph.aupdate_state(config, {"hitl_approved": False})', 'await orchestrator.graph.aupdate_state(hitl_config, {"hitl_approved": False})')
])

modify_file('apps/backend/lam/executor.py', [
    ('try:\n    from lam.bridges.doctoralia import scrape_doctoralia_profile\n    from lam.bridges.google_ads import read_ads_campaigns\n    from lam.bridges.wordpress import draft_wordpress_post\nexcept ImportError:\n    # Fallback to local placeholders for tests if bridge is disconnected\n    from .bridges.doctoralia import scrape_doctoralia_profile\n    from .bridges.google_ads import read_ads_campaigns\n    from .bridges.wordpress import draft_wordpress_post', 'import typing\nif typing.TYPE_CHECKING:\n    from lam.bridges.doctoralia import scrape_doctoralia_profile\n    from lam.bridges.google_ads import read_ads_campaigns\n    from lam.bridges.wordpress import draft_wordpress_post\nelse:\n    try:\n        from lam.bridges.doctoralia import scrape_doctoralia_profile\n        from lam.bridges.google_ads import read_ads_campaigns\n        from lam.bridges.wordpress import draft_wordpress_post\n    except ImportError:\n        from .bridges.doctoralia import scrape_doctoralia_profile\n        from .bridges.google_ads import read_ads_campaigns\n        from .bridges.wordpress import draft_wordpress_post')
])

modify_file('apps/backend/lam/orchestrator.py', [
    ('try:\n    from lam.agency.ads_agent import ads_agent_node\n    from lam.agency.coordinator import marketing_coordinator_node, route_agency\n    from lam.agency.copy_agent import copy_agent_node\n    from lam.agency.seo_agent import seo_agent_node\nexcept ImportError:\n    from .agency.ads_agent import ads_agent_node\n    from .agency.coordinator import marketing_coordinator_node, route_agency\n    from .agency.copy_agent import copy_agent_node\n    from .agency.seo_agent import seo_agent_node', 'import typing\nif typing.TYPE_CHECKING:\n    from lam.agency.ads_agent import ads_agent_node\n    from lam.agency.coordinator import marketing_coordinator_node, route_agency\n    from lam.agency.copy_agent import copy_agent_node\n    from lam.agency.seo_agent import seo_agent_node\nelse:\n    try:\n        from lam.agency.ads_agent import ads_agent_node\n        from lam.agency.coordinator import marketing_coordinator_node, route_agency\n        from lam.agency.copy_agent import copy_agent_node\n        from lam.agency.seo_agent import seo_agent_node\n    except ImportError:\n        from .agency.ads_agent import ads_agent_node\n        from .agency.coordinator import marketing_coordinator_node, route_agency\n        from .agency.copy_agent import copy_agent_node\n        from .agency.seo_agent import seo_agent_node')
])
