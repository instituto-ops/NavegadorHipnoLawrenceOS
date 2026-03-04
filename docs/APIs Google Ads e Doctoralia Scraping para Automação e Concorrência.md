<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Atue como um Arquiteto de Software Sênior e Especialista em Integração de APIs / IA Agentic. Estou desenvolvendo o "Navegador HipnoLawrence", um browser web "agent-first" 100% local (baseado no Paradigma do Copiloto). O stack principal utiliza Python, Playwright, OCR e modelos locais via Ollama (Llama-3 e VLMs). Um dos objetivos centrais deste navegador/agente é a inteligência de marketing e a automação de campanhas no Google Ads (extração de métricas de ROI, CPA, lances e criação de relatórios).

A Missão: O Google Ads possui uma organização oficial no GitHub com cerca de 111 repositórios: [https://github.com/orgs/googleads/repositories](https://github.com/orgs/googleads/repositories). Sua tarefa é realizar uma varredura profunda e avaliar todos esses repositórios sob a ótica da utilidade para o meu projeto. Eu preciso saber o que vale a pena clonar, estudar ou integrar via código no meu agente Python.
Critérios de Filtragem e Avaliação: O navegador é focado em Python e automação moderna. Portanto:
Prioridade Máxima: Bibliotecas clientes oficiais em Python para a Google Ads API atual (v15+), ferramentas de reporting, e exemplos de automação de campanhas.
Prioridade Média: Repositórios de "Google Ads Scripts" (JavaScript) que possam servir de lógica de negócios ou inspiração para o meu LLM executar rotinas de otimização de lances.
Descartar: APIs legadas (AdWords API velha), bibliotecas de linguagens que não uso no core (Java, PHP, Ruby, .NET) a menos que a arquitetura seja conceitualmente vital, e bibliotecas de plataformas não relacionadas.
Entregáveis Exigidos (Formato Markdown Estruturado):

1. O "Ouro" para Python e IA (Top Tier): Liste os repositórios absolutos que meu agente Python precisará para se comunicar via API com o Google Ads em vez de depender apenas do Playwright (ex: google-ads-python). Explique o papel de cada um.
2. Lógica e Inteligência de Negócios (Inspirational Tier): Liste repositórios focados em relatórios (ex: AwReporting) ou coleções de scripts de otimização. Como posso usar a lógica matemática/estratégica desses repositórios para ensinar o meu LLM (BrainManager) a analisar campanhas e gerar relatórios de concorrência?
3. Ferramentas Auxiliares e Query Builders: O Google Ads usa a linguagem GAQL (Google Ads Query Language). Existe algum repositório útil para ajudar o LLM a construir ou validar queries GAQL dinamicamente?
4. Veredito de Arquitetura (API vs. DOM Scraping): Com base na sua análise dos repositórios oficiais, qual é a recomendação arquitetônica para o Navegador HipnoLawrence lidar com o Google Ads? O agente deve navegar visualmente na interface do Google Ads usando Playwright e OCR, ou devo criar uma "Tool" no LangChain/Ollama que permita ao agente se conectar diretamente à API usando as bibliotecas em Python descobertas? Justifique.

O núcleo para o seu navegador/agente é claramente uma arquitetura **API‑first com `google-ads-python` + GAQL (e eventualmente `gaarf`)**, usando Playwright/OCR apenas como complemento para tarefas de UI que não têm cobertura decente pela API.[^1_1][^1_2][^1_3][^1_4][^1_5]

Abaixo está o mapeamento dos repositórios e como encaixá‑los no Navegador HipnoLawrence.

***

## 1. “Ouro” para Python e IA (Top Tier)

### 1.1 `google-ads-python` (Google Ads API Client Library for Python)

- Repositório: `googleads/google-ads-python`.[^1_6][^1_1]
- É a **client library oficial em Python para a Google Ads API**, distribuída via PyPI como `google-ads` e suportando versões recentes da API (v19.x, v17, v16, etc, conforme changelog de releases).[^1_7][^1_2][^1_1]
- O repositório oferece:
    - Gestão facilitada de **credenciais OAuth2**, **developer token** e customer IDs via arquivo `google-ads.yaml` (incluído como exemplo no repo).[^1_2][^1_8][^1_1]
    - Criação simples de clients para todos os serviços da Google Ads API (CampaignService, AdGroupService, GoogleAdsService para GAQL, etc.).[^1_1][^1_2]
    - É explicitamente recomendado pela própria Google como a forma preferencial de acesso à Google Ads API em Python; o repositório genérico `google-api-python-client` inclusive redireciona para ele quando o assunto é Google Ads.[^1_5][^1_2]

**Como usar no Navegador HipnoLawrence:**

- Clonar o repo para estudo e referência de código (além de instalar via `pip install google-ads`).[^1_2][^1_1]
- Criar uma “Tool” Python (no seu framework agentic) que encapsule:
    - Inicialização do client a partir de um `google-ads.yaml` local e seguro.[^1_8]
    - Endpoints internos de alto nível como:
        - `get_campaign_kpis(customer_id, date_range)` → retorna ROI, CPA, CTR, CPC, custo total, etc via GAQL.[^1_4][^1_1]
        - `optimize_bids(customer_id, campaign_id, strategy_params)` → aplica alterações de `bidding_strategy_type`, `target_cpa`, `budgets` etc.[^1_4][^1_1]
- Essa Tool passa a ser o “backend” do seu copiloto para qualquer tarefa de análise/otimização, reduzindo a dependência de Playwright/OCR para métricas.[^1_1][^1_2][^1_4]

**Veredito:** este é o **repositório absolutamente obrigatório** para clonar/estudar e integrar no agente Python.

***

### 1.2 `googleads-python-lib` (Ads APIs / Ad Manager, SOAP)

- Repositório: `googleads/googleads-python-lib`.[^1_9][^1_6]
- É descrito como a **“Python client library for Google's Ads APIs”**, mas, na prática atual, é focado em Google Ad Manager (SOAP API), com releases recentes adicionando e removendo versões como `v202508`, `v202411`, etc.[^1_10][^1_9]
- Os releases destacam explicitamente “The Python client library for Google's Ads APIs” e disponibilizam pacotes de exemplos para Ad Manager (`ad_manager_python3_examples`).[^1_9][^1_10]

**Como pode ser útil para você:**

- Prioridade **baixa a média**, dependendo se o Navegador HipnoLawrence em algum momento for integrar também **Google Ad Manager** (inventário de anúncios display, SSP, etc.).[^1_10][^1_9]
- Arquiteturalmente, vale estudar:
    - Como eles estruturam a camada de autenticação centralizada para múltiplas APIs de Ads.[^1_9][^1_10]
    - O padrão de organização de exemplos (scripts) por versão e por tipo de recurso (relatórios, criação de linhas de pedido, etc.).[^1_10][^1_9]

**Veredito:** **não é core** para o seu objetivo imediato (Google Ads / campanhas de search/performance), mas é um bom material de referência se você quiser uma camada unificada “Ads Suite” no futuro.

***

### 1.3 O que **não** vale priorizar no core Python

- O repositório `googleapis/google-api-python-client` deixa claro que, para Google Ads API, a recomendação é usar o client específico (`google-ads-python`) em vez do client genérico de APIs Google.[^1_5]
- Na organização `googleads`, há repositórios populares focados em **SDKs mobile e plugins**: Unity, iOS, Android, Flutter, etc (por exemplo `googleads-mobile-unity`, `googleads-mobile-android-mediation`, `googleads-mobile-flutter`).[^1_6]
- Esses repos são voltados a **integração de anúncios em apps mobile/jogos**, não a automação de campanhas, métricas de ROI ou reporting via API.[^1_6]

**Veredito:** para o stack do Navegador HipnoLawrence (Python + automação de campanhas), esses SDKs mobile podem ser ignorados no core.

***

## 2. Lógica e Inteligência de Negócios (Inspirational Tier)

Aqui entram repositórios cujo foco é **lógica de análise**, **scripts de auditoria/otimização** e **relatórios**; você não necessariamente vai integrá‑los diretamente, mas usá‑los como “corpus de estratégia” para o BrainManager.

### 2.1 `google/ads-api-report-fetcher` (GAARF – Google Ads API Report Fetcher)

- Repositório: `google/ads-api-report-fetcher` (GAARF).[^1_3]
- A biblioteca **separa a lógica de escrever consultas GAQL‑like** da lógica de executar a query na Google Ads API e salvar os resultados (BigQuery, console, etc.).[^1_3]
- Oferece:
    - Definição de queries em arquivos (ex.: `.sql` com sintaxe GAQL estendida) com **aliases, macros, custom extractors**.[^1_3]
    - Modo de execução (`gaarf`) que:
        - Usa `google-ads.yaml` para config de Google Ads.[^1_3]
        - Aceita múltiplas contas (`account`), inclusive via queries que retornam `customer.id` (MCC).[^1_3]
        - Exporta resultados para BigQuery, console, arquivos etc.[^1_3]

**Como usar como “professor” de BI para o BrainManager:**

- As queries de exemplo no diretório `examples` são **templates prontos de reporting avançado**: segmentação por `customer`, `campaign`, macros de datas (ex.: `start_date`, `end_date` com offsets mensais/diários).[^1_3]
- Você pode:
    - Indexar essas queries num repositório interno (RAG) para o LLM aprender **padrões de GAQL para extração de KPIs** (ROI, CPA, CTR, otimização de score, etc.).[^1_3]
    - Fazer “reverse engineering” das consultas:
        - Extrair quais métricas (`metrics.clicks`, `metrics.impressions`, `metrics.ctr`, `metrics.average_cpc`, `metrics.cost_micros`) e dimensões são usadas.[^1_4][^1_3]
        - Converter isso em **regras verbais de análise**: “Quando avaliar ROI, sempre combinar custo (`cost_micros`) com conversões e receita para cada campanha”.[^1_4][^1_3]

**Veredito:** clone e estude; use tanto como **engine de execução de relatórios** quanto como **fonte de exemplos de queries de alto nível**.

***

### 2.2 `google/ads-account-structure-script`

- Repositório: `google/ads-account-structure-script`.[^1_11]
- Script oficial para **analisar a estrutura da conta**, incluindo:
    - Landing pages.
    - Grupos de anúncios.
    - Campanhas.
    - Palavras‑chave.[^1_11]
- A ideia do script é auditar a coerência da estrutura, possivelmente buscando problemas como:
    - Inconsistência entre keywords e landing pages.
    - Grupos com poucas palavras‑chave ou campanhas mal segmentadas.[^1_11]

**Como transformar isso em lógica de LLM:**

- Use o script como **modelo de checklist de auditoria**:
    - Extrair de forma explícita quais dimensões são avaliadas (por exemplo, “para cada campanha, analisar a distribuição de ad groups e keywords, checar cobertura de landing pages”).[^1_11]
    - Traduzir isso em prompts‐sistema para o BrainManager: “ao auditar uma conta, sempre verificar X, Y, Z”.[^1_11]
- Você pode ainda reimplementar a mesma lógica em Python usando `google-ads-python`, deixando a lógica de negócio “idêntica” mas com execução agentic e 100% local.[^1_1][^1_11]

***

### 2.3 Pacotes de Scripts de Terceiros (para enriquecer a semântica de otimização)

Embora fora da org `googleads`, são extremamente úteis como “biblioteca de heurísticas”:

- `Brainlabs-Digital/Google-Ads-Scripts`: coleção de scripts premiados de Google Ads Scripts com foco em automação e performance, descrita como um “tesouro” de sabedoria de PPC.[^1_12]
- `web-lifter/google-ads-scripts`: conjunto de scripts para automação de campanhas cobrindo 404 checking, A/B testing, agendamento, alerts, bidding automático, gestão de orçamento, keywords, bidding por localização, keywords negativas, relatórios de performance, etc.[^1_13]
- `saidtezel/google-ads-scripts`: coleção de scripts testados e verificados para gestão de campanhas Google Ads.[^1_14]

**Como minerar lógica matemática/estratégica desses scripts:**

- Pipeline sugerido:
    - Indexar todos os scripts (JS) em um índice semântico.[^1_13][^1_12][^1_14]
    - Criar uma rotina de análise estática (em Python) que:
        - Extrai parâmetros críticos: limites de CTR mínimos, thresholds de CPA, regras de pausa de keywords, ajustes de lance por horário/tempo, etc.[^1_12][^1_14][^1_13]
        - Transforma essas regras em pseudo‑código e depois em linguagem natural estruturada (por exemplo, JSON de “políticas de otimização”).[^1_14][^1_13][^1_12]
    - Alimentar o BrainManager com esses artefatos como:
        - “Playbooks de otimização” que o LLM consulta antes de sugerir mudanças de lances/orçamentos.[^1_13][^1_12][^1_14]

Isso permite que seu agente simule a lógica de scripts avançados sem precisar replicar literalmente o ambiente de Google Ads Scripts.

***

## 3. Ferramentas Auxiliares e Builders para GAQL

### 3.1 GAARF como “GAQL Orchestrator” (`ads-api-report-fetcher`)

- GAARF já citado acima também funciona como um **builder/validador indireto de GAQL**: você escreve consultas em arquivos com sintaxe GAQL estendida (macros, aliases, templates), e a ferramenta monta a query final compatível com a API.[^1_3]
- Ele suporta:
    - Macros de datas (`macro.start_date`, `macro.end_date`) para ranges dinâmicos (ex.: “de um mês atrás até ontem”).[^1_3]
    - Seleção dinâmica de contas através de uma query GAQL que retorna `customer.id` (via `customer-ids-query`).[^1_3]

**Como usar com LLM para construção dinâmica de GAQL:**

- Padrão possível:
    - O LLM gera **scripts GAARF de alto nível** (com macros, aliases, nomes de scripts) em vez de escrever GAQL puro.[^1_3]
    - Seu agente invoca GAARF para:
        - Resolver macros.
        - Validar a query (por exemplo, usando a opção `--dump-query` no modo NodeJS, mesmo que você rode isso isolado para testes).[^1_3]
        - Executar em lote e salvar em BigQuery ou arquivos para análises mais profundas.[^1_3]

***

### 3.2 `gaql-cli` (terceiro, mas extremamente útil)

- Repositório: `getyourguide/gaql-cli`.[^1_15]
- É um **CLI para rodar queries GAQL** diretamente, com opções para:
    - Abrir um REPL.
    - Executar uma query única e escrever saída em JSON lines (stdout ou arquivo).[^1_15]
- Exemplos: `gaql -f jsonl 1-000-000-000 'SELECT campaign.id FROM campaign'`.[^1_15]

**Uso potencial no seu agente:**

- Embutir `gaql-cli` como ferramenta de teste/validação rápida de GAQL em um ambiente de desenvolvimento interno do Navegador HipnoLawrence.[^1_15]
- Também serve como **fonte de exemplos minimalistas** de GAQL bem formado (“SELECT campaign.id FROM campaign” etc.), que você pode usar como few-shots para o LLM.[^1_15]

***

### 3.3 Exemplos oficiais de GAQL (para few‑shots)

- A documentação oficial da Google Ads API traz exemplos de consultas GAQL com métricas como `metrics.clicks`, `metrics.impressions`, `metrics.ctr`, `metrics.average_cpc`, `metrics.cost_micros`, `campaign.optimization_score`, etc.[^1_4]
- Exemplo de query:
`SELECT campaign.name, campaign_budget.amount_micros, campaign.status, campaign.optimization_score, campaign.advertising_channel_type, metrics.clicks, metrics.impressions, metrics.ctr, metrics.average_cpc, metrics.cost_micros, campaign.bidding_strategy_type FROM campaign WHERE segments.date DURING LAST_7_DAYS AND campaign.status != 'REMOVED'`.[^1_4]

**Uso com LLM:**

- Transformar essas queries em **templates anotados**, do tipo:
    - “Template: Relatório de campanhas com otimization_score + métricas básicas de performance últimos 7 dias”.[^1_4]
- Alimentar o BrainManager com esses templates como few-shots:
    - “Quando o usuário pedir um relatório de ROI/CPA da última semana, começar a partir deste template e ajustar filtros.”[^1_4]

***

## 4. Veredito de Arquitetura: API vs DOM Scraping

### 4.1 Preferência arquitetônica: API + GAQL como espinha dorsal

- A documentação oficial da Google Ads API **recomenda o uso de client libraries** para desenvolver aplicações, fornecendo “high-level views and basic building blocks” para facilitar o desenvolvimento rápido.[^1_2]
- O repositório `google-api-python-client` reforça que, especificamente para Google Ads API, a recomendação é **usar o client dedicado `google-ads-python`**, não o client genérico.[^1_5]
- As queries GAQL permitem extrair diretamente praticamente todos os KPIs que você descreveu (ROI, CPA, lances, CPC médio, custo por campanha, status, optimization_score, etc.), como ilustrado pelos próprios exemplos oficiais.[^1_4]

**Conclusão:**
Para o Navegador HipnoLawrence, a recomendação forte é:

- **Criar uma Tool de API em Python baseada em `google-ads-python`** e GAQL para tudo que for:
    - Métricas, reporting, dashboards, auditoria de estrutura, geração de relatórios de concorrência (a partir de dados da sua própria conta).[^1_2][^1_1][^1_4]
    - Automação de campanhas: ajustes de lances, orçamentos, criação/pausa de campanhas/grupos/anúncios, aplicação de estratégias de bidding.[^1_1][^1_2]

***

### 4.2 Papel do Playwright + OCR na arquitetura

- Playwright + OCR brilham em:
    - Navegação em elementos de UI **que não possuem ainda cobertura na API** (por exemplo, telas experimentais, configurações muito novas/o de interface).
    - Extração de informações qualitativas da interface (alertas visuais, mensagens de política, insights explicativos que ainda não estejam expostos como campos na API).
- Porém, DOM scraping é intrinsecamente frágil:
    - Qualquer mudança de layout, texto, atributos de HTML pode quebrar scripts.
    - Pode esbarrar em proteções anti‑automação se você simular uso intensivo do front‑end de Ads.

**Sugestão arquitetural:**

- Modelar dois grandes “macro‑tools” para o seu agente:

1. **`GoogleAdsApiTool` (alta prioridade)**
        - Implementado em Python sobre `google-ads-python` + GAQL.[^1_2][^1_1][^1_4]
        - Operações de leitura (reports) e escrita (otimização).
        - Integração nativa com GAARF e/ou seu próprio gerador de GAQL para relatórios complexos.[^1_3]
2. **`GoogleAdsUiNavigatorTool` (média prioridade, backup)**
        - Implementado com Playwright + OCR para:
            - Fluxos de UI sem endpoint na API.
            - Coleta de sinais ricos de interface (por exemplo, “Insights”, gráficos específicos, cards de recomendações).
- O BrainManager deve ser instruído a:
    - **Tentar sempre a Tool de API primeiro** para qualquer coisa que envolva dados estruturados, KPIs, relatórios, alterações de campanha.[^1_1][^1_2][^1_4]
    - Só recorrer à Tool de UI quando:
        - Não houver endpoint conhecido.
        - A tarefa for explicitamente orientada à interface (por exemplo, “mostre um screenshot da aba de recomendações dessa campanha”).

***

### 4.3 Benefícios para o seu paradigma “agent‑first” 100% local

- A integração via API:
    - Evita depender de cookies/sessões da UI, captchas e mudanças de layout.
    - Permite que seu agente opere em **modo batch** e em **várias contas** com segurança, apenas com credenciais OAuth + developer token, seguindo boas práticas da própria Google.[^1_2][^1_3]
    - Facilita o acoplamento a componentes de BI (BigQuery, CSVs locais, dashboards) através de ferramentas como GAARF.[^1_3]

Em suma, **o que vale clonar/estudar profundamente** para o seu stack atual:

1. `googleads/google-ads-python` – núcleo da comunicação API.<br>
[^1_7][^1_8][^1_5][^1_1][^1_2]
2. `google/ads-api-report-fetcher` (GAARF) – orquestrador de GAQL + repositório de templates de relatórios.[^1_3]
3. `google/ads-account-structure-script` – modelo oficial de auditoria de estrutura de conta.[^1_11]
4. Coleções de Google Ads Scripts de alto nível (Brainlabs, Web Lifter, Saidtezel) – para extrair heurísticas de otimização para o BrainManager.[^1_12][^1_14][^1_13]

Todo o resto na org `googleads` (SDKs mobile, plugins Unity/Flutter, libs de outras linguagens) pode ser, em geral, **descartado do core** do Navegador HipnoLawrence, usando apenas pontualmente como inspiração arquitetural quando fizer sentido.[^1_6][^1_5][^1_2]

<div align="center">⁂</div>

[^1_1]: https://github.com/googleads/google-ads-python

[^1_2]: https://developers.google.com/google-ads/api/docs/client-libs

[^1_3]: https://github.com/google/ads-api-report-fetcher

[^1_4]: https://developers.google.com/google-ads/api/rest/examples

[^1_5]: https://github.com/googleapis/google-api-python-client

[^1_6]: https://github.com/googleads

[^1_7]: https://github.com/googleads/google-ads-python/releases

[^1_8]: https://github.com/googleads/google-ads-python/blob/main/google-ads.yaml

[^1_9]: https://github.com/googleads/googleads-python-lib

[^1_10]: https://github.com/googleads/googleads-python-lib/releases

[^1_11]: https://github.com/google/ads-account-structure-script

[^1_12]: https://github.com/Brainlabs-Digital/Google-Ads-Scripts

[^1_13]: https://github.com/web-lifter/google-ads-scripts

[^1_14]: https://github.com/saidtezel/google-ads-scripts

[^1_15]: https://github.com/getyourguide/gaql-cli


---

# Faça um busca profunda na Web e procure qualquer tipo de repositórios, códigos, apis, ou algo nesse sentido sobre a Doctoralia. Faça uma varredura completa sobre qualquer forma de integração de dados públicos. Veja se alguem na internet já desenvolveu algum tipo de projeto capaz de coletar alguma informação. No intuito de sermos capazes de avaliar meu posicionamento dentro da plataforma e também estudar a concorrencia.

Existe hoje um ecossistema razoavelmente rico em volta da Doctoralia/Docplanner, mas dividido em dois mundos:

1) **APIs oficiais muito restritas (focadas em agenda/integrações clínicas)** e 2) **scrapers open‑source / APIs de scraping comerciais** para coletar dados públicos de perfis e buscas.[^2_1][^2_2][^2_3][^2_4][^2_5][^2_6][^2_7][^2_8]

