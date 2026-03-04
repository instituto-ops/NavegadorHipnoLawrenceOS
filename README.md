# NeuroStrategy OS (NavegadorHipnoLawrenceOS) 🧠🚀

**NeuroStrategy OS** é um Sistema Operacional Cognitivo e Navegador IA-nativo (LAM - Large Action Model) desenvolvido para automatizar fluxos de marketing médico, prospecção clínica e análise estratégica com ênfase em ética, privacidade e precisão.

## 🌟 Principais Funcionalidades

- **Navegador Autônomo (LAM):** Execução de tarefas complexas via Playwright com modo visível para supervisão em tempo real.
- **Painel de Análise Estratégica:** Dashboard integrado com Google Analytics 4 (GA4), Google Ads e Google Business Profile (GBP).
- **Integração WordPress:** Automação de publicação e monitoramento de estatísticas de site.
- **Human-in-the-Loop (HITL):** Pontos de interrupção obrigatórios para aprovação humana em ações críticas.
- **Arquitetura de IA Híbrida:** Uso de modelos locais (Ollama), Groq (latência ultrabaixa) e fallbacks via OpenRouter.

## 🏗️ Arquitetura do Projeto

O projeto utiliza um monorepo organizado da seguinte forma:

- `/apps/frontend`: Aplicação SPA (Single Page Application) construída com **React + Vite + Tailwind CSS**. Utiliza WebSockets para comunicação em tempo real com o backend.
- `/apps/backend`: Servidor robusto em **Python (FastAPI)** que hospeda o orquestrador LangGraph, agentes LAM e serviços de integração de APIs.
- `/docs`: Repositório de conhecimento estratégico, incluindo o `Documento Mestre` e guias de integração.
- `/credentials`: (Gitignored) Armazena chaves JSON de contas de serviço do Google.

## 🛠️ Stack Tecnológico

- **Frontend:** React 19, Vite, Recharts, Lucide React, Tailwind CSS.
- **Backend:** Python 3.12, FastAPI, LangChain, LangGraph, Playwright.
- **LLMs & Agents:** Groq (primary), Ollama (local), OpenRouter (fallback), Browser-Use (browser agent).

## 🚀 Como Iniciar

### Windows (Automático)
Basta executar o arquivo:
```cmd
Iniciar_NeuroOS.bat
```
Este script vai liberar as portas, iniciar o backend, o frontend e abrir a aplicação no modo app.

### Linux/Mac (Setup Inicial)
```bash
chmod +x setup.sh
./setup.sh
```

### Execução Manual
1. **Backend:**
   ```bash
   cd apps/backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
2. **Frontend:**
   ```bash
   cd apps/frontend
   npm install
   npm run dev
   ```

## 🔐 Configuração de Variáveis (.env)

Certifique-se de configurar o arquivo `.env` na raiz:
- `GROQ_API_KEY`: Para o roteamento principal de IA.
- `GA4_PROPERTY_ID`: Para o dashboard de análise.
- `GOOGLE_APPLICATION_CREDENTIALS`: Caminho para o seu JSON de conta de serviço.
- `WP_URL`, `WP_USERNAME`, `WP_APP_PASSWORD`: Para integração com blog/site.

---
Desenvolvido para **Instituto de Psicologia e Hipnose Ericksoniana**.
