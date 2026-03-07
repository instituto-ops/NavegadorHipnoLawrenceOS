import fs from 'fs';

let content;

// electron/updater.ts
content = fs.readFileSync('apps/frontend/electron/updater.ts', 'utf-8');
content = content.replace("export function setupUpdater(win: BrowserWindow | null): void {", "export function setupUpdater(_win: BrowserWindow | null): void {");
fs.writeFileSync('apps/frontend/electron/updater.ts', content, 'utf-8');

// ActionReviewCard.tsx
content = fs.readFileSync('apps/frontend/src/components/ActionReviewCard.tsx', 'utf-8');
content = content.replace("const getActionIcon = (type: string) => {", "const getActionIcon = (type: string): React.ReactNode => {");
fs.writeFileSync('apps/frontend/src/components/ActionReviewCard.tsx', content, 'utf-8');

// AgentChat.tsx
content = fs.readFileSync('apps/frontend/src/components/AgentChat.tsx', 'utf-8');
content = content.replace("const messagesEndRef = useRef<HTMLDivElement>(null);", "const messagesEndRef = useRef<HTMLDivElement | null>(null);");
content = content.replace("const scrollToBottom = () => {", "const scrollToBottom = (): void => {");
content = content.replace("const handleStop = () => {", "const handleStop = (): void => {");
fs.writeFileSync('apps/frontend/src/components/AgentChat.tsx', content, 'utf-8');

// MainLayout.tsx
content = fs.readFileSync('apps/frontend/src/components/MainLayout.tsx', 'utf-8');
content = content.replace("const NavItem = ({ to, icon: Icon, children }: { to: string; icon: React.ElementType; children: React.ReactNode }) => (", "const NavItem = ({ to, icon: Icon, children }: { to: string; icon: React.ElementType; children: React.ReactNode }): React.ReactElement => (");
fs.writeFileSync('apps/frontend/src/components/MainLayout.tsx', content, 'utf-8');

// AbidusAnalysis.tsx
content = fs.readFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', 'utf-8');
content = content.replace("const renderContent = () => {", "const renderContent = (): React.ReactElement | null => {");
fs.writeFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', content, 'utf-8');

// Dashboard.tsx
content = fs.readFileSync('apps/frontend/src/pages/Dashboard.tsx', 'utf-8');
content = content.replace("const renderChart = () => {", "const renderChart = (): React.ReactElement => {");
content = content.replace("const getActionIcon = (type: string) => {", "const getActionIcon = (type: string): React.ReactNode => {");
fs.writeFileSync('apps/frontend/src/pages/Dashboard.tsx', content, 'utf-8');

// SeoIntelligence.tsx
content = fs.readFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', 'utf-8');
content = content.replace("const getScoreColor = (score: number): string => {", "const getScoreColor = (score: number | null | undefined): string => {\n  if (score === null || score === undefined) return 'text-red-500';");
content = content.replace("const formatMetric = (value: number, type: 'percentage' | 'number' | 'time'): string => {", "const formatMetric = (value: number | null | undefined, type: 'percentage' | 'number' | 'time'): string => {\n  if (value === null || value === undefined) return 'N/A';");
content = content.replace("const renderMetrics = () => {", "const renderMetrics = (): React.ReactElement | null => {");
content = content.replace("const renderOpportunities = () => {", "const renderOpportunities = (): React.ReactElement | null => {");
fs.writeFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', content, 'utf-8');

// aiWorker.ts
content = fs.readFileSync('apps/frontend/src/workers/aiWorker.ts', 'utf-8');
content = content.replace("const processChat = async (message: string) => {", "const processChat = async (message: string): Promise<any> => {");
fs.writeFileSync('apps/frontend/src/workers/aiWorker.ts', content, 'utf-8');
