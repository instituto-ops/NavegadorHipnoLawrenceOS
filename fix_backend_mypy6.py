import re

# main.py
with open("apps/backend/main.py", "r") as f:
    content = f.read()

content = content.replace("process_lam_stream(initial_state, config, thread_id)", "process_lam_stream(initial_state, _config, thread_id)")
content = content.replace("aupdate_state(config, {\"plan\"", "aupdate_state(_config, {\"plan\"")
content = content.replace("_config: Any = {\"configurable\": {\"thread_id\": thread_id}}", "config_obj: Any = {\"configurable\": {\"thread_id\": thread_id}}")
content = content.replace("_config, {\"hitl_approved\"", "config_obj, {\"hitl_approved\"")
content = content.replace("None, _config, thread_id", "None, config_obj, thread_id")
content = content.replace("process_lam_stream(initial_state, _config, thread_id)", "process_lam_stream(initial_state, config_obj, thread_id)")
content = content.replace("aupdate_state(_config, {\"plan\"", "aupdate_state(config_obj, {\"plan\"")

with open("apps/backend/main.py", "w") as f:
    f.write(content)
