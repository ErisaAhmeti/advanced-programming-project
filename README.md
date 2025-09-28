
# Planner Shëndeti - Health Planner App

Një aplikacion për planifikimin e shëndetit me menaxhim përdoruesish, qëllimesh dhe progresi, me ruajtje të dhënave në MongoDB.

## Karakteristikat

* 🎯 Menaxhim përdoruesish (emër, moshë, peshë, gjatësia, aktiviteti, qëllimi)
* 🍎 Menaxhim qëllimesh (humbje peshe, fitnes, mirëmbajtje)
* 📊 Ruajtje e progresit ditor
* 🗄️ **MongoDB Integration** – ruajtje e të dhënave në databazë

## Struktura e Projektit

```bash
health-planner/
├── frontend/              # React + Vite frontend
│   ├── src/               # Komponentët React
│   ├── package.json       
│   ├── vite.config.ts     
│   └── Dockerfile         
├── backend/               # Express + MongoDB backend
│   ├── src/               # API routes dhe models
│   ├── package.json       
│   ├── tsconfig.json      
│   └── Dockerfile         
├── scripts/               # Script-e për databazën
├── docker-compose.yml     
└── README.md              
```

## Instalimi dhe Startimi

### Parakushtet

* Node.js 18+
* MongoDB (lokal ose Docker)

### Zhvillim Lokal

1. **Instalo varësitë**

   ```bash
   cd health-planner
   npm run install:all
   ```

2. **Konfiguro environment variables**

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Nise MongoDB**

   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   ```

4. **Nise aplikacionin**

   ```bash
   npm run dev:full
   ```

5. **Akseso aplikacionin**

   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Backend API: [http://localhost:3001/api/health](http://localhost:3001/api/health)

## Database Schema

### Users (Përdoruesit)

* emri, mosha, pesha, gjatësia
* niveli i aktivitetit
* qëllimi

### Goals (Qëllimet)

* lloji i qëllimit (humbje peshe, fitnes, mirëmbajtje)
* vlera aktuale dhe e synuar
* data e synuar

### Progress (Progresi)

* pesha ditore
* aktiviteti dhe shënime

## API Endpoints

```bash
# Users
GET    /api/users       
POST   /api/users       
GET    /api/users/:id   
PUT    /api/users/:id   
DELETE /api/users/:id   

# Goals
GET    /api/goals       
POST   /api/goals       
GET    /api/goals/:id   
PUT    /api/goals/:id   
DELETE /api/goals/:id   

# Progress
GET    /api/progress    
POST   /api/progress    
GET    /api/progress/:id
PUT    /api/progress/:id
DELETE /api/progress/:id

# Health Check
GET    /api/health      
```

## Teknologjitë e Përdorura

### Frontend

* React + Vite
* TypeScript
* Tailwind CSS

### Backend

* Node.js + Express
* MongoDB me Mongoose
* TypeScript

---


Dëshiron që ta thjeshtoj edhe më shumë (pa shpjegime të tepërta si algoritmet BMR/TDEE) apo ta lë kështu?
