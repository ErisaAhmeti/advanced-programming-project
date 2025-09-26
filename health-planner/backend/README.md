# Health Planner Backend

Express.js + MongoDB backend për aplikacionin Health Planner.

## Zhvillimi Lokal

\`\`\`bash
# Instalo dependencies
npm install

# Starto development server
npm run dev

# Build për production
npm run build

# Start production server
npm start

# Run tests
npm test
\`\`\`

## Environment Variables

Krijo `.env` file në root directory:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/health-planner
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
\`\`\`

## API Endpoints

### Users
- \`GET /api/users\` - Get all users
- \`GET /api/users/:id\` - Get user by ID
- \`POST /api/users\` - Create new user
- \`PUT /api/users/:id\` - Update user
- \`DELETE /api/users/:id\` - Delete user

### Goals
- \`GET /api/goals\` - Get all goals
- \`GET /api/goals/:id\` - Get goal by ID
- \`POST /api/goals\` - Create new goal
- \`PUT /api/goals/:id\` - Update goal
- \`PATCH /api/goals/:id/progress\` - Update goal progress
- \`DELETE /api/goals/:id\` - Delete goal

### Progress
- \`GET /api/progress\` - Get progress entries
- \`GET /api/progress/stats/:userId\` - Get user statistics
- \`GET /api/progress/:id\` - Get progress by ID
- \`POST /api/progress\` - Create progress entry
- \`PUT /api/progress/:id\` - Update progress entry
- \`DELETE /api/progress/:id\` - Delete progress entry

## Docker

\`\`\`bash
# Build Docker image
docker build -t health-planner-backend .

# Run container
docker run -p 3001:3001 health-planner-backend
\`\`\`
\`\`\`
