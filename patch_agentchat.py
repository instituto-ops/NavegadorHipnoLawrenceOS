with open("apps/frontend/src/components/AgentChat.tsx", "r") as f:
    content = f.read()

# Add import
import_old = """import { JulesTerminal } from "./JulesTerminal";"""
import_new = """import { JulesTerminal } from "./JulesTerminal";
import { ActionReviewCard } from "./ActionReviewCard";"""

content = content.replace(import_old, import_new)

# Add hitl to destructured hook return
hook_old = """    isJulesRunning,
    sendTask,
    sendJulesCommand,
    sendPanicStop,
  } = useAgentSocket("ws://localhost:8000/ws");"""

hook_new = """    isJulesRunning,
    hitlRequest,
    sendTask,
    sendJulesCommand,
    sendPanicStop,
    sendHitlResponse,
  } = useAgentSocket("ws://localhost:8000/ws");"""

content = content.replace(hook_old, hook_new)

# Insert the component
render_old = """          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">"""

render_new = """          {hitlRequest && (
            <ActionReviewCard
              plan={hitlRequest.plan}
              onApprove={() => sendHitlResponse(hitlRequest.thread_id, "approve")}
              onReject={() => sendHitlResponse(hitlRequest.thread_id, "reject")}
              onEdit={(editedPlan) => sendHitlResponse(hitlRequest.thread_id, "edit", editedPlan)}
            />
          )}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">"""

content = content.replace(render_old, render_new)

with open("apps/frontend/src/components/AgentChat.tsx", "w") as f:
    f.write(content)
