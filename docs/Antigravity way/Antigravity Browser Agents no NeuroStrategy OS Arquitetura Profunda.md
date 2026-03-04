# Antigravity Browser Agents no NeuroStrategy OS: Arquitetura Profunda
## Visão geral
Este relatório aprofunda a análise anterior sobre agentes de navegador em Google Antigravity, tomando como referência o texto fornecido (persona do agente) e conectando cada parte a mecanismos técnicos reais: ReAct, Computer Use, visão de tela, emulação humana e soberania de dados.[^1][^2][^3][^4][^5][^6][^7][^8][^9][^10][^11]

O objetivo é servir de manual arquitetural para o **NeuroStrategy OS**, mostrando como transformar o “funcionário digital” descrito no texto em uma implementação concreta com Playwright/Puppeteer, Gemini Computer Use e camadas de segurança e dados locais.
## 1. "Cérebro" ReAct: da narrativa à implementação
### 1.1 ReAct na prática
O texto descreve o agente Antigravity como baseado explícitamente no ciclo **Pensamento → Ação → Observação → Replanejamento**, que corresponde à arquitetura **ReAct (Reason + Act)** da literatura recente.[^12][^13][^14][^11]

Em ReAct, cada iteração inclui: 
- **Thought (Pensamento)**: o modelo gera uma cadeia de raciocínio em linguagem natural definindo a submeta atual (“Preciso encontrar o preço da sessão de um concorrente em Goiânia no Doctoralia”).[^11]
- **Action (Ação)**: o modelo escolhe e emite uma chamada de ferramenta, aqui mapeada para ações Computer Use (`open_url`, `click`, `type`, `scroll`).[^6][^7][^8][^9][^10][^11]
- **Observation (Observação)**: o executor devolve de volta ao modelo um snapshot da tela (screenshot), DOM/árvore de acessibilidade e metadados (URL, frame ativo), permitindo avaliar o progresso.[^7][^8][^9][^6]

O **Replanejamento** descrito na persona (“se aparecer um pop‑up de cookies, identifico o botão 'Aceitar' e volto para a tarefa”) é precisamente o passo em que o modelo, ao ver uma Observation inesperada, atualiza sua cadeia de raciocínio e substitui o próximo passo do plano.[^15][^16][^13][^14][^12][^11]
### 1.2 Como codificar o loop ReAct no NeuroStrategy OS
Para transformar isso em código dentro do NeuroStrategy OS, o núcleo do agente precisa de: 
- Um **coordenador de episódios** que mantenha o histórico `(thought_i, action_i, observation_i)` em uma estrutura serializável (por exemplo, JSON em um event log).[^15][^12][^13][^14][^11]
- Um adaptador de modelo Gemini ou LAM equivalente capaz de: 
  - Receber o histórico como contexto; 
  - Gerar o próximo Thought explicando o que fará; 
  - Em seguida, emitir uma chamada Computer Use estruturada. 
- Um **interpreter** para essas chamadas de ferramenta, que as traduza para Playwright/Puppeteer e devolva Observations codificadas (ver Seção 2 e 3).[^6][^7][^8][^9][^10]

A frase do texto "isso garante que o Scraping do Doctoralia nunca pare de funcionar" se traduz em termos técnicos na capacidade do ciclo ReAct de replanejar quando: 
- Seletor CSS antigo falha; 
- A estrutura visual muda; 
- Intersticiais (cookies, banners LGPD) aparecem e precisam ser resolvidos antes de continuar.[^12][^16][^17][^11][^15]
## 2. "Olhos": Visão de Computador + DOM Mapping
### 2.1 Dualidade DOM + screenshot
O texto afirma que o agente "não vê apenas o código HTML" mas "enxerga a página de duas formas: DOM dinâmico e análise de screenshot". Essa abordagem corresponde exatamente ao design recomendado na documentação do **Gemini Computer Use**, que aceita **combinações de screenshot renderizada, snapshot do DOM/árvore de acessibilidade e metadados de tela**.[^8][^9][^10]

