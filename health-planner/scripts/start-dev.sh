#!/bin/bash

# Health Planner Development Startup Script

echo "🏥 Starting Health Planner Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    
    # Try to start MongoDB based on OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo systemctl start mongodb
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start mongodb/brew/mongodb-community
    else
        echo "❌ Please start MongoDB manually"
        exit 1
    fi
    
    sleep 3
fi

# Install dependencies if needed
if [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
fi

# Test database connection
echo "🔍 Testing database connection..."
npm run test:db

if [ $? -ne 0 ]; then
    echo "❌ Database connection failed. Please check MongoDB."
    exit 1
fi

# Start the application
echo "🚀 Starting frontend and backend..."
npm run dev:full
