# Static frontend container

The frontend image serves the static entrypoint at `/` with Nginx. The original
Django templates are also copied into the image for deployments that use them
directly from the backend.

## Runtime configuration

`env.js` is generated when the container starts, so values are injected at
runtime rather than baked into the image. Do not commit `env.js`; configure
these variables in the deployment platform instead:

```sh
docker run --rm -p 8080:80 \
  -e API_URL=https://api.example.com \
  -e GOOGLE_CLIENT_ID=your-google-client-id \
  amazon-frontend
```

For Render, create separate backend and frontend web services. In the
**frontend** service, set `BROWSER_API_URL` to the backend service URL, for
example `https://your-backend-service.onrender.com`, and add
`GOOGLE_CLIENT_ID` under **Environment**. Browser API requests use
`BROWSER_API_URL`, then `API_URL`, then `BACKEND_URL`. `BACKEND_URL` remains the
Nginx upstream target, so it can be a Docker service name locally.
Render passes these values to the container, and the Nginx entrypoint creates
`/usr/share/nginx/html/env.js` before Nginx starts. The generated file exists
only inside the running container and is not stored in GitHub.

Local Docker Compose defaults `BACKEND_URL` to `http://backend:8000`, while the
local `frontend/env.js` file remains available for running the frontend outside
Docker.

For the backend Render service, set `FRONTEND_URL` and
`CORS_ALLOWED_ORIGINS` to the complete frontend origin, for example:

```text
FRONTEND_URL=https://your-frontend-service.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend-service.onrender.com
ALLOWED_HOSTS=your-backend-service.onrender.com
```

The backend uses secure cross-origin JWT cookies in production. Both services
must use HTTPS.

The browser reads these values from `window.env`. `API_URL` is exposed through
`window.apiUrl(path)` for frontend API requests. Leave `API_URL` empty when the
API is served from the same origin.