No executor: 
- Cada Action enviada ao navegador resulta em uma nova **Observation** que pode conter: 
  - `image`: screenshot atual com coordenadas de tela; 
  - `ax_tree` ou `dom_snapshot`: representação da árvore de acessibilidade/DOM textual; 
  - `metadata`: URL, título da aba, dimensões da viewport.[^9][^10][^8]
- O modelo Computer Use aprende a correlacionar elementos visuais (porção da imagem) com nós na árvore, o que permite raciocinar tanto em termos estritamente semânticos (role=button, name="Aceitar") quanto visuais (um banner cobrindo o conteúdo principal).[^15][^16][^7][^8][^9]
### 2.2 Monitoramento de DOM dinâmico (AJAX/React)
A parte "DOM Dinâmico: Eu monitoro mudanças em tempo real (AJAX/React)" pode ser implementada com: 
- **MutationObservers** no front‑end da sessão de navegador, que disparam quando nós são adicionados/removidos ou atributos relevantes mudam.[^15][^17][^18]
- Hooks no executor Playwright/Puppeteer que registram eventos de rede (`page.on('response')`, `page.waitForLoadState('networkidle')`) como sinais para recomputar a árvore de acessibilidade/screenshot antes de enviar a próxima Observação.[^12][^17][^15]

Isso garante que, quando um dashboard React carrega um gráfico novo, o agente receba um novo snapshot e possa inspecionar se esse gráfico está presente, mesmo se o HTML original fosse apenas um `div#root` vazio.[^16][^17][^15]
### 2.3 Auditoria SEO visual
O texto menciona que o agente pode detectar se um banner de anúncio atrapalha a leitura no celular, algo muito relevante para o **Módulo de Auditoria SEO** do NeuroStrategy OS. Tecnicamente, isso pode ser modelado como: 
- Capturar screenshots em breakpoints diferentes (mobile, tablet, desktop) usando o modo de emulação de dispositivos do Playwright.[^15][^17]
- Usar o modelo multimodal (Gemini 3 Pro/2.5) para: 
  - Identificar blocos de texto principais (título H1, corpo de artigo) e regiões de anúncio; 
  - Verificar sobreposição visual (banner cobrindo texto, pop‑up intrusivo), densidade de anúncios e tempo até conteúdo legível; 
  - Gerar um score qualitativo de usabilidade/UX mobile, alinhado com boas práticas de Core Web Vitals.[^19][^20][^8][^9]

Esse score pode alimentar recomendações automáticas: reposicionar banner, reduzir altura de pop‑up, inserir botão de fechar mais visível, etc.
## 3. "Mãos": emulação humana e evasão de anti‑bot
### 3.1 Mouse com curvas de Bézier
A parte da persona que fala de **“Curvatura de Mouse Bezier”** está alinhada com trabalhos acadêmicos e bibliotecas como **Ghost Cursor** e frameworks de mouse em Playwright/Puppeteer, que usam curvas de Bézier e leis de controle motor (como a Lei de Fitts) para simular movimentos humanos.[^21][^22][^23][^24]

Implementação técnica típica no executor de UI: 
- Em vez de `page.click(selector)` (teleporte instantâneo do cursor), usa‑se: 
  - Cálculo de um caminho de Bézier entre a posição atual e o alvo; 
  - Amostragem de `N` pontos intermediários com jitter aleatório; 
  - Em cada ponto, chamada a `page.mouse.move(x, y, {steps: 1})` com delays não uniformes.[^22][^23][^24][^21]
- Variante: uso direto de bibliotecas como `ghost-cursor` para Puppeteer ou libs equivalentes para Playwright.[^23][^21][^22]

