# Shazam Frontend (Videofy Web)

Standalone React + Vite web app for identifying movies, TV shows, and viral clips from video frames.

## Setup

```bash
npm install
cp .env.example .env   # fill in your keys
npm run dev            # http://localhost:5173
```

The dev server proxies `/api/*` to the backend (`VITE_API_URL`, default `http://localhost:8080`). Start `shazam-backend` first.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build
- `npm run typecheck` — TypeScript check

## Structure

- `src/pages/` — landing, home (scan), result, history, purchase
- `src/components/ui/` — shadcn/Radix UI components
- `src/api-client/` — typed API client + React Query hooks (formerly `@workspace/api-client-react`)
- `src/lib/scan-context.tsx` — scan result state
