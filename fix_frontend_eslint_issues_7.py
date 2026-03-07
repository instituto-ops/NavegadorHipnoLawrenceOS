import re

# src/components/ActionReviewCard.tsx
with open("apps/frontend/src/components/ActionReviewCard.tsx", "r") as f:
    content = f.read()

content = content.replace("const ActionReviewCard: React.FC<ActionReviewCardProps> = ({", "const ActionReviewCard: React.FC<ActionReviewCardProps> = ({")
content = content.replace("const renderParams = () => {", "const renderParams = (): React.ReactElement | null => {")
content = content.replace("const getActionIcon = (type: string) => {", "const getActionIcon = (type: string): React.ReactElement => {")
content = content.replace("const ActionReviewCard: React.FC<ActionReviewCardProps> = ({", "export const ActionReviewCard: React.FC<ActionReviewCardProps> = ({") # just to make sure it's valid if it wasn't

with open("apps/frontend/src/components/ActionReviewCard.tsx", "w") as f:
    f.write(content)
