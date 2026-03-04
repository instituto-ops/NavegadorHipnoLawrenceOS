# ⚡ Quick Start (30 minutos): NavegadorHipnoLawrenceOS

**Para**: Instituto OPS - Victor Bernardes Santana  
**Objetivo**: Colocar ESLint + Prettier rodando HOJE  
**Tempo**: 30 minutos  
**Status**: Copy-paste ready

---

## 🚀 COMEÇAR AGORA (30 MINUTOS)

### MINUTO 0-5: Copiar comandos abaixo

```bash
# Navegue até seu repositório
cd ~/projects/NavegadorHipnoLawrenceOS

# Limpe cache (recomendado)
rm -rf node_modules package-lock.json
npm cache clean --force
```

### MINUTO 5-10: Instalar Dependências

```bash
npm install --save-dev \
  eslint \
  @eslint/js \
  typescript-eslint \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-import \
  eslint-plugin-better-tailwindcss \
  prettier \
  eslint-config-prettier \
  eslint-plugin-prettier \
  husky \
  lint-staged
```

**Esperado**: Deve levar ~2-3 minutos. Aguarde completar.

---

## MINUTO 10-15: Criar 3 Arquivos de Configuração

### Arquivo 1: `.eslintrc.js` (Copiar integralmente)

**Localização**: Raiz do projeto

```javascript
import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import typescriptEslint from 'typescript-eslint';
import tailwindPlugin from 'eslint-plugin-better-tailwindcss';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: [
      'dist',
      'node_modules',
      '.vite',
      'coverage',
      'build',
      '.env*',
      'out',
      'release',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: typescriptEslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
      'better-tailwindcss': { entryPoint: 'src/index.css' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'better-tailwindcss': tailwindPlugin,
      '@typescript-eslint': typescriptEslint.plugin,
      import: importPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/display-name': 'warn',
      'react/jsx-key': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-types': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      'better-tailwindcss/no-unnecessary-whitespace': 'warn',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          alphabeticalOrder: true,
          caseInsensitive: true,
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-var': 'error',
      'prettier/prettier': 'error',
    },
  },
];
```

### Arquivo 2: `.prettierrc.json`

**Localização**: Raiz do projeto

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "jsxSingleQuote": false
}
```

### Arquivo 3: `.lintstagedrc.json`

**Localização**: Raiz do projeto

```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{css,scss}": ["prettier --write"],
  "*.json": ["prettier --write"],
  "*.md": ["prettier --write"]
}
```

---

## MINUTO 15-20: Setup Husky (Pre-commit hooks)

```bash
# 1. Inicializar
npx husky install

# 2. Criar pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# 3. Verificar (deve mostrar):
# #!/usr/bin/env sh
# . "$(dirname -- "$0")/_/husky.sh"
# npx lint-staged
cat .husky/pre-commit
```

---

## MINUTO 20-25: Atualizar package.json Scripts

**Arquivo**: `package.json`

**Adicionar/Atualizar a seção `"scripts"`**:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint src --max-warnings 0",
    "lint:fix": "eslint src --fix && prettier --write src",
    "format": "prettier --write src",
    "format:check": "prettier --check src"
  }
}
```

---

## MINUTO 25-30: TESTAR TUDO

### Teste 1: ESLint
```bash
npm run lint
```

**Esperado:**
- ✅ Sem erros críticos
- ⚠️ Warnings podem aparecer (é normal)

### Teste 2: Type Check
```bash
npm run type-check
```

**Esperado:**
- ✅ Sem erros

### Teste 3: Prettier
```bash
npm run format:check
```

**Esperado:**
- ✅ Tudo formatado

### Teste 4: Build
```bash
npm run build
```

**Esperado:**
- ✅ Build bem-sucedido

---

## ✨ PRIMEIRA EXECUÇÃO DO PRE-COMMIT

```bash
# 1. Adicionar arquivos de config
git add .eslintrc.js .prettierrc.json .lintstagedrc.json .husky/

# 2. Fazer commit (pre-commit hook vai rodar automaticamente)
git commit -m "ci: add ESLint, Prettier, and Husky setup"

# Se tudo passou, fazer push
git push origin develop
```

**Se houver erro**: O pre-commit hook tentará corrigir automaticamente, depois tente commit novamente.

---

## 🎉 SUCESSO! Você fez em 30 minutos:

✅ ESLint instalado e configurado
✅ Prettier instalado e configurado
✅ Husky + pre-commit hooks rodando
✅ Seu código é validado antes de cada commit
✅ Formatação automática ativada

---

## 📝 PRÓXIMOS PASSOS (DEPOIS)

Quando estiver pronto para continuar:

1. **Próxima**: Implementar GitHub Actions (1 hora)
2. **Depois**: Builds multiplataforma automáticos (2 horas)
3. **Depois**: Codesigning (3-4 horas)
4. **Depois**: Auto-update (1 hora)

---

## ⚠️ TROUBLESHOOTING RÁPIDO

### Problema: "eslint not found"
```bash
npm install --save-dev eslint
```

### Problema: "Module not found" no ESLint
```bash
rm -rf node_modules
npm install
```

### Problema: Pre-commit hook não roda
```bash
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
chmod +x .husky/pre-commit
```

### Problema: ESLint diz que arquivo não existe
```bash
# Criar arquivo vazio se necessário
touch src/index.tsx
```

### Problema: TypeScript error
```bash
npm run type-check
# Verificar erros específicos
```

---

## 📞 SUPORTE

Se algo não funcionar:

1. Releia esta seção
2. Limpe cache:
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```
3. Reinstale Husky:
   ```bash
   npx husky install
   npx husky add .husky/pre-commit "npx lint-staged"
   ```
4. Teste novamente:
   ```bash
   npm run lint
   ```

---

**Pronto? Comece AGORA! ⏱️ Você tem 30 minutos.**

🚀 Boa sorte!