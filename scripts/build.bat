@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Сборка релизной версии
echo ========================================
echo.

echo Создание архива релиза...
git archive --format=zip --output release-v1.0.1.zip HEAD

echo.
echo Архив создан: release-v1.0.1.zip
dir release-v1.0.1.zip

pause