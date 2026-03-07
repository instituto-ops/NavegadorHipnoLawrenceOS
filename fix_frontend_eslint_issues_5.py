import re

# electron/main.ts
with open("apps/frontend/electron/main.ts", "r") as f:
    content = f.read()

content = content.replace("win.loadURL(VITE_DEV_SERVER_URL);", "void win.loadURL(VITE_DEV_SERVER_URL);")
content = content.replace("win.loadFile(path.join(RENDERER_DIST, 'index.html'));", "void win.loadFile(path.join(RENDERER_DIST, 'index.html'));")
content = content.replace("app.whenReady().then(() => {", "void app.whenReady().then(() => {")

with open("apps/frontend/electron/main.ts", "w") as f:
    f.write(content)

# src/components/ActionReviewCard.tsx
with open("apps/frontend/src/components/ActionReviewCard.tsx", "r") as f:
    content = f.read()

content = content.replace("const getActionColor = (type: string) => {", "const getActionColor = (type: string): string => {")

with open("apps/frontend/src/components/ActionReviewCard.tsx", "w") as f:
    f.write(content)

# src/components/MainLayout.tsx
with open("apps/frontend/src/components/MainLayout.tsx", "r") as f:
    content = f.read()

content = content.replace("const navItems = [", "const navItems: {icon: any, label: string, path: string}[] = [")

with open("apps/frontend/src/components/MainLayout.tsx", "w") as f:
    f.write(content)

# src/pages/AbidusAnalysis.tsx
with open("apps/frontend/src/pages/AbidusAnalysis.tsx", "r") as f:
    content = f.read()

content = content.replace("const renderPilar = (title: string, score: number, desc: string, items: string[]) => (", "const renderPilar = (title: string, score: number, desc: string, items: string[]): React.ReactElement => (")

with open("apps/frontend/src/pages/AbidusAnalysis.tsx", "w") as f:
    f.write(content)

# src/pages/Dashboard.tsx
with open("apps/frontend/src/pages/Dashboard.tsx", "r") as f:
    content = f.read()

content = content.replace("const fetchAgentStatus = async () => {", "const fetchAgentStatus = async (): Promise<void> => {")
content = content.replace("const renderAgentStatus = () => {", "const renderAgentStatus = (): React.ReactElement => {")

with open("apps/frontend/src/pages/Dashboard.tsx", "w") as f:
    f.write(content)

# src/pages/SeoIntelligence.tsx
with open("apps/frontend/src/pages/SeoIntelligence.tsx", "r") as f:
    content = f.read()

content = content.replace("const getStatusColor = (status: 'good' | 'warning' | 'error') => {", "const getStatusColor = (status: 'good' | 'warning' | 'error'): string => {")
content = content.replace("} catch (_error) {", "} catch (_error: any) {")
content = content.replace("export const SeoIntelligence: React.FC = () => {", "export const SeoIntelligence: React.FC = (): React.ReactElement => {")

with open("apps/frontend/src/pages/SeoIntelligence.tsx", "w") as f:
    f.write(content)
