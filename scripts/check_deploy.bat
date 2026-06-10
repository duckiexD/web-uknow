@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Проверка развертывания
echo ========================================
echo.

echo Статус контейнеров:
docker compose -f docker-compose.prod.yml ps
echo.

echo Последние логи:
docker compose -f docker-compose.prod.yml logs --tail=50
echo.

:: Проверка доступности
echo Проверка доступности сайта...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:5000

echo.
pause