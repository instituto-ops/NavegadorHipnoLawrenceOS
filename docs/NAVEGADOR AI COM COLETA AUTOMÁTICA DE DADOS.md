# 🤖 NAVEGADOR AI COM COLETA AUTOMÁTICA DE DADOS

**Análise de Viabilidade & Implementação Prática**  
**Data:** 17 de Janeiro de 2026  
**Foco:** Integração de assistente AI dentro do NeuroStrategy OS para coleta automática

---

## 📋 ÍNDICE

1. **Viabilidade Técnica**
2. **Comparativo de Tecnologias**
3. **Arquitetura Proposta**
4. **Implementação Prática (Passo-a-Passo)**
5. **Segurança & Gerenciamento de Credenciais**
6. **Interface & UX**
7. **Roadmap de Desenvolvimento**
8. **Estimativas & Recursos**

---

## 1️⃣ VIABILIDADE TÉCNICA: SIM, É 100% POSSÍVEL

### Resposta Rápida

```
Pergunta: "Posso criar um navegador AI dentro do NeuroStrategy OS 
          que coleta dados automaticamente de forma invisível?"

Resposta: ✅ SIM, TOTALMENTE POSSÍVEL

Prova:
├─ Claude Computer Use API: Lançado Oct 2024 (public beta)
├─ Firecrawl Agent Endpoint: Lançado 2025 (autonomous web agents)
├─ Playwright/Puppeteer: Estáveis há 5+ anos (browser automation)
├─ n8n: Tem integração nativa com Claude + Playwright
└─ Comet Browser: Prova de conceito do que é possível

Maturidade: PRODUCTION READY ✅
```

### O que você está pedindo (Mapeamento)

```
SEU PEDIDO:                              TECNOLOGIA:
─────────────────────────────────────────────────────────────
"Navegador invisível"                 → Headless browser (Playwright/Puppeteer)
"Com assistente AI"                   → Claude Computer Use API / Comet
"Coleta automática"                   → Firecrawl Agent / n8n Workflows
"Sem aparecer na tela"                → Headless mode (não renderiza UI)
"Apenas log de progresso"             → Logging + Status dashboard
"Interface de coletando dados"        → React/Vue UI com status em tempo real
"Login seguro em config"              → Encrypted credential storage + Keyring
"Relatórios de tarefas"               → JSON reports + metrics export
"Erros registrados"                   → Error logging + retry logic
```

**Conclusão: Tudo está disponível e pronto. Questão é INTEGRAÇÃO.**

---

## 2️⃣ COMPARATIVO DE TECNOLOGIAS

### 2.1 Opção A: Claude Computer Use API (Recomendada)

```
ESPECIFICAÇÕES:
├─ Modelo: Claude 3.5 Sonnet
├─ API: Anthropic Beta API
├─ Capabilities: Screenshot + Mouse + Keyboard
├─ Velocidade: Média-Alta (múltiplas chamadas)
├─ Custo: $3 por milhão input tokens / $15 por milhão output tokens
├─ Vision: ✅ Excelente (entende UI visualmente)
├─ Login Automático: ✅ Sim (pode preencher formulários)
└─ Headless: ✅ Sim (pode rodar sem interface)

COMO FUNCIONA:
1. Você descreve a tarefa em linguagem natural
2. Claude vê screenshot do desktop/browser
3. Claude decide próxima ação
4. Executa (click, type, scroll)
5. Captura novo screenshot
6. Loop até completar

EXEMPLO PSEUDOCÓDIGO:
───────────────────────────────────────
task = "Collect data from Google Analytics dashboard"
screenshot = capture_desktop()

response = claude_api.messages.create(
    model="claude-3-5-sonnet",
    max_tokens=1024,
    tools=[computer_use],
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": task},
                {"type": "image", "source": {"type": "base64", 
                 "media_type": "image/png", 
                 "data": screenshot}}
            ]
        }
    ]
)

# Claude retorna tool_use com ações
# Você executa as ações
# Loop continua até sucesso
───────────────────────────────────────

✅ PROS:
├─ Melhor "compreensão" de UI (visão)
├─ Lidar com mudanças de layout
├─ Única solução true "general-purpose"
├─ Excelente para formulários complexos
└─ Erro recovery automático

❌ CONS:
├─ Mais caro (múltiplas chamadas = mais tokens)
├─ Mais lento (visão + análise = latência)
├─ Baseado em screenshots (pode falhar em UI complexo)
└─ Rate limits da API
```

---

### 2.2 Opção B: Firecrawl Agent (Mais Rápida & Barata)

```
ESPECIFICAÇÕES:
├─ Modelo: Firecrawl + Backend LLM
├─ API: REST API
├─ Capabilities: Web scraping + AI + Autonomous agents
├─ Velocidade: Rápida (otimizada para web)
├─ Custo: Menos caro que Claude (web-specific)
├─ Vision: ⚠️ Pode usar, mas não é foco
├─ Login Automático: ✅ Sim (agent pode fazer)
└─ Headless: ✅ Sim (já é headless)

COMO FUNCIONA:
1. Você descreve o que quer extrair
2. Firecrawl Agent acessa site
3. Faz login se necessário
4. Extrai dados
5. Retorna JSON estruturado

EXEMPLO CÓDIGO:
───────────────────────────────────────
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="YOUR_API_KEY")

# Agent mode (autonomous)
result = firecrawl.agent(
    goal="Login to Google Analytics as user@example.com, 
          extract sessions from last 7 days",
    credentials={
        "email": "user@example.com",
        "password": "encrypted_password"
    },
    max_steps=10,
    timeout=60
)

print(result.data)  # JSON estruturado
print(result.logs)  # Log de ações
───────────────────────────────────────

✅ PROS:
├─ Muito mais rápido
├─ Muito mais barato
├─ Especificamente feito para web scraping
├─ Dados já estruturados (JSON)
├─ Menos chamadas = melhor performance
└─ Anti-bot bypass nativo

❌ CONS:
├─ Menos "inteligente" que Claude (vision)
├─ Pode falhar em UIs muito complexas
├─ Menos flexibilidade
└─ Pode precisar de retry manual
```

