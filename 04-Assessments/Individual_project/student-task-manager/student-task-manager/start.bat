@echo off
start "Backend (port 5000)" cmd /k "cd /d %~dp0backend && npm.cmd run dev"
start "Frontend (port 5173)" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"
timeout /t 4 >nul
start http://localhost:5173
