@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Проверка качества кода
echo ========================================
echo.

:: Проверка наличия ruff
pip show ruff > nul 2>&1
if errorlevel 1 (
    echo Установка ruff...
    pip install ruff
)

:: Запуск линтера
echo Запуск линтера ruff...
ruff check backend\ --output-format=full

if errorlevel 1 (
    echo.
    echo [ОШИБКА] Найдены проблемы в коде
    pause
    exit /b 1
)

echo.
echo [УСПЕХ] Линтер не нашёл ошибок!
echo.

:: Проверка форматтера
echo Проверка форматирования black...
pip show black > nul 2>&1
if errorlevel 1 (
    pip install black
)

black backend\ --check --quiet
if errorlevel 1 (
    echo [ПРЕДУПРЕЖДЕНИЕ] Код не отформатирован
    echo Запустите scripts/format.bat для форматирования
) else (
    echo [УСПЕХ] Код отформатирован правильно
)

echo.
pause