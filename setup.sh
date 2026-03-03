#!/bin/bash
# 🚀 Script de Setup para o Jules (e desenvolvedores locais em Linux/Mac)
# Este script prepara todo o ambiente do NeuroStrategy OS (Monorepo),
# incluindo as dependências de sistema para a VM limpa.

set -e

echo "==========================================================="
echo "🧠 Inicializando Setup do NeuroStrategy OS..."
echo "==========================================================="

# 1. Atualizar e instalar dependências essenciais de sistema
echo "📦 Instalando dependências de sistema (VM)..."
sudo apt-get update
sudo apt-get install -y python3-pip xvfb curl wget

# 2. Instalar Node.js (para o frontend)
echo "🟢 Configurando Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pnpm yarn

# 3. Configuração do Backend (Python)
echo "🐍 Instalando dependências do Backend (apps/backend)..."
cd apps/backend

# Atualizar o gerenciador de pacotes do Python
python3 -m pip install --upgrade pip

# Instalar pacotes Python
pip install -r requirements.txt

# Instalar binários do Playwright requisitados pelo browser-use
echo "🌐 Instalando dependências do Playwright..."
playwright install-deps
playwright install chromium

cd ../..

# 4. Configuração do Frontend (Node)
echo "⚛️ Instalando dependências do Frontend (apps/frontend)..."
cd apps/frontend

# Instalar pacotes NPM a partir do lockfile
npm ci

cd ../..

echo "✅ Setup Completo! O Snapshot de ambiente do Jules está pronto."
echo "==========================================================="
