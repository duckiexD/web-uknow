@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Общая проверка качества проекта
echo ========================================
echo.

call scripts\test.bat
call scripts\api-test.bat
call scripts\logs-check.bat

echo.
echo ========================================
echo Проверка качества завершена
echo ========================================
pause