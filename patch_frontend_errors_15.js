import fs from 'fs';

let content = fs.readFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', 'utf-8');

content = content.replace("  Zap,", "");
content = content.replace("  Gauge,", "");
content = content.replace("import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';", "import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';");

fs.writeFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', content, 'utf-8');
