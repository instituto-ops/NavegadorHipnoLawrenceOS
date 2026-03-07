import fs from 'fs';

let content;

// electron/main.ts
content = fs.readFileSync('apps/frontend/electron/main.ts', 'utf-8');
content = content.replace("icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),", "icon: path.join(process.env.VITE_PUBLIC || '', 'favicon.ico'),");
fs.writeFileSync('apps/frontend/electron/main.ts', content, 'utf-8');

// SeoIntelligence.tsx
content = fs.readFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', 'utf-8');
content = content.replace("{data.map((entry, index) => (", "{data.map((_entry, index) => (");
content = content.replace("const [pageSpeed, setPageSpeed] = useState<PageSpeedData | null>(null);", "const [pageSpeed, setPageSpeed] = useState<PageSpeedData | null>(null);\n  const [error, setError] = useState<string | null>(null);");
content = content.replace("setError(err.message);", "setError((_err as Error).message);");
fs.writeFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', content, 'utf-8');
