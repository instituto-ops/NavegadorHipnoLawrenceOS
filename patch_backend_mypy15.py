def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/main.py', [
    ('process_lam_stream(initial_state, hitl_config_req, thread_id)', 'process_lam_stream(initial_state, ws_config, thread_id)'),
    ('                ws_config: Any = {"configurable": {"thread_id": thread_id}}', '                ws_config2: Any = {"configurable": {"thread_id": thread_id}}')
])

modify_file('apps/backend/main.py', [
    ('ws_config2: Any = {"configurable": {"thread_id": thread_id}}', 'ws_config: Any = {"configurable": {"thread_id": thread_id}}')
]) # Restore it so we can only replace the second occurrence

with open('apps/backend/main.py', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'ws_config: Any = {"configurable": {"thread_id": thread_id}}' in line and i > 160:
        lines[i] = line.replace('ws_config', 'ws_config2')

with open('apps/backend/main.py', 'w') as f:
    f.writelines(lines)
