import fs from 'fs';

let content;

// Dashboard.tsx
content = fs.readFileSync('apps/frontend/src/pages/Dashboard.tsx', 'utf-8');
content = content.replace("}) => (", "}): React.ReactElement => (");
content = content.replace("const fetchSpreadsheetData = async () => {", "const fetchSpreadsheetData = async (): Promise<void> => {");
content = content.replace("const fetchGA4Data = async () => {", "const fetchGA4Data = async (): Promise<void> => {");
fs.writeFileSync('apps/frontend/src/pages/Dashboard.tsx', content, 'utf-8');

// SeoIntelligence.tsx
content = fs.readFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', 'utf-8');
content = content.replace("import { \n  Search, \n  Globe,\n  BarChart3,\n  ShieldCheck,\n  ArrowRight,\n  AlertTriangle,\n  Info,\n  Loader2,\n  CheckCircle2\n} from 'lucide-react';", "import { \n  Search, \n  Globe,\n  BarChart3,\n  ShieldCheck,\n  ArrowRight,\n  AlertTriangle,\n  Info,\n  Loader2,\n  CheckCircle2\n} from 'lucide-react';\n//");
fs.writeFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', content, 'utf-8');
