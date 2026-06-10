@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Финальная проверка перед релизом
echo ========================================
echo.

echo === Проверка линтера ===
ruff check backend/ --quiet
if errorlevel 1 (
    echo [ОШИБКА] Линтер не пройден
    exit /b 1
) else (
    echo [УСПЕХ] Линтер пройден
)

echo.
echo === Проверка форматтера ===
black backend/ --check --quiet
if errorlevel 1 (
    echo [ОШИБКА] Форматтер не пройден
    exit /b 1
) else (
    echo [УСПЕХ] Форматтер пройден
)

echo.
echo === Проверка API ===
curl.exe -s http://localhost:5000/api/products > nul
if errorlevel 1 (
    echo [ОШИБКА] Сервер не запущен
    exit /b 1
) else (
    echo [УСПЕХ] API доступен
)

echo.
echo ✅ Релиз готов к выпуску!

pause