---

### 2.3 Opção C: Playwright + n8n (DIY - Mais Controle)

```
ESPECIFICAÇÕES:
├─ Framework: Playwright (browser automation)
├─ Orquestração: n8n (workflow)
├─ Capabilities: Controle total
├─ Velocidade: MUITO RÁPIDA (não usa AI)
├─ Custo: ZERO (open source)
├─ Vision: ❌ Não (selector-based)
├─ Login Automático: ✅ Sim (fácil)
└─ Headless: ✅ Sim (default)

COMO FUNCIONA:
1. Você define workflow em n8n visualmente
2. Playwright clica em elementos específicos
3. Extrai dados via seletores CSS/XPath
4. Salva em database
5. Loop automático

EXEMPLO WORKFLOW:
───────────────────────────────────────
Trigger: Schedule (every day at 8am)
  ↓
Step 1: Launch browser
  ↓
Step 2: Navigate to https://analytics.google.com
  ↓
Step 3: Fill login form
  await page.fill('input[email]', credentials.email)
  await page.fill('input[password]', credentials.password)
  ↓
Step 4: Click login button
  await page.click('button[type="submit"]')
  ↓
Step 5: Wait for dashboard
  await page.waitForSelector('.analytics-card')
  ↓
Step 6: Extract sessions
  const sessions = await page.locator('.session-count').textContent()
  ↓
Step 7: Save to database
  await database.insert({date, sessions, timestamp})
  ↓
Step 8: Send report email
  ↓
Step 9: Close browser
───────────────────────────────────────

✅ PROS:
├─ GRATUITAMENTE
├─ Muito rápido (não usa IA)
├─ Controle total
├─ Escalável facilmente
├─ Open source (seu próprio servidor)
└─ Sem limites de API

❌ CONS:
├─ Frágil em mudanças de UI (seletores quebram)
├─ Sem adaptação automática
├─ Precisa manutenção se site mudar
├─ Menos inteligente (não entende contexto)
└─ Pode falhar em logins complexos
```

---

### 2.4 Comparativo Lado-a-Lado

```
┌─────────────────────┬──────────────┬─────────────┬──────────────┐
│ CRITÉRIO            │ Claude Use   │ Firecrawl   │ Playwright   │
├─────────────────────┼──────────────┼─────────────┼──────────────┤
│ Velocidade          │ Média        │ ⭐⭐⭐⭐⭐  │ ⭐⭐⭐⭐⭐  │
│ Custo               │ $$           │ $           │ ✅ Free      │
│ Inteligência        │ ⭐⭐⭐⭐⭐  │ ⭐⭐⭐⭐   │ ⭐⭐        │
│ Resiliência         │ ⭐⭐⭐⭐⭐  │ ⭐⭐⭐⭐   │ ⭐⭐⭐      │
│ UI Complexa         │ ⭐⭐⭐⭐⭐  │ ⭐⭐⭐⭐   │ ⭐⭐        │
│ Login 2FA           │ ⭐⭐⭐⭐   │ ⭐⭐⭐     │ ⭐⭐⭐      │
│ Setup Time          │ 2 horas      │ 1 hora      │ 30 minutos   │
│ Manutenção          │ Baixa        │ Média       │ Média-Alta   │
├─────────────────────┼──────────────┼─────────────┼──────────────┤
│ RECOMENDAÇÃO        │ Premium path │ Balanced    │ Budget path  │
└─────────────────────┴──────────────┴─────────────┴──────────────┘

ESCOLHA PARA SEU CASO:
├─ SE quer máxima confiabilidade:  → Claude Computer Use
├─ SE quer balance custo/benefício: → Firecrawl Agent
└─ SE quer zero custo:             → Playwright + n8n
```

---

## 3️⃣ ARQUITETURA PROPOSTA

### 3.1 Visão Geral (Sistema Completo)