Pesquisas mostram que esse tipo de trajetória, com aceleração inicial, velocidade máxima intermediária e desaceleração ao aproximar o alvo, mais micro‑pausas e ligeiros overshoots, produz movimentos quase indistinguíveis de usuários humanos e dificulta a detecção por WAFs comportamentais.[^21][^22][^23]
### 3.2 Digitação cadenciada
A "Digitação Cadenciada" pode ser implementada com: 
- Em vez de `page.fill(selector, "texto")`, usar loops de `page.type(selector, char, {delay: random(ms)})`, onde o delay segue uma distribuição aproximando padrões humanos (por exemplo, média 120–250 ms, variância moderada).[^21][^22]
- Introdução intencional de pequenos erros e correções (`Backspace`) em alguns contextos de baixa sensibilidade (como buscas), reforçando o aspecto humano.[^22][^23][^21]
### 3.3 Navegação "pura" em Chromium completo
A afirmação "Eu rodo um navegador completo (Chromium)... carregando todos os scripts de rastreio" alinha‑se com recomendações de ferramentas de Computer Use: 
- O executor utiliza instâncias **não‑headless** ou headless com **stealth plugins**, preservando fingerprint semelhante a um navegador de desktop comum.[^16][^7][^8][^9]
- Isso inclui: 
  - Execução de todos os scripts de tracking (Google Analytics, pixel do Meta, scripts anti‑bot); 
  - Cookies, localStorage e sessionStorage funcionais; 
  - User‑agent, timezone, language e viewport configurados para se parecer com uma máquina real (por exemplo, Windows 11 + Chrome).[^7][^8][^9][^23][^16]

Com isso, do ponto de vista de DataDome/Cloudflare, o agente se comporta como um usuário humano típico, e qualquer proteção residual é tratada pela emulação de mouse/teclado e, quando necessário, por fluxos de captura manual de captcha.
## 4. Integração local e soberania de dados
### 4.1 Modelo de execução "no seu PC"
A persona enfatiza que o agente opera "dentro do seu PC", em contraste com automações baseadas em cloud (Zapier, Make). Em termos arquiteturais, isso significa: 
- **Executor de UI local**: o processo que controla o Chromium/Playwright roda em ambiente sob controle do NeuroStrategy OS (desktop local ou servidor dedicado), não em infraestrutura terceirizada.[^4][^6][^25][^10]
- **Plano de dados local**: acessos a bancos do WordPress, consultório e CRMs são feitos por conectores internos; apenas resumos ou features derivadas são eventualmente enviados a modelos em nuvem.[^25][^4]

A documentação da Gemini Computer Use recomenda explicitamente que o cliente mantenha **um executor próprio**, com responsabilidades claras de: 
- Controlar domínios permitidos; 
- Implementar logging/auditoria; 
- Implementar salvaguardas contra ações perigosas.[^6][^10][^25]

Isso combina naturalmente com soberania de dados: o que sai do ambiente local para o modelo são **observações parciais**, não bancos completos.
### 4.2 Padrão de segmentação de dados para NeuroStrategy OS
Para o seu contexto (clínica, leads, TEA, etc.), uma boa estratégia de segmentação é: 
- **Camada bruta (RAW)**: WordPress, CRM, banco de pacientes totalmente locais; acesso apenas por back‑end interno. 
- **Camada de features (FEATURES)**: agregações, estatísticas e recortes textuais necessários para que o modelo raciocine (por exemplo, "lead com nome X, origem Instagram, ticket Y"), enviados ao LAM/LLM. 
- **Camada de artefatos (ARTIFACTS)**: relatórios, dashboards e scripts gerados pelo agente, armazenados localmente, com trilha de origem clara (qual tarefa e quais observações os geraram).[^4][^25]

Assim, mesmo que o modelo rodando em cloud tenha visão sobre partes dos dados, o núcleo sensível (identificadores completos de pacientes, histórico clínico) permanece restrito ao OS local.
## 5. Conectando com os módulos do NeuroStrategy OS
### 5.1 Aba de SEO: PageSpeed + auditoria visual
O texto descreve a capacidade do agente de abrir o site, rodar PageSpeed e "navegar visualmente" em paralelo. Um pipeline concreto: 
1. **Thought**: "Quero avaliar SEO técnico e UX visual desta landing page em mobile". 
2. **Action**: 
   - Abrir URL da landing; 
   - Chamar API do PageSpeed ou Lighthouse; 
   - Acionar Computer Use para gerar screenshots em viewport mobile, coletar DOM e árvore de acessibilidade.[^15][^17][^8][^9]
