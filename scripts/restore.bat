@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Восстановление из резервной копии
echo ========================================
echo.

echo Доступные бэкапы:
dir backups\*.db

echo.
set /p BACKUP_FILE="Введите имя файла для восстановления (из папки backups): "

if exist "backups\%BACKUP_FILE%" (
    echo Остановка контейнера...
    docker compose -f docker-compose.prod.yml down 2>nul
    
    echo Восстановление базы данных...
    copy "backups\%BACKUP_FILE%" "backend\database.db"
    
    echo Запуск контейнера...
    docker compose -f docker-compose.prod.yml up -d
    
    echo [УСПЕХ] Данные восстановлены
) else (
    echo [ОШИБКА] Файл %BACKUP_FILE% не найден
)

pause