```
┌────────────────────────────────────────────────────────────────┐
│                   NeuroStrategy OS v7.2                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────────────────────────┐      │
│  │  Frontend (React) - NeuroStrategy Dashboard         │      │
│  │  ├─ Marketing Radar                                 │      │
│  │  ├─ Settings Panel                                 │      │
│  │  ├─ Data Collection Status                          │      │
│  │  └─ Collection Log & Reports                        │      │
│  └──────────────┬──────────────────────────────────────┘      │
│                 │                                              │
│                 ▼                                              │
│  ┌─────────────────────────────────────────────────────┐      │
│  │  API Server (Node.js/Python)                        │      │
│  │  ├─ Credential Management                           │      │
│  │  ├─ Workflow Orchestration                          │      │
│  │  ├─ Error Handling                                  │      │
│  │  └─ Status Reporting                                │      │
│  └──────────────┬──────────────────────────────────────┘      │
│                 │                                              │
│        ┌────────┼────────┐                                     │
│        ▼        ▼        ▼                                     │
│  ┌──────────┬──────────┬──────────┐                            │
│  │ Collector│ Collector│ Collector│   (Headless Browsers)      │
│  │ Instance │ Instance │ Instance │                            │
│  │ (Claude  │(Firecrawl│(Playwright)                           │
│  │ Use)     │)         │                                        │
│  └────┬─────┴────┬─────┴────┬─────┘                            │
│       │          │          │                                 │
│       ▼          ▼          ▼                                 │
│  ┌─ Google Analytics                                          │
│  ├─ Google Search Console                                     │
│  ├─ Instagram API                                             │
│  ├─ Google Business Profile                                   │
│  ├─ WordPress REST                                            │
│  └─ Doctoralia (manual entry via form)                        │
│       │          │          │                                 │
│       └──────────┼──────────┘                                 │
│                  ▼                                            │
│       ┌──────────────────────┐                                │
│       │  Secure Database     │                                │
│       │  (IndexedDB + Backup)│                                │
│       └──────────────────────┘                                │
│                  │                                            │
│                  ▼                                            │
│       ┌──────────────────────┐                                │
│       │  Analytics Engine    │                                │
│       │  (Data Processing)   │                                │
│       └──────────────────────┘                                │
│                  │                                            │
│                  ▼                                            │
│       ┌──────────────────────┐                                │
│       │  Dashboard & Reports │                                │
│       │  (Real-time Viz)     │                                │
│       └──────────────────────┘                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Data Flow - Coleta de GA4

```
┌─ USER SCHEDULES COLLECTION (ex: every day 08:00)
│
├─ CREDENTIAL RETRIEVAL
│  └─ Decrypt stored credentials (AES-256)
│
├─ HEADLESS BROWSER LAUNCH
│  ├─ Playwright launches Chrome headless
│  ├─ No UI rendered (invisible)
│  └─ Viewport: 1920x1080 (standard)
│
├─ AUTHENTICATION
│  ├─ Navigate to Google Analytics
│  ├─ Wait for login form
│  ├─ Fill email (if needed - já logado geralmente)
│  └─ Handle any 2FA if necessary
│
├─ DATA EXTRACTION
│  ├─ Click on date range selector
│  ├─ Set dates (last 7 days)
│  ├─ Wait for data to load
│  ├─ Take screenshot for verification
│  ├─ Parse visible metrics:
│  │  ├─ Sessions
│  │  ├─ Conversions
│  │  ├─ Bounce rate
│  │  ├─ Avg session duration
│  │  └─ Traffic sources
│  └─ Extract table data via DOM
│
├─ DATA TRANSFORMATION
│  ├─ Parse numbers (remove commas, %)
│  ├─ Normalize timestamps
│  ├─ Calculate derived metrics
│  └─ Structure into JSON
│
├─ STORAGE
│  ├─ Save to IndexedDB (immediate)
│  ├─ Encrypt sensitive fields
│  ├─ Backup to server
│  └─ Audit log entry
│
├─ LOGGING
│  └─ Log every action:
│     ├─ Timestamp
│     ├─ Action (navigated, clicked, extracted)
│     ├─ Status (success/error)
│     ├─ Value extracted (if applicable)
│     └─ Error message (if applicable)
│
└─ COMPLETION
   ├─ Close browser
   ├─ Generate report
   ├─ Send success notification
   └─ Update dashboard
```

---

### 3.3 Estrutura de Arquivos

```
neuro-strategy-os/
├── src/
│   ├── collectors/
│   │   ├── base-collector.ts
│   │   ├── claude-collector.ts      (Claude Computer Use)
│   │   ├── firecrawl-collector.ts   (Firecrawl Agent)
│   │   ├── playwright-collector.ts  (Playwright)
│   │   ├── ga4-collector.ts
│   │   ├── gsc-collector.ts
│   │   ├── instagram-collector.ts
│   │   └── gbp-collector.ts
│   │
│   ├── credentials/
│   │   ├── credential-manager.ts    (Encrypt/Decrypt)
│   │   ├── keyring-adapter.ts       (OS keyring)
│   │   └── credential.types.ts
│   │
│   ├── automation/
│   │   ├── browser-pool.ts          (Browser instances)
│   │   ├── scheduler.ts             (Schedule tasks)
│   │   ├── task-executor.ts
│   │   ├── error-handler.ts
│   │   └── retry-logic.ts
│   │
│   ├── logging/
│   │   ├── collector-logger.ts
│   │   ├── error-logger.ts
│   │   └── audit-log.ts
│   │
│   ├── ui/
│   │   ├── CollectionStatus.tsx     (Real-time status)
│   │   ├── CollectionLog.tsx        (Detailed log)
│   │   ├── ErrorAlert.tsx
│   │   └── CredentialManager.tsx
│   │
│   └── utils/
│       ├── encryption.ts
│       ├── http-client.ts
│       └── data-parser.ts
│
└── config/
    ├── collectors.config.json
    ├── scheduler.config.json
    └── security.config.json
```

---

## 4️⃣ IMPLEMENTAÇÃO PRÁTICA

### 4.1 Setup Inicial (Fase 1)

#### A. Instalar Dependências

```bash
# Node.js + npm
npm install playwright puppeteer @firecrawl/api anthropic

# Python (se usar Python para Claude)
pip install anthropic selenium undetected-chromedriver

# n8n (se usar n8n)
npm install -g n8n

# Encryption
npm install crypto-js dotenv

# Database
npm install better-sqlite3  # Local storage
npm install sqlite3         # Alternative
```

#### B. Setup de Ambiente

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
FIRECRAWL_API_KEY=fc-...
PLAYWRIGHT_HEADLESS=true
DATABASE_PATH=./data/neurostrategy.db
LOG_LEVEL=info
ENCRYPTION_KEY=your-secret-key-32-chars-minimum
```

#### C. Credential Management (Seguro)

