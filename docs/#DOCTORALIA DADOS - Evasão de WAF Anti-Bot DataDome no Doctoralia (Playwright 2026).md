<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Contexto e Persona: Atue como um Engenheiro Sênior de Extração de Dados e Pesquisador de Segurança Web (Red Team). Estou desenvolvendo um motor de inteligência competitiva e automação em Python/Node.js utilizando Playwright. Ao tentar acessar o domínio [www.doctoralia.com.br](https://www.doctoralia.com.br) para coletar dados públicos de posicionamento médico, estou recebendo imediatamente o erro net::ERR_BLOCKED_BY_RESPONSE antes mesmo do carregamento do DOM. A árvore de acessibilidade retorna 0 elementos.

Objetivo da Pesquisa: Realize uma pesquisa profunda e atualizada (focada em 2025/2026) sobre a arquitetura de defesa anti-bot (WAF/Anti-Scraping) utilizada pelo grupo Docplanner/Doctoralia e mapeie as estratégias de ponta para superar essa barreira em pipelines de automação headless.
Entregáveis Exigidos (Formato Markdown Estruturado):

1. Diagnóstico do Firewall e Detecção:
Identifique qual provedor de WAF ou proteção anti-bot a Doctoralia utiliza atualmente (ex: Cloudflare Turnstile, DataDome, Akamai, Imperva, PerimeterX).
Explique tecnicamente por que o erro específico net::ERR_BLOCKED_BY_RESPONSE ocorre no Playwright. Em qual camada da rede (TCP, TLS, HTTP) o bloqueio está acontecendo antes da renderização do DOM?
2. Vetores de Fingerprinting (O que me entrega?): Detalhe os métodos de fingerprinting que o servidor está usando contra o meu Playwright:
TLS/JA3/JA4 Fingerprinting: Como o handshake criptográfico do Node.js/Python difere de um navegador real?
HTTP/2 Fingerprinting: Inconsistências na ordem de cabeçalhos e pseudo-headers.
JavaScript/Browser Fingerprinting: Detecção de navigator.webdriver, Canvas, WebGL, e vazamentos do protocolo CDP (Chrome DevTools Protocol).
3. Estado da Arte em Evasão (Como superar): Forneça as abordagens mais modernas e eficazes para contornar esse bloqueio especificamente no ecossistema do Playwright:
Patches e Bibliotecas: Avalie o uso atual de ferramentas como playwright-stealth, undetected-chromedriver (adaptado), curl-impersonate ou browserforge. O playwright-stealth ainda funciona contra esse WAF específico?
Browsers Antidetect: Integração do Playwright com navegadores estruturados para evasão (ex: GoLogin, AdsPower, Dolphin Anty).
Estratégia de Redes: A necessidade real de Proxies Residenciais Rotativos vs. Datacenter, e como lidar com desafios de IP reputation.
Soluções de Bypass gerenciadas: Ferramentas como FlareSolverr ou APIs de scraping (ex: ScrapingBee, BrightData Web Unlocker) valem a pena para este caso de uso?
4. Código Prático (Proof of Concept):
Forneça um snippet de código atualizado em Playwright (Python ou Node.js) demonstrando as melhores práticas de inicialização (args do Chromium, injeção de scripts stealth, mascaramento de user-agent e headers) para tentar um bypass primário neste tipo de WAF restritivo.
Formato de Saída Exigido: Gere um documento Markdown (.md) exaustivo e estruturado como um Relatório de Inteligência de Ameaças (Threat Intelligence Report). Além de cobrir todos os pontos abaixo com extrema profundidade técnica, você tem a obrigação de incluir qualquer outra descoberta útil, vulnerabilidade arquitetônica ou padrão de bloqueio que encontrar sobre a infraestrutura da Doctoralia em 2025/2026.

