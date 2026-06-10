@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Просмотр логов
echo ========================================
echo.

docker compose logs -f