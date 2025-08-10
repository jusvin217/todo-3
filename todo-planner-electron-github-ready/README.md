# Todo Planner — Electron + React (Starter)

This is a starter Electron + React app with:
- Per-task timers (start/pause/reset)
- Weekly planner view (assign tasks to days)
- Country-themed background placeholders
- Simple Google Calendar helper placeholders (you must add CLIENT_ID and implement OAuth flow)

## Quick start (Windows / mac / linux for dev)

Requirements:
- Node.js 18+
- npm

Install:
```bash
npm install
```

Run in development (opens Electron):
```bash
npm run dev
```

Build renderer:
```bash
npm run build
```

Package Windows installer (requires electron-builder toolchain on Windows):
```bash
npm run dist
```

## Notes
- This starter uses in-memory token storage and placeholder assets. For production:
  - Use `keytar` for secure token storage.
  - Implement PKCE + loopback or system-browser OAuth flow for Google.
  - Replace placeholder images in `public/assets/` with real photos.
