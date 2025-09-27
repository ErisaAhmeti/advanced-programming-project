# Deployment Guide - Health Planner

Udhëzues për deployment të aplikacionit Health Planner në environment të ndryshme.

## Production Deployment

### 1. Vercel (Frontend) + Railway/Render (Backend)

**Frontend në Vercel:**
\`\`\`bash
# 1. Push kodin në GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Lidh me Vercel
# - Shko në vercel.com
# - Import repository
# - Set build command: cd frontend && npm run build
# - Set output directory: frontend/dist
\`\`\`

**Backend në Railway:**
\`\`\`bash
# 1. Krijo account në railway.app
# 2. Connect GitHub repository
# 3. Set environment variables:
MONGODB_URI=mongodb+srv://...
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app

# 4. Set build command: cd backend && npm run build
# 5. Set start command: cd backend && npm start
\`\`\`

### 2. Docker Deployment (VPS/Cloud)

**Përgatitja:**
\`\`\`bash
# 1. Clone repository në server
git clone https://github.com/your-username/health-planner.git
cd health-planner

# 2. Konfiguro environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit files me production values
nano backend/.env
nano frontend/.env
\`\`\`

**Deployment:**
\`\`\`bash
# 1. Build dhe start containers
docker-compose up -d

# 2. Check logs
docker-compose logs -f

# 3. Setup reverse proxy (nginx)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/health-planner
\`\`\`

**Nginx Configuration:**
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

### 3. Environment Variables

**Backend (.env):**
\`\`\`env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/health-planner
MONGODB_DB_NAME=health-planner

# Server
PORT=3001
NODE_ENV=production

# Frontend
FRONTEND_URL=https://your-frontend-domain.com

# Security (optional)
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
\`\`\`

**Frontend (.env):**
\`\`\`env
VITE_API_URL=https://your-backend-domain.com
VITE_APP_NAME=Health Planner
\`\`\`

## Database Setup

### MongoDB Atlas (Recommended)

1. **Krijo account në MongoDB Atlas**
   - Shko në mongodb.com/atlas
   - Krijo cluster të ri
   - Setup database user dhe password

2. **Konfiguro Network Access**
   - Shto IP addresses që mund të aksesojnë
   - Për development: 0.0.0.0/0 (të gjitha)
   - Për production: specific IPs

3. **Merr Connection String**
   \`\`\`
   mongodb+srv://username:password@cluster.mongodb.net/health-planner?retryWrites=true&w=majority
   \`\`\`

### Self-hosted MongoDB

\`\`\`bash
# Ubuntu/Debian
sudo apt update
sudo apt install mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database dhe user
mongo
> use health-planner
> db.createUser({
    user: "healthuser",
    pwd: "securepassword",
    roles: ["readWrite"]
  })
\`\`\`

## SSL/HTTPS Setup

### Me Let's Encrypt (Certbot)

\`\`\`bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
\`\`\`

## Monitoring dhe Logging

### PM2 (për Node.js apps)

\`\`\`bash
# Install PM2
npm install -g pm2

# Start backend me PM2
cd backend
pm2 start npm --name "health-planner-backend" -- start

# Monitor
pm2 monit
pm2 logs health-planner-backend

# Auto-restart on server reboot
pm2 startup
pm2 save
\`\`\`

### Docker Logging

\`\`\`bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Log rotation
# Add to docker-compose.yml:
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
\`\`\`

## Backup Strategy

### Database Backup

\`\`\`bash
# MongoDB dump
mongodump --uri="mongodb+srv://..." --out=./backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb+srv://..." ./backup/20240101/
\`\`\`

### Automated Backup Script

\`\`\`bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/health-planner"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/db_$DATE"

# Compress
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$BACKUP_DIR/db_$DATE"

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.tar.gz"
\`\`\`

## Performance Optimization

### Frontend

\`\`\`bash
# Build optimized version
cd frontend
npm run build

# Analyze bundle size
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/static/js/*.js
\`\`\`

### Backend

\`\`\`javascript
// Add compression middleware
const compression = require('compression');
app.use(compression());

// Add caching headers
app.use(express.static('public', {
  maxAge: '1d'
}));
\`\`\`

### Database

\`\`\`javascript
// Add indexes për performance
// In your models:
UserSchema.index({ email: 1 });
GoalSchema.index({ userId: 1, status: 1 });
ProgressSchema.index({ userId: 1, date: -1 });
\`\`\`

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive info
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Monitoring and logging enabled

## Troubleshooting

### Common Issues

**Build Failures:**
\`\`\`bash
# Clear caches
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
\`\`\`

**Database Connection:**
\`\`\`bash
# Test connection
node -e "
const mongoose = require('mongoose');
mongoose.connect('your-connection-string')
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Error:', err));
"
\`\`\`

**Docker Issues:**
\`\`\`bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
