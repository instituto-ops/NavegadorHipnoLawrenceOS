import fs from 'fs';

let content;

// ActionReviewCard.tsx
content = fs.readFileSync('apps/frontend/src/components/ActionReviewCard.tsx', 'utf-8');
content = content.replace("const handleSaveEdit = () => {", "const handleSaveEdit = (): void => {");
fs.writeFileSync('apps/frontend/src/components/ActionReviewCard.tsx', content, 'utf-8');

// AgentChat.tsx
content = fs.readFileSync('apps/frontend/src/components/AgentChat.tsx', 'utf-8');
content = content.replace("const handlePlanEdit = (editedPlan: any) => {", "const handlePlanEdit = (editedPlan: any): void => {");
fs.writeFileSync('apps/frontend/src/components/AgentChat.tsx', content, 'utf-8');

// AbidusAnalysis.tsx
content = fs.readFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', 'utf-8');
content = content.replace("const handleOptimize = (target: string) => {", "const handleOptimize = (target: string): void => {");
content = content.replace("const fetchAnalysis = async () => {", "const fetchAnalysis = async (): Promise<void> => {");
fs.writeFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', content, 'utf-8');

// Dashboard.tsx
content = fs.readFileSync('apps/frontend/src/pages/Dashboard.tsx', 'utf-8');
content = content.replace("const CustomTooltip = ({ active, payload, label }: any) => {", "const CustomTooltip = ({ active, payload, label }: any): React.ReactElement | null => {");
fs.writeFileSync('apps/frontend/src/pages/Dashboard.tsx', content, 'utf-8');

// SeoIntelligence.tsx
content = fs.readFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', 'utf-8');
content = content.replace("const handleUrlSubmit = (e: React.FormEvent) => {", "const handleUrlSubmit = (e: React.FormEvent): void => {");
content = content.replace("const getScoreColor = (score: number) => {", "const getScoreColor = (score: number): string => {");
content = content.replace("const formatMetric = (value: number, type: 'percentage' | 'number' | 'time') => {", "const formatMetric = (value: number, type: 'percentage' | 'number' | 'time'): string => {");
content = content.replace("import { \n  Search, \n  TrendingUp, \n  Target, \n  ArrowUpRight, \n  AlertCircle, \n  CheckCircle2, \n  BarChart3,\n  Globe,\n  Users,\n  Activity\n} from 'lucide-react';", "import { \n  Search, \n  TrendingUp, \n  Target, \n  ArrowUpRight, \n  AlertCircle, \n  CheckCircle2, \n  BarChart3,\n  Globe,\n  Users,\n  Activity\n} from 'lucide-react';\n//");
fs.writeFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', content, 'utf-8');

// aiWorker.ts
content = fs.readFileSync('apps/frontend/src/workers/aiWorker.ts', 'utf-8');
content = content.replace("static async getInstance(progress_callback?: (progress: unknown) => void) {", "static async getInstance(progress_callback?: (progress: unknown) => void): Promise<FeatureExtractionPipeline> {");
fs.writeFileSync('apps/frontend/src/workers/aiWorker.ts', content, 'utf-8');
