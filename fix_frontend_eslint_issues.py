import os
import re

# 1. apps/frontend/electron/main.ts
file_path = "apps/frontend/electron/main.ts"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("function createWindow() {", "function createWindow(): void {")
content = content.replace("win.loadURL(process.env.VITE_DEV_SERVER_URL)", "void win.loadURL(process.env.VITE_DEV_SERVER_URL)")
content = content.replace("win.loadFile(path.join(process.env.DIST, 'index.html'))", "void win.loadFile(path.join(process.env.DIST, 'index.html'))")
content = content.replace("app.whenReady().then(createWindow)", "void app.whenReady().then(createWindow)")

with open(file_path, "w") as f:
    f.write(content)

# 2. apps/frontend/electron/updater.ts
file_path = "apps/frontend/electron/updater.ts"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("export function setupUpdater() {", "export function setupUpdater(): void {")
content = content.replace("autoUpdater.checkForUpdatesAndNotify()", "void autoUpdater.checkForUpdatesAndNotify()")
content = content.replace("console.log('Update available.')", "console.warn('Update available.')")

with open(file_path, "w") as f:
    f.write(content)

# 3. apps/frontend/src/components/ActionReviewCard.tsx
file_path = "apps/frontend/src/components/ActionReviewCard.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("const getActionIcon = (type: string) => {", "const getActionIcon = (type: string): JSX.Element => {")

with open(file_path, "w") as f:
    f.write(content)

# 4. apps/frontend/src/components/AgentChat.tsx
file_path = "apps/frontend/src/components/AgentChat.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("const handleSend = () => {", "const handleSend = (): void => {")
content = content.replace("const handleKeyPress = (e: React.KeyboardEvent) => {", "const handleKeyPress = (e: React.KeyboardEvent): void => {")

with open(file_path, "w") as f:
    f.write(content)

# 5. apps/frontend/src/components/MainLayout.tsx
file_path = "apps/frontend/src/components/MainLayout.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {", "const MainLayout: React.FC<MainLayoutProps> = ({ children }): JSX.Element => {")

with open(file_path, "w") as f:
    f.write(content)

# 6. apps/frontend/src/pages/AbidusAnalysis.tsx
file_path = "apps/frontend/src/pages/AbidusAnalysis.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("const AbidusAnalysis: React.FC = () => {", "const AbidusAnalysis: React.FC = (): JSX.Element => {")

with open(file_path, "w") as f:
    f.write(content)

# 7. apps/frontend/src/pages/Dashboard.tsx
file_path = "apps/frontend/src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("const fetchMetrics = async () => {", "const fetchMetrics = async (): Promise<void> => {")
content = content.replace("const formatCurrency = (value: number) => {", "const formatCurrency = (value: number): string => {")
content = content.replace("const renderStatusIcon = (status: string) => {", "const renderStatusIcon = (status: string): JSX.Element | null => {")

with open(file_path, "w") as f:
    f.write(content)

# 8. apps/frontend/src/pages/SeoIntelligence.tsx
file_path = "apps/frontend/src/pages/SeoIntelligence.tsx"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("Zap,", "")
content = content.replace(", Gauge", "")
content = content.replace("RechartsTooltip,", "")
content = content.replace("const SeoIntelligence: React.FC<SeoIntelligenceProps> = ({ onAudit }) => {", "const SeoIntelligence: React.FC<SeoIntelligenceProps> = ({ onAudit }): JSX.Element => {")
content = content.replace("} catch (error) {", "} catch (_error) {")
content = content.replace("const handleAudit = async () => {", "const handleAudit = async (): Promise<void> => {")
content = content.replace("const formatPercent = (val: any) => `${val}%`;", "const formatPercent = (val: number | string): string => `${val}%`;")

with open(file_path, "w") as f:
    f.write(content)

# 9. apps/frontend/src/workers/aiWorker.ts
file_path = "apps/frontend/src/workers/aiWorker.ts"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace("self.onmessage = async (e: MessageEvent) => {", "self.onmessage = async (e: MessageEvent): Promise<void> => {")

with open(file_path, "w") as f:
    f.write(content)
