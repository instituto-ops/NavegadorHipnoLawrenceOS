def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/lam/executor.py', [
    ('import sys\nfrom .bridges.doctoralia import scrape_doctoralia_profile', 'from .bridges.doctoralia import scrape_doctoralia_profile')
])

modify_file('apps/backend/lam/orchestrator.py', [
    ('import sys\nfrom .agency.ads_agent import ads_agent_node', 'from .agency.ads_agent import ads_agent_node')
])

modify_file('apps/backend/main.py', [
    ('orchestrator.graph.astream(initial_state, config)', 'orchestrator.graph.astream(initial_state, ws_config)'),
    ('orchestrator.graph.aget_state(config)', 'orchestrator.graph.aget_state(ws_config)')
])
