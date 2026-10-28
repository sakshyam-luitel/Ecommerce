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

  For Render, create a Docker web service and add `API_URL` and
  `GOOGLE_CLIENT_ID` under **Environment**. Render passes them to the container,
  and the Nginx entrypoint creates `/usr/share/nginx/html/env.js` before Nginx
  starts. The generated file exists only inside the running container and is not
  stored in GitHub.

The browser reads these values from `window.env`. `API_URL` is exposed through
`window.apiUrl(path)` for frontend API requests. Leave `API_URL` empty when the
API is served from the same origin.