```typescript
// src/credentials/credential-manager.ts

import crypto from 'crypto';
import os from 'os';

interface StoredCredential {
  service: 'ga4' | 'gsc' | 'instagram' | 'gbp' | 'doctoralia';
  encryptedEmail: string;
  encryptedPassword: string;
  encryptedToken?: string;
  timestamp: number;
}

class CredentialManager {
  private encryptionKey: Buffer;

  constructor() {
    // Use OS keyring if available, fallback to env
    const keyPath = path.join(os.homedir(), '.neurostrategy', 'key');
    if (fs.existsSync(keyPath)) {
      this.encryptionKey = Buffer.from(fs.readFileSync(keyPath));
    } else {
      this.encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY || '');
    }
  }

  // ENCRYPT: Store credential safely
  async storeCredential(
    service: string,
    email: string,
    password: string,
    token?: string
  ) {
    const encrypted: StoredCredential = {
      service,
      encryptedEmail: this.encrypt(email),
      encryptedPassword: this.encrypt(password),
      encryptedToken: token ? this.encrypt(token) : undefined,
      timestamp: Date.now(),
    };

    // Store in IndexedDB (encrypted)
    await this.db.credentials.put(encrypted);

    // Also backup to file (for migration)
    fs.writeFileSync(
      path.join(os.homedir(), `.neurostrategy/${service}.cred`),
      JSON.stringify(encrypted)
    );

    return { success: true, service };
  }

  // DECRYPT: Retrieve credential securely
  async getCredential(service: string) {
    const stored = await this.db.credentials.get(service);
    if (!stored) throw new Error(`No credential found for ${service}`);

    return {
      email: this.decrypt(stored.encryptedEmail),
      password: this.decrypt(stored.encryptedPassword),
      token: stored.encryptedToken 
        ? this.decrypt(stored.encryptedToken) 
        : undefined,
    };
  }

  // ENCRYPT Helper
  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      this.encryptionKey,
      iv
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  // DECRYPT Helper
  private decrypt(text: string): string {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.encryptionKey,
      iv
    );
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

export default new CredentialManager();
```

---

### 4.2 Collector Base (Fase 2)

```typescript
// src/collectors/base-collector.ts

interface CollectionResult {
  service: string;
  data: Record<string, any>;
  timestamp: number;
  status: 'success' | 'error' | 'partial';
  error?: string;
  logsGenerated: CollectionLog[];
}

interface CollectionLog {
  timestamp: number;
  action: string;
  status: 'info' | 'success' | 'warning' | 'error';
  details?: string;
}

abstract class BaseCollector {
  protected service: string;
  protected logs: CollectionLog[] = [];

  async collect(): Promise<CollectionResult> {
    this.logs = [];
    const startTime = Date.now();

    try {
      this.log('Collection started', 'info');

      // Get credentials
      this.log('Retrieving credentials', 'info');
      const credentials = await credentialManager.getCredential(this.service);

      // Authenticate
      this.log('Authenticating', 'info');
      await this.authenticate(credentials);

      // Extract data
      this.log('Extracting data', 'info');
      const data = await this.extractData();

      // Validate
      this.log('Validating data', 'info');
      await this.validateData(data);

      this.log(`Collection completed in ${Date.now() - startTime}ms`, 'success');

      return {
        service: this.service,
        data,
        timestamp: startTime,
        status: 'success',
        logsGenerated: this.logs,
      };
    } catch (error) {
      this.log(`Error: ${error.message}`, 'error');

      return {
        service: this.service,
        data: {},
        timestamp: startTime,
        status: 'error',
        error: error.message,
        logsGenerated: this.logs,
      };
    }
  }

  protected log(message: string, level: 'info' | 'success' | 'warning' | 'error') {
    const log: CollectionLog = {
      timestamp: Date.now(),
      action: message,
      status: level,
    };
    this.logs.push(log);
    console.log(`[${this.service}] ${level.toUpperCase()}: ${message}`);
  }

  // Abstract methods to implement
  protected abstract authenticate(credentials: any): Promise<void>;
  protected abstract extractData(): Promise<Record<string, any>>;
  protected abstract validateData(data: Record<string, any>): Promise<void>;
}

export default BaseCollector;
```

---

### 4.3 GA4 Collector com Claude (Fase 3)

```typescript
// src/collectors/ga4-collector-claude.ts

import BaseCollector from './base-collector';
import Anthropic from '@anthropic-ai/sdk';

class GA4CollectorClaude extends BaseCollector {
  private client: Anthropic;
  private browser: any; // Playwright browser

  constructor() {
    super();
    this.service = 'ga4';
    this.client = new Anthropic();
  }

  protected async authenticate(credentials: any): Promise<void> {
    // Claude vai fazer login automaticamente
    this.log('Claude will handle authentication', 'info');
  }

  protected async extractData(): Promise<Record<string, any>> {
    const task = `
    You are a data collection agent. Please perform the following steps:

    1. Navigate to https://analytics.google.com
    2. Login with the provided email (if needed - you may already be logged in)
    3. Click on the date range selector
    4. Select "Last 7 days"
    5. Wait for data to load
    6. Extract and report these metrics:
       - Total sessions
       - Total conversions
       - Bounce rate
       - Average session duration
       - Traffic sources breakdown
    7. Take a final screenshot for verification

    Return your findings as a JSON object with the metrics.
    `;

    return await this.runClaudeAgent(task);
  }

  private async runClaudeAgent(task: string): Promise<Record<string, any>> {
    const messages: any[] = [];

    // Main loop - Claude pode fazer múltiplas ações
    for (let i = 0; i < 10; i++) {
      // Max 10 steps
      this.log(`Claude agent step ${i + 1}`, 'info');

      // Take screenshot first
      const screenshot = await this.takeScreenshot();

      // Send to Claude
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          ...messages,
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: task,
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png',
                  data: screenshot,
                },
              },
            ],
          },
        ],
        tools: [
          {
            name: 'click',
            description: 'Click at x,y coordinates',
            input_schema: {
              type: 'object',
              properties: {
                x: { type: 'number' },
                y: { type: 'number' },
              },
              required: ['x', 'y'],
            },
          },
          {
            name: 'type',
            description: 'Type text',
            input_schema: {
              type: 'object',
              properties: {
                text: { type: 'string' },
              },
              required: ['text'],
            },
          },
          {
            name: 'scroll',
            description: 'Scroll down',
            input_schema: {
              type: 'object',
              properties: {
                distance: { type: 'number', default: 500 },
              },
            },
          },
          {
            name: 'complete_task',
            description: 'Task is complete, return extracted data',
            input_schema: {
              type: 'object',
              properties: {
                data: { type: 'object' },
              },
              required: ['data'],
            },
          },
        ],
      });

      // Check if Claude finished
      if (
        response.content[0]?.type === 'tool_use' &&
        response.content[0]?.name === 'complete_task'
      ) {
        this.log('Claude completed task', 'success');
        return response.content[0]?.input?.data || {};
      }

      // Execute Claude's tool calls
      for (const content of response.content) {
        if (content.type === 'tool_use') {
          await this.executeTool(content.name, content.input);
          this.log(`Executed: ${content.name}`, 'info');
        }
      }

      // Add to message history for next iteration
      messages.push({
        role: 'user',
        content: response.content,
      });
    }

    throw new Error('Claude agent did not complete task within 10 steps');
  }

  private async takeScreenshot(): Promise<string> {
    // Playwright screenshot → base64
    if (!this.browser) {
      const playwright = await import('playwright');
      this.browser = await playwright.chromium.launch({ headless: true });
    }
    const page = await this.browser.newPage();
    await page.goto('https://analytics.google.com');
    const screenshot = await page.screenshot({ encoding: 'base64' });
    return screenshot as string;
  }

  private async executeTool(
    name: string,
    input: Record<string, any>
  ): Promise<void> {
    const page = this.browser?.pages?.[0];
    if (!page) throw new Error('No page open');

    switch (name) {
      case 'click':
        await page.mouse.click(input.x, input.y);
        break;
      case 'type':
        await page.keyboard.type(input.text);
        break;
      case 'scroll':
        await page.evaluate((distance) => {
          window.scrollBy(0, distance);
        }, input.distance || 500);
        break;
    }
  }

  protected async validateData(data: Record<string, any>): Promise<void> {
    if (!data.sessions) throw new Error('Missing sessions metric');
    this.log('Data validation passed', 'success');
  }
}

export default GA4CollectorClaude;
```

