import fs from 'fs';

let content;

// electron/main.ts
content = fs.readFileSync('apps/frontend/electron/main.ts', 'utf-8');
content = content.replace('function createWindow() {', 'function createWindow(): void {');
content = content.replace('win.loadFile(path.join(__dirname, \'../dist/index.html\'))', 'void win.loadFile(path.join(__dirname, \'../dist/index.html\'))');
content = content.replace('win.loadURL(process.env.VITE_DEV_SERVER_URL)', 'void win.loadURL(process.env.VITE_DEV_SERVER_URL)');
content = content.replace('app.whenReady().then(createWindow)', 'void app.whenReady().then(createWindow)');
fs.writeFileSync('apps/frontend/electron/main.ts', content, 'utf-8');

// electron/updater.ts
content = fs.readFileSync('apps/frontend/electron/updater.ts', 'utf-8');
content = content.replace('export function setupUpdater(win: BrowserWindow) {', 'export function setupUpdater(win: BrowserWindow): void {');
content = content.replace('autoUpdater.checkForUpdatesAndNotify()', 'void autoUpdater.checkForUpdatesAndNotify()');
content = content.replace('console.log(\'Update available.\');', 'console.warn(\'Update available.\');');
content = content.replace('autoUpdater.downloadUpdate()', 'void autoUpdater.downloadUpdate()');
fs.writeFileSync('apps/frontend/electron/updater.ts', content, 'utf-8');

// ActionReviewCard
content = fs.readFileSync('apps/frontend/src/components/ActionReviewCard.tsx', 'utf-8');
content = content.replace('export default function ActionReviewCard({ action, onApprove, onReject, onEdit }: ActionReviewCardProps) {', 'export default function ActionReviewCard({ action, onApprove, onReject, onEdit }: ActionReviewCardProps): React.ReactElement {');
fs.writeFileSync('apps/frontend/src/components/ActionReviewCard.tsx', content, 'utf-8');

// AgentChat
content = fs.readFileSync('apps/frontend/src/components/AgentChat.tsx', 'utf-8');
content = content.replace('export default function AgentChat() {', 'export default function AgentChat(): React.ReactElement {');
content = content.replace('const handleSendMessage = (msg: string) => {', 'const handleSendMessage = (msg: string): void => {');
fs.writeFileSync('apps/frontend/src/components/AgentChat.tsx', content, 'utf-8');

// MainLayout
content = fs.readFileSync('apps/frontend/src/components/MainLayout.tsx', 'utf-8');
content = content.replace('export default function MainLayout({ children }: { children: React.ReactNode }) {', 'export default function MainLayout({ children }: { children: React.ReactNode }): React.ReactElement {');
fs.writeFileSync('apps/frontend/src/components/MainLayout.tsx', content, 'utf-8');

// AbidusAnalysis
content = fs.readFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', 'utf-8');
content = content.replace('export default function AbidusAnalysis() {', 'export default function AbidusAnalysis(): React.ReactElement {');
fs.writeFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', content, 'utf-8');

// Dashboard
content = fs.readFileSync('apps/frontend/src/pages/Dashboard.tsx', 'utf-8');
content = content.replace('export default function Dashboard() {', 'export default function Dashboard(): React.ReactElement {');
content = content.replace('const CustomTooltip = ({ active, payload, label }: any) => {', 'const CustomTooltip = ({ active, payload, label }: any): React.ReactElement | null => {');
content = content.replace('const renderMetrics = () => {', 'const renderMetrics = (): React.ReactElement => {');
fs.writeFileSync('apps/frontend/src/pages/Dashboard.tsx', content, 'utf-8');

// SeoIntelligence
content = fs.readFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', 'utf-8');
content = content.replace('import { \n  Search, \n  TrendingUp, \n  Zap, \n  Target, \n  ArrowUpRight, \n  AlertCircle, \n  CheckCircle2, \n  BarChart3,\n  Globe,\n  Users,\n  Activity,\n  Gauge\n} from \'lucide-react\';', 'import { \n  Search, \n  TrendingUp, \n  Target, \n  ArrowUpRight, \n  AlertCircle, \n  CheckCircle2, \n  BarChart3,\n  Globe,\n  Users,\n  Activity\n} from \'lucide-react\';');
content = content.replace('import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from \'recharts\';', 'import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from \'recharts\';');
content = content.replace('export default function SeoIntelligence() {', 'export default function SeoIntelligence(): React.ReactElement {');
content = content.replace('const [error, setError] = useState<string | null>(null);', '');
content = content.replace('const runAnalysis = async (url: string) => {', 'const runAnalysis = async (url: string): Promise<void> => {');
content = content.replace('} catch (err: any) {', '} catch (_err: any) {');
content = content.replace('setError(\'Failed to run analysis\');', '');
fs.writeFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', content, 'utf-8');

// aiWorker
content = fs.readFileSync('apps/frontend/src/workers/aiWorker.ts', 'utf-8');
content = content.replace('self.onmessage = async (e: MessageEvent) => {', 'self.onmessage = async (e: MessageEvent): Promise<void> => {');
fs.writeFileSync('apps/frontend/src/workers/aiWorker.ts', content, 'utf-8');