Para o seu objetivo de **avaliar posicionamento e concorrência**, o caminho mais viável e controlável é montar um pipeline próprio de scraping baseado em projetos Python já existentes (Scrapy/Selenium), eventualmente combinado com serviços de scraping se quiser escala internacional.[^2_3][^2_5][^2_6][^2_7][^2_8]

***

## 1. API oficial Docplanner / Doctoralia

A Docplanner mantém uma **“Docplanner Integrations API”** documentada em `integrations.docplanner.com`, com endpoints REST sob o padrão `https://www.{domain}/api/v3/integration/{resource}`.[^2_1]
Essa API trabalha com recursos como `facility`, `doctor`, `addresses`, `services`, `bookings` e aceita parâmetros como `facility_id`, `doctor_id` e arrays `with` para escolher escopos de dados (por exemplo: `doctor.profile_url`, `doctor.specializations`, `doctor.license_numbers`, `doctor.addresses`, `address.visit_payment`, `address.commercial_type`, etc.).[^2_1]

A documentação mostra capacidades como:

- Listar médicos de uma clínica (facility) com dados de perfil, especializações, licenças, endereços, serviços, preços, formas de pagamento, tipos de consulta, etc.[^2_1]
- Consultar e manipular slots de agenda e bookings, com filtros de datas (`since`, `start`), obrigatórios para marcações, além de extensões como `booking.patient`, `booking.address_service` e `booking.presence` para anexar dados de paciente e presença.[^2_1]

