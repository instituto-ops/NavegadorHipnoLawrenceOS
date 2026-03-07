import fs from 'fs';

let content;

// AbidusAnalysis.tsx
content = fs.readFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', 'utf-8');
content = content.replace("const handleAnalyze = (e: React.FormEvent) => {", "const handleAnalyze = (e: React.FormEvent): void => {");
fs.writeFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', content, 'utf-8');

// Dashboard.tsx
content = fs.readFileSync('apps/frontend/src/pages/Dashboard.tsx', 'utf-8');
content = content.replace("const fetchWpData = async () => {", "const fetchWpData = async (): Promise<void> => {");
content = content.replace("const formatPercent = (val: number) => {", "const formatPercent = (val: number): string => {");
content = content.replace("const fetchData = async () => {", "const fetchData = async (): Promise<void> => {");
fs.writeFileSync('apps/frontend/src/pages/Dashboard.tsx', content, 'utf-8');

// SeoIntelligence.tsx
content = fs.readFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', 'utf-8');
content = content.replace("import { \n  Search, \n  TrendingUp, \n  Zap, \n  Target, \n  ArrowUpRight, \n  AlertCircle, \n  CheckCircle2, \n  BarChart3,\n  Globe,\n  Users,\n  Activity,\n  Gauge,\n  ShieldCheck,\n  ArrowRight,\n  AlertTriangle,\n  Info,\n  Loader2\n} from 'lucide-react';", "import { \n  Search, \n  Globe,\n  BarChart3,\n  ShieldCheck,\n  ArrowRight,\n  AlertTriangle,\n  Info,\n  Loader2,\n  CheckCircle2\n} from 'lucide-react';");
content = content.replace("import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';", "import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';");
fs.writeFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', content, 'utf-8');
