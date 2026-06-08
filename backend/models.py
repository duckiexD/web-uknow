# -*- coding: utf-8 -*-
import sqlite3
import json
import os

DATABASE_PATH = os.environ.get("DATABASE_PATH", "database.db")


def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price INTEGER NOT NULL,
            image TEXT,
            category TEXT,
            article TEXT,
            description TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            items TEXT,
            total INTEGER,
            status TEXT DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            text TEXT NOT NULL,
            date TEXT,
            likes INTEGER DEFAULT 0
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS gym_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            subscription_title TEXT,
            subscription_price TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS rent_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            rent_title TEXT,
            rent_price TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        products = [
            (
                "Футболка Сборной России",
                1200,
                "images/fytbolka.jpeg",
                "Одежда",
                "VYS-001",
                "Официальная футболка Сборной России по футболу",
            ),
            (
                "Шорты Сборной России",
                900,
                "images/shorti.jpeg",
                "Одежда",
                "VYS-002",
                "Тренировочные шорты Сборной России",
            ),
            (
                "Мяч футбольный",
                2500,
                "images/myach.jpeg",
                "Инвентарь",
                "VYS-003",
                "Официальный мяч ЧМ 2018",
            ),
            (
                "Бутсы детские",
                3200,
                "images/bytsi.jpeg",
                "Инвентарь",
                "VYS-004",
                "Детские бутсы для игры на искусственном газоне",
            ),
            (
                "Кружка «Высота»",
                600,
                "images/kryzhka.jpeg",
                "Сувениры",
                "VYS-005",
                'Керамическая кружка секции "Высота"',
            ),
            (
                "Шарф болельщика",
                800,
                "images/scarf.jpeg",
                "Сувениры",
                "VYS-006",
                "Шарф болельщика с надписью Россия",
            ),
        ]
        cursor.executemany(
            """
            INSERT INTO products (name, price, image, category, article, description)
            VALUES (?, ?, ?, ?, ?, ?)
        """,
            products,
        )

    conn.commit()
    conn.close()


def save_order(customer_name, phone, items, total):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO orders (customer_name, phone, items, total, status)
        VALUES (?, ?, ?, ?, ?)
    """,
        (customer_name, phone, json.dumps(items), total, "new"),
    )
    order_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return order_id


def get_comments():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM comments ORDER BY id DESC")
    comments = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return comments


def save_comment(name, text, date):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO comments (name, text, date, likes)
        VALUES (?, ?, ?, ?)
    """,
        (name, text, date, 0),
    )
    comment_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return comment_id


def like_comment(comment_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE comments SET likes = likes + 1 WHERE id = ?", (comment_id,))
    conn.commit()
    conn.close()


def save_gym_order(customer_name, phone, subscription_title, subscription_price):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO gym_orders (customer_name, phone, subscription_title, subscription_price)
        VALUES (?, ?, ?, ?)
    """,
        (customer_name, phone, subscription_title, subscription_price),
    )
    order_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return order_id


def save_rent_order(customer_name, phone, rent_title, rent_price):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO rent_orders (customer_name, phone, rent_title, rent_price)
        VALUES (?, ?, ?, ?)
    """,
        (customer_name, phone, rent_title, rent_price),
    )
    order_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return order_id


print("✅ models.py загружен успешно")
