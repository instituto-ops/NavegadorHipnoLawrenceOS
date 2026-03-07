def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/lam/agency/ads_agent.py', [
    ('try:\n    pass', '')
])

modify_file('apps/backend/lam/agency/copy_agent.py', [
    ('try:\n    pass', '')
])

modify_file('apps/backend/lam/agency/seo_agent.py', [
    ('try:\n    pass', '')
])

modify_file('apps/backend/lam/agency/coordinator.py', [
    ('try:\n    pass', '')
])