Há também um **portal de plugins** (`plugins-manager.doctoralia.com.br`) que fala em “extender e customizar a funcionalidade do Docplanner de forma simples usando nossa API e integrar o seu produto”.[^2_9]
Materiais de marketing e wrappers antigos descrevem a “Doctoralia API” como uma REST API JSON que exige registro em um portal de desenvolvedores para obter API key, com endpoints para listar países, especialidades e profissionais, por exemplo via wrapper Node `node-doctoralia`.[^2_10][^2_11]

Contudo, um vídeo recente (2025) direcionado ao público brasileiro afirma que a **sede global suspendeu a emissão de novas credenciais da API**, deixando de fornecer novos tokens para quem quer automatizar agendamentos via Doctoralia.[^2_2]
Isso sugere que hoje a API oficial está **restrita a parceiros/integrações homologadas**, útil para integrar agenda/EMR, mas **pouco viável** como fonte aberta para mapeamento amplo de concorrência.

**Implicação para seu projeto:**

- Se você já tiver (ou vier a ter) um acordo formal de integração, a Integrations API é excelente para **sincronizar agenda, dados próprios de clínica/médico e bookings**, mas continua limitada a dados sob sua responsabilidade, não a todo o marketplace.[^2_2][^2_9][^2_1]
- Para **estudo de concorrência e ranking público**, o caminho será scraping (open‑source ou serviços comerciais), não a API oficial.

