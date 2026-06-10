# DEPLOYMENT.md

## 1. Где развернут проект
**Вариант:** Docker demo-stand  
**Адрес:** http://localhost:5000

## 2. Требования
- Docker Desktop (Windows/Mac) или Docker Engine (Linux)
- Docker Compose
- 1 GB свободной оперативной памяти
- Порт 5000 свободен

## 3. Команды развертывания
```bash
# Клонировать репозиторий
git clone https://github.com/duckiexD/web-uknow
cd web-uknow

# Скопировать конфигурацию
copy .env.production.example .env.production

# Запустить production версию
scripts\deploy.bat

# Или через Docker Compose напрямую
docker compose -f docker-compose.prod.yml up --build -d