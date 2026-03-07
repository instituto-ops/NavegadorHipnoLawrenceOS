import fs from 'fs';

let content;

// electron/main.ts
content = fs.readFileSync('apps/frontend/electron/main.ts', 'utf-8');
content = content.replace('ipcMain.handle(\'jules-command\', async (_, command) => {', 'ipcMain.handle(\'jules-command\', async (_, command): Promise<string> => {');
content = content.replace('ipcMain.on(\'window-controls\', (event, command) => {', 'ipcMain.on(\'window-controls\', (event, command): void => {');
fs.writeFileSync('apps/frontend/electron/main.ts', content, 'utf-8');

// ActionReviewCard.tsx
content = fs.readFileSync('apps/frontend/src/components/ActionReviewCard.tsx', 'utf-8');
content = content.replace('const parseActionDetails = (actionStr: string) => {', 'const parseActionDetails = (actionStr: string): any => {');
fs.writeFileSync('apps/frontend/src/components/ActionReviewCard.tsx', content, 'utf-8');

// AgentChat.tsx
content = fs.readFileSync('apps/frontend/src/components/AgentChat.tsx', 'utf-8');
content = content.replace('const handleApprove = (actionId: string) => {', 'const handleApprove = (actionId: string): void => {');
content = content.replace('const handleReject = (actionId: string) => {', 'const handleReject = (actionId: string): void => {');
fs.writeFileSync('apps/frontend/src/components/AgentChat.tsx', content, 'utf-8');

// MainLayout.tsx
content = fs.readFileSync('apps/frontend/src/components/MainLayout.tsx', 'utf-8');
content = content.replace('const handleWindowControl = (command: \'minimize\' | \'maximize\' | \'close\') => {', 'const handleWindowControl = (command: \'minimize\' | \'maximize\' | \'close\'): void => {');
fs.writeFileSync('apps/frontend/src/components/MainLayout.tsx', content, 'utf-8');

// AbidusAnalysis.tsx
content = fs.readFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', 'utf-8');
content = content.replace('const [activeTab, setActiveTab] = useState(\'dashboard\');', 'const [activeTab, setActiveTab] = useState<string>(\'dashboard\');');
content = content.replace('const handleOptimize = (target: string) => {', 'const handleOptimize = (target: string): void => {');
fs.writeFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', content, 'utf-8');

// Dashboard.tsx
content = fs.readFileSync('apps/frontend/src/pages/Dashboard.tsx', 'utf-8');
content = content.replace('const handleAction = (action: string) => {', 'const handleAction = (action: string): void => {');
content = content.replace('const formatCurrency = (value: number) => {', 'const formatCurrency = (value: number): string => {');
content = content.replace('const getStatusColor = (status: string) => {', 'const getStatusColor = (status: string): string => {');
fs.writeFileSync('apps/frontend/src/pages/Dashboard.tsx', content, 'utf-8');

// SeoIntelligence.tsx
content = fs.readFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', 'utf-8');
content = content.replace('const formatMetric = (value: number, type: \'percentage\' | \'number\' | \'time\') => {', 'const formatMetric = (value: number, type: \'percentage\' | \'number\' | \'time\'): string => {');
content = content.replace('const getScoreColor = (score: number) => {', 'const getScoreColor = (score: number): string => {');
fs.writeFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', content, 'utf-8');
