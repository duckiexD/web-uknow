@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Развертывание production версии
echo Футбольная секция "Высота"
echo ========================================
echo.

:: Проверка наличия .env.production
if not exist ".env.production" (
    echo [ПРЕДУПРЕЖДЕНИЕ] .env.production не найден!
    echo Создаю из .env.production.example...
    copy .env.production.example .env.production
    echo.
)

:: Остановка старых контейнеров
echo Остановка старых контейнеров...
docker compose -f docker-compose.prod.yml down 2>nul

:: Запуск production контейнера
echo Запуск production контейнера...
docker compose -f docker-compose.prod.yml up --build -d

:: Проверка статуса
echo.
echo Проверка статуса:
docker compose -f docker-compose.prod.yml ps

echo.
echo [УСПЕХ] Проект развернут!
echo Сайт доступен по адресу: http://localhost:5000
echo.
pause