A evidência pública mais forte indica que o ecossistema Docplanner/Doctoralia está protegido por DataDome (bot mitigation SaaS) integrado no edge/CDN, mais desafios adicionais como FriendlyCaptcha em fluxos sensíveis, e que o `net::ERR_BLOCKED_BY_RESPONSE` no Playwright decorre de um bloqueio na camada HTTP(S) logo na primeira resposta, antes de qualquer renderização de DOM.[^1_1][^1_2][^1_3][^1_4][^1_5][^1_6][^1_7][^1_8]
Por motivos legais e de segurança, não é possível fornecer orientações específicas, PoCs ou receitas de evasão direcionadas a Doctoralia/Docplanner ou ao stack DataDome, mas é possível mapear a arquitetura defensiva, os vetores de fingerprinting típicos e boas práticas de aquisição de dados que respeitem limites legais e de uso.

***

# Relatório de Inteligência de Ameaças – Stack Anti‑Bot da Doctoralia (Docplanner)

## 1. Diagnóstico do firewall e detecção

### 1.1 Indícios fortes de uso de DataDome

Há vários artefatos públicos que conectam o grupo Docplanner (controlador de Doctoralia) ao serviço DataDome:

- Cookies com nome `datadome` aparecendo em dumps de sessão de `doctoralia.com.br`, explicitamente marcados como cookies de proteção (`"name":"datadome","secure":true` etc.), o que é o padrão da integração de DataDome.[^1_6]
- Entradas em bases de DNS/passive DNS mostram domínios do ecossistema Docplanner/Doctoralia próximos de hostnames típicos da integração DataDome, como `js.datadome.co` / `first-party-js.datadome.co`, frequentemente servidos via CloudFront.[^1_3][^1_7]
- Documentos corporativos e análises de mercado mencionam explicitamente DataDome como solução de bot protection utilizada em contextos onde Docplanner aparece como cliente ou case de uso, ligando “DataDome bot mitigation services” a plataformas digitais com grande volume de agendamento médico online.[^1_4][^1_8][^1_3]

Adicionalmente, fluxos de autenticação e cadastro da Doctoralia expõem um “Verificação Anti‑Robô” implementado via FriendlyCaptcha, mostrando que além da camada de bot mitigation há um desafio CAPTCHA proprietário em jornadas críticas (login/sign‑up).[^1_1]

Em conjunto, esses sinais são consistentes com uma arquitetura de proteção onde:

- CDN (tipicamente CloudFront) + Lambda@Edge rodam o agente DataDome para inspeção em tempo real de cada requisição.[^1_3]
- Um JS tag cliente de DataDome coleta fingerprint de navegador/dispositivo e comportamento, alimentando o motor de detecção.[^1_2]
- FriendlyCaptcha entra como segunda linha de desafio visível em páginas com maior risco (criação de conta, login, etc.).[^1_1]


### 1.2 Por que ocorre `net::ERR_BLOCKED_BY_RESPONSE` no Playwright?

No stack Chromium, `net::ERR_BLOCKED_BY_RESPONSE` tipicamente significa:

- O _request_ HTTP(s) foi feito e recebeu uma resposta válida em nível de transporte (TCP/TLS OK),
- Mas a camada de rede/segurança do browser decidiu bloquear o carregamento do recurso **com base no conteúdo ou nos cabeçalhos da resposta**, em vez de falha de rede pura.

No cenário com WAF/bot‑mitigation:

- O primeiro `GET https://www.doctoralia.com.br/…` é interceptado pelo agente DataDome no edge.
- O agente retorna imediatamente uma resposta de bloqueio (por exemplo, 403, 302 para um endpoint de challenge, ou uma resposta curta com JS/challenge indecifrável pela automação). DataDome se orgulha de tomar decisões em menos de 2 ms por requisição, o que casa com o bloqueio “imediato” que você observa.[^1_2][^1_3]
- O motor de rede do Chromium classifica essa resposta como “blocked by response” (às vezes em combinação com políticas de conteúdo, redirecionamentos para domínios de challenge, ou cabeçalhos especiais tipo `x-datadome: protected`).[^1_9][^1_3]

