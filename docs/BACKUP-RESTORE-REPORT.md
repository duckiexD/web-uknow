# BACKUP_RESTORE_REPORT.md

## Резервное копирование и восстановление

### Тип данных
- **База данных:** SQLite (файл `backend/database.db`)
- **Конфигурация:** `.env` файлы

### Инструменты
- Ручное копирование файлов
- Скрипты: `backup.bat`, `restore.bat`

### Процесс создания бэкапа

```bash
# Запуск бэкапа
scripts\backup.bat

# Результат:
# - Копирование database.db в backups/database_backup_20250610.db
# - Копирование .env в backups/env_backup_20250610.txt