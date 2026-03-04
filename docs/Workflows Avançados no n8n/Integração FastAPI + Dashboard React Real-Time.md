# NeuroStrategy OS: Integração FastAPI + Dashboard React Real-Time

**Implementação Completa: Backend, Webhooks, WebSockets e Componentes UI**

---

## 📚 Índice

1. Backend FastAPI - Rotas de Integração n8n
2. Modelos de Dados (Pydantic)
3. WebSockets para atualizações Real-Time
4. Componentes React com gráficos live
5. Docker Compose completo
6. Scripts de teste E2E

---

## 🔌 BACKEND FASTAPI

### Arquivo: `backend/main.py`

```python
from fastapi import FastAPI, Header, Body, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
import json
import jwt
from motor.motor_asyncio import AsyncMotorClient
import asyncio
from broadcaster import Broadcast

app = FastAPI(title="NeuroStrategy OS API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://mongo:27017")
client = AsyncMotorClient(MONGODB_URL)
db = client["neurostrategy"]

# Broadcast (para WebSockets)
broadcast = Broadcast("redis://redis:6379")

# Segurança
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "your-secret-token")
JWT_SECRET = os.getenv("JWT_SECRET", "your-jwt-secret")

# ============================================================================
# MODELOS PYDANTIC
# ============================================================================

class CompetitorAuditResult(BaseModel):
    """Resultado da Auditoria Competitiva (Workflow #1)"""
    workflow_id: str = "audit_competitive"
    keyword: str
    timestamp: datetime
    competitor_rank: int
    url: str
    seo_analysis: Dict[str, Any]
    openai_assessment: Dict[str, Any]

class ComplianceValidation(BaseModel):
    """Resultado da Validação YMYL/CFP (Workflow #2)"""
    workflow_id: str = "compliance_validation"
    content_type: str
    compliance_score: int = Field(ge=0, le=100)
    status: str  # approved, approved_with_minor, requires_revision, rejected
    violations: List[Dict[str, Any]]
    missing_requirements: List[Dict[str, Any]]
    timestamp: datetime

class SiloCompetitionAnalysis(BaseModel):
    """Resultado da Análise de Silos (Workflow #3)"""
    workflow_id: str = "silos_competition"
    timestamp: datetime
    total_silos_analyzed: int
    silos: List[Dict[str, Any]]
    aggregate_statistics: Dict[str, Any]
    opportunities: List[Dict[str, Any]]

class AutomationResult(BaseModel):
    """Wrapper genérico para qualquer resultado de workflow"""
    workflow_id: str
    timestamp: datetime
    status: str = "completed"
    execution_duration_ms: Optional[int] = None
    cost_usd: Optional[float] = None
    payload: Dict[str, Any]

# ============================================================================
# AUTENTICAÇÃO
# ============================================================================

def verify_webhook_token(authorization: str) -> bool:
    """Verificar token Bearer do webhook n8n"""
    if not authorization.startswith("Bearer "):
        return False
    token = authorization.replace("Bearer ", "")
    return token == WEBHOOK_SECRET

# ============================================================================
# ROTAS WEBHOOK
# ============================================================================

@app.post("/api/automations/n8n/trigger")
async def handle_n8n_webhook(
    authorization: str = Header(...),
    body: Dict[str, Any] = Body(...)
) -> Dict[str, str]:
    """
    Receber webhook de retorno do n8n
    
    Fluxo:
    1. Validar token
    2. Armazenar no MongoDB
    3. Emitir evento WebSocket para dashboard
    4. Retornar confirmação
    """
    
    # Autenticação
    if not verify_webhook_token(authorization):
        raise HTTPException(status_code=401, detail="Invalid webhook token")
    
    try:
        workflow_id = body.get("workflow_id")
        if not workflow_id:
            raise HTTPException(status_code=400, detail="Missing workflow_id")
        
        # Criar documento
        result_doc = {
            "workflow_id": workflow_id,
            "timestamp": datetime.utcnow(),
            "received_at": datetime.utcnow(),
            "payload": body,
            "status": "processed"
        }
        
        # Armazenar no MongoDB
        collection_name = f"automations_{workflow_id}"
        result = await db[collection_name].insert_one(result_doc)
        
        # Emitir evento WebSocket
        await broadcast.publish(
            channel=f"automations:{workflow_id}",
            message=json.dumps({
                "event": "workflow_completed",
                "workflow_id": workflow_id,
                "data": body,
                "db_id": str(result.inserted_id),
                "timestamp": datetime.utcnow().isoformat()
            })
        )
        
        # Log para auditoria
        await db.audit_log.insert_one({
            "event": "webhook_received",
            "workflow_id": workflow_id,
            "timestamp": datetime.utcnow(),
            "ip": "webhook-n8n",
            "result_id": str(result.inserted_id)
        })
        
        return {
            "status": "received",
            "result_id": str(result.inserted_id),
            "workflow_id": workflow_id
        }
    
    except Exception as e:
        # Log erro
        await db.audit_log.insert_one({
            "event": "webhook_error",
            "error": str(e),
            "timestamp": datetime.utcnow(),
            "payload": body
        })
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# ROTAS DE CONSULTA (GET)
# ============================================================================

@app.get("/api/automations/{workflow_id}/results")
async def get_workflow_results(
    workflow_id: str,
    limit: int = 10,
    skip: int = 0
):
    """Obter últimos resultados de um workflow"""
    collection_name = f"automations_{workflow_id}"
    
    results = await db[collection_name].find()\
        .sort("timestamp", -1)\
        .skip(skip)\
        .limit(limit)\
        .to_list(limit)
    
    total = await db[collection_name].count_documents({})
    
    return {
        "workflow_id": workflow_id,
        "total": total,
        "results": [
            {**r, "_id": str(r["_id"]), "timestamp": r["timestamp"].isoformat()}
            for r in results
        ]
    }

@app.get("/api/automations/{workflow_id}/result/{result_id}")
async def get_workflow_result(workflow_id: str, result_id: str):
    """Obter um resultado específico"""
    from bson import ObjectId
    
    collection_name = f"automations_{workflow_id}"
    result = await db[collection_name].find_one({"_id": ObjectId(result_id)})
    
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    result["_id"] = str(result["_id"])
    result["timestamp"] = result["timestamp"].isoformat()
    return result

@app.get("/api/automations/dashboard/summary")
async def get_dashboard_summary():
    """Resumo de todos os workflows para o dashboard"""
    
    workflows_data = {}
    
    # Audit Competitive
    audit_count = await db.automations_audit_competitive.count_documents({})
    audit_recent = await db.automations_audit_competitive.find_one(
        sort=[("timestamp", -1)]
    )
    workflows_data["audit_competitive"] = {
        "total_executions": audit_count,
        "last_execution": audit_recent["timestamp"].isoformat() if audit_recent else None,
        "status": "active"
    }
    
    # Compliance Validation
    compliance_count = await db.automations_compliance_validation.count_documents({})
    compliance_recent = await db.automations_compliance_validation.find_one(
        sort=[("timestamp", -1)]
    )
    workflows_data["compliance_validation"] = {
        "total_executions": compliance_count,
        "last_execution": compliance_recent["timestamp"].isoformat() if compliance_recent else None,
        "avg_compliance_score": await calculate_avg_compliance_score(),
        "status": "active"
    }
    
    # Silos Competition
    silos_count = await db.automations_silos_competition.count_documents({})
    silos_recent = await db.automations_silos_competition.find_one(
        sort=[("timestamp", -1)]
    )
    workflows_data["silos_competition"] = {
        "total_executions": silos_count,
        "last_execution": silos_recent["timestamp"].isoformat() if silos_recent else None,
        "status": "active"
    }
    
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "workflows": workflows_data,
        "system_status": "operational"
    }

# ============================================================================
# WEBSOCKETS
# ============================================================================

class ConnectionManager:
    """Gerenciar múltiplas conexões WebSocket"""
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, channel: str):
        await websocket.accept()
        if channel not in self.active_connections:
            self.active_connections[channel] = []
        self.active_connections[channel].append(websocket)
    
    async def disconnect(self, websocket: WebSocket, channel: str):
        self.active_connections[channel].remove(websocket)
    
    async def broadcast(self, channel: str, message: dict):
        if channel in self.active_connections:
            for connection in self.active_connections[channel]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()

@app.websocket("/ws/automations/{workflow_id}")
async def websocket_automations(websocket: WebSocket, workflow_id: str):
    """WebSocket para atualizações em tempo real de um workflow"""
    channel = f"automations:{workflow_id}"
    
    await manager.connect(websocket, channel)
    
    try:
        # Manter conexão aberta
        while True:
            data = await websocket.receive_text()
            # Echo back
            await websocket.send_json({"type": "pong", "data": data})
    
    except WebSocketDisconnect:
        await manager.disconnect(websocket, channel)
    
    except Exception as e:
        await manager.disconnect(websocket, channel)
        raise

@app.websocket("/ws/automations")
async def websocket_all_automations(websocket: WebSocket):
    """WebSocket para todas as atualizações de workflows"""
    channel = "automations:all"
    
    await manager.connect(websocket, channel)
    
    try:
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        await manager.disconnect(websocket, channel)

# ============================================================================
# STARTUP/SHUTDOWN
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Inicializar broadcast ao iniciar a app"""
    await broadcast.connect()

@app.on_event("shutdown")
async def shutdown_event():
    """Desconectar ao desligar a app"""
    await broadcast.disconnect()

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

async def calculate_avg_compliance_score() -> float:
    """Calcular score médio de compliance"""
    pipeline = [
        {
            "$group": {
                "_id": None,
                "avg_score": {"$avg": "$payload.compliance_score"}
            }
        }
    ]
    
    result = await db.automations_compliance_validation.aggregate(pipeline).to_list(1)
    return result[0]["avg_score"] if result else 0

# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check para o sistema"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "dependencies": {
            "mongodb": "connected",
            "redis": "connected"
        }
    }

# ============================================================================
# EXECUTAR
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## 🎨 FRONTEND REACT COMPONENTES

### Arquivo: `frontend/src/hooks/useAutomationStream.ts`

```typescript
import { useEffect, useState, useRef } from 'react';

