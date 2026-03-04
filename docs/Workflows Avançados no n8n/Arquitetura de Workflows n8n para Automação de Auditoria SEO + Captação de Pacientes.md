# NeuroStrategy OS: Arquitetura de Workflows n8n para Automação de Auditoria SEO + Captação de Pacientes

**Relatório Técnico de Engenharia de Automação de Marketing - Nível Enterprise**

**Status:** Draft v2.0 | Data: Março 2026 | Classificação: Soberania de Dados (Self-Hosted n8n + Docker)

---

## 📋 Índice Executivo

Este documento descreve a arquitetura de **3 Workflows Avançados no n8n** (self-hosted) que automatizam o pipeline "Abidus" de auditoria SEO + captação de pacientes para clínica de hipnose clínica:

1. **Workflow #1 – Auditoria Competitiva Automática (SERPER + HTML Extract + OpenAI)**
   - Extração de H1, H2, H3, Meta Title/Desc, Alt Tags dos 3 primeiros resultados do Google
   - Validação em tempo real de densidade de palavras-chave (Rank Math-like)
   - Comunicação via Webhook com dashboard React

2. **Workflow #2 – Validação de Conformidade YMYL/CFP (LLM-Based Guardrails)**
   - Análise de copywriting contra regras restritivas do Conselho Federal de Psicologia
   - Detecção de promessas de "cura", jargões antiéticos, prova social sensacionalista
   - Retorno estruturado (score de compliance, sugestões de reescrita)

3. **Workflow #3 – Engenharia de Silos Locais Dinâmicos + Coleta Doctoralia**
   - Construção de URLs dinâmicas [Serviço + Cidade/Bairro] combinadas com análise de concorrência
   - Scraping de Doctoralia (com Apify/Playwright para bypass de anti-bot)
   - Geração de relatório de posicionamento competitivo por localidade

---

## 🏗️ Arquitetura Geral: Stack Técnico

```
┌─────────────────────────────────────────────────────────┐
│         Dashboard React (NeuroStrategy OS)              │
│  (/api/automations/n8n/trigger → recebe Webhooks)      │
└──────────────────────┬──────────────────────────────────┘
                       │
         (REST POST com Webhook Token)
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│    n8n (Self-Hosted, Docker, Porta 5678)               │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Workflow #1: Auditoria Competitiva               │   │
│  │ (Webhook Trigger → Serper → HTML Extract)        │   │
│  │ → OpenAI Validation → Webhook Return             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Workflow #2: Validação YMYL/CFP                 │   │
│  │ (Webhook Trigger → OpenAI Guardrails)           │   │
│  │ → Compliance Score → Webhook Return             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Workflow #3: Silos Locais + Concorrência        │   │
│  │ (Webhook Trigger → Apify/Playwright)            │   │
│  │ → URL Builder → Analysis → Webhook Return       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
         │                                    │
         │ (integra com APIs externas)         │
         ▼                                    ▼
    ┌─────────────┐                   ┌──────────────┐
    │ Serper.dev  │                   │ Apify Cloud  │
    │ (SERP API)  │                   │ ou Playwright│
    └─────────────┘                   └──────────────┘
```

---

## 🚀 Workflow #1: Auditoria Competitiva Automática

### Objetivo
Extrair e estruturar dados SEO dos **3 primeiros resultados do Google** para uma palavra-chave target (ex: "psicóloga especializada em TEA em Goiânia"). Validar conformidade com critérios Rank Math em tempo real.

### Nós n8n Utilizados

1. **Webhook (Incoming)**
   - Ativa o workflow via POST
   - Esperado: `{ "keyword": "psicóloga TEA goiânia", "city": "Goiânia", "service": "TEA" }`

2. **Serper Node** (via HTTP Request ou integração nativa)
   - Executa busca no Google via Serper.dev API
   - Retorna: `organic[]` com `title`, `description`, `link` dos 10 primeiros resultados
   - Filtra apenas os **3 primeiros** para análise profunda

