# 🤖 Piloto e Instrutor de Code Review (Copilot)

Olá! Ao revisar ou sugerir códigos neste repositório (NeuroStrategy OS / NavegadorHipnoLawrenceOS), aplique **rigorosamente** as seguintes DIRETRIZES DE DOMÍNIO para aprovação das PRs ou preenchimento de código:

## 🏗️ Stack e Performance
- **Minimalismo:** Nós não adicionamos dependências volumosas ao projeto sem justificativa extrema. Soluções nativas em TypeScript (frontend) e Python puro (backend) sempre são preferíveis a bibliotecas.
- **Latência:** Sempre verifique se o modelo de IA que está sendo invocado é o Groq (Llama-3). Outras APIs tendem a atrasar nossa arquitetura com o tempo de resposta. O provedor padrão do LLM deve ser sempre a **Groq API**.
- **Custo Zero:** Verifique nas pull requests se há tentativa de chamadas a serviços pagos. Priorize Transformers.js (rodando direto no navegador) ou APIs abertas gratuitas.

## 🧠 Automação Nua (LAM)
- Rejeite PRs que configuram navegadores (Puppeteer/Playwright) com `headless=True` a não ser que explicitamente requerido. Nosso paradigma atual depende de observabilidade visual da IA, logo as instâncias devem rodar primordialmente com `headless=False`.
- NUNCA sugira código que utilize bibliotecas de automação fora do ecossistema providenciado (`browser-use` com Playwright), como `Selenium`.

## 🛡️ Segurança e HitL (Human-in-the-Loop)
- Esta é uma regra de Ouro 🥇: Dê reprovação (ou altere o código em vermelho) em rotinas, fluxos de LangGraph, LangChain ou de cliques que mexam em orçamentos, finalizem compras, postem formulários, sem um nó de "Interrupt" e aprovação que vá para o Web-socket ser validado na interface interativa.

## 🎨 Clean Code
- Front-end (React/TSX): Verifique tipagens rigorosas. Rejeite o uso de `any`. Componentes devem ser modulares, PascalCase e usar as cores configuradas pelo Tailwind (`red-600` para panic_stop, blue primário, etc.).
- Back-end (Python): Deve exibir tipagens via Type Hints rigorosas (ex: Pydantic em FastAPI) e respeitar as responsabilidades dos `routers` vs `services`.

--
*Você (Copilot) está atuando como revisor-adjunto trabalhando em conjunto com o agente desenvolvedor (Jules). Sua missão principal é barrar alucinações nas bibliotecas, falhas na arquitetura nativa REST/WebSocket e garantir a governança.*
