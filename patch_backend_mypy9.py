def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/lam/executor.py', [
    ('import sys\nimport os\n\nsys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))\n\ntry:\n    from lam.bridges.doctoralia import scrape_doctoralia_profile # type: ignore[import-not-found, no-redef]\n    from lam.bridges.google_ads import read_ads_campaigns # type: ignore[import-not-found, no-redef]\n    from lam.bridges.wordpress import draft_wordpress_post # type: ignore[import-not-found, no-redef]\nexcept ImportError:\n    from .bridges.doctoralia import scrape_doctoralia_profile # type: ignore[import-not-found, no-redef]\n    from .bridges.google_ads import read_ads_campaigns # type: ignore[import-not-found, no-redef]\n    from .bridges.wordpress import draft_wordpress_post # type: ignore[import-not-found, no-redef]', 'import typing\nif typing.TYPE_CHECKING:\n    from lam.bridges.doctoralia import scrape_doctoralia_profile\n    from lam.bridges.google_ads import read_ads_campaigns\n    from lam.bridges.wordpress import draft_wordpress_post\nelse:\n    try:\n        from lam.bridges.doctoralia import scrape_doctoralia_profile\n        from lam.bridges.google_ads import read_ads_campaigns\n        from lam.bridges.wordpress import draft_wordpress_post\n    except ImportError:\n        from .bridges.doctoralia import scrape_doctoralia_profile\n        from .bridges.google_ads import read_ads_campaigns\n        from .bridges.wordpress import draft_wordpress_post')
])

modify_file('apps/backend/lam/orchestrator.py', [
    ('import sys\nimport os\n\nsys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))\n\ntry:\n    from lam.agency.ads_agent import ads_agent_node # type: ignore[import-not-found, no-redef]\n    from lam.agency.coordinator import marketing_coordinator_node, route_agency # type: ignore[import-not-found, no-redef]\n    from lam.agency.copy_agent import copy_agent_node # type: ignore[import-not-found, no-redef]\n    from lam.agency.seo_agent import seo_agent_node # type: ignore[import-not-found, no-redef]\nexcept ImportError:\n    from .agency.ads_agent import ads_agent_node # type: ignore[import-not-found, no-redef]\n    from .agency.coordinator import marketing_coordinator_node, route_agency # type: ignore[import-not-found, no-redef]\n    from .agency.copy_agent import copy_agent_node # type: ignore[import-not-found, no-redef]\n    from .agency.seo_agent import seo_agent_node # type: ignore[import-not-found, no-redef]', 'import typing\nif typing.TYPE_CHECKING:\n    from lam.agency.ads_agent import ads_agent_node\n    from lam.agency.coordinator import marketing_coordinator_node, route_agency\n    from lam.agency.copy_agent import copy_agent_node\n    from lam.agency.seo_agent import seo_agent_node\nelse:\n    try:\n        from lam.agency.ads_agent import ads_agent_node\n        from lam.agency.coordinator import marketing_coordinator_node, route_agency\n        from lam.agency.copy_agent import copy_agent_node\n        from lam.agency.seo_agent import seo_agent_node\n    except ImportError:\n        from .agency.ads_agent import ads_agent_node\n        from .agency.coordinator import marketing_coordinator_node, route_agency\n        from .agency.copy_agent import copy_agent_node\n        from .agency.seo_agent import seo_agent_node')
])

modify_file('apps/backend/main.py', [
    ('hitl_config_req: Any = {"configurable": {"thread_id": thread_id}}', 'config: Any = {"configurable": {"thread_id": thread_id}}'),
    ('hitl_config_resp: Any = {"configurable": {"thread_id": thread_id}}', 'config_resp: Any = {"configurable": {"thread_id": thread_id}}'),
    ('snapshot = await orchestrator.graph.aget_state(hitl_config)', 'snapshot = await orchestrator.graph.aget_state(config)'),
    ('await orchestrator.graph.aupdate_state(hitl_config, {"hitl_approved": True})', 'await orchestrator.graph.aupdate_state(config_resp, {"hitl_approved": True})'),
    ('current_task = asyncio.create_task(process_lam_stream(None, hitl_config, thread_id))', 'current_task = asyncio.create_task(process_lam_stream(None, config_resp, thread_id))'),
    ('await orchestrator.graph.aupdate_state(hitl_config, {"plan": msg.plan, "hitl_approved": True})', 'await orchestrator.graph.aupdate_state(config_resp, {"plan": msg.plan, "hitl_approved": True})'),
    ('await orchestrator.graph.aupdate_state(hitl_config, {"hitl_approved": False})', 'await orchestrator.graph.aupdate_state(config_resp, {"hitl_approved": False})')
])
