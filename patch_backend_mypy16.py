def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/main.py', [
    ('aupdate_state(ws_config,', 'aupdate_state(ws_config2,'),
    ('process_lam_stream(None, ws_config, thread_id)', 'process_lam_stream(None, ws_config2, thread_id)')
])
