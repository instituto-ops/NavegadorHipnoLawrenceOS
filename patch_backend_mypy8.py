def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/lam/executor.py', [
    ('try:\n    from lam.bridges.doctoralia import scrape_doctoralia_profile  # type: ignore[no-redef]\n    from lam.bridges.google_ads import read_ads_campaigns  # type: ignore[no-redef]\n    from lam.bridges.wordpress import draft_wordpress_post  # type: ignore[no-redef]\nexcept ImportError:\n    from .bridges.doctoralia import scrape_doctoralia_profile  # type: ignore[no-redef]\n    from .bridges.google_ads import read_ads_campaigns  # type: ignore[no-redef]\n    from .bridges.wordpress import draft_wordpress_post  # type: ignore[no-redef]', 'import sys\nimport os\n\nsys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))\n\ntry:\n    from lam.bridges.doctoralia import scrape_doctoralia_profile # type: ignore[import-not-found, no-redef]\n    from lam.bridges.google_ads import read_ads_campaigns # type: ignore[import-not-found, no-redef]\n    from lam.bridges.wordpress import draft_wordpress_post # type: ignore[import-not-found, no-redef]\nexcept ImportError:\n    from .bridges.doctoralia import scrape_doctoralia_profile # type: ignore[import-not-found, no-redef]\n    from .bridges.google_ads import read_ads_campaigns # type: ignore[import-not-found, no-redef]\n    from .bridges.wordpress import draft_wordpress_post # type: ignore[import-not-found, no-redef]')
])

modify_file('apps/backend/lam/orchestrator.py', [
    ('try:\n    from lam.agency.ads_agent import ads_agent_node  # type: ignore[no-redef]\n    from lam.agency.coordinator import marketing_coordinator_node, route_agency  # type: ignore[no-redef]\n    from lam.agency.copy_agent import copy_agent_node  # type: ignore[no-redef]\n    from lam.agency.seo_agent import seo_agent_node  # type: ignore[no-redef]\nexcept ImportError:\n    from .agency.ads_agent import ads_agent_node  # type: ignore[no-redef]\n    from .agency.coordinator import marketing_coordinator_node, route_agency  # type: ignore[no-redef]\n    from .agency.copy_agent import copy_agent_node  # type: ignore[no-redef]\n    from .agency.seo_agent import seo_agent_node  # type: ignore[no-redef]', 'import sys\nimport os\n\nsys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))\n\ntry:\n    from lam.agency.ads_agent import ads_agent_node # type: ignore[import-not-found, no-redef]\n    from lam.agency.coordinator import marketing_coordinator_node, route_agency # type: ignore[import-not-found, no-redef]\n    from lam.agency.copy_agent import copy_agent_node # type: ignore[import-not-found, no-redef]\n    from lam.agency.seo_agent import seo_agent_node # type: ignore[import-not-found, no-redef]\nexcept ImportError:\n    from .agency.ads_agent import ads_agent_node # type: ignore[import-not-found, no-redef]\n    from .agency.coordinator import marketing_coordinator_node, route_agency # type: ignore[import-not-found, no-redef]\n    from .agency.copy_agent import copy_agent_node # type: ignore[import-not-found, no-redef]\n    from .agency.seo_agent import seo_agent_node # type: ignore[import-not-found, no-redef]')
])

modify_file('apps/backend/main.py', [
    ('hitl_config: Any = {"configurable": {"thread_id": thread_id}}', 'hitl_config_req: Any = {"configurable": {"thread_id": thread_id}}')
])