3. **HTTP Request (para extrair HTML de cada URL)**
   - Faz requisição GET para cada uma das 3 URLs
   - Opções:
     - **Simples:** `http.request` com headers básicos
     - **Robusto:** usar proxy (ex: Bright Data, Oxylabs) se enfrentar 403/429
     - **Recomendado para bypass:** Apify's `web-browser` actor ou Playwright via HTTP

4. **HTML Extract (Cheerio/jQuery)**
   - Node nativo do n8n para parsing HTML
   - Extrai:
     - `h1, h2, h3` (structure)
     - `meta[name="description"]` (meta desc)
     - `img[alt]` (alt tags)
     - Densidade de keywords (contagem de ocorrências do keyword target)

5. **Code Node (JavaScript/Python)**
   - Calcula **metricas Rank Math-like:**
     - Keyword Density: `(ocorrências_keyword / total_words) * 100`
     - Readability Score (heurístico simples: avg chars per paragraph)
     - Content Length: total de palavras
     - Heading Structure Score: se tem H1, hierarquia H2→H3, etc.

6. **OpenAI Node**
   - Prompt: "Analisa a estrutura SEO abaixo e fornece recomendações de otimização baseadas em Rank Math v1.0"
   - Input: estrutura extraída (headings, meta, alt tags, density)
   - Output: JSON com `score_seo`, `recommendations`, `competitive_gaps`

7. **Webhook (Outgoing)**
   - Retorna para `POST /api/automations/n8n/trigger`
   - Payload:
     ```json
     {
       "workflow_id": "audit_competitive",
       "keyword": "psicóloga TEA goiânia",
       "timestamp": "2026-03-04T09:30:00Z",
       "competitors": [
         {
           "rank": 1,
           "url": "https://competitor1.com.br/...",
           "title": "...",
           "meta_desc": "...",
           "h1": "...",
           "h2_list": [...],
           "keyword_density": 2.1,
           "seo_score": 78,
           "recommendations": [...]
         },
         ...
       ],
       "aggregate_analysis": {
         "avg_keyword_density": 1.95,
         "common_h2_patterns": [...],
         "opportunity_gaps": [...]
       }
     }
     ```

### 🔐 Tratamento de Anti-Bot (WAF/CAPTCHA)

**Problema:** Serper retorna títulos/descrições, mas URLs reais podem estar bloqueadas por Cloudflare, DataDome, etc.

**Solução A (Recomendada):** Usar **Apify Web Scraper Actor**
- Nó: `HTTP Request` com payload:
  ```json
  {
    "method": "POST",
    "url": "https://api.apify.com/v2/acts/apify~web-scraper/runs",
    "headers": { "Authorization": "Bearer APIFY_TOKEN" },
    "body": {
      "startUrls": [{"url": "https://competitor.com"}],
      "useChrome": true,
      "proxyConfiguration": { "useApifyProxy": true }
    }
  }
  ```
- Apify retorna renderização completa + extração de seletores CSS

**Solução B (Alternativa):** Playwright com Proxies
- Nó: `Code Node` executando:
  ```python
  from playwright.async_api import async_playwright
  
  async def scrape_with_proxy():
      proxy = "http://proxy.provider:port"
      async with async_playwright() as p:
          browser = await p.chromium.launch(proxy={"server": proxy})
          page = await browser.new_page()
          await page.goto(url, wait_until="domcontentloaded")
          html = await page.content()
          # Parse com BeautifulSoup/Cheerio
          return html
  ```

### Prompt Otimizado para OpenAI Node