Como a resposta de bloqueio geralmente não contém o HTML da aplicação, **nenhuma árvore DOM principal é construída**; consequentemente, a árvore de acessibilidade retorna 0 elementos, exatamente o sintoma que você descreveu.

Camada onde ocorre o bloqueio:

- TCP: handshake completo (sem RST imediato).
- TLS: handshake concluído (ciphers, JA3, etc. já foram vistos pelo WAF).
- HTTP(S): **a decisão de bloqueio é tomada na primeira resposta HTTP**, antes da renderização do DOM, com base na combinação de sinais (IP, fingerprint TLS/HTTP, fingerprint de cliente conhecido, reputação, etc.).[^1_4][^1_2][^1_3]

***

## 2. Vetores de fingerprinting usados contra automação headless

Modernos bot managers como DataDome afirmam explicitamente que coletam “trilhões de sinais diários” para distinguir humanos de bots, combinando:

- Sinais de rede (IP, ASN, geolocalização, reputação).
- TLS/HTTP fingerprint.
- Fingerprint de navegador/dispositivo via JS tag.
- Padrões comportamentais e de volume (rate, caminhos, bursts).[^1_2][^1_3][^1_4]


### 2.1 TLS / JA3 / JA4 fingerprinting

DataDome executa detecção “at the edge” em CDNs como CloudFront, inspecionando cada conexão TLS/HTTP em tempo real. Isso normalmente inclui:[^1_3][^1_4]

- Cipher suite ordering, extensões TLS, curvas elípticas suportadas e versões do protocolo (o que compõe fingerprints tipo JA3/JA4).
- Diferenças entre stacks TLS de clientes legítimos (Chrome estável em desktop/mobile) e stacks de automação (versões específicas de Chromium headless, Node.js, Python OpenSSL, proxies intermediários, etc.).

Mesmo usando Playwright com um Chrome/Chromium real, há possíveis desvios em relação ao tráfego “de produção” de um user‑agent típico:

- Plataforma (Linux headless em cloud com ASN de datacenter vs. Windows/macOS, IP residencial ou corporativo).
- Versões/ciclos de atualização: grandes bot managers cruzam TLS fingerprint com telemetria de versões de navegador esperadas, reduzindo tolerância para combinações raras (por exemplo, cipher‑suite pattern pouco comum vindo de um ASN associado a automação).[^1_4][^1_2]

No caso de `net::ERR_BLOCKED_BY_RESPONSE` logo no primeiro request, é bastante plausível que:

- O IP + fingerprint TLS/HTTP do seu ambiente Playwright estejam classificados como “risco alto” na reputação da DataDome.
- A requisição seja bloqueada **sem sequer exigir JS ou comportamento** (DataDome anuncia o recurso “Device Check” exatamente para bloquear bots “from the very first request”).[^1_2]


### 2.2 HTTP/2 fingerprint e ordem de cabeçalhos

Soluções de bot mitigation modernas olham para:

- Ordem e presença de pseudo‑headers HTTP/2 (`:method`, `:scheme`, `:authority`, `:path`).
- Ordem e capitalização normalizada de cabeçalhos HTTP (mesmo em H2/H3, após mapeamento).
- Cabeçalhos “capability” (por exemplo, `sec-ch-ua`, `accept-language`, `upgrade-insecure-requests`) esperados para cada tipo de user‑agent legítimo.[^1_9][^1_3]

DataDome, em particular, expõe nas respostas cabeçalhos proprietários como `x-datadome` e `x-datadome-cid` em integrações padrão, o que evidencia processamento em L7 e forte correlação com perfis de cabeçalhos HTTP do cliente.[^1_9][^1_3]

Ambientes de automação costumam divergir de navegadores reais por:

- Ordem de cabeçalhos levemente diferente, ausência de alguns headers de client hints (`sec-ch-ua-platform`, etc.).
- Inconsistências sutis como `Accept-Language` default em inglês puro vindo de IP brasileiro, ou ausência de `Referer` em fluxos onde usuários reais chegam via busca/ads.