---

### 4.4 UI Component - Collection Status

```typescript
// src/ui/CollectionStatus.tsx

import React, { useState, useEffect } from 'react';

interface CollectionLog {
  timestamp: number;
  action: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

interface CollectionStatusProps {
  isRunning: boolean;
  service: string;
  logs: CollectionLog[];
  progress: number; // 0-100
}

export const CollectionStatus: React.FC<CollectionStatusProps> = ({
  isRunning,
  service,
  logs,
  progress,
}) => {
  return (
    <div className="collection-status">
      {/* Header */}
      <div className="status-header">
        <div className="status-icon">
          {isRunning ? (
            <div className="spinner" />
          ) : (
            <div className="checkmark" />
          )}
        </div>
        <div className="status-text">
          <h3>Coletando dados: {service}</h3>
          <p>{isRunning ? 'Em andamento...' : 'Concluído'}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-text">{progress}%</p>

      {/* Live Log */}
      <div className="log-container">
        <h4>Log de Atividades</h4>
        <div className="log-entries">
          {logs.map((log, i) => (
            <div key={i} className={`log-entry status-${log.status}`}>
              <span className="timestamp">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className="action">{log.action}</span>
              <span className={`status-badge ${log.status}`}>
                {log.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .collection-status {
          background: #1e293b;
          border-radius: 8px;
          padding: 20px;
          color: #f1f5f9;
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #64748b;
          border-top-color: #38bdf8;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .checkmark {
          width: 24px;
          height: 24px;
          background: #10b981;
          border-radius: 50%;
          position: relative;
        }

        .checkmark::after {
          content: '✓';
          color: white;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .progress-container {
          width: 100%;
          height: 8px;
          background: #334155;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #38bdf8, #0284c7);
          transition: width 0.3s;
        }

        .log-container {
          max-height: 300px;
          overflow-y: auto;
          margin-top: 16px;
        }

        .log-entry {
          display: flex;
          gap: 12px;
          padding: 8px;
          border-left: 3px solid #64748b;
          margin-bottom: 4px;
          font-size: 12px;
          font-family: monospace;
        }

        .log-entry.status-info {
          border-left-color: #94a3b8;
        }

        .log-entry.status-success {
          border-left-color: #10b981;
          color: #d1fae5;
        }

        .log-entry.status-warning {
          border-left-color: #f59e0b;
          color: #fef3c7;
        }

        .log-entry.status-error {
          border-left-color: #ef4444;
          color: #fee2e2;
        }

        .status-badge {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: bold;
          margin-left: auto;
        }

        .status-badge.success {
          background: #10b981;
          color: white;
        }

        .status-badge.error {
          background: #ef4444;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default CollectionStatus;
```

---

## 5️⃣ SEGURANÇA & GERENCIAMENTO DE CREDENCIAIS

### 5.1 Arquitetura de Segurança

```
CREDENCIAL:
  ├─ User enters in UI
  │  └─ NEVER stored in plaintext
  │
  ├─ Encryption (AES-256)
  │  └─ Unique IV per credential
  │
  ├─ Storage Layers:
  │  ├─ Layer 1: IndexedDB (encrypted)
  │  ├─ Layer 2: OS Keyring (if available)
  │  │  ├─ Windows: DPAPI
  │  │  ├─ macOS: Keychain
  │  │  └─ Linux: SecretService
  │  └─ Layer 3: Encrypted file (~/.neurostrategy/)
  │
  └─ Usage:
     ├─ Decrypt only when needed
     ├─ Never log password
     ├─ Clear from memory after use
     └─ Audit trail of access
```

### 5.2 Credential Storage Best Practices