3. **Observation**: 
   - Pontuações de desempenho, acessibilidade e SEO; 
   - Screenshot com possíveis banners intrusivos; 
   - Lista de elementos com roles e labels (botões, formulários, headings).[^19][^20][^8][^9]
4. **ReAct**: 
   - Se detectar que texto principal está encoberto por pop‑up em mobile, o agente gera recomendações de alteração de layout; 
   - Se PageSpeed indica imagens sem lazy‑load, o agente planeja um patch de código no tema WordPress; 
   - Se H1 não contém a keyword alvo, sugere reescrita do título.[^12][^20][^11][^15][^19]
### 5.2 Publicação WordPress via GUI
Quando a API falha, o texto descreve o agente entrando no admin do WP e configurando Yoast via cliques. Arquiteturalmente, este é apenas mais um cenário Computer Use: 
- A tarefa de alto nível é "garantir que o post está perfeito"; o agente combina: 
  - Acesso direto ao banco ou à API REST do WP para ler metadados; 
  - Navegação GUI em `/wp-admin` para casos onde o plugin não expõe API suficiente.[^15][^17][^8][^9]
- A interação via GUI é idêntica a de um humano: abrir editor, preencher campos de snippet SEO, verificar pré‑visualização, salvar rascunho/publicar. 

Importante: no SO de IA, definir **limites de ação** para evitar que um bug no agente publique conteúdo incompleto ou quebre o layout.
### 5.3 Fluxo de Leads em tempo real
Para monitorar Instagram e "pular" no CRM quando surge um lead qualificado, a arquitetura pode ser: 
- **Listener de eventos**: 
  - Integração via API do Meta/Instagram para receber notificações de novos DMs ou comentários; 
  - Alternativamente, um mini‑browser agent monitorando o front‑end do Instagram Web em intervalos.[^13][^26]
- **Classificador de leads**: 
  - Modelo (pode ser Gemma local) que rotula o texto da mensagem como qualificado/não qualificado; 
- **Trigger de agente GUI**: 
  - Quando um lead é qualificado, dispara uma tarefa ReAct: abrir CRM, criar registro de paciente, anotar origem (Instagram) e contexto da mensagem.[^27][^26][^14][^13]

Tudo isso permanece sob soberania local se o listener e o CRM estiverem dentro do ambiente gerido pelo NeuroStrategy OS.
## 6. Boas práticas para transformar a persona em arquitetura robusta
### 6.1 Transparência e auditoria
A narrativa do "funcionário digital" precisa ser suportada por: 
- **Logs detalhados de Thought/Action/Observation** por tarefa, permitindo auditorias a posteriori — algo muito alinhado com práticas de ReAct e com exigências regulatórias emergentes.[^4][^25][^11]
- Representação legível de cada episódio: quem pediu o quê, quais sites foram acessados, quais dados foram lidos, que mudanças foram feitas.
### 6.2 Segurança operacional
- **Whitelists de domínio**: impedir que o agente use Computer Use fora de domínios aprovados (Doctoralia, WordPress próprio, painéis de anúncio, CRMs autorizados).[^6][^25][^10]
- **Classes de risco para ações**: 
  - Baixo risco: scraping de preços, navegação, leitura de métricas; 
  - Médio risco: criação/edição de posts, cadastro de leads; 
  - Alto risco: alteração de orçamento de anúncios, exclusão de dados, compras online. 

