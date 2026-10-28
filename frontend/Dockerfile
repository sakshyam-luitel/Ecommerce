FROM nginx:1.31-alpine-slim

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.d/40-frontend-env.sh /docker-entrypoint.d/40-frontend-env.sh

COPY index.html /usr/share/nginx/html/index.html
COPY static /usr/share/nginx/html/static
COPY templates /usr/share/nginx/html/templates

RUN chmod +x /docker-entrypoint.d/40-frontend-env.sh

EXPOSE 80
