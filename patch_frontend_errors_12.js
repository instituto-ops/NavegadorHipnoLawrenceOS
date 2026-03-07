import fs from 'fs';

let content;

// AbidusAnalysis.tsx
content = fs.readFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', 'utf-8');
content = content.replace("const getPriorityColor = (priority: string) => {", "const getPriorityColor = (priority: string): string => {");
fs.writeFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', content, 'utf-8');

// Dashboard.tsx
content = fs.readFileSync('apps/frontend/src/pages/Dashboard.tsx', 'utf-8');
content = content.replace("const fetchWpData = async (): Promise<void> => {", "const fetchWpData = async (): Promise<void> => {"); // Need to see the actual function def
content = content.replace("const fetchData = async () => {", "const fetchData = async (): Promise<void> => {");
content = content.replace("const formatPercent = (val: number) => {", "const formatPercent = (val: number): string => {");
fs.writeFileSync('apps/frontend/src/pages/Dashboard.tsx', content, 'utf-8');

// SeoIntelligence.tsx
content = fs.readFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', 'utf-8');
content = content.replace("import { \n  Search, \n  TrendingUp, \n  Target, \n  ArrowUpRight, \n  AlertCircle, \n  CheckCircle2, \n  BarChart3,\n  Globe,\n  Users,\n  Activity,\n  ShieldCheck,\n  ArrowRight,\n  AlertTriangle,\n  Info,\n  Loader2\n} from 'lucide-react';", "import { \n  Search, \n  TrendingUp, \n  Zap, \n  Target, \n  ArrowUpRight, \n  AlertCircle, \n  CheckCircle2, \n  BarChart3,\n  Globe,\n  Users,\n  Activity,\n  Gauge,\n  ShieldCheck,\n  ArrowRight,\n  AlertTriangle,\n  Info,\n  Loader2\n} from 'lucide-react';");
content = content.replace("import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';", "import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';");
fs.writeFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', content, 'utf-8');
