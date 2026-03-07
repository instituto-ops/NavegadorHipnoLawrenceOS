#!/bin/bash
cd apps/backend

# Fix analytics/__init__.py
cat << 'INIT_EOF' > analytics/__init__.py
from .ga4_service import ga4_service as ga4_service
from .ads_service import ads_service as ads_service
from .gbp_service import gbp_service as gbp_service
from .wordpress_service import wp_service as wp_service
from .n8n_service import n8n_service as n8n_service
from .instagram_service import instagram_service as instagram_service
from .pagespeed_service import pagespeed_service as pagespeed_service

__all__ = [
    "ga4_service",
    "ads_service",
    "gbp_service",
    "wp_service",
    "n8n_service",
    "instagram_service",
    "pagespeed_service"
]
INIT_EOF

# Fix lam/agency/ads_agent.py
sed -i 's/from \.\.planner import Plan, generate_plan/# from ..planner import Plan, generate_plan/g' lam/agency/ads_agent.py

# Fix lam/agency/copy_agent.py
sed -i 's/from \.\.planner import Plan, generate_plan/# from ..planner import Plan, generate_plan/g' lam/agency/copy_agent.py

# Fix lam/agency/seo_agent.py
sed -i 's/from \.\.planner import Plan, generate_plan/# from ..planner import Plan, generate_plan/g' lam/agency/seo_agent.py

# Fix lam/agency/coordinator.py
sed -i 's/from \.ads_agent import ads_agent_node/# from .ads_agent import ads_agent_node/g' lam/agency/coordinator.py
sed -i 's/from \.copy_agent import copy_agent_node/# from .copy_agent import copy_agent_node/g' lam/agency/coordinator.py
sed -i 's/from \.seo_agent import seo_agent_node/# from .seo_agent import seo_agent_node/g' lam/agency/coordinator.py

# Fix lam/orchestrator.py
sed -i 's/except:/except Exception:/g' lam/orchestrator.py

# Fix main.py
sed -i 's/except:/except Exception:/g' main.py
sed -i 's/if current_task: current_task.cancel()/if current_task:\n            current_task.cancel()/g' main.py
