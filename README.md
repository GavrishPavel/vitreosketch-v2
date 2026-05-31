# vitreosketch-v2

VitreoSketch v2 with lysis trainer.

## Backend for short scene links

A minimal Node/Express backend is included in `server/`.

### API
- `POST /api/scenes` — save current scene, returns `{ id }`
- `GET /api/scenes/:id` — load saved scene
- `GET /api/health` — health check

### Run locally
```bash
npm install
npm start
```

By default it serves the static site and stores scenes in `server/data/scenes/`.
