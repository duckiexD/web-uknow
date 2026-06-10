@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Перезапуск production версии
echo ========================================
echo.

echo Остановка контейнеров...
docker compose -f docker-compose.prod.yml down

echo.
echo Запуск контейнеров...
docker compose -f docker-compose.prod.yml up --build -d

echo.
echo Проверка статуса:
docker compose -f docker-compose.prod.yml ps

echo.
echo [УСПЕХ] Перезапуск выполнен!
echo.
pause