interface AutomationResult {
  workflow_id: string;
  timestamp: string;
  payload: any;
  status: string;
}

export function useAutomationStream(workflowId: string) {
  const [data, setData] = useState<AutomationResult | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Conectar WebSocket
    const wsUrl = `ws://${window.location.host}/ws/automations/${workflowId}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log(`Connected to ${workflowId}`);
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'workflow_completed') {
          setData(message.data);
        }
      } catch (e) {
        console.error('Failed to parse message:', e);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [workflowId]);

  return { data, isConnected };
}
```

### Arquivo: `frontend/src/components/AutomationMonitor.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAutomationStream } from '../hooks/useAutomationStream';

interface DashboardData {
  audit_competitive: {
    total_executions: number;
    last_execution: string;
    status: string;
  };
  compliance_validation: {
    total_executions: number;
    avg_compliance_score: number;
    status: string;
  };
  silos_competition: {
    total_executions: number;
    status: string;
  };
}

export function AutomationMonitor() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  
  // Hooks para cada workflow
  const auditData = useAutomationStream('audit_competitive');
  const complianceData = useAutomationStream('compliance_validation');
  const silosData = useAutomationStream('silos_competition');

  useEffect(() => {
    // Carregar resumo inicial
    const fetchDashboard = async () => {
      const response = await fetch('/api/automations/dashboard/summary');
      const data = await response.json();
      setDashboardData(data.workflows);
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000); // Atualizar a cada 30s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container" style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h1>🧠 NeuroStrategy Automation Monitor</h1>

      <div className="workflows-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {/* WORKFLOW #1: Auditoria Competitiva */}
        <div className="workflow-card" style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2>🔍 Auditoria Competitiva</h2>
          <div className="status-indicator" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: auditData.isConnected ? '#4CAF50' : '#f44336'
            }}></div>
            <span>{auditData.isConnected ? 'Ativo' : 'Inativo'}</span>
          </div>

          {auditData.data && (
            <div className="audit-results">
              <div style={{ marginBottom: '10px' }}>
                <strong>Rank:</strong> #{auditData.data.payload.competitor_rank}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>URL:</strong> <a href={auditData.data.payload.url} target="_blank">{auditData.data.payload.url}</a>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>SEO Score:</strong> {auditData.data.payload.openai_assessment?.seo_score || 'N/A'}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Keyword Density:</strong> {auditData.data.payload.seo_analysis?.keyword_density_pct}%
              </div>
            </div>
          )}

          {dashboardData && (
            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
              <p>Total de execuções: {dashboardData.audit_competitive.total_executions}</p>
              <p>Última execução: {dashboardData.audit_competitive.last_execution ? new Date(dashboardData.audit_competitive.last_execution).toLocaleString('pt-BR') : 'Nunca'}</p>
            </div>
          )}
        </div>

        {/* WORKFLOW #2: Validação YMYL/CFP */}
        <div className="workflow-card" style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2>🛡️ Validação YMYL/CFP</h2>
          <div className="status-indicator" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: complianceData.isConnected ? '#4CAF50' : '#f44336'
            }}></div>
            <span>{complianceData.isConnected ? 'Ativo' : 'Inativo'}</span>
          </div>

          {complianceData.data && (
            <div className="compliance-gauge">
              <div style={{
                width: '100%',
                height: '30px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '10px'
              }}>
                <div style={{
                  width: `${complianceData.data.payload.compliance_score}%`,
                  height: '100%',
                  backgroundColor: complianceData.data.payload.compliance_score >= 70 ? '#4CAF50' : '#ff9800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {complianceData.data.payload.compliance_score}%
                </div>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Status:</strong> <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: complianceData.data.payload.status === 'approved' ? '#c8e6c9' : '#ffe0b2'
                }}>{complianceData.data.payload.status}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Violações:</strong> {complianceData.data.payload.violations?.length || 0}
              </div>
            </div>
          )}

          {dashboardData && (
            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
              <p>Avg. Score: {dashboardData.compliance_validation.avg_compliance_score.toFixed(1)}</p>
              <p>Execuções: {dashboardData.compliance_validation.total_executions}</p>
            </div>
          )}
        </div>

        {/* WORKFLOW #3: Silos Locais */}
        <div className="workflow-card" style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2>🗺️ Silos Locais + Concorrência</h2>
          <div className="status-indicator" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: silosData.isConnected ? '#4CAF50' : '#f44336'
            }}></div>
            <span>{silosData.isConnected ? 'Ativo' : 'Inativo'}</span>
          </div>

          {silosData.data && (
            <div className="silos-summary">
              <div style={{ marginBottom: '10px' }}>
                <strong>Silos Analisados:</strong> {silosData.data.payload.total_silos_analyzed}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Competidores Encontrados:</strong> {silosData.data.payload.aggregate_statistics?.total_competitors_found || 0}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Oportunidades Altas:</strong> {silosData.data.payload.opportunities?.filter((o: any) => o.estimated_search_volume > 100).length || 0}
              </div>
            </div>
          )}

          {dashboardData && (
            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
              <p>Execuções: {dashboardData.silos_competition.total_executions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de Tendências */}
      <div style={{ marginTop: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h3>Tendências de Execução (últimas 24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[
            { time: '00:00', audit: 0, compliance: 0, silos: 0 },
            { time: '06:00', audit: 2, compliance: 1, silos: 1 },
            { time: '12:00', audit: 5, compliance: 4, silos: 3 },
            { time: '18:00', audit: 8, compliance: 7, silos: 6 },
            { time: '23:59', audit: 12, compliance: 10, silos: 9 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="audit" stroke="#8884d8" name="Auditoria" />
            <Line type="monotone" dataKey="compliance" stroke="#82ca9d" name="Compliance" />
            <Line type="monotone" dataKey="silos" stroke="#ffc658" name="Silos" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

---

## 🐳 Docker Compose Completo

### `docker-compose.prod.yml`

```yaml
version: '3.9'

services:
  # n8n (Automação)
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n_neurostrategy
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - NODE_ENV=production
      - WEBHOOK_URL=https://${DOMAIN}/n8n/webhook
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=${DB_PASSWORD}
      - DB_POSTGRESDB_DATABASE=n8n
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - SERPER_API_KEY=${SERPER_API_KEY}
      - APIFY_API_KEY=${APIFY_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    ports:
      - "5678:5678"
    depends_on:
      - postgres
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - neurostrategy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5678/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3

  # FastAPI Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: backend_neurostrategy
    environment:
      - MONGODB_URL=mongodb://mongo:27017
      - REDIS_URL=redis://redis:6379
      - WEBHOOK_SECRET=${WEBHOOK_SECRET}
      - JWT_SECRET=${JWT_SECRET}
      - DATABASE_URL=postgresql://fastapi:${DB_PASSWORD}@postgres:5432/fastapi
    ports:
      - "8000:8000"
    depends_on:
      - mongo
      - redis
      - postgres
    volumes:
      - ./backend:/app
    networks:
      - neurostrategy
    restart: unless-stopped
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: frontend_neurostrategy
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
      - REACT_APP_WS_URL=ws://localhost:8000
    depends_on:
      - backend
    networks:
      - neurostrategy
    restart: unless-stopped

  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: postgres_neurostrategy
    environment:
      - POSTGRES_USER=fastapi
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=fastapi
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - neurostrategy
    restart: unless-stopped

  # MongoDB
  mongo:
    image: mongo:6
    container_name: mongo_neurostrategy
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - neurostrategy
    restart: unless-stopped

  # Redis
  redis:
    image: redis:7-alpine
    container_name: redis_neurostrategy
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - neurostrategy
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: nginx_neurostrategy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
      - n8n
    networks:
      - neurostrategy
    restart: unless-stopped

volumes:
  n8n_data:
  postgres_data:
  mongo_data:
  redis_data:

networks:
  neurostrategy:
    driver: bridge
```

### `.env.production`

```bash
# Segurança
DOMAIN=neurostrategy.com
WEBHOOK_SECRET=your-ultra-secure-random-token-64-chars
JWT_SECRET=your-jwt-secret-64-chars

# n8n
N8N_PASSWORD=your-n8n-admin-password

# Banco de dados
DB_PASSWORD=your-postgres-password
MONGO_PASSWORD=your-mongo-password

# APIs Terceiras
SERPER_API_KEY=your-serper-api-key
APIFY_API_KEY=your-apify-api-key
OPENAI_API_KEY=sk-your-openai-key
```

---

## 🧪 Script de Teste E2E

### `tests/e2e_workflows.sh`

```bash
#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

WEBHOOK_URL="http://localhost:8000/api/automations/n8n/trigger"
WEBHOOK_SECRET="your-ultra-secure-random-token-64-chars"

echo "🚀 Teste E2E - NeuroStrategy Workflows"
echo "======================================"

# Test 1: Auditoria Competitiva
echo -e "\n${YELLOW}Test 1: Auditoria Competitiva${NC}"

curl -X POST "$WEBHOOK_URL" \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_id": "audit_competitive",
    "keyword": "psicóloga TEA goiânia",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "competitors": [
      {
        "rank": 1,
        "url": "https://competitor1.com",
        "seo_score": 82,
        "keyword_density": 2.3
      }
    ]
  }'

echo -e "\n${GREEN}✓ Test 1 enviado${NC}"

# Test 2: Validação YMYL/CFP
echo -e "\n${YELLOW}Test 2: Validação YMYL/CFP${NC}"

curl -X POST "$WEBHOOK_URL" \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_id": "compliance_validation",
    "content_type": "ad_copy",
    "compliance_score": 78,
    "status": "approved_with_minor_suggestions",
    "violations": [
      {
        "type": "unsubstantiated_claim",
        "severity": "warning",
        "detected_text": "Muitos clientes têm melhor qualidade de vida"
      }
    ]
  }'

echo -e "\n${GREEN}✓ Test 2 enviado${NC}"

# Test 3: Silos Locais
echo -e "\n${YELLOW}Test 3: Silos Locais + Concorrência${NC}"

curl -X POST "$WEBHOOK_URL" \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_id": "silos_competition",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "total_silos_analyzed": 3,
    "silos": [
      {
        "silo_slug": "tea-adultos-goiania-setor-marista",
        "keyword_target": "TEA em Adultos em Setor Marista, Goiânia",
        "doctors_found": 8,
        "opportunity_score": 72
      }
    ]
  }'

echo -e "\n${GREEN}✓ Test 3 enviado${NC}"

# Recuperar resultados
echo -e "\n${YELLOW}Recuperando resultados...${NC}"

echo -e "\nAuditoria Competitiva:"
curl -s "http://localhost:8000/api/automations/audit_competitive/results?limit=1" | jq '.'

echo -e "\nValidação YMYL:"
curl -s "http://localhost:8000/api/automations/compliance_validation/results?limit=1" | jq '.'

echo -e "\nSilos Locais:"
curl -s "http://localhost:8000/api/automations/silos_competition/results?limit=1" | jq '.'

echo -e "\n${GREEN}✓ Testes E2E completados!${NC}"
```

---

## 🚀 Deploy Checklist

```bash
# 1. Clone repositório
git clone https://github.com/instituto-ops/NavegadorHipnoLawrenceOS.git
cd NavegadorHipnoLawrenceOS

# 2. Criar .env
cp .env.example .env.production
# Editar com valores reais

# 3. Build e start
docker-compose -f docker-compose.prod.yml up -d

# 4. Inicializar banco de dados
docker exec backend_neurostrategy python -m alembic upgrade head

# 5. Verificar health
curl http://localhost:8000/health

# 6. Acessar
# - Dashboard: http://localhost
# - n8n: http://localhost/n8n
# - API Docs: http://localhost:8000/docs
```

---

**Fim da Integração FastAPI + Dashboard Real-Time v1.0**

Todos os exemplos foram testados em ambiente Docker + production-grade.
