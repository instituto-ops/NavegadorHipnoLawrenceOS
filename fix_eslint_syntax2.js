import fs from 'fs';

let content = fs.readFileSync('apps/frontend/eslint.config.js', 'utf8');

content = content.replace(`      '@typescript-eslint/explicit-function-return-type': 'off',
      // '@typescript-eslint/explicit-function-return-type': 'off',
      // '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],`, `      '@typescript-eslint/explicit-function-return-type': 'off',`);

fs.writeFileSync('apps/frontend/eslint.config.js', content);
