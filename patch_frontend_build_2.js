import fs from 'fs';

let content;

// SeoIntelligence.tsx
content = fs.readFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', 'utf-8');
content = content.replace("const [error, setError] = useState<string | null>(null);", "const [_error, setError] = useState<string | null>(null);");
fs.writeFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', content, 'utf-8');
