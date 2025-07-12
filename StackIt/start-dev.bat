@echo off
echo Starting StackIt Development Environment...
echo.
echo Backend API Server: http://localhost:3001
echo Frontend App: http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo.

start "StackIt Backend" cmd /k "npm run server"
timeout /t 2 /nobreak >nul
start "StackIt Frontend" cmd /k "npm run dev"

echo Both servers are starting...
echo.
echo Default admin credentials:
echo Username: admin
echo Password: admin123
echo.
pause 