```text
Você é um especialista em SEO técnico e Rank Math. Você receberá dados estruturados de 3 
concorrentes que rankam no Google para a palavra-chave: "{keyword}".

Sua tarefa é:
1. Analisar a estrutura de Heading (H1, H2, H3) e avaliar se segue a hierarquia semântica correta.
2. Calcular densidade de palavra-chave (ideal: 1-3% para saúde).
3. Avaliar a qualidade de Meta Titles e Descriptions para CTR (140-160 chars para title, 150-160 para desc).
4. Identificar padrões de Alt Tags em imagens (coverage e descritivos).
5. Retornar um JSON estruturado:

{
  "seo_score": <0-100>,
  "keyword_density_analysis": {
    "optimal_range": "1-3%",
    "competitors": [
      {
        "rank": 1,
        "density_pct": 2.1,
        "assessment": "Optimal"
      }
    ]
  },
  "heading_structure": {
    "has_h1": true,
    "h1_keyword_match": "exact|partial|none",
    "h2_hierarchy_score": 85,
    "feedback": "..."
  },
  "meta_optimization": {
    "avg_title_length": 145,
    "avg_desc_length": 155,
    "ctr_potential": "high|medium|low"
  },
  "opportunities": [
    {
      "gap": "Description missing power words",
      "recommendation": "Incorporate 'especializado em TEA' + 'avaliação gratuita' para CTR"
    }
  ]
}

Sempre responda EXCLUSIVAMENTE em JSON válido.
```

### Comunicação com Dashboard

**Retorno do Webhook:**
- URL: `http://fastapi-backend:8000/api/automations/n8n/trigger`
- Headers: `Authorization: Bearer {DASHBOARD_SECRET}`, `Content-Type: application/json`
- O dashboard recebe e atualiza em tempo real uma tabela comparativa de competitors

---

## 🛡️ Workflow #2: Validação de Conformidade YMYL/CFP

### Objetivo
Auditar copywriting contra regulamentações do **Conselho Federal de Psicologia (CFP)** e detectar:
- Promessas de "cura" (proibido em psicologia)
- Jargões antiéticos
- Prova social sensacionalista/enganosa
- Falta de disclaimers obrigatórios

### Nós n8n Utilizados

1. **Webhook (Incoming)**
   - Esperado: 
     ```json
     {
       "text_to_validate": "Curo depressão e ansiedade em 3 sessões de hipnose...",
       "content_type": "landing_page|ad_copy|blog_post|testimonial"
     }
     ```

2. **Code Node – Pré-processamento**
   - Extrai entidades e estrutura:
     - Dividi texto em sentenças
     - Detecta possíveis violações óbvias (regex):
       - `/curo|cura|eliminei completamente|nunca mais/gi` → Flag: "Cura Promise"
       - `/100% de sucesso|todos meus clientes|garantido/gi` → Flag: "Unsubstantiated Claims"
     - Armazena em arrays para validação LLM

3. **OpenAI Node – LLM Guardrails**
   - Modelo: `gpt-4` ou `gpt-3.5-turbo` (mais econômico)
   - Prompt estruturado (veja abaixo)
   - Retorna:
     - `compliance_score` (0-100)
     - `violations` array com `severity` (critical|warning|info)
     - `suggestions` para reescrita

4. **Code Node – Score Aggregation**
   - Converte violations em score:
     - `critical` (1 ocorrência): -25 pontos
     - `warning` (1 ocorrência): -10 pontos
     - `info` (1 ocorrência): -5 pontos
   - Capturado em intervalo 0-100

5. **Conditional Logic (IF Node)**
   - Se `compliance_score < 70`: sinaliza para revisão humana
   - Se `>=70`: libera para publicação automática (ou enfileira)

6. **Webhook (Outgoing)**
   - Retorna:
     ```json
     {
       "content_type": "landing_page",
       "compliance_score": 78,
       "status": "approved_with_minor_suggestions",
       "violations": [
         {
           "type": "unsubstantiated_claim",
           "severity": "warning",
           "detected_text": "Meus clientes têm 95% de sucesso",
           "suggestion": "Change to: 'Muitos clientes relatam melhorias significativas em sua qualidade de vida'"
         }
       ],
       "summary": "Content is compliant with CFP guidelines with minor adjustments",
       "timestamp": "2026-03-04T10:15:00Z"
     }
     ```

### Prompt Otimizado para OpenAI (LLM Guardrails)

