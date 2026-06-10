@echo off
chcp 65001 > nul
cd /d "%~dp0\.."

echo ========================================
echo Запуск тестов
echo ========================================
echo.

echo Проверка доступности сайта...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:5000

echo.
echo Проверка API товаров...
curl -s http://localhost:5000/api/products | findstr "Футболка"

if errorlevel 1 (
    echo [ОШИБКА] API товаров не работает
) else (
    echo [УСПЕХ] API товаров работает
)

echo.
echo Проверка API отзывов...
curl -s http://localhost:5000/api/comments

echo.
echo [ГОТОВО] Тесты завершены
pause