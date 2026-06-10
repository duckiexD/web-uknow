@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Запуск сервера футбольной секции "Высота"
echo ========================================
echo.

:: Проверка наличия .env
if not exist ".env" (
    echo [ПРЕДУПРЕЖДЕНИЕ] Файл .env не найден!
    echo Создаю из .env.example...
    copy .env.example .env
    echo.
)

:: Запуск сервера
echo Запуск Flask сервера...
echo Сайт будет доступен по адресу: http://localhost:5000
echo Для остановки сервера нажмите Ctrl+C
echo.
python backend\app.py

pause