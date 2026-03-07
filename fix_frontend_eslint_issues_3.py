import re

# src/components/AgentChat.tsx
with open("apps/frontend/src/components/AgentChat.tsx", "r") as f:
    content = f.read()
content = content.replace("const handleSubmit = (e: React.FormEvent) => {", "const handleSubmit = (e: React.FormEvent): void => {")
content = content.replace("const handleJulesSubmit = (e: React.FormEvent) => {", "const handleJulesSubmit = (e: React.FormEvent): void => {")
with open("apps/frontend/src/components/AgentChat.tsx", "w") as f:
    f.write(content)

# src/pages/SeoIntelligence.tsx
with open("apps/frontend/src/pages/SeoIntelligence.tsx", "r") as f:
    content = f.read()

# Fix unused vars
content = re.sub(r"import\s*{\s*Activity,\s*Search,\s*AlertTriangle,\s*TrendingUp,\s*Download,\s*CheckCircle2,\s*ShieldAlert\s*}\s*from\s*'lucide-react';", "import { Activity, Search, AlertTriangle, TrendingUp, Download, CheckCircle2, ShieldAlert } from 'lucide-react';", content)
content = re.sub(r"import\s*{\s*LineChart,\s*Line,\s*XAxis,\s*YAxis,\s*CartesianGrid,\s*Tooltip,\s*ResponsiveContainer\s*}\s*from\s*'recharts';", "import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';", content)
content = content.replace("const formatPercent = (val: any) => `${val}%`;", "const formatPercent = (val: string | number): string => `${val}%`;")
with open("apps/frontend/src/pages/SeoIntelligence.tsx", "w") as f:
    f.write(content)

# src/pages/Dashboard.tsx
with open("apps/frontend/src/pages/Dashboard.tsx", "r") as f:
    content = f.read()
content = content.replace("const formatPercent = (val: number) => {", "const formatPercent = (val: number): string => {")
content = content.replace("const handleConnectServices = () => {", "const handleConnectServices = (): void => {")
with open("apps/frontend/src/pages/Dashboard.tsx", "w") as f:
    f.write(content)