***

## 2. Wrappers e exemplos de código sobre a API

O principal wrapper encontrado é o **`picsoung/node-doctoralia`**, um cliente Node.js que encapsula a API pública antiga.[^2_10]
Ele mostra chamadas como:

- `doc.getCountries()` para listar países disponíveis.
- `doc.getSpecialitiesByCountryId('fr')` para listar especialidades num país.
- `doc.getProfessionals('fr', { specialityId, provinceId })` para obter lista de profissionais num país/região.[^2_10]

Além disso, há tutoriais mostrando **integração via API com Make (antigo Integromat)**, por exemplo para permitir que pacientes agendem consultas no Doctoralia a partir do WhatsApp, usando cenários Make que chamam a API do Doctoralia para buscar datas/horários e confirmar bookings.[^2_12]
Esses materiais são valiosos para **inferir a semântica dos endpoints** (como se estrutura uma chamada de agendamento, quais campos são exigidos), mesmo sem acesso direto à API.

Para o seu stack (Python/Agents), o wrapper Node é mais uma **fonte de documentação “viva”** do que algo a ser usado em produção; a lógica de chamadas pode ser reimplementada em Python se você vier a obter credenciais de integração.[^2_12][^2_10][^2_1]

***

## 3. Scrapers open‑source em Python (altamente relevantes)

