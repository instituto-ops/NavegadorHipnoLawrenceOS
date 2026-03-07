import fs from 'fs';

let content;

// MainLayout.tsx
content = fs.readFileSync('apps/frontend/src/components/MainLayout.tsx', 'utf-8');
content = content.replace("const navLinkClass = ({ isActive }: { isActive: boolean }) =>", "const navLinkClass = ({ isActive }: { isActive: boolean }): string =>");
fs.writeFileSync('apps/frontend/src/components/MainLayout.tsx', content, 'utf-8');

// AbidusAnalysis.tsx
content = fs.readFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', 'utf-8');
content = content.replace("export const AbidusAnalysis: React.FC = () => {", "export const AbidusAnalysis = (): React.ReactElement => {");
content = content.replace("const getStatusColor = (status: string) => {", "const getStatusColor = (status: string): string => {");
fs.writeFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', content, 'utf-8');

// Dashboard.tsx
content = fs.readFileSync('apps/frontend/src/pages/Dashboard.tsx', 'utf-8');
content = content.replace("export const Dashboard: React.FC = () => {", "export const Dashboard = (): React.ReactElement => {");
content = content.replace("const fetchWpData = async () => {", "const fetchWpData = async (): Promise<void> => {");
content = content.replace("const MetricCard = ({ title, value, change, suffix = '' }: any) => (", "const MetricCard = ({ title, value, change, suffix = '' }: any): React.ReactElement => (");
content = content.replace("const ActionCard = ({ title, desc, icon: Icon, time }: any) => (", "const ActionCard = ({ title, desc, icon: Icon, time }: any): React.ReactElement => (");
fs.writeFileSync('apps/frontend/src/pages/Dashboard.tsx', content, 'utf-8');

// SeoIntelligence.tsx
content = fs.readFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', 'utf-8');
content = content.replace("import { \n  Search, \n  TrendingUp, \n  Target, \n  ArrowUpRight, \n  AlertCircle, \n  CheckCircle2, \n  BarChart3,\n  Globe,\n  Users,\n  Activity\n} from 'lucide-react';", "import { \n  Search, \n  TrendingUp, \n  Target, \n  ArrowUpRight, \n  AlertCircle, \n  CheckCircle2, \n  BarChart3,\n  Globe,\n  Users,\n  Activity,\n  ShieldCheck,\n  ArrowRight,\n  AlertTriangle,\n  Info,\n  Loader2\n} from 'lucide-react';");
content = content.replace("import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';", "import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';");
fs.writeFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', content, 'utf-8');
