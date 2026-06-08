FROM python:3.12-slim

WORKDIR /app

# Скопируем всё сразу (без промежуточных шагов)
COPY . .

# Установим зависимости
RUN pip install --no-cache-dir Flask==2.3.3 flask-cors==4.0.0 python-dotenv==1.0.0

EXPOSE 5000

CMD ["python", "backend/app.py"]