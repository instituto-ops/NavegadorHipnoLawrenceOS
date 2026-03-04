with open("apps/backend/lam/planner.py", "r") as f:
    content = f.read()

new_models = """class Plan(BaseModel):
    actions: List[AtomicAction] = Field(
        description="Sequence of atomic actions to achieve the goal"
    )
    requires_hitl: bool = Field(
        default=False,
        description="Must be True if ANY action in the plan involves financial spending, publishing posts, or sending public messages."
    )
"""

content = content.replace(
    'class Plan(BaseModel):\n    actions: List[AtomicAction] = Field(\n        description="Sequence of atomic actions to achieve the goal"\n    )',
    new_models,
)

with open("apps/backend/lam/planner.py", "w") as f:
    f.write(content)
