import sys

with open("apps/backend/lam/orchestrator.py", "r") as f:
    lines = f.readlines()

new_lines = []

for i, line in enumerate(lines):
    # Only process the exact lines we want without matching partial strings
    if line.strip() == "from executor import Executor":
        new_lines.append(line)
        new_lines.append("try:\n")
        new_lines.append("    from .agency.coordinator import marketing_coordinator_node, route_agency\n")
        new_lines.append("    from .agency.copy_agent import copy_agent_node\n")
        new_lines.append("    from .agency.ads_agent import ads_agent_node\n")
        new_lines.append("    from .agency.seo_agent import seo_agent_node\n")
        new_lines.append("except ImportError:\n")
        new_lines.append("    from lam.agency.coordinator import marketing_coordinator_node, route_agency\n")
        new_lines.append("    from lam.agency.copy_agent import copy_agent_node\n")
        new_lines.append("    from lam.agency.ads_agent import ads_agent_node\n")
        new_lines.append("    from lam.agency.seo_agent import seo_agent_node\n")
        continue

    if line.strip() == "memory_context: str  # Placeholder for NeuroEngine connection":
        new_lines.append(line)
        new_lines.append("    agency_routing: Dict[str, Any] # For coordinator decisions\n")
        new_lines.append("    copy_asset: Dict[str, Any]\n")
        new_lines.append("    ads_asset: Dict[str, Any]\n")
        new_lines.append("    seo_asset: Dict[str, Any]\n")
        continue

    if line.strip() == 'builder.add_node("Goal", self._node_goal)':
        new_lines.append(line)
        new_lines.append("\n")
        new_lines.append("        # Agency Subsystem Nodes\n")
        new_lines.append('        builder.add_node("MarketingCoordinator", marketing_coordinator_node)\n')
        new_lines.append('        builder.add_node("CopyAgent", copy_agent_node)\n')
        new_lines.append('        builder.add_node("AdsAgent", ads_agent_node)\n')
        new_lines.append('        builder.add_node("SEOAgent", seo_agent_node)\n')
        continue

    if line.strip() == 'builder.add_edge(START, "Goal")':
        new_lines.append(line)
        new_lines.append("\n")
        new_lines.append("        # Route from Goal to Coordinator or straight to Planning depending on the task\n")
        new_lines.append('        builder.add_conditional_edges("Goal", self._route_from_goal)\n')
        new_lines.append("\n")
        new_lines.append("        # From Coordinator, route to the sub-agents\n")
        new_lines.append('        builder.add_conditional_edges("MarketingCoordinator", route_agency, ["CopyAgent", "AdsAgent", "SEOAgent"])\n')
        new_lines.append("\n")
        new_lines.append("        # Sub-agents go back to verification/planning if they need LAM execution, else Summarization. For simplicity, we send them to Summarization.\n")
        new_lines.append('        builder.add_edge("CopyAgent", "Summarization")\n')
        new_lines.append('        builder.add_edge("AdsAgent", "Summarization")\n')
        new_lines.append('        builder.add_edge("SEOAgent", "Summarization")\n')
        continue

    if line.strip() == 'builder.add_edge("Goal", "Planning")':
        continue

    if line.strip() == 'async def _node_goal(self, state: LamState):':
        new_lines.append('    def _route_from_goal(self, state: LamState) -> Literal["MarketingCoordinator", "Planning"]:\n')
        new_lines.append('        task = state.get("task", "").lower()\n')
        new_lines.append('        marketing_keywords = ["campaign", "copy", "ads", "seo", "marketing", "hypnotherapy campaign"]\n')
        new_lines.append('        if any(keyword in task for keyword in marketing_keywords):\n')
        new_lines.append('            print("Routing to Marketing Agency Subsystem...")\n')
        new_lines.append('            return "MarketingCoordinator"\n')
        new_lines.append('        return "Planning"\n\n')
        new_lines.append(line)
        continue

    # Careful replacement of the specific dictionary definition
    if '            "memory_context": "",' in line and '        }' in lines[i+1]:
        new_lines.append(line)
        new_lines.append('            "agency_routing": {},\n')
        new_lines.append('            "copy_asset": {},\n')
        new_lines.append('            "ads_asset": {},\n')
        new_lines.append('            "seo_asset": {}\n')
        continue

    new_lines.append(line)


with open("apps/backend/lam/orchestrator.py", "w") as f:
    f.writelines(new_lines)
