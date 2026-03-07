def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/analytics/wordpress_service.py', [
    ('        payload = {\n            "title": title,\n            "content": content,\n            "status": status\n        }', '        payload: dict[str, str | list[int]] = {\n            "title": title,\n            "content": content,\n            "status": status\n        }')
])

modify_file('apps/backend/lam/executor.py', [
    ('import typing\nif typing.TYPE_CHECKING:\n    from lam.bridges.doctoralia import scrape_doctoralia_profile\n    from lam.bridges.google_ads import read_ads_campaigns\n    from lam.bridges.wordpress import draft_wordpress_post\nelse:\n    try:\n        from lam.bridges.doctoralia import scrape_doctoralia_profile\n        from lam.bridges.google_ads import read_ads_campaigns\n        from lam.bridges.wordpress import draft_wordpress_post\n    except ImportError:\n        from .bridges.doctoralia import scrape_doctoralia_profile\n        from .bridges.google_ads import read_ads_campaigns\n        from .bridges.wordpress import draft_wordpress_post', 'try:\n    from lam.bridges.doctoralia import scrape_doctoralia_profile  # type: ignore[no-redef]\n    from lam.bridges.google_ads import read_ads_campaigns  # type: ignore[no-redef]\n    from lam.bridges.wordpress import draft_wordpress_post  # type: ignore[no-redef]\nexcept ImportError:\n    from .bridges.doctoralia import scrape_doctoralia_profile  # type: ignore[no-redef]\n    from .bridges.google_ads import read_ads_campaigns  # type: ignore[no-redef]\n    from .bridges.wordpress import draft_wordpress_post  # type: ignore[no-redef]')
])

modify_file('apps/backend/lam/orchestrator.py', [
    ('import typing\nif typing.TYPE_CHECKING:\n    from lam.agency.ads_agent import ads_agent_node\n    from lam.agency.coordinator import marketing_coordinator_node, route_agency\n    from lam.agency.copy_agent import copy_agent_node\n    from lam.agency.seo_agent import seo_agent_node\nelse:\n    try:\n        from lam.agency.ads_agent import ads_agent_node\n        from lam.agency.coordinator import marketing_coordinator_node, route_agency\n        from lam.agency.copy_agent import copy_agent_node\n        from lam.agency.seo_agent import seo_agent_node\n    except ImportError:\n        from .agency.ads_agent import ads_agent_node\n        from .agency.coordinator import marketing_coordinator_node, route_agency\n        from .agency.copy_agent import copy_agent_node\n        from .agency.seo_agent import seo_agent_node', 'try:\n    from lam.agency.ads_agent import ads_agent_node  # type: ignore[no-redef]\n    from lam.agency.coordinator import marketing_coordinator_node, route_agency  # type: ignore[no-redef]\n    from lam.agency.copy_agent import copy_agent_node  # type: ignore[no-redef]\n    from lam.agency.seo_agent import seo_agent_node  # type: ignore[no-redef]\nexcept ImportError:\n    from .agency.ads_agent import ads_agent_node  # type: ignore[no-redef]\n    from .agency.coordinator import marketing_coordinator_node, route_agency  # type: ignore[no-redef]\n    from .agency.copy_agent import copy_agent_node  # type: ignore[no-redef]\n    from .agency.seo_agent import seo_agent_node  # type: ignore[no-redef]')
])

modify_file('apps/backend/main.py', [
    ('                hitl_config2: Any = {"configurable": {"thread_id": thread_id}}', '                hitl_config_resp: Any = {"configurable": {"thread_id": thread_id}}'),
    ('                    await orchestrator.graph.aupdate_state(hitl_config2, {"hitl_approved": True})', '                    await orchestrator.graph.aupdate_state(hitl_config_resp, {"hitl_approved": True})'),
    ('                    current_task = asyncio.create_task(process_lam_stream(None, hitl_config2, thread_id))', '                    current_task = asyncio.create_task(process_lam_stream(None, hitl_config_resp, thread_id))'),
    ('                    await orchestrator.graph.aupdate_state(hitl_config2, {"plan": msg.plan, "hitl_approved": True})', '                    await orchestrator.graph.aupdate_state(hitl_config_resp, {"plan": msg.plan, "hitl_approved": True})'),
    ('                    await orchestrator.graph.aupdate_state(hitl_config2, {"hitl_approved": False})', '                    await orchestrator.graph.aupdate_state(hitl_config_resp, {"hitl_approved": False})'),
    ('                config: Any = {"configurable": {"thread_id": thread_id}}', '                hitl_config_resp: Any = {"configurable": {"thread_id": thread_id}}')
])
