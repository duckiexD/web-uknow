@"
@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Форматирование кода
echo ========================================
echo.

python -m black backend\

if errorlevel 1 (
    echo [ОШИБКА] Ошибка форматирования
    pause
    exit /b 1
)

echo.
echo [УСПЕХ] Код отформатирован!
pause
"@ | Out-File -FilePath scripts\format.bat -Encoding ASCII