@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Проверка портов и сервисов
echo ========================================
echo.

echo === Docker контейнеры ===
docker compose -f docker-compose.prod.yml ps

echo.
echo === Открытые порты ===
netstat -ano | findstr "LISTENING" | findstr "5000"

echo.
echo === Проверка доступности ===
curl.exe -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:5000

pause