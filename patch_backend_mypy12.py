def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/lam/executor.py', [
    ('import typing\nif typing.TYPE_CHECKING:\n    from lam.bridges.doctoralia import scrape_doctoralia_profile\n    from lam.bridges.google_ads import read_ads_campaigns\n    from lam.bridges.wordpress import draft_wordpress_post\nelse:\n    try:\n        from lam.bridges.doctoralia import scrape_doctoralia_profile\n        from lam.bridges.google_ads import read_ads_campaigns\n        from lam.bridges.wordpress import draft_wordpress_post\n    except ImportError:\n        from .bridges.doctoralia import scrape_doctoralia_profile\n        from .bridges.google_ads import read_ads_campaigns\n        from .bridges.wordpress import draft_wordpress_post', 'try:\n    from lam.bridges.doctoralia import scrape_doctoralia_profile  # type: ignore\n    from lam.bridges.google_ads import read_ads_campaigns  # type: ignore\n    from lam.bridges.wordpress import draft_wordpress_post  # type: ignore\nexcept ImportError:\n    from .bridges.doctoralia import scrape_doctoralia_profile  # type: ignore\n    from .bridges.google_ads import read_ads_campaigns  # type: ignore\n    from .bridges.wordpress import draft_wordpress_post  # type: ignore')
])

modify_file('apps/backend/lam/orchestrator.py', [
    ('import typing\nif typing.TYPE_CHECKING:\n    from lam.agency.ads_agent import ads_agent_node\n    from lam.agency.coordinator import marketing_coordinator_node, route_agency\n    from lam.agency.copy_agent import copy_agent_node\n    from lam.agency.seo_agent import seo_agent_node\nelse:\n    try:\n        from lam.agency.ads_agent import ads_agent_node\n        from lam.agency.coordinator import marketing_coordinator_node, route_agency\n        from lam.agency.copy_agent import copy_agent_node\n        from lam.agency.seo_agent import seo_agent_node\n    except ImportError:\n        from .agency.ads_agent import ads_agent_node\n        from .agency.coordinator import marketing_coordinator_node, route_agency\n        from .agency.copy_agent import copy_agent_node\n        from .agency.seo_agent import seo_agent_node', 'try:\n    from lam.agency.ads_agent import ads_agent_node  # type: ignore\n    from lam.agency.coordinator import marketing_coordinator_node, route_agency  # type: ignore\n    from lam.agency.copy_agent import copy_agent_node  # type: ignore\n    from lam.agency.seo_agent import seo_agent_node  # type: ignore\nexcept ImportError:\n    from .agency.ads_agent import ads_agent_node  # type: ignore\n    from .agency.coordinator import marketing_coordinator_node, route_agency  # type: ignore\n    from .agency.copy_agent import copy_agent_node  # type: ignore\n    from .agency.seo_agent import seo_agent_node  # type: ignore')
])

modify_file('apps/backend/main.py', [
    ('process_lam_stream(initial_state, hitl_config, thread_id)', 'process_lam_stream(initial_state, config, thread_id)'),
    ('config_resp: Any = {"configurable": {"thread_id": thread_id}}', 'ws_config: Any = {"configurable": {"thread_id": thread_id}}'),
    ('process_lam_stream(None, config_resp, thread_id)', 'process_lam_stream(None, ws_config, thread_id)'),
    ('aupdate_state(config_resp,', 'aupdate_state(ws_config,')
])