Para níveis médio/alto, o sistema deve exigir **confirmação humana explícita** ou rodar primeiro em modo simulado.[^4][^25][^6]
### 6.3 Evolução contínua de LAMs
A robustez descrita na persona (“nunca para de funcionar mesmo com mudança de layout”) só se sustenta se: 
- O modelo subjacente for atualizado periodicamente com novas trajetórias de navegação (especialmente em plataformas críticas como Doctoralia);[^15][^12][^16][^17][^7]
- O NeuroStrategy OS coletar ativamente casos de fracasso e usá‑los para fine‑tuning ou feedback, reforçando caminhos de sucesso e penalizando estratégias frágeis.[^13][^27][^14][^11]
## 7. Síntese para design do NeuroStrategy OS
Integrando o texto da persona com a literatura e a stack da Google, o "agente Antigravity" para o seu projeto pode ser formalizado como: 
- Um **LAM/ReAct multimodal** (Gemini 3 Pro + 2.5 Computer Use ou análogo) capaz de raciocinar sobre objetivos de marketing, navegar interfaces complexas e replanejar sob incerteza.[^2][^3][^4][^7][^14][^8][^9][^10][^11]
- Um **executor de navegador local** baseado em Playwright/Puppeteer + módulos de emulação humana (Bezier mouse, digitação cadenciada, proxies e fingerprint realistas).[^15][^16][^17][^6][^7][^8][^21][^22][^23][^24]
- Uma **camada de dados soberana**, com conectores dedicados para WordPress, CRMs e plataformas de anúncios, mantendo PII e dados sensíveis dentro do ambiente controlado. 
- Um **orquestrador de tarefas NeuroStrategy**, que converte metas de alto nível (ticket médio, SEO, fluxo de leads) em planos concretos que o agente executa de ponta a ponta.

Com esses pilares, o discurso de que "o Antigravity é o seu funcionário digital que nunca dorme" deixa de ser metáfora de marketing e passa a ser uma especificação arquitetural precisa que pode ser implementada, monitorada e evoluída ao longo do tempo.

---

## References

