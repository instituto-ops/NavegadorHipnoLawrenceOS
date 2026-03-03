#!/bin/bash
# 🚀 Script de Setup para o Jules (e desenvolvedores locais em Linux/Mac)
# Este script prepara todo o ambiente do NeuroStrategy OS (Monorepo).

set -e

echo "==========================================================="
echo "🧠 Inicializando Setup do NeuroStrategy OS..."
echo "==========================================================="

# 1. Copiar as variáveis de ambiente se elas não existirem
echo "📄 Verificando variáveis de ambiente..."
if [ ! -f .env ]; then
  echo "=> Criando .env na raiz a partir do .env.example..."
  cp .env.example .env 2>/dev/null || echo "=> Nenhum .env.example raiz encontrado, pulando..."
fi

if [ ! -f apps/backend/.env ]; then
  echo "=> Criando .env no backend a partir de .env.example..."
  cp apps/backend/.env.example apps/backend/.env 2>/dev/null || echo "=> Nenhum .env.example no backend, pulando..."
fi

# 2. Configuração do Backend (Python)
echo "🐍 Instalando dependências do Backend (apps/backend)..."
cd apps/backend

# Atualizar pip
python3 -m pip install --upgrade pip

# Instalar pacotes Python
pip install -r requirements.txt

# Instalar binários do Playwright requisitados pelo browser-use
echo "🌐 Instalando binários do Playwright..."
playwright install chromium

cd ../..

# 3. Configuração do Frontend (Node)
echo "⚛️ Instalando dependências do Frontend (apps/frontend)..."
cd apps/frontend

# Instalar pacotes NPM a partir do lockfile para garantir previsibilidade
npm ci

cd ../..

echo "✅ Setup Completo! O sistema está pronto para rodar."
echo "==========================================================="
echo "DICA: O backend exige a Groq API configurada no .env (apps/backend) para funcionar."
