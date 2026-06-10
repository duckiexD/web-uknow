@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo API тестирование
echo ========================================
echo.

echo 1. GET /api/products - список товаров
curl -s http://localhost:5000/api/products
echo.

echo 2. POST /api/comments - добавить отзыв
curl -X POST http://localhost:5000/api/comments -H "Content-Type: application/json" -d "{\"name\":\"Тест\",\"text\":\"Тестовый отзыв\"}"
echo.

echo 3. GET /api/comments - получить отзывы
curl -s http://localhost:5000/api/comments
echo.

echo 4. POST /api/gym-orders - заявка на абонемент
curl -X POST http://localhost:5000/api/gym-orders -H "Content-Type: application/json" -d "{\"name\":\"Иван\",\"phone\":\"+7 999 123-45-67\",\"title\":\"12 месяцев\",\"price\":\"24000\"}"
echo.

echo 5. POST /api/rent-orders - заявка на аренду
curl -X POST http://localhost:5000/api/rent-orders -H "Content-Type: application/json" -d "{\"name\":\"Петр\",\"phone\":\"+7 999 123-45-67\",\"title\":\"Аренда 1 час\",\"price\":\"3500\"}"
echo.

echo 6. Ошибочный запрос - несуществующий товар
curl -s http://localhost:5000/api/products/999999

echo.
echo [ГОТОВО] API тестирование завершено
pause