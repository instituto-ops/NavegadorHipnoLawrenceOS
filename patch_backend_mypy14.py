def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/main.py', [
    ('process_lam_stream(initial_state, hitl_config_req, thread_id)', 'process_lam_stream(initial_state, ws_config, thread_id)'),
    ('ws_config: Any = {"configurable": {"thread_id": thread_id}}', 'ws_config2: Any = {"configurable": {"thread_id": thread_id}}', 2) # Just in case it tries to replace the first one
])
