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
**frontend** service, add `API_URL` and `GOOGLE_CLIENT_ID` under **Environment**.
Set `BACKEND_URL` to the backend service URL, for example
`https://your-backend-service.onrender.com`—not to the frontend service URL.
Render passes these values to the container, and the Nginx entrypoint creates
`/usr/share/nginx/html/env.js` before Nginx starts. The generated file exists
only inside the running container and is not stored in GitHub.

Local Docker Compose defaults `BACKEND_URL` to `http://backend:8000`, while the
local `frontend/env.js` file remains available for running the frontend outside
Docker.

The browser reads these values from `window.env`. `API_URL` is exposed through
`window.apiUrl(path)` for frontend API requests. Leave `API_URL` empty when the
API is served from the same origin.
