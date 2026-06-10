@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Остановка Docker контейнеров
echo ========================================
echo.

docker compose down

echo.
echo [УСПЕХ] Контейнеры остановлены
echo.
pause