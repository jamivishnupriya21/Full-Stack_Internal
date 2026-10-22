@echo off
echo Installing backend packages...
cd /d "%~dp0backend"
call npm.cmd install
echo Installing frontend packages...
cd /d "%~dp0frontend"
call npm.cmd install
echo.
echo Done. Now double-click start.bat
pause
