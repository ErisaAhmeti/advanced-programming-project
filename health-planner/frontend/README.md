# Health Planner Frontend

React + Vite frontend për aplikacionin Health Planner.

## Zhvillimi Lokal

\`\`\`bash
# Instalo dependencies
npm install

# Starto development server
npm run dev

# Build për production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
\`\`\`

## Environment Variables

Krijo `.env` file në root directory:

\`\`\`env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Health Planner
\`\`\`

## Docker

\`\`\`bash
# Build Docker image
docker build -t health-planner-frontend .

# Run container
docker run -p 5173:5173 health-planner-frontend
\`\`\`

## Struktura

- `src/pages/` - Faqet kryesore të aplikacionit
- `src/components/` - Komponentët e ripërdorshëm
- `src/lib/` - Utilities dhe helper functions
- `src/__tests__/` - Test files