```text
ROLE: Você é um auditor especializado em ética profissional e regulamentações 
do Conselho Federal de Psicologia (CFP) do Brasil. Sua responsabilidade é 
validar conteúdo de marketing para serviços de psicologia, hipnose clínica 
e terapias correlatas.

REGRAS INVIOLÁVEIS (CFP):
1. PROIBIÇÕES ABSOLUTAS:
   - Promessas de "cura" (ex: "Curo depressão", "Eliminei a ansiedade", "Nunca mais terá pânico")
   - Garantias de resultado (ex: "100% de sucesso", "Funciona sempre")
   - Comparações com medicamentos ou promessas de substituição (ex: "Melhor que antidepressivos")
   - Jargão pseudocientífico não validado (ex: "Reprograma seu DNA", "Cura através de energia cósmica")

2. OBRIGATORIEDADES:
   - Menção de CRP (número de registro do psicólogo)
   - Termo de confidencialidade/sigilo profissional
   - Ressalva de que hipnose clínica é complementar, não substitui diagnóstico médico
   - Para TEA: esclarecer que diagnóstico é médico/multidisciplinar, não psicólogo sozinho

3. PROVA SOCIAL (Testimoniais):
   - ✓ Permitido: "Um cliente relatou melhorias em sua qualidade de vida"
   - ✗ Proibido: Nomes/fotos de clientes (quebra sigilo), percentuais genéricos ("95% melhora")
   - ✓ Permitido: Descrição genérica de melhoria ("Muitos pacientes relatam melhor controle emocional")

TAREFA:
Analise o texto abaixo contra essas regras e retorne um JSON estruturado:

{
  "compliance_score": <0-100>,
  "status": "approved|approved_with_minor_suggestions|requires_revision|rejected",
  "violations": [
    {
      "type": "prohibition_cure_promise|unsubstantiated_claim|missing_cfp_mention|...",
      "severity": "critical|warning|info",
      "line_reference": "Texto exato detectado: '...'",
      "explanation": "Por que isso viola: ...",
      "suggestion": "Reescreva como: '...'"
    }
  ],
  "strengths": ["Menção apropriada de CRP", "Linguagem humilde e realista"],
  "summary": "Resumo geral da conformidade em 1-2 linhas"
}

TEXTO A VALIDAR:
---
{content_to_validate}
---

Responda EXCLUSIVAMENTE em JSON válido. Não adicione markdown, explicações ou prefácio.
```

### Integração com Dashboard

- O score é exibido em tempo real no dashboard como **compliance gauge**
- Violações são listadas com sugestões de reescrita
- Permite revisão + aprovação manual antes de publicação (fluxo híbrido)

---

## 🗺️ Workflow #3: Engenharia de Silos Locais + Concorrência Doctoralia

### Objetivo
1. Construir matriz de **URLs dinâmicas** combinando `[Serviço + Localidade]`
2. Buscar concorrentes em Doctoralia para cada combinação
3. Gerar relatório de "gaps de posicionamento" e oportunidades SEO hiperlocais

### Nós n8n Utilizados

#### Fase 1: Construção de Matriz Silo

1. **Webhook (Incoming)**
   ```json
   {
     "services": ["TEA em Adultos", "Depressão", "Ansiedade"],
     "cities": ["Goiânia", "Uberlândia"],
     "neighborhoods": ["Setor Marista", "Setor Bela Vista", "Centro"],
     "action": "generate_silos|analyze_competition"
   }
   ```

2. **Function Node (JavaScript)**
   - Gera cartesiano de `services × cities × neighborhoods`
   - Produz URLs amigáveis:
     ```javascript
     function generateSiloURLs(services, cities, neighborhoods) {
       const urls = [];
       for (let service of services) {
         for (let city of cities) {
           for (let neighborhood of neighborhoods) {
             const slug = `${sanitize(service)}-${sanitize(city)}-${sanitize(neighborhood)}`;
             urls.push({
               service,
               city,
               neighborhood,
               canonical_url: `/psicologia/${slug}/`,
               keyword_target: `${service} em ${neighborhood}, ${city}`
             });
           }
         }
       }
       return urls;
     }
     ```
   - Retorna: matriz com ~18 URLs (3 × 2 × 3)

3. **Google Sheets Node (Opcional)**
   - Armazena matriz de silos em planilha para referência

