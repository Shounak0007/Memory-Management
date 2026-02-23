#!/bin/bash

echo "===================================="
echo "  Memory Agent - Starting Services"
echo "===================================="
echo ""

# Check if MongoDB is running
echo "[1/3] Checking MongoDB..."
if pgrep -x mongod > /dev/null; then
    echo "MongoDB is already running."
elif systemctl is-active --quiet mongod; then
    echo "MongoDB is already running."
else
    echo "Starting MongoDB..."
    if command -v brew &> /dev/null && brew services list | grep mongodb-community | grep started &> /dev/null; then
        echo "MongoDB is already running via Homebrew."
    elif command -v brew &> /dev/null; then
        brew services start mongodb-community
    else
        sudo systemctl start mongod
    fi
fi
echo ""

# Start Backend
echo "[2/3] Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!
echo "Backend server started (PID: $BACKEND_PID) on http://localhost:5000"
cd ..
echo ""

# Wait a bit for backend to start
sleep 3

# Start Frontend
echo "[3/3] Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID)"
cd ..
echo ""

echo "===================================="
echo "  All services started!"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo "===================================="
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
wait