1. [Google Antigravity](https://antigravity.google) - Streamline UX development by leveraging browser-in-the-loop agents to automate repetitive tasks. Vie...

2. [Build with Google Antigravity, our new agentic development platform](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/) - Google Antigravity: The agentic development platform that lets agents autonomously plan, execute, an...

3. [Introducing Google Antigravity, a New Era in AI-Assisted Software ...](https://antigravity.google/blog/introducing-google-antigravity) - As the agent works, it produces Artifacts, tangible deliverables in formats that are easier for user...

4. [Google DeepMind Unveils Antigravity: Autonomous AI Agent ...](https://www.therift.ai/news-feed/google-deepmind-unveils-antigravity-autonomous-ai-agent-platform-for-developers) - Google DeepMind launches Antigravity, a free platform deploying autonomous AI agents across code edi...

5. [Google Antigravity : Build Apps Faster | AI-Powered Editor, Agent Manager & Browser Integration](https://www.youtube.com/watch?v=FPESYnmbXpo) - This video provides the first look at Anti-gravity, a brand new product by Google DeepMind built spe...

6. [Integrate Gemini 2.5 Computer Use via API](https://skywork.ai/blog/gemini-2-5-computer-use-api-step-by-step-guide/) - Learn how to integrate Gemini 2.5 Computer Use with APIs. Step-by-step Python, JavaScript, REST samp...

7. [Google AI Introduces Gemini 2.5 'Computer Use' (Preview)](https://www.marktechpost.com/2025/10/08/google-ai-introduces-gemini-2-5-computer-use-preview-a-browser-control-model-to-power-ai-agents-to-interact-with-user-interfaces/) - Google AI Introduces Gemini 2.5 'Computer Use' (Preview): A Browser-Control Model to Power AI Agents...

8. [Computer Use | Gemini API - Google AI for Developers](https://ai.google.dev/gemini-api/docs/computer-use) - Computer Use enables you to build browser control agents that interact with and automate tasks. Usin...

9. [How Gemini 2.5 Computer Use Lets AI Control Web Interfaces ...](https://sider.ai/blog/ai-tools/how-gemini-2_5-computer-use-lets-ai-control-web-interfaces-safely-and-smartly) - This can include a DOM snapshot, accessibility tree, or a rendered screenshot with coordinates. It a...

10. [Gemini 2.5 Computer Use model - Google AI for Developers](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-computer-use-preview-10-2025) - Learn about the Gemini Computer Use model from Google

11. [ReAct-Based Action Strategy](https://www.emergentmind.com/topics/react-based-action-strategy) - ReAct-based action strategy integrates iterative reasoning and execution in LLM agents, enhancing in...

12. [Agent-E: From Autonomous Web Navigation to Foundational Design
  Principles in Agentic Systems](http://arxiv.org/pdf/2407.13032.pdf) - AI Agents are changing the way work gets done, both in consumer and
enterprise domains. However, the...

13. [4. Empirical Evaluation And...](https://www.emergentmind.com/topics/large-action-models) - Large Action Models are AI systems that plan, generate, and execute structured actions across modali...

14. [Large Action Models: From Inception to Implementation](https://arxiv.org/html/2412.10047v1)

15. [AutoGLM: Autonomous Foundation Agents for GUIs](https://arxiv.org/html/2411.00820v1) - ...User Interfaces (GUIs). While foundation models excel at acquiring human
knowledge, they often st...

16. [WebGames: Challenging General-Purpose Web-Browsing AI Agents](https://arxiv.org/html/2502.18356v1) - ...ai, offering a lightweight, client-side implementation
that facilitates rapid evaluation cycles. ...

17. [AutoWebGLM: A Large Language Model-based Web Navigating Agent](https://dl.acm.org/doi/pdf/10.1145/3637528.3671620) - ...data (2) versatility of actions on webpages, and (3) task difficulty due to the open-domain natur...

18. [DexAssist: A Voice-Enabled Dual-LLM Framework for Accessible Web
  Navigation](https://arxiv.org/pdf/2411.12214.pdf) - ...framework displays
an increase of ~36 percentage points in overall accuracy within the first
iter...

19. [Gemini: A Family of Highly Capable Multimodal Models](http://arxiv.org/pdf/2312.11805.pdf) - ...model to achieve human-expert
performance on the well-studied exam benchmark MMLU, and improving ...

20. [Gemma: Open Models Based on Gemini Research and Technology](https://arxiv.org/pdf/2403.08295.pdf) - This work introduces Gemma, a family of lightweight, state-of-the art open
models built from the res...

21. [[PDF] Emulating Human-Like Mouse Movement Using Bezier Curves and ...](https://ijirt.org/publishedpaper/IJIRT183343_PAPER.pdf)

22. [Emulating Human-Like Mouse Movement Using Bezier Curves and ...](https://ijirt.org/article?manuscript=183343) - International Journal for Innovative Research in Technology is UGC Compliant Peer reviewed Journal. ...

23. [Ghost Cursor Tutorial: Human mouse movements for puppeteer](https://roundproxies.com/blog/ghost-cursor/) - Learn Ghost Cursor for web scraping with Puppeteer. 5-step guide to create human-like mouse movement...

24. [GitHub - ChrisdeWolf/bezier-mouse-js: bezier-mouse-js is a lightweight javascript library to mirror human-like mouse movements with Bézier curves.](https://github.com/ChrisdeWolf/bezier-mouse-js) - bezier-mouse-js is a lightweight javascript library to mirror human-like mouse movements with Bézier...

25. [Computer Use model and tool | Generative AI on Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/computer-use) - The Gemini 2.5 Computer Use model and tool may be prone to errors and security vulnerabilities. Acti...

26. [What are Large Action Models? The Next Frontier in AI Decision ...](https://www.digitalocean.com/resources/articles/large-action-models) - Explore how large action models are expanding AI's ability to understand and execute complex physica...

27. [Comprehensive Guide to Large Action Models (LAMs) in AI - Code B](https://code-b.dev/blog/large-action-models) - Understand how Large Action Models work, their architecture, industry use cases, challenges, and fut...

