import re

# src/pages/SeoIntelligence.tsx
with open("apps/frontend/src/pages/SeoIntelligence.tsx", "r") as f:
    content = f.read()

content = content.replace("Tooltip as RechartsTooltip, ", "")
content = content.replace("const getScoreColor = (score: number) => {", "const getScoreColor = (score: number): string => {")
content = content.replace("} catch (error) {", "} catch (_error) {")
content = content.replace("const renderMetricsSection = (title: string, metrics: Record<string, any>) => (", "const renderMetricsSection = (title: string, metrics: Record<string, string | number>): React.ReactElement => (")

with open("apps/frontend/src/pages/SeoIntelligence.tsx", "w") as f:
    f.write(content)

# src/components/ActionReviewCard.tsx
with open("apps/frontend/src/components/ActionReviewCard.tsx", "r") as f:
    content = f.read()

content = content.replace("const renderParams = () => {", "const renderParams = (): React.ReactElement | null => {")

with open("apps/frontend/src/components/ActionReviewCard.tsx", "w") as f:
    f.write(content)

# src/components/MainLayout.tsx
with open("apps/frontend/src/components/MainLayout.tsx", "r") as f:
    content = f.read()

content = content.replace("const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {", "const MainLayout: React.FC<MainLayoutProps> = ({ children }): React.ReactElement => {")
content = content.replace("const renderStatusIcon = (status: string) => {", "const renderStatusIcon = (status: string): React.ReactElement | null => {")

with open("apps/frontend/src/components/MainLayout.tsx", "w") as f:
    f.write(content)

# src/pages/AbidusAnalysis.tsx
with open("apps/frontend/src/pages/AbidusAnalysis.tsx", "r") as f:
    content = f.read()

content = content.replace("const renderAnalysisSection = (title: string, content: string) => (", "const renderAnalysisSection = (title: string, content: string): React.ReactElement => (")

with open("apps/frontend/src/pages/AbidusAnalysis.tsx", "w") as f:
    f.write(content)

# src/pages/Dashboard.tsx
with open("apps/frontend/src/pages/Dashboard.tsx", "r") as f:
    content = f.read()

content = content.replace("const renderTrendIcon = (trend: 'up' | 'down' | 'neutral') => {", "const renderTrendIcon = (trend: 'up' | 'down' | 'neutral'): React.ReactElement | null => {")
content = content.replace("const formatPercent = (val: number) => {", "const formatPercent = (val: number): string => {")
content = content.replace("const getMetricTrend = (key: string) => {", "const getMetricTrend = (key: string): 'up' | 'down' | 'neutral' => {")
content = content.replace("const renderAgentStatus = () => {", "const renderAgentStatus = (): React.ReactElement => {")

with open("apps/frontend/src/pages/Dashboard.tsx", "w") as f:
    f.write(content)

# src/workers/aiWorker.ts
with open("apps/frontend/src/workers/aiWorker.ts", "r") as f:
    content = f.read()

content = content.replace("const mockProcessData = async (data: any) => {", "const mockProcessData = async (data: any): Promise<any> => {")

with open("apps/frontend/src/workers/aiWorker.ts", "w") as f:
    f.write(content)
