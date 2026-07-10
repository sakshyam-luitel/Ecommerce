# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A Django-based Amazon clone. The Django project lives in `ecommerce/` (the repo root is one level above it). It serves two things from a single Django app:

1. **Server-rendered pages** via Django templates + vanilla JS in `static/scripts/` (the storefront the user actually browses).
2. **A JSON REST API** under `/api/v1/` consumed by that frontend JS, with JWT cookie auth for login/registration.

A separate React frontend existed earlier but was deleted (see git history: commits "Deleted the react project"). Do not assume a React/Vite frontend exists.

## Commands

All commands run from `ecommerce/` unless noted. The virtualenv is at the repo root (`.venv/`).

```bash
# Activate venv (Windows / Git Bash)
source ../.venv/Scripts/activate

# Install deps
pip install -r requirements.txt

# Run dev server
python manage.py runserver

# Migrations
python manage.py makemigrations
python manage.py migrate

# Load seed product/order data (do this after migrate on a fresh DB)
python manage.py loaddata data.json

# Tests (Django test runner)
python manage.py test                      # all tests
python manage.py test amazon_app           # one app
python manage.py test api.tests.SomeTest   # single test class/method

# Tailwind CSS (npm deps live in ecommerce/, not the repo root)
npm install
```

`build.sh` is the production/deploy build (Render): installs deps, `collectstatic`, `migrate`, then `loaddata data.json`.

## Architecture

### Two apps, one owns the models

- **`amazon_app`** — owns all models (`Products`, `Cart`, `Order`, `OrderItem` in `amazon_app/models.py`) and **all migrations**. Its views (`amazon_app/views.py`) only render templates (`login`, `register`, `products`/amazon, `checkout`, `orders`, `tracking`). Most page views require authentication via `@permission_classes([IsAuthenticated])`.
- **`api`** — the REST layer. Its views (`api/views.py`) are function-based `@api_view` handlers that **import models from `amazon_app`**. `api/models.py` is empty/commented — never add models here. Serializers are `ModelSerializer`s in `api/serializers.py`.

When changing a model, edit `amazon_app/models.py` and generate migrations in `amazon_app`.

### URL layout (`amazon_clone/urls.py`)

- `''` → `amazon_app.urls` (the HTML pages)
- `api/v1/` → `api.urls` (products, cart, cart/<pk>, order, order/<pk>, order_items)
- `api/auth/` and `api/auth/registration/` → `dj_rest_auth` (login, logout, registration, token refresh)

### Auth

JWT via `dj-rest-auth` + `simplejwt`, delivered as **httpOnly cookies** (`access-token` / `refresh-token`), configured in `REST_AUTH` / `SIMPLE_JWT` in `settings.py`. Access token lives 15 min, refresh 7 days with rotation + blacklist. Account identity is **email-based** (`ACCOUNT_AUTHENTICATION_METHOD = 'email'`, username not required) via `django-allauth`. DRF default permission is `IsAuthenticated`.

Note: several API views in `api/views.py` have their `@permission_classes([IsAuthenticated])` commented out but still call `request.user` — be aware when touching cart/order endpoints that some are effectively open while relying on `request.user`.

### Data model notes

- `Products.id` and `Cart.product_id` are `CharField` primary keys (string IDs from `data.json`), not integers.
- `Order.id` and `OrderItem.product_id` are UUIDs. `OrderSerializer` treats `id`/`user_id` as read-only; the view sets `id=uuid.uuid4()` and `user_id=request.user` on save.
- Migrations `0006`/`0007` renamed model fields to snake_case (`product_id`, `delivery_option_id`, etc.) — match that convention, except the legacy `priceCents` field which stays camelCase.

## Configuration

- Settings read from `ecommerce/.env` (gitignored) via `python-dotenv`. Required keys: `SECRET_KEY`, `DEBUG`, `DATABASE_URL` (parsed by `dj-database-url`). MySQL-style `DB_*` keys exist but the active `DATABASES` config uses `DATABASE_URL`; there is also a local `db.sqlite3`.
- Static files served via **WhiteNoise** with `CompressedManifestStaticFilesStorage`; run `collectstatic` before relying on static in production.
- `ALLOWED_HOSTS` includes `'*'` and `.onrender.com` (deploy target is Render). CORS is configured for `localhost:5173`.

## Seed data & encoding

- `ecommerce/data.json` is the Django fixture loaded via `loaddata`. There is also a top-level `data.json` (raw source data, 42KB).
- `fix_encoding.py` is a one-off utility to strip a BOM / re-encode `data.json` as UTF-8. Run it from `ecommerce/` if `loaddata` fails on encoding.
