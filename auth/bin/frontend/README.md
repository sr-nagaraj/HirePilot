# HirePilot Auth UI

Minimal React UI for testing the Spring Security JWT backend.

## Run

```bash
npm install
npm run dev
```

The app expects the backend on `http://localhost:8081`.

To use a different backend URL:

```bash
VITE_API_BASE_URL=http://localhost:8081 npm run dev
```

## What It Tests

- `GET /api/auth/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/demo/profile` without a token
- `GET /api/demo/profile` with `Authorization: Bearer <token>`