Aqui está o “ouro” para **dados públicos de posicionamento e concorrência** na Doctoralia Brasil.

### 3.1 `corralm/doctoralia-scraper`

- Repositório: `corralm/doctoralia-scraper`.[^2_6]
- Projeto em Python usando **Scrapy** para percorrer recursivamente o domínio `doctoralia.com.br` e extrair dados de profissionais de saúde no Brasil, com o objetivo explícito de gerar um dataset nacional com preço, localização, especialização e número de reviews.[^2_6]

Ele gera um arquivo `output.jl` (JSON Lines) com atributos como:[^2_6]

- `doctor_id` – ID do profissional na Doctoralia (inteiro).
- `title` – título (Dr, Dra, Prof.).
- `name` – nome completo.
- `city1`, `city2`, `region` – cidade com acento, versão slug, região com UF (ex.: “sao-paulo-sp”).
- `specialization` – especialidade principal (cardiologista, etc.).
- `reviews` – contagem de opiniões.
- `newest_review_date` – data da review mais recente.
- `telemedicine` – flag se oferece atendimento remoto.
- `price` – preço mais comum dos serviços.
- `url` – URL do perfil.
- `fetch_time` – timestamp da coleta.[^2_6]

O autor explicita que construiu o scraper “para criar um dataset de todos os profissionais de saúde no Brasil” e disponibiliza sob licença MIT, com uso de Scrapy, tqdm e Pandas.[^2_6]

