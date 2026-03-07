import re

def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/lam/agency/ads_agent.py', [
    ('try:\n    from ..planner import Plan, generate_plan\n\nexcept ImportError:', 'import typing\nif typing.TYPE_CHECKING:\n    from ..planner import Plan, generate_plan\n\ntry:')
])

modify_file('apps/backend/lam/agency/copy_agent.py', [
    ('try:\n    from ..planner import Plan, generate_plan\n\nexcept ImportError:', 'import typing\nif typing.TYPE_CHECKING:\n    from ..planner import Plan, generate_plan\n\ntry:')
])

modify_file('apps/backend/lam/agency/seo_agent.py', [
    ('try:\n    from ..planner import Plan, generate_plan\n\nexcept ImportError:', 'import typing\nif typing.TYPE_CHECKING:\n    from ..planner import Plan, generate_plan\n\ntry:')
])

modify_file('apps/backend/lam/agency/coordinator.py', [
    ('try:\n    from .ads_agent import ads_agent_node\n    from .copy_agent import copy_agent_node\n    from .seo_agent import seo_agent_node\nexcept ImportError:', 'import typing\nif typing.TYPE_CHECKING:\n    from .ads_agent import ads_agent_node\n    from .copy_agent import copy_agent_node\n    from .seo_agent import seo_agent_node\n\ntry:')
])
