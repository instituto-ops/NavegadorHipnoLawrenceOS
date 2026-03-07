import fs from 'fs';

let content;

// AgentChat.tsx
content = fs.readFileSync('apps/frontend/src/components/AgentChat.tsx', 'utf-8');
content = content.replace("const formatTime = (dateStr: string) => {", "const formatTime = (dateStr: string): string => {");
content = content.replace("const handlePlanEdit = (editedPlan: any): void => {", "const handlePlanEdit = (editedPlan: unknown): void => {");
fs.writeFileSync('apps/frontend/src/components/AgentChat.tsx', content, 'utf-8');

// Dashboard.tsx
content = fs.readFileSync('apps/frontend/src/pages/Dashboard.tsx', 'utf-8');
content = content.replace("const fetchActiveUsers = async () => {", "const fetchActiveUsers = async (): Promise<void> => {");
fs.writeFileSync('apps/frontend/src/pages/Dashboard.tsx', content, 'utf-8');

// SeoIntelligence.tsx
content = fs.readFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', 'utf-8');
content = content.replace("import { \n  Search, \n  TrendingUp, \n  Target, \n  ArrowUpRight, \n  AlertCircle, \n  CheckCircle2, \n  BarChart3,\n  Globe,\n  Users,\n  Activity\n} from 'lucide-react';\n//", "import { \n  Search, \n  TrendingUp, \n  Target, \n  ArrowUpRight, \n  AlertCircle, \n  CheckCircle2, \n  BarChart3,\n  Globe,\n  Users,\n  Activity\n} from 'lucide-react';");
content = content.replace("import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';", "import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';");
content = content.replace("const runAnalysis = async (url: string): Promise<void> => {", "const runAnalysis = async (url: string): Promise<void> => {");
content = content.replace("catch (_err: any) {", "catch (_err: unknown) {");
fs.writeFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', content, 'utf-8');
