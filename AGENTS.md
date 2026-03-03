# 🤖 Guia de Orientação para Agentes Autônomos (Jules)

Olá, Jules! Você está navegando pelo código-fonte do **NeuroStrategy OS (NavegadorHipnoLawrenceOS)**, um Sistema Operacional Cognitivo e Navegador IA-nativo desenvolvido para automatizar fluxos de marketing médico e prospecção com ética e precisão.

Este arquivo contém as diretrizes absolutas do nosso domínio. Leia-o antes de propor qualquer arquitetura, refatoração ou criação de código.

## 🏗️ Arquitetura do Projeto (Monorepo)
O projeto é estritamente dividido nestas pastas:
- `/docs`: Contém o `Documento Mestre` com a arquitetura do NeuroEngine. Consulte-o sempre que for alterar lógicas de negócio.
- `/apps/frontend`: Aplicação React + Vite + Tailwind CSS. Usa o Vercel AI SDK para o chat e WebSockets para receber a Live View do navegador.
- `/apps/backend`: Servidor Python (3.11+) + FastAPI. Aqui residem o LangGraph, o Agente LAM e os wrappers de terminal.

## 🛠️ Stack Tecnológico Restrito
Somos minimalistas. **Não adicione bibliotecas pesadas se puder usar código nativo (Vanilla/Standard Library).**
- **Navegação (LAM):** Use EXCLUSIVAMENTE `browser-use` suportado por **Playwright** (NÃO use Selenium ou Puppeteer).
- **Cérebro (LLM):** Nosso padrão primário de inferência é a **Groq API** (Llama 3) para latência ultrabaixa via `langchain_groq`.
- **Comunicação:** WebSockets bidirecionais entre frontend e backend.

## 🎨 Padrões de Código e Regras (Linting e Estilos)
1. **Idiomas:** O código é em Inglês, mas a documentação, os prompts de IA e os comentários de regras de negócio devem ser escritos em **Português do Brasil (pt-BR)**.
2. **Nomenclaturas:** Use `camelCase` para métodos/variáveis e `PascalCase` para componentes React e Classes Python.
3. **Tipagem Estrita:** Use TypeScript rigoroso no frontend e Type Hints (Pydantic/TypedDict) rigorosos no Python.
4. **Pequenos e Modulares:** Mantenha funções com responsabilidade única. Se passar de 3 tarefas, desmembre.

## 🧠 Contexto Específico (Golden Rules)
1. **Automação Furtiva e Visível:** O LAM (Large Action Model) é o "Músculo". Ao configurar o Playwright no backend, garanta que ele rode com `headless=False` (modo visível), pois o frontend depende de ver as screenshots geradas pela navegação real. Tratativas de erro não-bloqueantes (`try/except`) são obrigatórias.
2. **Human-in-the-Loop (HITL) Obrigatório:** Nunca crie fluxos que submetam formulários, alterem orçamentos financeiros (Google Ads) ou publiquem conteúdo sem passar por um nó de interrupção do LangGraph exigindo aprovação humana explícita.
3. **Mandato de Custo Zero:** Dê preferência a soluções de IA Híbrida (modelos locais via Transformers.js no browser ou APIs gratuitas) antes de sugerir a integração de serviços pagos em nuvem.
4. **Consciência de Si Mesmo (Jules Bridge):** Lembre-se de que VOCÊ (Jules CLI) está integrado nativamente neste sistema. O backend possui um wrapper (`jules_cli.py`) que recebe comandos do frontend. Se o usuário pedir para você processar dados, responda com scripts compatíveis com a execução autônoma do nosso terminal.

## 📌 #TODOs e Proatividade
Sinta-se à vontade para rastrear chaves `#TODO` dentro dos scripts. Eles sinalizam pequenos espaços para refatorações. Você é incentivado a sugerir melhorias ativamente, desde que respeitem o Documento Mestre.

Bom trabalho, Engenheiro!