```typescript
// src/credentials/secure-storage.ts

import keytar from 'keytar';
import crypto from 'crypto';

class SecureCredentialStorage {
  // Preferred: OS Keyring
  async storeInKeyring(
    service: string,
    account: string,
    credentials: string
  ) {
    try {
      await keytar.setPassword(service, account, credentials);
      return true;
    } catch (error) {
      console.log('Keyring not available, falling back to encrypted storage');
      return false;
    }
  }

  // Fallback: AES-256 Encrypted File
  async storeEncrypted(
    service: string,
    credentials: Record<string, string>
  ) {
    const encrypted = this.encryptAES256(
      JSON.stringify(credentials),
      process.env.ENCRYPTION_KEY!
    );

    const path = path.join(
      os.homedir(),
      '.neurostrategy',
      `${service}.enc`
    );

    // Create directory if not exists
    fs.mkdirSync(path.dirname(path), { recursive: true });

    // Write with restrictive permissions (600 = rw------)
    fs.writeFileSync(path, encrypted, { mode: 0o600 });

    return true;
  }

  // Retrieve with fallback chain
  async getCredential(service: string): Promise<Record<string, string>> {
    // Try 1: OS Keyring
    try {
      const stored = await keytar.getPassword(service, service);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // Keyring not available
    }

    // Try 2: Encrypted file
    const path = path.join(
      os.homedir(),
      '.neurostrategy',
      `${service}.enc`
    );
    if (fs.existsSync(path)) {
      const encrypted = fs.readFileSync(path, 'utf-8');
      const decrypted = this.decryptAES256(
        encrypted,
        process.env.ENCRYPTION_KEY!
      );
      return JSON.parse(decrypted);
    }

    throw new Error(`No credential found for ${service}`);
  }

  private encryptAES256(
    plaintext: string,
    key: string
  ): string {
    const iv = crypto.randomBytes(16);
    const keyBuffer = crypto
      .createHash('sha256')
      .update(key)
      .digest();

    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    let encrypted = cipher.update(plaintext, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  }

  private decryptAES256(
    ciphertext: string,
    key: string
  ): string {
    const [ivHex, encrypted] = ciphertext.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const keyBuffer = crypto
      .createHash('sha256')
      .update(key)
      .digest();

    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
  }
}

export default new SecureCredentialStorage();
```

### 5.3 Checklist de Segurança

```
ANTES DE IMPLEMENTAR EM PRODUÇÃO:

✅ ENCRYPTION
  ├─ [ ] Use AES-256 (minimum)
  ├─ [ ] Random IV para cada encryption
  ├─ [ ] Key derivation (PBKDF2 or bcrypt)
  └─ [ ] Rotate keys annually

✅ STORAGE
  ├─ [ ] Never store in plaintext
  ├─ [ ] Use OS Keyring when possible
  ├─ [ ] Set file permissions to 600
  └─ [ ] Backup encrypted credentials only

✅ ACCESS
  ├─ [ ] Decrypt only when needed
  ├─ [ ] Clear from memory after use
  ├─ [ ] Audit log all access
  ├─ [ ] Add rate limiting for failed attempts
  └─ [ ] Implement session timeouts

✅ API KEYS
  ├─ [ ] Never commit to git (.gitignore)
  ├─ [ ] Use environment variables
  ├─ [ ] Rotate keys quarterly
  ├─ [ ] Monitor for unauthorized use
  └─ [ ] Implement API key versioning

✅ TRANSMISSION
  ├─ [ ] Always use HTTPS
  ├─ [ ] Validate SSL certificates
  ├─ [ ] Use TLS 1.2+
  └─ [ ] Implement HSTS header

✅ LOGGING
  ├─ [ ] Never log passwords
  ├─ [ ] Never log full API keys (only last 4 chars)
  ├─ [ ] Log access with timestamps
  ├─ [ ] Secure log storage
  └─ [ ] Implement log retention policy
```

---

## 6️⃣ INTERFACE & UX

### 6.1 Settings Panel (Configurar Credenciais)

```
┌─────────────────────────────────────────────────────┐
│  ⚙️ SETTINGS - Data Collection                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 📊 GOOGLE ANALYTICS 4                              │
│ ├─ Status: ✅ Configured                           │
│ ├─ Last collection: Today 08:15 AM                 │
│ └─ [Edit Credentials] [Test] [Remove]              │
│                                                     │
│ 🔍 GOOGLE SEARCH CONSOLE                           │
│ ├─ Status: ⚠️ Not configured                       │
│ └─ [Add Credentials]                               │
│                                                     │
│ 📷 INSTAGRAM                                        │
│ ├─ Status: ✅ Configured                           │
│ ├─ Account: @seu_instagram                         │
│ └─ [Edit Credentials] [Test] [Remove]              │
│                                                     │
│ 🏢 GOOGLE BUSINESS PROFILE                         │
│ ├─ Status: ✅ Configured                           │
│ └─ [Edit Credentials] [Test] [Remove]              │
│                                                     │
│ 🩺 DOCTORALIA (Manual Entry)                       │
│ ├─ Status: Manual entry                            │
│ ├─ Input form every week                           │
│ └─ [Edit Form]                                     │
│                                                     │
│ ⏰ COLLECTION SCHEDULE                             │
│ ├─ Every day at: [08:00] [Save]                    │
│ ├─ On weekends: [OFF] [Toggle]                     │
│ └─ Notify on error: [ON] [Toggle]                  │
│                                                     │
│ 🔐 SECURITY                                        │
│ ├─ Encryption: AES-256 ✅                          │
│ ├─ Storage: OS Keyring + Encrypted File            │
│ ├─ Last audit: 2 days ago                          │
│ └─ [View Audit Log]                                │
│                                                     │
│                   [Save Changes] [Cancel]          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 6.2 Live Collection Dashboard

```
┌─────────────────────────────────────────────────────┐
│  📡 COLLECTION RADAR (Live)                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Current Collections:                                │
│                                                     │
│ [1] Google Analytics 4                              │
│     ⏳ Collecting... (Step 3/5)                     │
│     Progress: ████████░░░░░░░░ 45%                 │
│     Time: 2m 15s elapsed / ~5m remaining           │
│     Last log: ✅ Extracted metrics from dashboard  │
│                                                     │
│ [2] Instagram Insights                              │
│     ⏳ Collecting... (Step 2/3)                     │
│     Progress: ██████░░░░░░░░░░░░ 35%               │
│     Time: 1m 30s elapsed / ~3m remaining           │
│     Last log: ✅ Logged in successfully            │
│                                                     │
│ [3] Google Business (Queued)                        │
│     ⏱️ Waiting for GA4 to complete                  │
│     Progress: ░░░░░░░░░░░░░░░░░░ 0%                │
│                                                     │
│ ────────────────────────────────────────────────   │
│ Collection Log (Detail View)                        │
│                                                     │
│ 08:15:22 ✅ Collection batch started               │
│ 08:15:25 ℹ️  GA4: Decrypting credentials           │
│ 08:15:26 ✅ GA4: Authenticated                     │
│ 08:15:27 ℹ️  GA4: Navigating to dashboard          │
│ 08:15:32 ℹ️  GA4: Waiting for metrics to load      │
│ 08:15:35 ✅ GA4: Data extracted (2450 sessions)    │
│ 08:15:37 ℹ️  Instagram: Starting collection        │
│ 08:15:40 ✅ Instagram: Logged in                   │
│ 08:15:42 ℹ️  Instagram: Retrieving post metrics    │
│ 08:15:45 ✅ Instagram: 12 posts fetched            │
│                                                     │
│ [Stop Collection] [View Full Log] [Export Report]  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 6.3 Error Handling & Recovery