#### Fase 2: Coleta de Concorrência Doctoralia

4. **Loop Node (para cada URL silo)**
   - Itera sobre cada combinação `[Service, City, Neighborhood]`

5. **HTTP Request → Apify Web Scraper Actor** (OU Playwright direto)

   **Opção A: Apify (Recomendado para confiabilidade)**
   ```json
   {
     "method": "POST",
     "url": "https://api.apify.com/v2/acts/apify~web-scraper/run-sync-get-dataset-items",
     "headers": {
       "Authorization": "Bearer {APIFY_TOKEN}",
       "Content-Type": "application/json"
     },
     "body": {
       "startUrls": [
         {"url": "https://www.doctoralia.com.br/search?speciality=psicologia&location=Goiânia"}
       ],
       "pageFunction": "pageFunction",
       "useChrome": true,
       "proxyConfiguration": {"useApifyProxy": true}
     }
   }
   ```

   **Opção B: Playwright via Code Node**
   ```python
   from playwright.async_api import async_playwright
   from bs4 import BeautifulSoup
   import json
   
   async def scrape_doctoralia(service, city):
       search_url = f"https://www.doctoralia.com.br/search?speciality={service}&location={city}"
       async with async_playwright() as p:
           browser = await p.chromium.launch(headless=True)
           page = await browser.new_page()
           # Bypass DataDome com headers realistas
           await page.set_extra_http_headers({
               "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
           })
           await page.goto(search_url, wait_until="domcontentloaded")
           html = await page.content()
           
           soup = BeautifulSoup(html, "html.parser")
           doctors = []
           for card in soup.find_all("div", class_="doctor-card"):
               doctors.append({
                   "name": card.find("h2").text,
                   "specialty": card.find("span", class_="specialty").text,
                   "rating": float(card.find("span", class_="rating").text),
                   "reviews": int(card.find("span", class_="review-count").text),
                   "link": card.find("a")["href"]
               })
           
           await browser.close()
           return doctors
   ```

6. **HTML Extract Node**
   - Selectors para Doctoralia:
     - `.doctor-card h2` → nome
     - `.doctor-card .specialty` → especialidade
     - `.doctor-card .rating` → nota
     - `.doctor-card .review-count` → quantidade de avaliações

7. **Code Node – Data Enrichment**
   - Para cada concorrente, coleta:
     - Dados demográficos (especialidades, localização, rating)
     - Calcula "dominação local": `rating × log(review_count + 1)`
   - Estrutura:
     ```json
     {
       "silo": {
         "service": "TEA em Adultos",
         "city": "Goiânia",
         "neighborhood": "Setor Marista"
       },
       "competitors": [
         {
           "rank": 1,
           "name": "Dr. Silva",
           "rating": 4.8,
           "reviews": 245,
           "specialties": ["TEA", "Desenvolvimento"],
           "doctoralia_dominance_score": 78,
           "link": "..."
         }
       ],
       "market_gap": {
         "avg_rating": 4.6,
         "avg_reviews": 120,
         "dominant_strategy": "High review volume from few players",
         "opportunity": "New specialist with unique angle (Ericksonian hypnosis)"
       }
     }
     ```

#### Fase 3: Geração de Relatório + Retorno Webhook

8. **Merge/Aggregate Node**
   - Consolida todos os silos analisados

9. **Code Node – Report Generation**
   - Gera markdown/HTML com:
     - Matriz de posicionamento por localidade
     - Heatmap de competição (onde há mais concorrentes com alto rating)
     - Recomendações de nicho (ex: "Setor Bela Vista tem baixa cobertura de hipnose clínica")

