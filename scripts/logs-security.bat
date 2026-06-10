@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Проверка логов на ошибки
echo ========================================
echo.

echo === Последние логи контейнера ===
docker compose -f docker-compose.prod.yml logs --tail=50

echo.
echo === Поиск критических ошибок ===
docker compose -f docker-compose.prod.yml logs --tail=100 2>&1 | findstr /i "error exception traceback fatal"
if errorlevel 1 (
    echo [УСПЕХ] Критических ошибок не найдено
) else (
    echo [ПРЕДУПРЕЖДЕНИЕ] Найдены ошибки в логах
)

pause