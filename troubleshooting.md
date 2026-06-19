# Troubleshooting

### `next not found` in the frontend container
Enter the container and reinstall dependencies:
```bash
docker compose run --rm frontend sh
npm install
```

### Frontend hot reload doesn't pick up changes (WSL2 / Windows)
File watching over bind mounts can be unreliable. The compose file already sets
`WATCHPACK_POLLING=true`; if it still misbehaves, restart the frontend service:
```bash
docker compose restart frontend
```

### Port already in use (8000 / 8080 / 5433)
Another process is using the port. Change `WEB_PORT`, `BACKEND_PORT` or
`DB_EXTERNAL_PORT` in `.env`, then `docker compose up` again.

### Backend can't connect to the database
- In Docker, the backend talks to the `db` service on `db:5432` (set automatically).
- Locally, the backend uses `localhost:5433` — make sure the dockerized db is up
  (`docker compose up db`) or point `DB_HOST`/`DB_PORT` at your own Postgres.

### `Error: Cannot find module '../lightningcss.*.node'`
Installing `node_modules` on a different OS than the container. Remove the lockfile
and reinstall, or install the optional binary manually:
```bash
npm install --save-optional lightningcss-linux-x64-gnu
```

### Fix "permission denied" on mounted files
```bash
sudo chown -R $USER:$USER .
```