10. **Webhook (Outgoing)**
    - Retorna relatório completo:
    ```json
    {
      "workflow_id": "silos_competition_analysis",
      "timestamp": "2026-03-04T11:30:00Z",
      "silos_analyzed": 18,
      "total_competitors_found": 247,
      "silos": [
        {
          "canonical_url": "/psicologia/tea-adultos-goiania-setor-marista/",
          "keyword_target": "TEA em Adultos em Setor Marista, Goiânia",
          "doctoralia_competitors": 8,
          "avg_rating": 4.7,
          "market_dominance_pct": 45,
          "opportunity_score": 72,
          "recommendation": "High demand, low unique positioning. Differentiate via Ericksonian angle."
        }
      ],
      "opportunities": [
        {
          "location": "Setor Bela Vista, Goiânia",
          "gap": "No specialists with hypnotherapy + TEA combination",
          "estimated_search_volume": 120,
          "competitive_advantage": "Pioneer positioning possible"
        }
      ],
      "next_actions": [
        "Create landing pages for high-opportunity silos",
        "Optimize for long-tail keywords combining service + hypnosis"
      ]
    }
    ```

---

## 🔌 Integração com FastAPI Dashboard

### Rota Backend Esperada

```python
# FastAPI endpoint para receber webhooks do n8n
@app.post("/api/automations/n8n/trigger")
async def handle_n8n_webhook(
    authorization: str = Header(...),
    body: dict = Body(...)
):
    # Verificar token
    if not verify_webhook_token(authorization):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    workflow_id = body.get("workflow_id")
    
    # Armazenar resultado no banco de dados
    result = await db.automations.insert_one({
        "workflow_id": workflow_id,
        "timestamp": datetime.now(),
        "payload": body,
        "status": "completed"
    })
    
    # Emitir event para WebSocket (dashboard em tempo real)
    await broadcast.publish(
        channel=f"automations:{workflow_id}",
        message={
            "event": "workflow_completed",
            "data": body
        }
    )
    
    return {"status": "received", "result_id": str(result.inserted_id)}
```

### Frontend React (Componente Dashboard)

```jsx
// NeuroStrategy Dashboard - Automation Monitor
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

export function AutomationMonitor() {
  const [workflows, setWorkflows] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Conectar a WebSocket para atualizações em tempo real
    const socket = new WebSocket('ws://localhost:8000/ws/automations');
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setWorkflows(prev => [...prev, data]);
    };
    
    setWs(socket);
    return () => socket.close();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>NeuroStrategy Automation Monitor</h1>
      
      <div className="workflow-grid">
        {/* Workflow #1 */}
        <div className="workflow-card">
          <h3>🔍 Auditoria Competitiva</h3>
          <p>Status: {workflows.filter(w => w.workflow_id === 'audit_competitive').length > 0 ? 'Ativo' : 'Inativo'}</p>
          <div className="competitors-table">
            {workflows.map(w => (
              <CompetitorRow key={w.url} data={w} />
            ))}
          </div>
        </div>

        {/* Workflow #2 */}
        <div className="workflow-card">
          <h3>🛡️ Validação YMYL/CFP</h3>
          <ComplianceGauge score={workflows[0]?.compliance_score || 0} />
          <ViolationsList violations={workflows[0]?.violations || []} />
        </div>

        {/* Workflow #3 */}
        <div className="workflow-card">
          <h3>🗺️ Silos Locais + Concorrência</h3>
          <SiloHeatmap silos={workflows[0]?.silos || []} />
        </div>
      </div>
    </div>
  );
}
```

---

## ⚙️ Configuração de Produção (Docker)

