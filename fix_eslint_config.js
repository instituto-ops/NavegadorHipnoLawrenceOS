import fs from 'fs';

let content = fs.readFileSync('apps/frontend/eslint.config.js', 'utf8');

content = content.replace(`      'import/order': 'off',
      // 'import/order': [
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
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],`, `      'import/order': 'off',`);

fs.writeFileSync('apps/frontend/eslint.config.js', content);
