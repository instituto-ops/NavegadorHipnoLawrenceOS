import re

# src/components/ActionReviewCard.tsx
with open("apps/frontend/src/components/ActionReviewCard.tsx", "r") as f:
    content = f.read()

content = content.replace("export const ActionReviewCard: React.FC<ActionReviewCardProps> = ({", "export const ActionReviewCard = ({")
content = content.replace("const getActionColor = (type: string): string => {", "export const getActionColor = (type: string): string => {") # to make it used maybe? no, it's already used.
# The issue is probably missing return type on inner functions
content = content.replace("const renderParams = (): React.ReactElement | null => {", "const renderParams = (): React.ReactElement | null => {")

with open("apps/frontend/src/components/ActionReviewCard.tsx", "w") as f:
    f.write(content)