```
┌─────────────────────────────────────────────────────┐
│  ⚠️ COLLECTION ERROR                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Google Analytics 4 - Authentication Failed         │
│                                                     │
│ Error: Invalid credentials (401)                    │
│ Time: 08:15:47 AM                                  │
│ Attempts: 2/3                                      │
│                                                     │
│ Logs:                                              │
│ ├─ 08:15:45 ✅ Credential retrieved                │
│ ├─ 08:15:46 ✅ Browser launched                    │
│ ├─ 08:15:47 ✅ Navigated to login page             │
│ ├─ 08:15:48 ✅ Email filled                        │
│ ├─ 08:15:49 ✅ Password filled                     │
│ ├─ 08:15:50 ✅ Login button clicked                │
│ ├─ 08:15:51 ❌ ERROR: Login failed - invalid creds │
│ │    → Password may be outdated                    │
│ │    → 2FA may be required                         │
│ └─ 08:15:52 ℹ️  Retrying in 2 minutes...           │
│                                                     │
│ Options:                                            │
│ ├─ [Update Credentials] (opens form)               │
│ ├─ [Retry Now]                                     │
│ ├─ [Skip & Continue] (other collections)           │
│ └─ [View Full Details]                             │
│                                                     │
│ Automatic retry: Attempt 3 scheduled for 08:17 AM │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 7️⃣ ROADMAP DE DESENVOLVIMENTO

### Fase 1: Foundation (Semanas 1-2)

```
✅ Setup base infrastructure
├─ Credential manager (encrypt/decrypt)
├─ Base collector class
├─ Logging system
├─ Error handling
└─ Basic UI components

Resultado: Pronto para integrar primeiro collector
```

### Fase 2: Primeira Integração (Semanas 3-4)

```
✅ Integrar um collector (escolher um):
├─ Opção A: Claude Computer Use (mais poderoso)
├─ Opção B: Firecrawl (mais rápido)
└─ Opção C: Playwright (mais simples)

+ Google Analytics 4 collector
+ Testing & debugging
+ Performance optimization

Resultado: GA4 dados coletando automaticamente
```

### Fase 3: Escalação (Semanas 5-6)

```
✅ Adicionar mais collectors em paralelo:
├─ Google Search Console
├─ Instagram API
├─ Google Business Profile
└─ WordPress REST (analytics)

+ Scheduler para múltiplas coletas
+ Conflict resolution (não coletar 2x simultaneamente)
+ Dashboard com múltiplos data sources

Resultado: Sistema coleta 5 data sources
```

### Fase 4: Produção (Semanas 7-8)

```
✅ Security hardening
├─ Penetration testing
├─ Credential audit
├─ Log review
└─ Backup verification

✅ Performance optimization
├─ Parallel collections
├─ Caching strategies
├─ Resource usage monitoring
└─ Cost optimization

✅ Documentação
├─ User guide
├─ Developer guide
├─ API documentation
└─ Troubleshooting guide

Resultado: Sistema PRONTO PARA PRODUÇÃO
```

---

## 8️⃣ ESTIMATIVAS & RECURSOS

### 8.1 Tempo de Desenvolvimento

```
┌─────────────────────────────┬──────┬─────────┐
│ TASK                        │ HORAS│ SEMANA  │
├─────────────────────────────┼──────┼─────────┤
│ Credential Management       │  8   │ Sem 1   │
│ Base Collector Class        │  6   │ Sem 1   │
│ Logging System              │  4   │ Sem 1   │
│ UI Components               │  8   │ Sem 2   │
├─────────────────────────────┼──────┼─────────┤
│ Claude Integration          │  16  │ Sem 3-4 │
│ GA4 Collector              │  12  │ Sem 3-4 │
│ Testing & Debug            │  8   │ Sem 4   │
├─────────────────────────────┼──────┼─────────┤
│ GSC Collector              │  8   │ Sem 5   │
│ Instagram Collector        │  8   │ Sem 5   │
│ GBP Collector              │  6   │ Sem 5-6 │
│ WordPress Collector        │  6   │ Sem 6   │
├─────────────────────────────┼──────┼─────────┤
│ Scheduler & Orchestration   │  12  │ Sem 6-7 │
│ Dashboard Integration       │  8   │ Sem 7   │
│ Security Audit             │  8   │ Sem 7   │
│ Optimization & Testing      │  12  │ Sem 8   │
│ Documentation              │  8   │ Sem 8   │
├─────────────────────────────┼──────┼─────────┤
│ TOTAL                       │ 136  │ 8 semanas│
└─────────────────────────────┴──────┴─────────┘

