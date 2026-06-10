from datetime import datetime
from pathlib import Path
import os
import sys

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from models import (
    get_comments,
    get_db,
    init_db,
    like_comment,
    save_comment,
    save_gym_order,
    save_order,
    save_rent_order,
)

# Загружаем .env из корня проекта
env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
    print(f"✅ .env загружен из {env_path}")
else:
    print(f"⚠️ .env не найден в {env_path}, использую значения по умолчанию")

# Добавляем backend в путь
backend_path = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_path)

# Создаём приложение
app = Flask(__name__, static_folder="../frontend", static_url_path="")

# Настройка CORS
cors_origins = os.environ.get("CORS_ORIGINS", "*")
CORS(app, origins=cors_origins.split(",") if cors_origins != "*" else "*")

# Инициализация БД
try:
    init_db()
    print("✅ База данных инициализирована")
except Exception as e:
    print(f"⚠️ Ошибка инициализации БД: {e}")

# Проверка наличия фронтенда
frontend_path = Path(__file__).parent.parent / "frontend"
if frontend_path.exists():
    print(f"✅ Фронтенд найден: {frontend_path}")
else:
    print(f"⚠️ Папка фронтенда не найдена: {frontend_path}")

print("\n" + "=" * 50)
print("🚀 Футбольная секция «Высота»")
print("📱 Сайт: http://localhost:5000")
print("📡 API: http://localhost:5000/api/products")
print("=" * 50 + "\n")

# ==================== API Endpoints ====================


@app.route("/")
def serve_index():
    """Главная страница"""
    try:
        return send_from_directory("../frontend", "index.html")
    except Exception as e:
        return (
            f"Ошибка: {e}. Проверьте, что файл index.html существует в папке frontend",
            404,
        )


@app.route("/<path:path>")
def serve_static(path):
    """Статические файлы фронтенда"""
    try:
        return send_from_directory("../frontend", path)
    except Exception as e:
        return f"Файл {path} не найден: {e}", 404


# ==================== Товары ====================


@app.route("/api/products", methods=["GET"])
def get_products():
    """Получить все товары"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products")
        rows = cursor.fetchall()
        products = [dict(row) for row in rows]
        conn.close()
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    """Получить один товар"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return jsonify(dict(row))
        return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== Заказы ====================


@app.route("/api/orders", methods=["POST"])
def create_order():
    """Создать заказ из корзины"""
    try:
        data = request.json
        if not data.get("name") or not data.get("phone"):
            return jsonify({"error": "Name and phone are required"}), 400

        order_id = save_order(
            data["name"], data["phone"], data.get("items", []), data.get("total", 0)
        )
        return jsonify({"status": "success", "order_id": order_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== Отзывы ====================


@app.route("/api/comments", methods=["GET"])
def get_all_comments():
    """Получить все отзывы"""
    try:
        comments = get_comments()
        return jsonify(comments)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/comments", methods=["POST"])
def add_comment():
    """Добавить отзыв"""
    try:
        data = request.json

        # ВАЛИДАЦИЯ: проверяем, что имя и текст отзыва присутствуют
        if not data.get("name") or not data.get("text"):
            return jsonify({"error": "Name and text are required"}), 400

        date = datetime.now().strftime("%d.%m.%Y %H:%M")

        comment_id = save_comment(data["name"], data["text"], date)
        return jsonify({"status": "success", "id": comment_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/comments/<int:comment_id>/like", methods=["POST"])
def add_like(comment_id):
    """Поставить лайк отзыву"""
    try:
        like_comment(comment_id)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== Абонементы ====================


@app.route("/api/gym-orders", methods=["POST"])
def create_gym_order():
    """Заявка на абонемент"""
    try:
        data = request.json
        if not data.get("name") or not data.get("phone"):
            return jsonify({"error": "Name and phone are required"}), 400

        order_id = save_gym_order(
            data["name"], data["phone"], data.get("title", ""), data.get("price", "")
        )
        return jsonify({"status": "success", "order_id": order_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== Аренда ====================


@app.route("/api/rent-orders", methods=["POST"])
def create_rent_order():
    """Заявка на аренду"""
    try:
        data = request.json
        if not data.get("name") or not data.get("phone"):
            return jsonify({"error": "Name and phone are required"}), 400

        order_id = save_rent_order(
            data["name"], data["phone"], data.get("title", ""), data.get("price", "")
        )
        return jsonify({"status": "success", "order_id": order_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== Контакты ====================


@app.route("/api/contact", methods=["POST"])
def contact_form():
    """Обработка контактной формы"""
    try:
        data = request.json
        print(f"📝 Заявка с контактов: {data.get('name')} - {data.get('phone')}")
        return jsonify({"status": "success", "message": "Заявка принята"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== Запуск ====================

if __name__ == "__main__":
    debug_mode = os.environ.get("DEBUG", "True").lower() == "true"

    print("🟢 Запуск сервера...")
    print(f"🐛 Режим отладки: {'Включен' if debug_mode else 'Выключен'}")
    print("🌐 Сервер доступен по адресам:")
    print("   - http://localhost:5000")
    print("   - http://127.0.0.1:5000")
    print("")
    print("⏹️  Для остановки нажмите Ctrl+C")
    print("")

    app.run(debug=debug_mode, host="0.0.0.0", port=5000)
