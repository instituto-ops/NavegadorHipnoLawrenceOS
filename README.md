# NeuroStrategy OS (NavegadorHipnoLawrenceOS)

Sistema Operacional Cognitivo e Navegador IA-nativo desenvolvido para automatizar fluxos de marketing médico e prospecção com ética e precisão.

## 🚀 Setup e Inicialização Automática (Para Jules / Linux / Mac)

Se você é um agente autônomo (Jules) configurando a VM pela primeira vez, basta executar o nosso script unificado que lidará com todo o ambiente (Python, Node e Playwright):

```bash
chmod +x setup.sh
./setup.sh
```

*(Este script cuidará das dependências de `/apps/frontend` com NPM e `/apps/backend` com Python/Pip para você, e já instalará o Chromium do Playwright).*

---

### Execução Local

**Backend:**
```bash
cd apps/backend
uvicorn main:app --reload
```

**Frontend:**
```bash
cd apps/frontend
npm run dev
```