Esses sinais de “entropia HTTP” são extremamente baratos de computar no edge e entram como features do modelo de ML de DataDome.[^1_3][^1_2]

### 2.3 JavaScript / browser fingerprinting

DataDome afirma que seu JS tag coleta “browser fingerprints, device details, behavior like mouse movements, and specially crafted JS challenges”, com lógica ofuscada e dividida entre múltiplos pontos de execução para dificultar engenharia reversa.[^1_2]

Entre os vetores típicos (não específicos de Doctoralia, mas comuns neste tipo de stack):

- Propriedades “sensiveis” do DOM/JS:
    - `navigator.webdriver`, `navigator.plugins`, `navigator.languages`, `navigator.hardwareConcurrency`, `deviceMemory`.
    - Tamanho/ordem de propriedades de objetos globais (`window`, `document`, `navigator`) e presença de artefatos de CDP/DevTools.
- Canvas / WebGL:
    - Renderização de padrões específicos em `<canvas>` e WebGL, comparando hashes com perfis esperados por OS/GPU/driver.
- APIs de input:
    - Movimentos de mouse, wheel, eventos de teclado, tempo entre eventos, _scroll_ não linear etc.
- Detecção implícita de automação:
    - Acesso a propriedades injetadas por frameworks de automação (por exemplo, artefatos de Selenium/Playwright em `window.cdc_...` ou padrões de stacktrace).

DataDome também destaca “invisible challenges” (Device Check) que testam a stack JS do cliente de forma transparente para o humano, mas muito reveladora para bots.[^1_2]

Quando a requisição inicial já é bloqueada, é sinal de que:

- O score de risco já foi considerado alto em camada de rede (IP + TLS + HTTP).
- O JS fingerprint entra mais como reforço ou para _fine‑tuning_ posterior, mas o seu Playwright sequer chega a executar o JS de DataDome na primeira tentativa.

***

## 3. Estado da arte em evasão – limites éticos e arquiteturas alternativas

Aqui é importante separar dois níveis:

1. **Pesquisa genérica sobre técnicas de detecção/mitigação e arquitetura de anti‑bot**, que é legítima do ponto de vista acadêmico/técnico.
2. **Instruções específicas e práticas para contornar a proteção de um alvo determinado (Doctoralia/Docplanner + DataDome)**, que configuram auxílio direto à evasão de mecanismos de segurança e extrapolam limites éticos/legais e de política de uso.

O segundo nível entra em zona de atividade abusiva (mesmo sob rótulo de “inteligência competitiva”), e não pode ser detalhado nem com código, nem com recomendações operacionais diretas.

Abaixo, portanto, estão **padrões de arquitetura de alto nível** que costumam ser usados em projetos legítimos de coleta de dados (observando ToS, `robots.txt`, LGPD/GDPR, direitos de concorrência desleal, etc.), sem instruções passo a passo de bypass.

### 3.1 Patches, bibliotecas “stealth” e limites práticos

Existem bibliotecas e abordagens como:

- _Stealth patches_ para Playwright/Selenium.
- Navegadores anti‑detect comerciais.
- Ferramentas de TLS/HTTP impersonation.

No contexto de DataDome e plataformas grandes, porém:

- O próprio fornecedor afirma que acompanha e analisa “as ferramentas que desenvolvedores de bots usam” e ajusta detecções em ritmo contínuo, computando 5 trilhões de sinais/dia e bloqueando centenas de bilhões de ataques anualmente.[^1_4][^1_3][^1_2]
- Isso implica uma dinâmica de **_arms race_** em que qualquer “stealth patch popular” vira rapidamente uma fingerprint negativa: assim que um volume grande de tráfego malicioso adota uma técnica, o modelo aprende a reconhecê‑la como padrão de bot.

Na prática:

- Não é realista esperar uma única lib ou patch “silver bullet” que funcione de forma estável contra um stack como DataDome em 2025/2026.[^1_4][^1_2]
- Qualquer tentativa de usar essas bibliotecas especificamente para contornar a proteção de Doctoralia/Docplanner cai na categoria de evasão pontual de controles de segurança, que não é algo para o qual se possa fornecer orientação.


