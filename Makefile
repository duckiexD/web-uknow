.PHONY: help setup run check format docker-build docker-up docker-down logs clean

# Цвета для вывода
GREEN := \033[0;32m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Показать все доступные команды
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

setup: ## Установка зависимостей
	@echo "$(GREEN)Установка зависимостей...$(NC)"
	pip install -r backend/requirements.txt
	pip install ruff black
	@echo "$(GREEN)✅ Зависимости установлены$(NC)"

run: ## Локальный запуск сервера
	@echo "$(GREEN)Запуск сервера...$(NC)"
	@if [ ! -f .env ]; then cp .env.example .env; fi
	python backend/app.py

check: ## Проверка качества кода (линтер)
	@echo "$(GREEN)Запуск линтера ruff...$(NC)"
	ruff check backend/ --output-format=full
	@echo "$(GREEN)✅ Проверка пройдена$(NC)"

format: ## Форматирование кода
	@echo "$(GREEN)Форматирование кода black...$(NC)"
	black backend/
	@echo "$(GREEN)✅ Форматирование завершено$(NC)"

docker-build: ## Сборка Docker образа
	@echo "$(GREEN)Сборка Docker образа...$(NC)"
	docker compose build

docker-up: ## Запуск через Docker Compose
	@echo "$(GREEN)Запуск контейнеров...$(NC)"
	@if [ ! -f .env ]; then cp .env.example .env; fi
	docker compose up --build

docker-down: ## Остановка Docker контейнеров
	@echo "$(GREEN)Остановка контейнеров...$(NC)"
	docker compose down

logs: ## Просмотр логов Docker
	docker compose logs -f

clean: ## Очистка временных файлов
	@echo "$(GREEN)Очистка временных файлов...$(NC)"
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache 2>/dev/null || true
	rm -rf backend/database.db 2>/dev/null || true
	@echo "$(GREEN)✅ Очистка завершена$(NC)"