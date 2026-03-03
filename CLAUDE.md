# Claude Code Instructions

## Local Development

**Always use Docker Compose for local testing**, not the Astro dev server.

### Start Local Environment
```bash
cd site
docker compose up --build -d
```

### Access
- Site: http://localhost
- Presentations: http://localhost/presentations/
- Grafana: http://localhost/grafana
- Prometheus: http://localhost/prometheus

### Rebuild After Changes
```bash
cd site
docker compose down && docker compose up --build -d
```

### Stop
```bash
cd site
docker compose down
```

## Do NOT Use
- `npm run dev` (port 4321) - This bypasses the production Caddy configuration

## Presentations

Speaker notes are accessed by pressing **S** during a presentation. If notes don't appear, check for popup blockers.

## CI/CD

- CI runs on every push to any branch (spell check, image validation, unit tests, Docker build, E2E tests)
- Docker image push to GHCR only happens on `main`
- Deployment is manual (secrets not configured)
