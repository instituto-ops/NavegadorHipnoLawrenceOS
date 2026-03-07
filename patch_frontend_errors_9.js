import fs from 'fs';

let content;

// SeoIntelligence.tsx
content = fs.readFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', 'utf-8');
content = content.replace("const ScoreGauge = ({ score, title }: { score: number; title: string }) => {", "const ScoreGauge = ({ score, title }: { score: number; title: string }): React.ReactElement => {");
content = content.replace("export const SeoIntelligence: React.FC = () => {", "export const SeoIntelligence = (): React.ReactElement => {");
fs.writeFileSync('apps/frontend/src/pages/SeoIntelligence.tsx', content, 'utf-8');
