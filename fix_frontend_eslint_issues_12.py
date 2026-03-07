import re

# src/pages/SeoIntelligence.tsx
with open("apps/frontend/src/pages/SeoIntelligence.tsx", "r") as f:
    content = f.read()

content = content.replace("const [error, setError] = useState<string | null>(null);", "const [_error, setError] = useState<string | null>(null);")
content = content.replace("catch (error) {", "catch (_error) {")
content = content.replace("setError(error instanceof Error ? error.message : 'Falha ao realizar auditoria');", "setError('Falha ao realizar auditoria');")

with open("apps/frontend/src/pages/SeoIntelligence.tsx", "w") as f:
    f.write(content)
