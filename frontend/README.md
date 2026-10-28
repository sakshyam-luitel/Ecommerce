# Static frontend container

The frontend image serves the static entrypoint at `/` with Nginx. The original
Django templates are also copied into the image for deployments that use them
directly from the backend.

## Runtime configuration

`env.js` is generated when the container starts, so values are injected at
runtime rather than baked into the image:

```sh
docker run --rm -p 8080:80 \
  -e API_URL=https://api.example.com \
  -e GOOGLE_CLIENT_ID=your-google-client-id \
  amazon-frontend
```

The browser reads these values from `window.env`. `API_URL` is exposed through
`window.apiUrl(path)` for frontend API requests. Leave `API_URL` empty when the
API is served from the same origin.
