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
      indicator.innerHTML = '<span class="global-api-loading-label">Working</span><span class="global-api-loading-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
      Object.assign(indicator.style, {
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: "9999",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        minWidth: "92px",
        height: "34px",
        padding: "0 10px",
        borderRadius: "17px",
        background: "#16324F",
        color: "#fff",
        font: "600 12px Arial, sans-serif",
        boxShadow: "0 4px 14px rgba(0,0,0,.25)",
        animation: "global-api-loading-in .2s ease-out",
      });
      Object.assign(indicator.querySelector(".global-api-loading-dots").style, {
        display: "inline-flex",
        gap: "3px",
      });
      indicator.querySelectorAll(".global-api-loading-dots i").forEach((dot, index) => {
        Object.assign(dot.style, {
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "#fff",
          animation: "global-api-dot 1.1s ease-in-out " + (index * 0.15) + "s infinite",
        });
      });
      const style = document.createElement("style");
      style.textContent = "@keyframes global-api-loading-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } } @keyframes global-api-dot { 0%, 60%, 100% { opacity: .35; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }";
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