### `docker-compose.yml` para n8n Self-Hosted

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - NODE_ENV=production
      - WEBHOOK_URL=https://neurostrategy.com/webhook  # URL pública para n8n
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=${DB_PASSWORD}
      - DB_POSTGRESDB_DATABASE=n8n
      - GENERIC_TIMEZONE=America/Sao_Paulo
      # Chaves de API terceiras
      - SERPER_API_KEY=${SERPER_API_KEY}
      - APIFY_API_KEY=${APIFY_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    ports:
      - "5678:5678"
    depends_on:
      - postgres
      - redis
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - neurostrategy

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=n8n
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - neurostrategy

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - neurostrategy

volumes:
  n8n_data:
  postgres_data:
  redis_data:

networks:
  neurostrategy:
    driver: bridge
```

### `.env.production`

```bash
N8N_PASSWORD=your-secure-password-here
DB_PASSWORD=postgres-secure-password
SERPER_API_KEY=your-serper-api-key
APIFY_API_KEY=your-apify-api-key
OPENAI_API_KEY=your-openai-api-key
```

---

## 🚨 Recomendações Avançadas (Enterprise)

### 1. Tratamento de Erros e Retry Logic

Adicionar a cada nó HTTP:
```json
{
  "retry_on_exit_code": [429, 503, 504],
  "max_tries": 3,
  "backoff_type": "exponential",
  "backoff_base": 2,
  "wait_between_tries": 1000
}
```

### 2. Rate Limiting para APIs Terceiras

- **Serper.dev**: 100 requests/dia (free tier) → cache de 30 dias
- **Apify**: 50k task units/mês (free) → otimizar seletor CSS
- **OpenAI**: $5-20 USD por workflow (gpt-3.5 ~$0.0015/1k tokens)

Implementar fila com **Redis** ou **n8n Queue** para distribuir calls ao longo do dia.

### 3. Monitoramento e Alertas

Configurar **Slack notifications** para:
- Workflow falha (erro HTTP 5xx)
- Compliance score < 70 (requer revisão humana)
- Silo gap > 90 (oportunidade crítica detectada)

Adicionar nó "Slack" ao final de cada workflow:
```json
{
  "channel": "#marketing-automations",
  "message": "Workflow #1 completed: 3 competitors analyzed, avg SEO score 78"
}
```

### 4. Auditoria e Logging Estruturado

Todos os workflows devem logar em formato estruturado:
```json
{
  "timestamp": "2026-03-04T09:30:00Z",
  "workflow_id": "audit_competitive",
  "execution_id": "uuid-xxx",
  "input": {...},
  "output": {...},
  "status": "success|error",
  "duration_ms": 3421,
  "cost_usd": 0.042,
  "api_calls": {
    "serper": 1,
    "openai": 1,
    "http": 3
  }
}
```

Armazenar em **MongoDB** para auditoria + BI.

### 5. Conformidade LGPD/CFP

- **Não armazenar dados de pacientes** em logs (PII)
- **Criptografar** chaves de API em variáveis de ambiente
- **Auditoria** de workflows que acessam dados de concorrentes (Doctoralia)
- **Retention policy**: deletar dados de execução após 90 dias

---

## 📊 KPIs de Sucesso

| Métrica | Target | Frequência |
|---------|--------|-----------|
| Auditoria Competitiva | <2min/busca | Diária |
| Taxa de Compliance YMYL | >85% sem revisão | Por publicação |
| Silos Mapeados | 50+ por mês | Semanal |
| Webhook Delivery Success | >99% | Realtime |
| Cost per Workflow | <$0.10 USD | Por execução |

---

## 🔗 Recursos Complementares

- **n8n Docs:** https://docs.n8n.io/
- **Serper.dev API:** https://serper.dev/docs
- **Apify Actors:** https://apify.com/actors
- **OpenAI Prompt Engineering:** https://platform.openai.com/docs/guides/prompt-engineering
- **CFP Resolução 016/2000:** Código de Ética Profissional

---

## ✅ Checklist de Implementação

- [ ] Provisionar n8n self-hosted em Docker
- [ ] Configurar variáveis de ambiente (chaves de API)
- [ ] Criar Workflow #1 com Serper + HTML Extract
- [ ] Testar bypass de WAF (Apify ou Playwright)
- [ ] Implementar validação OpenAI com prompt CFP
- [ ] Teste de compliance com textos exemplo (cura vs. melhora)
- [ ] Construir matriz de silos dinâmica
- [ ] Integrar Doctoralia scraping
- [ ] Configurar webhooks para dashboard FastAPI
- [ ] Teste E2E: trigger manual de cada workflow
- [ ] Monitoramento + alertas Slack
- [ ] Documentação de runbooks para operação

---

**Fim do Relatório Técnico v2.0**

*Próximas fases: Implementação de IA Agentic (LLM para otimização autônoma de bids/orçamento no Google Ads)*
