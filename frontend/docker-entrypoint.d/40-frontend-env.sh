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

(() => {
  const originalFetch = window.fetch.bind(window);
  let activeRequests = 0;

  const setLoading = (isLoading) => {
    let indicator = document.getElementById("global-api-loading");
    if (!indicator && isLoading) {
      indicator = document.createElement("div");
      indicator.id = "global-api-loading";
      indicator.setAttribute("role", "status");
      indicator.setAttribute("aria-label", "Working");
      indicator.innerHTML = '<span class="global-api-loading-spinner"></span>';
      Object.assign(indicator.style, {
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: "9999",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        background: "#16324F",
        boxShadow: "0 4px 14px rgba(0,0,0,.25)",
      });
      const spinner = indicator.firstElementChild;
      Object.assign(spinner.style, {
        width: "16px",
        height: "16px",
        border: "2px solid rgba(255,255,255,.35)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "global-api-spin .75s linear infinite",
      });
      const style = document.createElement("style");
      style.textContent = "@keyframes global-api-spin { to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
      document.body.appendChild(indicator);
    }
    if (indicator) {
      indicator.hidden = !isLoading;
    }
  };

  window.fetch = async (input, init = {}) => {
    const requestUrl = typeof input === "string" ? input : input.url;
    const isApiRequest = requestUrl.startsWith(window.env.BROWSER_API_URL || "") ||
      requestUrl.includes("/api/");
    if (!isApiRequest) {
      return originalFetch(input, init);
    }

    const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
    const accessToken = localStorage.getItem("access_token");
    if (accessToken && !headers.has("Authorization")) {
      headers.set("Authorization", "Bearer " + accessToken);
    }

    activeRequests += 1;
    setLoading(true);
    try {
      return await originalFetch(input, {
        ...init,
        credentials: init.credentials || "include",
        headers,
      });
    } finally {
      activeRequests -= 1;
      if (activeRequests === 0) {
        setLoading(false);
      }
    }
  };
})();
EOF