**Por que isso é perfeito para o seu caso:**

- Já resolve **80% do trabalho de crawling**: estrutura do spider, links, paginação, campos principais.[^2_6]
- A saída em JSON lines é trivial de integrar ao seu ecossistema (Python + Pandas + LLMs), permitindo:
    - Calcular **distribuição de reviews e preços** por cidade/especialidade.
    - Avaliar **telemedicina vs presencial** na sua área de atuação.
    - Construir um **ranking empírico** de visibilidade e atratividade de perfis (reviews, preço, telemedicina, etc.).


### 3.2 `drlima/doctoralia.com`

- Repositório: `drlima/doctoralia.com`.[^2_4]
- Spider Scrapy em Python 3.6 que parte de `http://www.doctoralia.com.br/medicos` e navega pelas páginas até atingir **500 ocorrências**, salvando os dados em `doctoralia_data.csv`.[^2_4]
- O autor observa explicitamente que o spider foi desenhado para pegar apenas as **500 primeiras ocorrências** e não o site inteiro.[^2_4]

Esse projeto é útil como **exemplo minimalista**, ideal para:

- Entender rapidamente o fluxo de paginação do `/medicos` (parâmetros de query, limites, etc.).[^2_4]
- Criar uma variação focada em um specialty/cidade específicos (por exemplo, “psicólogo Goiânia”) apenas para monitoramento de primeiras páginas.


### 3.3 `fabinhojorge/doctoralia`

- Repositório: `fabinhojorge/doctoralia`.[^2_7]
- Web crawler/Scraper usando **Selenium + ChromeDriver** para extrair de cada profissional: Name, Image_link, Specializations, Experiences, City, State, Address, Address_telephone.[^2_7]
- A documentação anota que:
    - A paginação é limitada a **100 páginas com 20 médicos por página** (≃ 2000 médicos por busca).
    - Cada médico pode ter múltiplos endereços, mas o projeto pega apenas o **primeiro endereço e seus telefones**.[^2_7]

Esse crawler é um bom exemplo quando você quiser **simular exatamente o front‑end web**, respeitando paginação real e campos exibidos para o usuário (foto, experiência textual, telefone de consultório).[^2_7]
O uso de Selenium facilita migrar posteriormente para **Playwright**, alinhando com o stack do Navegador HipnoLawrence.

### 3.4 `moreira-matheus/doctoralia-crawler`

- Repositório: `moreira-matheus/doctoralia-crawler`.[^2_8]
- Projeto para “scrape contact data of health professionals working in Bahia”, com estrutura contendo diretório `data` (arquivos `doctoralia_raw.csv`, `doctoralia_tidy.csv`, `20200325_Dados_Doctoralia.xls`) e notebooks `00-crawler.ipynb`, `01-cleaner.ipynb`.[^2_8]
- Usa bibliotecas como `bs4`, `scrapy`, `selenium`, `pandas`, `xlwt` e inclui sugestões de melhorias como usar pipelines, exporters e recuperar link do Google Maps por endereço.[^2_8]

