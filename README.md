# Planner Shëndeti - Health Planner App

Një aplikacion i plotë për planifikimin e shëndetit me rekomandime ushqimi dhe stërvitjeje të personalizuara.

## Karakteristikat

- 🎯 Vendosje qëllimesh personale (humbje peshe, fitnes, mirëmbajtje)
- 🍎 Rekomandime ushqimi të personalizuara
- 💪 Planet stërvitjeje të përshtatura
- 📊 Llogaritës kalori dhe makronutrientësh
- 📈 Ndjekje progresi me grafika
- 🌍 Ndërfaqe në gjuhën shqipe
- 🗄️ **MongoDB Database Integration** - Ruajtje të dhënash të sigurt dhe e shpejtë

## Struktura e Re e Projektit

Projekti tani është i organizuar në folder të veçanta për frontend dhe backend:

\`\`\`
health-planner/
├── frontend/              # React + Vite frontend
│   ├── src/               # React components dhe pages
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.ts     # Vite configuration
│   └── Dockerfile         # Frontend Docker image
├── backend/               # Express + MongoDB backend
│   ├── src/               # API routes dhe models
│   ├── package.json       # Backend dependencies
│   ├── tsconfig.json      # TypeScript configuration
│   └── Dockerfile         # Backend Docker image
├── scripts/               # Database scripts
├── docker-compose.yml     # Production Docker setup
├── docker-compose.dev.yml # Development Docker setup
└── README.md             # Ky skedar
\`\`\`

## Instalimi dhe Startimi

### Parakushtet

Sigurohu që ke të instaluara:
- [Node.js](https://nodejs.org/) (versioni 18 ose më i ri)
- [MongoDB](https://www.mongodb.com/try/download/community) (ose Docker)
- [Docker](https://www.docker.com/get-started) (opsional, por i rekomanduar)

### Opsioni 1: Zhvillim Lokal

1. **Shkarko dhe instalo projektin**
   \`\`\`bash
   # Kliko "Download ZIP" në v0 ose klono nga GitHub
   cd health-planner
   
   # Instalo dependencies për të gjitha folder
   npm run install:all
   \`\`\`

2. **Konfiguro environment variables**
   \`\`\`bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   \`\`\`

3. **Starto MongoDB**
   \`\`\`bash
   # Ubuntu/Debian
   sudo systemctl start mongodb
   
   # macOS me Homebrew
   brew services start mongodb/brew/mongodb-community
   
   # Ose me Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   \`\`\`

4. **Testo dhe mbush databazën**
   \`\`\`bash
   # Testo lidhjen me databazën
   npm run test:db
   
   # Mbush me të dhëna shembull
   npm run seed:db
   \`\`\`

5. **Starto aplikacionin**
   \`\`\`bash
   # Starto backend dhe frontend së bashku
   npm run dev:full
   
   # Ose veçmas:
   # Terminal 1: npm run server:dev
   # Terminal 2: npm run dev
   \`\`\`

6. **Hap aplikacionin**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api/health

### Opsioni 2: Me Docker (më i lehtë)

1. **Shkarko projektin**
   \`\`\`bash
   cd health-planner
   \`\`\`

2. **Starto me Docker (Production)**
   \`\`\`bash
   # Ndërto dhe starto të gjitha shërbimet
   npm run docker:up
   
   # Shiko logs
   npm run docker:logs
   \`\`\`

3. **Starto me Docker (Development)**
   \`\`\`bash
   # Starto në development mode me hot reload
   npm run docker:dev
   
   # Ndalo development containers
   npm run docker:dev:down
   \`\`\`

4. **Hap aplikacionin**
   - Aplikacioni: http://localhost:3000 (dev) ose http://localhost:5173 (prod)
   - API: http://localhost:3001
   - MongoDB: localhost:27017

### Komanda të Dobishme

\`\`\`bash
# Zhvillim
npm run dev:full          # Starto frontend + backend
npm run dev               # Vetëm frontend
npm run server:dev        # Vetëm backend

# Build
npm run build             # Build frontend + backend
npm run build:frontend    # Build vetëm frontend
npm run build:backend     # Build vetëm backend

# Database
npm run test:db           # Testo lidhjen me databazën
npm run seed:db           # Mbush me të dhëna shembull

# Docker
npm run docker:up         # Starto me Docker (production)
npm run docker:dev        # Starto me Docker (development)
npm run docker:down       # Ndalo Docker containers
npm run docker:logs       # Shiko logs
npm run docker:clean      # Pastro të gjitha

# Testing
npm run test              # Testo të gjitha
npm run test:frontend     # Testo frontend
npm run test:backend      # Testo backend
npm run lint              # Kontrollo kodin
\`\`\`

### Zhvillimi Manual

Nëse dëshiron të startosh komponentët manualisht:

**Backend:**
\`\`\`bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
\`\`\`

**MongoDB:**
\`\`\`bash
# Lokal
mongod

# Ose me Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0
\`\`\`

### Testimi i Aplikacionit

1. **Testo Database Integration:**
   - Shko në http://localhost:3000/database-test
   - Kliko "Run Database Tests"
   - Duhet të shohësh të gjitha testet të kalojnë

2. **Testo skenarë të ndryshëm:**
   - Humbje peshe: Vendos qëllim "Humbje Peshe", moshë 25, peshë 80kg, gjatësi 170cm
   - Fitnes: Vendos qëllim "Fitnes", aktivitet i lartë, stërvitje 5 herë në javë
   - Mirëmbajtje: Vendos qëllim "Mirëmbajtje", aktivitet mesatar

### Zgjidhja e Problemeve

**MongoDB Connection Issues:**
\`\`\`bash
# Kontrollo nëse MongoDB është duke u ekzekutuar
sudo systemctl status mongodb  # Linux
brew services list | grep mongo  # macOS

# Restarto MongoDB
sudo systemctl restart mongodb  # Linux
brew services restart mongodb-community  # macOS
\`\`\`

**Port Conflicts:**
- Frontend: Ndrysho portin në `frontend/vite.config.ts`
- Backend: Ndrysho `PORT` në `backend/.env`

**Docker Issues:**
\`\`\`bash
# Pastro Docker cache
docker system prune -a

# Restarto Docker containers
npm run docker:down && npm run docker:up
\`\`\`

## Database Schema

### Users (Përdoruesit)
- Informacione personale (emri, mosha, pesha, gjatësia)
- Niveli i aktivitetit fizik
- Gjendje shëndetësore dhe alergjitë
- Preferencat ushqimore

### Goals (Qëllimet)
- Lloji i qëllimit (humbje peshe, fitim muskujsh, etj.)
- Vlera aktuale dhe e synuar
- Data e synuar për arritjen e qëllimit
- Statusi dhe prioriteti

### Progress (Progresi)
- Të dhëna ditore (pesha, stërvitja, ushqimi)
- Matjet e trupit
- Gjendja psikologjike dhe niveli i energjisë
- Shënime personale

### Workouts (Stërvitjet)
- Emri dhe lloji i stërvitjes
- Ushtrimet dhe detajet (setet, përsëritjet, pesha)
- Kohëzgjatja dhe kalorit e djegur
- Vështirësia dhe shënimet

### Meals (Vaktet)
- Lloji i vaktit (mëngjes, drekë, darkë, snack)
- Ushqimet dhe sasitë
- Kalorit dhe makronutrientët
- Shënimet

## API Endpoints

\`\`\`
# Users
GET    /api/users          # Merr të gjithë përdoruesit
POST   /api/users          # Krijo përdorues të ri
GET    /api/users/:id      # Merr përdorues sipas ID
PUT    /api/users/:id      # Përditëso përdorues
DELETE /api/users/:id      # Fshi përdorues

# Goals
GET    /api/goals          # Merr të gjitha qëllimet
POST   /api/goals          # Krijo qëllim të ri
GET    /api/goals/:id      # Merr qëllim sipas ID
PUT    /api/goals/:id      # Përditëso qëllim
PATCH  /api/goals/:id/progress  # Përditëso progresin
DELETE /api/goals/:id      # Fshi qëllim

# Progress
GET    /api/progress       # Merr të gjitha hyrjet e progresit
POST   /api/progress       # Krijo hyrje të re progresi
GET    /api/progress/:id   # Merr hyrje progresi sipas ID
PUT    /api/progress/:id   # Përditëso hyrje progresi
DELETE /api/progress/:id   # Fshi hyrje progresi
GET    /api/progress/stats/:userId  # Merr statistika progresi

# Health Check
GET    /api/health         # Kontrollo statusin e API
\`\`\`

## Algoritmet

- **BMR (Basal Metabolic Rate):** Formula Mifflin-St Jeor
- **TDEE (Total Daily Energy Expenditure):** BMR × faktor aktiviteti
- **Makronutrientët:** Shpërndarje e personalizuar bazuar në qëllimet
- **Rekomandimet:** Algoritëm që përshtatet me preferencat dhe qëllimet

## Teknologjitë e Përdorura

### Frontend
- React 19 me Vite
- TypeScript
- Tailwind CSS v4
- Recharts (për grafika)
- Radix UI (për komponentët)
- React Router (për navigim)

### Backend
- Node.js me Express
- MongoDB me Mongoose
- TypeScript
- CORS dhe dotenv

### DevOps
- Docker & Docker Compose
- MongoDB 7.0
- Nginx (reverse proxy)

## Licenca

MIT License - Mund ta përdorësh lirisht për projekte akademike dhe komerciale.
