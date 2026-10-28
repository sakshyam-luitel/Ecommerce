FROM python:3.13-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install --no-install-recommends --yes \
        build-essential \
        default-libmysqlclient-dev \
        libpq-dev \
        pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate --no-input && python manage.py shell -c \"from amazon_app.models import Products; from django.core.management import call_command; Products.objects.exists() or call_command('loaddata', 'data.json')\" && python manage.py runserver 0.0.0.0:8000"]