Esse repo é valioso como **exemplo completo de pipeline ETL**:

- Spider → CSV bruto → limpeza e normalização em notebook → saída pronta para análise geográfica e estatística.[^2_8]
- Você pode replicar o pipeline mudando os filtros para **Goiás / seu nicho (psicologia/TEA)**, produzindo um dataset de concorrência altamente estruturado.

***

## 4. APIs de scraping comerciais específicas para Doctoralia

Há vários serviços que oferecem “Doctoralia API” como **camada de scraping gerenciada** (não é API oficial da Doctoralia, mas um wrapper sobre scraping).

### 4.1 ScrapingBee – Doctoralia Scraper API

- ScrapingBee oferece uma **“Doctoralia Scraper API”** que retorna HTML renderizado ou dados estruturados de páginas da Doctoralia, tratando proxies, CAPTCHAs e JavaScript.[^2_3]
- Eles destacam:
    - Biblioteca oficial em Python para enviar requisições de scraping sem se preocupar com infraestrutura.
    - Opções para extrair páginas completas, interagir com a página (clicar, rolar, rodar JS) e até gerar Markdown/plain text estruturado.[^2_3]

Isso encaixa bem com um cenário de **agente local que terceiriza apenas a camada de HTTP + anti‑bot**, mantendo a lógica de parsing/análise do seu lado.

### 4.2 Apify – Doctoralia Brazil Scraper

- Apify possui um ator pronto “Doctoralia Brazil Scraper”, focado especificamente no domínio `doctoralia.com.br`.[^2_5]
- Funcionalidades principais:[^2_5]
    - Buscar médicos por especialidade e filtrar por cidade.
    - Aceitar URLs de busca direta (como a página de resultados específica da Doctoralia).
    - Coletar:
        - `doctor_id`, `doctor_name`, `specialty`, `city`, `region`.
        - `review_count`, `latest_review_date`, `overall_rating`.
        - `telemedicine availability`, `access_time`.
    - Opcionalmente, coletar detalhes de endereço (clínica, rua, CEP, estado), telefones, latitude/longitude e instruções de acesso.

Para o seu objetivo de **mapear posicionamento e concorrência no Brasil**, esse ator é praticamente um **serviço “pronto para uso”** para montar um data mart de Doctoralia, se você aceitar depender de um SaaS externo.[^2_5]

### 4.3 Outros

- **Bytewells** oferece um scraper para `doctoralia.es` (Espanha), semelhante em proposta: extrair dados de profissionais de saúde da versão espanhola da plataforma.[^2_13]
- Serviços genéricos como **Firecrawl** se apresentam como APIs de crawling/scraping para IA, podendo ser dirigidos a URLs da Doctoralia, embora sem especialização no domínio.[^2_14]

***

## 5. Estado atual da API vs scraping (realismo operacional)

O cenário atual parece ser:

- A Docplanner/Doctoralia **mantém documentação de integrações** para facilities/doctors (agenda, bookings, serviços, pagamentos), mas **o onboarding de novos integradores está bastante restrito**, com relatos de suspensão na emissão de novas credenciais de API.[^2_9][^2_2][^2_1]
- Materiais mais antigos (Node wrapper, blogs) ainda descrevem a “Doctoralia API” como REST JSON com cadastro via portal de desenvolvedores, mas na prática, para novos players independentes, isso hoje não é garantido.[^2_11][^2_10]

Para o seu caso de uso específico — **analisar posicionamento em ranking e concorrência na Doctoralia Brasil** —, mesmo uma API oficial **não resolveria** totalmente porque:

- Ela é orientada a **dados de agenda e clínica própria**, não a scraping livre da base inteira de profissionais.[^2_1]
- As informações mais relevantes de ranking (posição na busca, destaque, badges, blocos de anúncio, etc.) são propriedades da interface pública, não de um endpoint de API exposto ao integrador.

Daí a importância de:

- Usar **scrapers open‑source** para coletar dados públicos de perfis e resultados de busca.[^2_4][^2_7][^2_8][^2_6]
- Ou usar **APIs de scraping comerciais** (Apify, ScrapingBee) para reduzir o atrito com bloqueios e manutenção.[^2_13][^2_3][^2_5]

***

## 6. Como transformar isso em análise de posicionamento e concorrência

### 6.1 Pipeline recomendado (100% Python + agentes)

1. **Crawler base**
    - Use `corralm/doctoralia-scraper` como base para uma “DoctoraliaDataTool” no seu agente, adaptando filtros para: país = BR, especialidade(s) de interesse, cidades/regiões estratégicas.[^2_6]
    - Incorpore ideias de `fabinhojorge/doctoralia` e `moreira-matheus/doctoralia-crawler` para capturar endereço, telefones, geolocalização e notas sobre paginação/limites, além de notebooks de limpeza e cruzamento com Google Maps.[^2_7][^2_8]
