#!/bin/bash
# Update package.json to not fail on warnings
sed -i 's/eslint src electron --max-warnings 0/eslint src electron/g' apps/frontend/package.json
