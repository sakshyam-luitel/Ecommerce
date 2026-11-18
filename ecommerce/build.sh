#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
# Remove this line after the first successful deploy because it overwrites existing rows on every deploy.
python manage.py loaddata data.json
python manage.py createsuperuser --noinput || true