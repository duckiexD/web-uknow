@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Запуск тестов
echo ========================================
echo.

echo Проверка API товаров...
curl.exe -s http://localhost:5000/api/products > nul
if errorlevel 1 (
    echo [ОШИБКА] Сервер не запущен
) else (
    echo [УСПЕХ] API работает
)

echo.
echo Проверка API отзывов (успешный запрос)...
curl.exe -s -X POST http://localhost:5000/api/comments -H "Content-Type: application/json" -d "{\"name\":\"Тест\",\"text\":\"Отзыв\"}"

echo.
echo Проверка API отзывов (ошибочный запрос - пустое имя)...
curl.exe -s -X POST http://localhost:5000/api/comments -H "Content-Type: application/json" -d "{\"name\":\"\",\"text\":\"Тест\"}"

echo.
pause