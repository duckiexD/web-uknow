@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Проверка зависимостей
echo ========================================
echo.

echo === Установка pip-audit ===
pip install pip-audit -q

echo === Проверка уязвимостей ===
pip-audit

echo.
echo === Проверка устаревших пакетов ===
pip list --outdated

echo.
pause