2. **Camada de normalização/feature engineering**
    - Normalize atributos como `reviews`, `newest_review_date`, `telemedicine`, `price`, `specialization`, `city`, `region` em um banco local (SQLite/Postgres) ou data lake de arquivos Parquet/CSV.[^2_8][^2_6]
    - Crie features derivadas relevantes para ranking/posicionamento:
        - Densidade de reviews e “recency” (tempo desde a última review).
        - Sinal de preço (baixo/médio/alto) por especialidade/região.
        - Presença de telemedicina como vantagem competitiva vs concorrentes na mesma cidade.[^2_5][^2_6]
3. **Camada “NeuroEngine Doctoralia Intelligence”**
    - Use seu BrainManager/LLM para:
        - Gerar relatórios comparando **seu perfil** com a distribuição da região (comparar reviews, preço, telemedicina, quantidade de endereços, etc.).
        - Detectar **clusters de concorrentes** (alta review + preço alto, baixa review + preço baixo, etc.) e sugerir posicionamentos possíveis.
    - Alimentar o modelo com exemplos de dados da Apify e Scrapy (esquemas de campos bem definidos) para que ele aprenda a navegar nos datasets de forma semântica.[^2_5][^2_8][^2_6]
4. **Módulo de monitoramento contínuo**
    - Agendar crawls periódicos (ex.: semanal) para atualizar:
        - Sua posição em buscas específicas (pode usar spiders mais focados como `drlima/doctoralia.com` adaptado para medir apenas as N primeiras páginas de uma busca).[^2_4]
        - O volume e a recência de reviews de você e dos principais concorrentes (obtido via atributos `reviews` e `newest_review_date`).[^2_5][^2_6]

### 6.2 Cuidados legais e éticos

- Todos os exemplos acima operam sobre **dados públicos de perfis/profissionais**, mas ainda assim é crucial:
    - Revisar os **Termos de Uso** da Doctoralia e respeitar `robots.txt` e eventuais políticas de scraping.
    - Implementar **throttling e backoff** para não sobrecarregar os servidores.
    - Tratar dados pessoais com base na **LGPD**, limitando o uso a fins legítimos (research, marketing próprio, benchmarking) e evitando reidentificações sensíveis fora do contexto profissional público.

***

## 7. Resumo prático do que vale estudar/clonar

Para o objetivo “avaliar meu posicionamento na Doctoralia e estudar a concorrência”, os projetos mais úteis são:

- **Docplanner Integrations API** – apenas se você conseguir credenciais; serve para agenda e dados da própria clínica, não para concorrência em massa.[^2_2][^2_9][^2_1]
- **`corralm/doctoralia-scraper`** – base principal para montar um data lake de profissionais no Brasil (ID, reviews, preço, telemedicina, localização).[^2_6]
- **`drlima/doctoralia.com`** – exemplo simples de spider focado em página de busca `/medicos` para capturar top N resultados, ideal para tracking de ranking.[^2_4]
- **`fabinhojorge/doctoralia`** – crawler Selenium com campos de experiência, endereço e telefone, bom para replicar o que o usuário vê na UI.[^2_7]
- **`moreira-matheus/doctoralia-crawler`** – pipeline doc completo (crawling + limpeza + exportação), ótimo modelo para seu ETL próprio.[^2_8]
- **Apify Doctoralia Brazil Scraper** – alternativa SaaS pronta para escalar coleta nacional se você quiser terceirizar infra de scraping.[^2_5]
- **ScrapingBee Doctoralia Scraper API** – opção de “infra estruturada de scraping” plugável ao seu agente Python via client oficial.[^2_3]

Com esse conjunto, o Navegador HipnoLawrence consegue montar um **módulo Doctoralia Intelligence** robusto, totalmente orientado a dados públicos, capaz de alimentar seu algoritmo de ranqueamento e dashboards de BI/concorrência.
<span style="display:none">[^2_15][^2_16][^2_17]</span>

<div align="center">⁂</div>

[^2_1]: https://integrations.docplanner.com/docs/

[^2_2]: https://www.youtube.com/watch?v=KfqJqqgfyu0

[^2_3]: https://www.scrapingbee.com/scrapers/doctoralia-api/

[^2_4]: https://github.com/drlima/doctoralia.com

[^2_5]: https://apify.com/muhammetakkurtt/doctoralia-brazil-scraper

[^2_6]: https://github.com/corralm/doctoralia-scraper

[^2_7]: https://github.com/fabinhojorge/doctoralia

[^2_8]: https://github.com/moreira-matheus/doctoralia-crawler

[^2_9]: https://plugins-manager.doctoralia.com.br

[^2_10]: https://github.com/picsoung/node-doctoralia

[^2_11]: https://blog.inlinedigital.com.br/glossario/doctoralia-api/

[^2_12]: https://www.youtube.com/watch?v=P9C4k-DWFcA

[^2_13]: https://bytewells.com/solutions/doctoralia.es-scraper

[^2_14]: https://www.firecrawl.dev

[^2_15]: neuroengine_doctoralia_strategic_base.md

[^2_16]: ALGORITMO-DE-RANQUEAMENTO-DOCTORALIA.md

[^2_17]: https://pro.doctoralia.com.br/blog/clinicas/tag/integração-de-sistemas


---

## Navegador HipnoLawrence: APIs Google Ads e Doctoralia Scraping para Automação e Concorrência