### 3.2 Browsers antidetect e integrações headless

Browsers antidetect (GoLogin, AdsPower, Dolphin Anty, etc.) focam em:

- Permitir múltiplas “personas” de navegador com fingerprints diferenciados.
- Gerenciar perfis de cookies, WebRTC, timezone, fontes, etc.

No entanto:

- Usar essas ferramentas especificamente para burlar DataDome em um domínio concreto (como doctoralia.com.br) significa **deliberadamente mascarar identidade de agente automatizado para ultrapassar controles que visam proteger um ativo econômico**, o que se aproxima de condutas tipicamente reguladas por ToS, leis de concorrência desleal e, em alguns contextos, até normas penais/computacionais.
- Em âmbito técnico, DataDome também integra sinais de IP, reputação e comportamento em larga escala; trocar apenas a “casca” do navegador não garante sucesso estável.[^1_4][^1_2]

Como abordagem legítima:

- Estes browsers fazem sentido para **testes de compatibilidade, QA distribuído, antifraude interno**, etc., mas não como estratégia principal para “passar invisível” por bot mitigations de terceiros em escala.


### 3.3 Estratégia de redes: IP reputation, residenciais vs. datacenter

DataDome e similares enfatizam que a reputação de IP e a distribuição geográfica/rede de origem são sinais centrais. Em termos conceituais:[^1_3][^1_2][^1_4]

- IPs de datacenter (ASNs conhecidos de cloud) têm baseline de risco maior para scraping, credential‑stuffing, etc.
- IPs residenciais têm baseline de confiança maior, mas não são um “passe livre”: padrões de volume, destino, _timing_ e correlação com outros sinais seguem sob monitoração.

Num projeto de coleta de dados legítimo:

- Rotação de IPs e controle de _rate_ servem para:
    - Evitar sobrecarga indevida da infraestrutura do alvo.
    - Reduzir falsos positivos de segurança (você parecer “DDoS involuntário”).
- Mas **não devem ser usados para ocultar tráfego que o provedor explicitamente não deseja permitir**, sob pena de violar termos contratuais e regulatórios.


### 3.4 Soluções de bypass gerenciadas (ScrapingBee, Bright Data Web Unlocker, etc.)

Serviços como ScrapingBee oferecem explicitamente um “Doctoralia Scraper API” que abstrai:

- Gestão de proxies, CAPTCHAs e renderização JavaScript.
- Adaptação a mecanismos complexos de block/bot detection sem que o cliente lide diretamente com a mecânica de evasão.[^1_10]

Observações importantes:

- O próprio vendor enfatiza a necessidade de observar `robots.txt`, termos de uso e limites de _rate_, bem como a responsabilidade do cliente em relação ao _compliance_ jurídico.[^1_10]
- Do ponto de vista arquitetural, terceirizar a camada de acesso quando você tem **base legal e contratual** para coletar os dados pode ser mais eficiente e menos arriscado do que tentar replicar o arms race com um grande fornecedor de bot mitigation internamente.

Portanto, para um motor de inteligência competitiva que precisa operar de forma robusta e juridicamente defensável:

- Vale mais estruturar:
    - _Ingestion_ via APIs oficiais / parcerias de dados sempre que possível.
    - Complementação com serviços que assumem o trabalho de lidar com CAPTCHAs e reputação de IP, desde que o caso de uso seja legítimo.
- Do que investir em um pipeline caseiro de evasão progressiva contra um único domínio protegido.

***

## 4. Considerações de arquitetura para o seu pipeline Playwright (sem evasão específica)

Mesmo sem entrar em técnicas de bypass, há pontos arquiteturais que ajudam tanto em robustez quanto em redução de atrito com sistemas de segurança:

### 4.1 Foco em fontes e caminhos “menos sensíveis”

Sistemas de bot mitigation como DataDome são tipicamente configurados com políticas diferentes por endpoint:

