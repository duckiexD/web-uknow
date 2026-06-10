@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Запуск через Docker
echo ========================================
echo.

:: Проверка наличия Docker
docker --version > nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Docker не установлен!
    echo Скачайте Docker Desktop с https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

:: Запуск контейнеров
echo Сборка и запуск контейнеров...
docker compose up --build

pause