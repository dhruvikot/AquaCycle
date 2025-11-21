#!/bin/bash
# Bash script to start both Admin Panel and Main App
# Usage: ./start-both.sh

echo "Starting Montevideo Recycling App System..."
echo ""

# Function to start admin panel
start_admin() {
    echo "Starting Admin Panel..."
    cd Recycling_Scheduler_Admin
    npm run dev
}

# Function to start main app
start_main() {
    echo "Starting Main App (Expo)..."
    npm start
}

# Start both in background
start_admin &
ADMIN_PID=$!

sleep 3

start_main &
MAIN_PID=$!

echo ""
echo "Both applications are starting..."
echo "Admin Panel: http://localhost:5173"
echo "Main App (Expo): Choose platform from Expo menu"
echo "  Press 'w' for web, 'a' for Android, 'i' for iOS"
echo ""
echo "Login Credentials:"
echo "  Admin - username: admin, password: admin123"
echo "  Driver - username: demo, password: demo123"
echo ""
echo "Press Ctrl+C to stop both applications"

# Wait for both processes
wait $ADMIN_PID $MAIN_PID

