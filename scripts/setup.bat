@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Установка зависимостей проекта
echo ========================================
echo.

:: Проверка наличия Python
python --version > nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Python не установлен!
    echo Скачайте Python с https://www.python.org/downloads/
    pause
    exit /b 1
)

:: Установка зависимостей
echo Установка пакетов из requirements.txt...
pip install -r backend/requirements.txt

if errorlevel 1 (
    echo [ОШИБКА] Не удалось установить зависимости
    pause
    exit /b 1
)

echo.
echo [УСПЕХ] Зависимости установлены!
echo.
pause