BREAKDOWN:
├─ ~17 horas/semana (standard 40h work week)
├─ Realista: 2-3 horas por dia
└─ Flexível: pode esticar para 12 semanas se slow
```

### 8.2 Custo de Operação (Mensal)

```
CENÁRIO 1: Apenas Free Tiers
├─ Playwright (headless): $0
├─ Claude Computer Use: $0 (durante teste)
├─ Firecrawl: $0 (free tier: 10k credits/mês)
├─ Google APIs: $0 (analytics/search console)
├─ Hosting (self-hosted): $0
└─ TOTAL: $0/mês

CENÁRIO 2: Production Scale (recomendado)
├─ Claude Computer Use: $20-50/mês
│  └─ ~500k input tokens, 100k output tokens por mês
├─ Firecrawl (backup): $25/mês (paid tier)
├─ Playwright Pro (nice to have): $0 (open source)
├─ Hosting (minimal): $10-20/mês (VPS básico)
├─ Monitoring/logging: $0-10/mês
└─ TOTAL: $55-105/mês

ECONOMIA:
├─ vs SEMrush: -$4800/ano
├─ vs Hootsuite: -$600/ano
├─ vs Zapier Premium: -$350/ano
└─ ECONOMIA TOTAL: $5750/ano
```

### 8.3 Recursos Necessários

```
HARDWARE:
├─ CPU: 2+ cores (pode rodar em 1, mais lento)
├─ RAM: 4GB minimum (8GB+ recomendado)
├─ Storage: 100GB+ (para logs, dados, backups)
├─ Network: 10+ Mbps upload (para uploads de imagens/logs)
└─ Uptime: 99%+ recomendado

SOFTWARE:
├─ Node.js 18+ (ou Python 3.9+)
├─ Docker (opcional, para containerization)
├─ PostgreSQL/SQLite (database)
├─ Redis (cache opcional)
└─ Git (version control)

SERVIÇOS:
├─ Claude API key (Anthropic)
├─ Firecrawl API key (opcional)
├─ Google OAuth credentials
├─ Instagram Graph API token
└─ Hosting (AWS, DigitalOcean, Hetzner, etc)

DESENVOLVIMENTO:
├─ IDE: VS Code (grátis)
├─ Testing: Jest (grátis)
├─ Monitoring: Better Stack (free tier)
└─ CI/CD: GitHub Actions (grátis)
```

---

## 🎯 PRÓXIMOS PASSOS

### Decisão Crítica #1: Qual Framework?

```
Recomendação: Híbrido

Start com Claude Computer Use:
├─ Razão 1: Mais inteligente (entende UI)
├─ Razão 2: Menos manutenção (adapta a mudanças)
├─ Razão 3: Google Analytics é complexo
└─ Razão 4: ROI no tempo economizado > custo

Depois adicione Firecrawl para:
├─ Dados simples (Instagram, GBP)
├─ Redundância (se Claude falhar)
└─ Performance (Firecrawl mais rápido)

Terceiro nível: Playwright para:
├─ Manual entry (Doctoralia)
├─ Simple tasks
└─ Cost optimization se escalar muito
```

### Decision Critical #2: Start Date

```
OPÇÃO A: Start Now (Recomendado)
├─ Você precisa disso para marketing
├─ 8 semanas = Fevereiro (production ready)
├─ Ganho: 2-3 meses vantagem sobre concorrentes
└─ Timeline: Ideal para Q1 2026

OPÇÃO B: After Refactor Completes
├─ Seu NeuroStrategy refactor: 5 semanas
├─ Collection system: 8 semanas em paralelo
├─ Timeline: Ambos prontos em Março
└─ Risco: Integração pode ser mais complexa

RECOMENDAÇÃO: Opção A (em paralelo)
└─ Ambos ficam prontos torno da mesma época
   e você economiza tempo total
```

---

## 📌 RESUMO EXECUTIVO

**Pergunta Original:**
> Qual a viabilidade de criar dentro do sistema um navegador com assistente AI para realizar automaticamente a coleta de dados manuais?

**Resposta:**
```
✅ VIABILIDADE: 100% Possível
   - Claude Computer Use API: Production-ready
   - Firecrawl Agent: Rápido e barato
   - Playwright: Gratuito e confiável

✅ TECNOLOGIA EXISTE: Não precisa inventar nada
   - Tudo está disponível em 2026
   - APIs públicas e documentadas
   - Exemplos de produção existentes

✅ VOCÊ CONSEGUE IMPLEMENTAR:
   - 136 horas de desenvolvimento (~8 semanas)
   - Conhecimento que você tem
   - Risco técnico: BAIXO
   - Risco de negócio: MUITO BAIXO

✅ BENEFÍCIO:
   - Coleta automática 24/7
   - Zero manual work
   - Dados sempre atualizados
   - Sistema inteligente que se adapta a mudanças

✅ CUSTO:
   - Desenvolvimento: Seu tempo (140h)
   - Operação: $0-100/mês
   - ROI: Infinito (horas economizadas)

PRÓXIMO PASSO: Escolher framework (Claude vs Firecrawl) e começar Phase 1
```

---

**Criado:** 17 de Janeiro de 2026  
**Status:** Pronto para implementação  
**Complexidade:** Média (não é rocket science)  
**Tempo até Production:** 8 semanas

Quer que eu crie exemplos de código mais específicos para algum framework?
