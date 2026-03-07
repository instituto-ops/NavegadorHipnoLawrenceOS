import re

# src/components/ActionReviewCard.tsx
with open("apps/frontend/src/components/ActionReviewCard.tsx", "r") as f:
    content = f.read()
content = content.replace("export const ActionReviewCard: React.FC<ActionReviewCardProps> = ({", "const ActionReviewCard: React.FC<ActionReviewCardProps> = ({")
with open("apps/frontend/src/components/ActionReviewCard.tsx", "w") as f:
    f.write(content)

# src/components/MainLayout.tsx
with open("apps/frontend/src/components/MainLayout.tsx", "r") as f:
    content = f.read()
content = content.replace("const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {", "const MainLayout: React.FC<MainLayoutProps> = ({ children }): React.ReactElement => {")
with open("apps/frontend/src/components/MainLayout.tsx", "w") as f:
    f.write(content)

# src/pages/AbidusAnalysis.tsx
with open("apps/frontend/src/pages/AbidusAnalysis.tsx", "r") as f:
    content = f.read()
content = content.replace("const AbidusAnalysis: React.FC = () => {", "const AbidusAnalysis: React.FC = (): React.ReactElement => {")
with open("apps/frontend/src/pages/AbidusAnalysis.tsx", "w") as f:
    f.write(content)

# src/pages/Dashboard.tsx
with open("apps/frontend/src/pages/Dashboard.tsx", "r") as f:
    content = f.read()
content = content.replace("const Dashboard: React.FC = () => {", "const Dashboard: React.FC = (): React.ReactElement => {")
with open("apps/frontend/src/pages/Dashboard.tsx", "w") as f:
    f.write(content)

# src/pages/SeoIntelligence.tsx
with open("apps/frontend/src/pages/SeoIntelligence.tsx", "r") as f:
    content = f.read()
content = content.replace("const SeoIntelligence: React.FC<SeoIntelligenceProps> = ({ onAudit }) => {", "const SeoIntelligence: React.FC<SeoIntelligenceProps> = ({ onAudit }): React.ReactElement => {")
content = content.replace("const formatPercent = (val: number | string) => `${val}%`;", "const formatPercent = (val: number | string): string => `${val}%`;")
with open("apps/frontend/src/pages/SeoIntelligence.tsx", "w") as f:
    f.write(content)
