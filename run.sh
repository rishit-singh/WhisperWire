#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting WhisperWire application...${NC}"

# Function to kill processes
cleanup() {
  echo -e "${RED}Shutting down processes...${NC}"
  if [ ! -z "$backend_pid" ]; then
    echo "Killing backend process (PID: $backend_pid)"
    kill -9 $backend_pid 2>/dev/null
  fi
  if [ ! -z "$frontend_pid" ]; then
    echo "Killing frontend process (PID: $frontend_pid)"
    kill -9 $frontend_pid 2>/dev/null
  fi
  exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup INT

# Start backend
echo -e "${GREEN}Starting backend on port 5002...${NC}"
cd "$(dirname "$0")/whisperwire-backend" && PORT=5002 npm run dev &
backend_pid=$!
echo -e "${GREEN}Backend started with PID: ${backend_pid}${NC}"

# Wait a bit for backend to initialize
sleep 2

# Start frontend
echo -e "${GREEN}Starting frontend...${NC}"
cd "$(dirname "$0")/whisperwire-frontend" && npm start &
frontend_pid=$!
echo -e "${GREEN}Frontend started with PID: ${frontend_pid}${NC}"

echo -e "${BLUE}Both services are running. Press Ctrl+C to stop.${NC}"

# Keep script running until Ctrl+C
wait 