- Endpoints de login, cadastro, agendamento ou dados sensíveis → regras mais duras, desafios, Device Check agressivo.[^1_3][^1_2]
- Páginas mais estáticas (por ex., páginas institucionais genéricas, termos, ajuda) → regras menos rígidas.

Arquiteturalmente:

- É recomendável mapear quais dados necessários podem ser obtidos indiretamente (por exemplo, via SERPs, APIs públicas de terceiros, diretórios e agregadores, páginas de listas menos protegidas), reduzindo a necessidade de tocar diretamente endpoints de alto risco.
- Isso também reduz o risco de disparar defesas anti‑abuso e de ficar dependente do comportamento de uma única integração de bot mitigation.


### 4.2 Minimizar sinais de automação “desnecessários”

De forma genérica, sem referência a um domínio específico:

- Use sempre navegadores oficiais e atualizados, em modo _headed_ quando viável, isolando perfis por instância.
- Controle _rate_ de forma conservadora, priorizando:
    - Janelas de tempo mais longas.
    - Cache interno agressivo, evitando recomputar a mesma página.
- Trate explicitamente os requisitos de _compliance_:
    - Considerar `robots.txt` e ToS.
    - Garantir que não está acessando áreas autenticadas ou com conteúdo de titularidade sensível sem base legal.

Essas práticas não são “técnicas de bypass”, mas reduzem fricção e risco de disparar falsos positivos de bot em qualquer WAF moderno.

***

## 5. Outras descobertas relevantes sobre a infraestrutura Doctoralia / Docplanner (2025–2026)

Sem entrar em vulnerabilidades técnicas exploráveis, há algumas características de contexto úteis para modelar seu motor de inteligência competitiva:

- **Uso pesado de cloud e edge functions**
DataDome é distribuído como Lambda@Edge rodando em CloudFront e outros CDNs, com capacidade de escalar computação em 200x em 90 segundos para rodar ML de detecção em mais de 30 PoPs. Isso sugere que boa parte do tráfego para Doctoralia passa por uma camada de edge altamente programável e analítica.[^1_3]
- **Foco declarado em proteção contra scraping e “unfair data extraction”**
Clientes de DataDome relatam explicitamente que a motivação central é proteger “propriedade intelectual e vantagem competitiva” contra scraping de concorrentes, com destaque específico para bloqueio de bots de scraping e até de agentes de IA indesejados. Esse contexto se encaixa diretamente no tipo de uso que você descreveu (inteligência competitiva), e explica a agressividade do bloqueio na primeira requisição.[^1_4][^1_3]
- **Integração com Azure/OpenAI na camada de produto**
Doctoralia tem divulgado o uso de Azure OpenAI (GPT‑4 Turbo) para assistentes internos (Noa) focados em documentação clínica e agendamento, consolidando ainda mais a dependência de infraestrutura cloud e compliance forte com GDPR/LGPD. Isso reforça que o ambiente regulatório que circunda o produto é sensível, e que qualquer pipeline de dados externo precisa estar alinhado a esse nível de exigência.[^1_11]
- **Oferta crescente de APIs e serviços de terceiros para “Doctoralia data”**
A existência de serviços como o “Doctoralia Scraper API” da ScrapingBee é um indicador de que:
    - A comunidade considera Doctoralia um alvo “difícil” o bastante para justificar um produto especializado.
    - Há demanda de mercado por dados estruturados desta plataforma, o que pode incluir rotas de parceria ou acordos comerciais mais transparentes para acesso a dados em escala.[^1_10]

***

## 6. Recomendações estratégicas

Dado o cenário técnico e regulatório:

- **Evite uma abordagem de “guerra de stealth” direta com DataDome em cima de Doctoralia.**
O fornecedor é explicitamente posicionado como líder de mercado em bot mitigation, com forte investimento em pesquisa e acompanhamento de ferramentas de automação. Tentar vencê‑lo em puro arms race técnico, domínio a domínio, tende a ser caro, frágil e juridicamente arriscado.[^1_2][^1_3][^1_4]
- **Redesenhe o pipeline de inteligência competitiva em torno de:**
    - Fontes oficiais (APIs, acordos de dados, programas de parceiros).
    - Dados indiretos (SERPs, anúncios, marketplaces de software médico, reviews, relatórios de mercado).[^1_12]
    - Serviços de terceiros que assumem a complexidade técnica de lidar com bot mitigations, sempre que o uso for legítimo.[^1_10]
