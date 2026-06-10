@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Проверка безопасности проекта
echo ========================================
echo.

echo === Поиск секретов в коде ===
git grep -n -i -E "password|secret|token|api_key|apikey|jwt|smtp" -- . ":!docs" ":!screenshots" ":!*.md" 2>nul
if errorlevel 1 (
    echo [УСПЕХ] Секретов не найдено
) else (
    echo [ПРЕДУПРЕЖДЕНИЕ] Найдены потенциальные секреты
)

echo.
echo === Проверка .gitignore ===
findstr /i ".env" .gitignore > nul
if errorlevel 1 (
    echo [ОШИБКА] .env не добавлен в .gitignore
) else (
    echo [УСПЕХ] .env в .gitignore
)

echo.
echo === Проверка .env.example ===
if exist ".env.example" (
    echo [УСПЕХ] .env.example существует
) else (
    echo [ОШИБКА] .env.example не найден
)

echo.
pause