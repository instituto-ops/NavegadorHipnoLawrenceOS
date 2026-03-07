def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/lam/executor.py', [
    ('try:\n    from .bridges.doctoralia import scrape_doctoralia_profile\n    from .bridges.google_ads import read_ads_campaigns\n    from .bridges.wordpress import draft_wordpress_post\nexcept ImportError:\n    from lam.bridges.doctoralia import scrape_doctoralia_profile\n    from lam.bridges.google_ads import read_ads_campaigns\n    from lam.bridges.wordpress import draft_wordpress_post', 'import sys\nfrom .bridges.doctoralia import scrape_doctoralia_profile\nfrom .bridges.google_ads import read_ads_campaigns\nfrom .bridges.wordpress import draft_wordpress_post')
])

modify_file('apps/backend/lam/orchestrator.py', [
    ('try:\n    from .agency.ads_agent import ads_agent_node\n    from .agency.coordinator import marketing_coordinator_node, route_agency\n    from .agency.copy_agent import copy_agent_node\n    from .agency.seo_agent import seo_agent_node\nexcept ImportError:\n    from lam.agency.ads_agent import ads_agent_node\n    from lam.agency.coordinator import marketing_coordinator_node, route_agency\n    from lam.agency.copy_agent import copy_agent_node\n    from lam.agency.seo_agent import seo_agent_node', 'import sys\nfrom .agency.ads_agent import ads_agent_node\nfrom .agency.coordinator import marketing_coordinator_node, route_agency\nfrom .agency.copy_agent import copy_agent_node\nfrom .agency.seo_agent import seo_agent_node')
])

modify_file('apps/backend/main.py', [
    ('process_lam_stream(initial_state, config, thread_id)', 'process_lam_stream(initial_state, hitl_config_req, thread_id)')
])
