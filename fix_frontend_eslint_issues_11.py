import re

# src/pages/SeoIntelligence.tsx
with open("apps/frontend/src/pages/SeoIntelligence.tsx", "r") as f:
    content = f.read()

content = content.replace("} catch (_error) {", "} catch (error) {")
content = content.replace("      setError(error.message || 'Falha ao realizar auditoria');", "      setError(error instanceof Error ? error.message : 'Falha ao realizar auditoria');")
content = content.replace("catch (error) {", "catch (_error) {") # Wait we need it for setError!

content = re.sub(r"catch \((.*?)\) {", r"catch (error: any) {", content)
content = content.replace("error: any", "error") # No type annotation in catch

with open("apps/frontend/src/pages/SeoIntelligence.tsx", "w") as f:
    f.write(content)
