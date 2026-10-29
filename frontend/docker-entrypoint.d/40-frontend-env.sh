#!/bin/sh
set -eu

escape_js_string() {
    printf '%s' "${1-}" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\r/\\r/g; s/\n/\\n/g'
}

api_url="$(escape_js_string "${API_URL-}")"
backend_url="$(escape_js_string "${BACKEND_URL-}")"
browser_api_url="$(escape_js_string "${BROWSER_API_URL-}")"
google_client_id="$(escape_js_string "${GOOGLE_CLIENT_ID-}")"

cat > /usr/share/nginx/html/env.js <<EOF
window.env = Object.freeze({
  API_URL: "${api_url}",
  BACKEND_URL: "${backend_url}",
  BROWSER_API_URL: "${browser_api_url}",
  GOOGLE_CLIENT_ID: "${google_client_id}"
});

window.apiUrl = (path) => {
  const baseUrl = (
    window.env.BROWSER_API_URL ||
    window.env.API_URL ||
    window.env.BACKEND_URL ||
    window.location.origin
  ).replace(/\/+$/, "");
  return baseUrl + "/" + String(path).replace(/^\/+/, "");
};
EOF
