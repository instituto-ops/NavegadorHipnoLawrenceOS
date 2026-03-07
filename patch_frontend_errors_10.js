import fs from 'fs';

let content;

// AgentChat.tsx
content = fs.readFileSync('apps/frontend/src/components/AgentChat.tsx', 'utf-8');
content = content.replace("const handleSubmit = (e: React.FormEvent) => {", "const handleSubmit = (e: React.FormEvent): void => {");
content = content.replace("const handleJulesSubmit = (e: React.FormEvent) => {", "const handleJulesSubmit = (e: React.FormEvent): void => {");
fs.writeFileSync('apps/frontend/src/components/AgentChat.tsx', content, 'utf-8');

// MainLayout.tsx
content = fs.readFileSync('apps/frontend/src/components/MainLayout.tsx', 'utf-8');
content = content.replace("const NavItem = ({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) => (", "const NavItem = ({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }): React.ReactElement => (");
fs.writeFileSync('apps/frontend/src/components/MainLayout.tsx', content, 'utf-8');

// AbidusAnalysis.tsx
content = fs.readFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', 'utf-8');
content = content.replace("const getHealthColor = (score: number) => {", "const getHealthColor = (score: number): string => {");
fs.writeFileSync('apps/frontend/src/pages/AbidusAnalysis.tsx', content, 'utf-8');

// Dashboard.tsx
content = fs.readFileSync('apps/frontend/src/pages/Dashboard.tsx', 'utf-8');
content = content.replace("const fetchAdsData = async () => {", "const fetchAdsData = async (): Promise<void> => {");
content = content.replace("const fetchGbpData = async () => {", "const fetchGbpData = async (): Promise<void> => {");
content = content.replace("const StatCard = ({ title, value, change, trend, icon: Icon, accentColor }: any) => (", "const StatCard = ({ title, value, change, trend, icon: Icon, accentColor }: any): React.ReactElement => (");
fs.writeFileSync('apps/frontend/src/pages/Dashboard.tsx', content, 'utf-8');

// SeoIntelligence.tsx
content = fs.readFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', 'utf-8');
content = content.replace("const runAnalysis = async () => {", "const runAnalysis = async (): Promise<void> => {");
fs.writeFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', content, 'utf-8');
