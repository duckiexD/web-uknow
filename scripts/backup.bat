@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

if not exist backups mkdir backups

set TIMESTAMP=%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%

echo ========================================
echo Создание резервной копии
echo ========================================
echo.

echo Копирование базы данных...
if exist "backend\database.db" (
    copy "backend\database.db" "backups\database_backup_%TIMESTAMP%.db"
    echo [УСПЕХ] База данных скопирована
) else (
    echo [ПРЕДУПРЕЖДЕНИЕ] database.db не найден
)

echo Копирование .env...
if exist ".env" (
    copy ".env" "backups\env_backup_%TIMESTAMP%.txt"
    echo [УСПЕХ] .env скопирован
) else (
    echo [ПРЕДУПРЕЖДЕНИЕ] .env не найден
)

echo.
echo Backup создан в папке backups
dir backups

pause