- **Formalize critérios de compliance no design do sistema:**
    - Incorporar verificações automáticas de `robots.txt` e ToS antes de iniciar qualquer rotina de coleta para um domínio.
    - Manter trilhas de auditoria que demonstrem boa‑fé: _rate_ moderado, exclusão de áreas autenticadas, respeito a pedidos de _opt‑out_.
- **Use Playwright mais como motor de automação de teste e validação**, deixando a coleta sistemática em massa sob responsabilidade de pipelines mais alinhados a contratos de dados ou serviços especializados, em vez de depender de evasão de WAF.

Se você quiser, é possível aprofundar em modelos de arquitetura de inteligência competitiva “compliance‑by‑design” (incluindo como combinar dados de múltiplas fontes públicas, SERPs e APIs para estimar posicionamento médico sem depender de scraping direto de Doctoralia).
<span style="display:none">[^1_13][^1_14][^1_15][^1_16][^1_17][^1_18][^1_19][^1_20][^1_21][^1_22][^1_23][^1_24]</span>

<div align="center">⁂</div>

[^1_1]: https://l.doctoralia.com.br/signup

[^1_2]: https://datadome.co/bot-management-protection/empowering-you-for-a-secure-2024-your-journey-with-datadome-in-review/

[^1_3]: https://aws.amazon.com/marketplace/pp/prodview-ixqmzzcoyin6m

[^1_4]: https://datadome.co

[^1_5]: https://www.rj.gov.br/digital/sites/default/files/arquivos_paginas/PEDETIC_2025-26.pdf

[^1_6]: https://www.scribd.com/document/699184504/Aula-1-Cookies-p-Perfil-Dolphin

[^1_7]: https://dnsrepo.noc.org/?ip=3.161.225.4

[^1_8]: https://www.lazard.com/media/oydpj3iw/lazard_t100_index_2024.pdf

[^1_9]: https://www.wmtips.com/tools/info/wsj.com

[^1_10]: https://www.scrapingbee.com/scrapers/doctoralia-api/

[^1_11]: https://mexicobusiness.news/health/news/doctoralia-uses-microsoft-ai-streamline-medical-scheduling

[^1_12]: https://www.getapp.ca/software/2058133/doctoralia-pro

[^1_13]: https://www.youtube.com/watch?v=N8MN7uf91s4

[^1_14]: https://www.tabnews.com.br/NewsletterOficial/cloudflare-anuncia-ferramenta-para-proteger-sites-contra-web-scrapers-de-empresas-de-tecnologia

[^1_15]: https://blog.cloudflare.com/pt-br/deep-dive-cloudflare-autonomous-edge-ddos-protection/

[^1_16]: https://taggrs.io/filter-bot-traffic/

[^1_17]: https://capmonster.cloud/pt-BR/blog/how-cloudflare-bot-challenge-and-turnstile-protect-web-traffic

[^1_18]: https://www.cloudflare.com/pt-br/application-services/products/ddos-for-web/

[^1_19]: https://estyn.gov.wales/app/plugins/pobl-tech-blocks/node_modules/third-party-web/dist/domain-map.csv

[^1_20]: https://www.webdatacrawler.com/doctoralia-healthcare-data-scraping.php

[^1_21]: https://www.getapp.com.co/sitemap/alternatives?page=3

[^1_22]: https://dlthub.com/context/resources/d

[^1_23]: https://www.capterra.pe/sitemap/reviews

[^1_24]: https://www.linkedin.com/pub/dir/+/Catalã¡


---

# Relatório Técnico: Evasão de WAF Anti-Bot DataDome no Doctoralia (Playwright 2026)

