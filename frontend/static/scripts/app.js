const routes = {
  "/": { template: "intro", scripts: ["login", "register", "intro"] },
  "/login/": { template: "login", scripts: ["login"] },
  "/register/": { template: "register", scripts: ["register"] },
  "/home/": { template: "home", scripts: ["home"] },
  "/checkout/": { template: "checkout", scripts: ["checkout"] },
  "/orders/": { template: "orders", scripts: ["orders"] },
  "/tracking/": { template: "tracking", scripts: ["tracking"] },
  "/auth/google/callback": { template: "callback", scripts: ["callback"] },
};

const scriptPaths = {
  home: "/static/scripts/home.js",
  callback: "/static/scripts/callback.js",
  checkout: "/static/scripts/checkout.js",
  intro: "/static/scripts/intro.js",
  login: "/static/scripts/login.js",
  orders: "/static/scripts/orders.js",
  register: "/static/scripts/register.js",
  tracking: "/static/scripts/tracking.js",
};

const routeAliases = {
  home: "/home/",
  checkout: "/checkout/",
  intro: "/",
  login: "/login/",
  orders: "/orders/",
  register: "/register/",
  tracking: "/tracking/",
};

const templateAliases = {
  amazon: "/home/",
  home: "/home/",
  checkout: "/checkout/",
  intro: "/",
  login: "/login/",
  orders: "/orders/",
  register: "/register/",
  tracking: "/tracking/",
};

const templateCache = new Map();

function getRoutePath(pathname) {
  if (routes[pathname]) {
    return pathname;
  }
  const withTrailingSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return routes[withTrailingSlash] ? withTrailingSlash : "/";
}

function getNavigationPath(pathname) {
  if (pathname === "/amazon/" || pathname === "/amazon") {
    return "/home/";
  }
  const templateMatch = pathname.match(/^\/templates\/([a-z-]+)\.html$/);
  if (templateMatch && templateAliases[templateMatch[1]]) {
    return templateAliases[templateMatch[1]];
  }
  return getRoutePath(pathname);
}

function normalizeTemplate(template) {
  return template
    .replace(/\{%\s*load\s+static\s*%\}\s*/g, "")
    .replace(/\{%\s*csrf_token\s*%\}/g, "")
    .replace(/\{\{\s*google_client_id\s*\}\}/g, window.env?.GOOGLE_CLIENT_ID || "")
    .replace(/\{%\s*url\s+['"]([^'"]+)['"]\s*%\}/g, (_, name) => routeAliases[name] || "/")
    .replace(/\/templates\/([a-z-]+)\.html/g, (_, name) => routeAliases[name] || "/")
    .replace(/\{%\s*include\s+["'](?:amazon|home)_header\.html["']\s*%\}/g, '<!-- HOME_HEADER -->')
    .replace(/<!--\s*AMAZON_HEADER\s*-->/g, '<!-- HOME_HEADER -->');
}

async function loadTemplate(templateName) {
  if (!templateCache.has(templateName)) {
    templateCache.set(
      templateName,
      fetch(`/templates/${templateName}.html`).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Unable to load frontend page: ${response.status}`);
        }
        return response.text();
      }),
    );
  }

  let template = normalizeTemplate(await templateCache.get(templateName));
  if (template.includes("<!-- HOME_HEADER -->")) {
    if (!templateCache.has("home_header")) {
      templateCache.set(
        "home_header",
        fetch("/templates/home_header.html").then(async (response) => {
          if (!response.ok) {
            throw new Error(`Unable to load storefront header: ${response.status}`);
          }
          return response.text();
        }),
      );
    }
    const header = normalizeTemplate(await templateCache.get("home_header"));
    template = template.replace("<!-- HOME_HEADER -->", header);
  }

  const document = new DOMParser().parseFromString(template, "text/html");
  document.querySelectorAll("script").forEach((script) => script.remove());
  return {
    body: document.body.innerHTML,
    title: document.title || "Ecommerce",
  };
}

async function loadPageScripts(scriptNames) {
  await Promise.all(
    scriptNames.map((name) => {
      const scriptPath = scriptPaths[name];
      return import(`${scriptPath}?route=${Date.now()}`);
    }),
  );
}

function navigate(path) {
  const url = new URL(path, window.location.origin);
  const routePath = getNavigationPath(url.pathname);
  if (url.origin !== window.location.origin || !routes[routePath]) {
    return false;
  }

  if (window.location.pathname !== routePath) {
    window.history.pushState({}, "", routePath + url.search);
  }
  render(routePath);
  return true;
}

window.navigateTo = (path) => navigate(path);

async function render(pathname) {
  const route = routes[getRoutePath(pathname)] || routes["/"];
  const app = document.getElementById("app");
  app.className = `route-${route.template}`;
  app.innerHTML = '<div class="page-loading">Loading…</div>';

  try {
    const page = await loadTemplate(route.template);
    app.innerHTML = page.body;
    document.title = page.title;
    try {
      await loadPageScripts(route.scripts);
    } catch (error) {
      console.error(`Unable to initialize ${route.template} page`, error);
    }
  } catch (error) {
    console.error(error);
    app.innerHTML = `<div class="page-error">Unable to load this page. ${error.message}</div>`;
  }
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || link.target || link.hasAttribute("download")) {
    return;
  }

  const url = new URL(link.href, window.location.origin);
  if (url.origin === window.location.origin && routes[getNavigationPath(url.pathname)]) {
    event.preventDefault();
    navigate(url.pathname + url.search);
  }
});

window.addEventListener("popstate", () => render(getNavigationPath(window.location.pathname)));
render(getNavigationPath(window.location.pathname));
