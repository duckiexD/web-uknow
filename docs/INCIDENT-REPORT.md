# INCIDENT_REPORT.md

## 1. Инцидент
API возвращает ошибку 500 при добавлении отзыва с пустым именем

## 2. Где обнаружено
Локальная разработка и Docker контейнер

## 3. Как воспроизвести
```bash
curl -X POST http://localhost:5000/api/comments \
  -H "Content-Type: application/json" \
  -d '{"name":"","text":"Тестовый отзыв"}'