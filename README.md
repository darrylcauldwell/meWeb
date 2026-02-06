# Personal Portfolio Site

An Astro-based personal portfolio site with blog posts, presentations, and CI/CD via GitHub Actions.

## Repository Structure

```
meWeb/
├── .github/workflows/        # CI/CD pipelines
├── site/                     # Astro static site
├── presentations/            # Presentation source files
│   └── sustainable-software/ # Keynote/PPTX sources
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker and Docker Compose (for production builds)

### Local Development

1. **Install dependencies:**
   ```bash
   cd site
   npm install
   ```

2. **Start the dev server:**
   ```bash
   cd site
   npm run dev
   ```

3. **Build for production:**
   ```bash
   cd site
   npm run build
   ```

### Docker Local Testing

Run the full Docker + Caddy stack locally:

1. **Start the stack:**
   ```bash
   cd site
   docker compose up --build
   ```

2. **Visit:**
   - Site: http://localhost
   - Health check: http://localhost/healthz
   - Grafana: http://localhost/grafana
   - Prometheus: http://localhost/prometheus

3. **Stop:**
   ```bash
   docker compose down
   ```

### Production Deployment (DigitalOcean)

1. **DNS:** Create A records on `dreamfold.dev` pointing to your droplet's IP address:
   - `blog` (site)
   - `ntfy` (push notifications)

2. **Bootstrap the droplet:** SSH into a fresh Ubuntu 22.04/24.04 droplet and run:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/darrylcauldwell/meWeb/main/scripts/deploy-droplet.sh | bash
   ```

   Defaults are baked in (`blog.dreamfold.dev`, etc.). Override with positional args if needed:

   ```bash
   curl -fsSL .../deploy-droplet.sh | bash -s -- mysite.example.com me@example.com
   ```

   This installs Docker, configures the firewall, clones the repo, writes the `.env`, and starts the production stack. The script is idempotent and safe to re-run.

3. **Verify:**
   ```bash
   docker ps                              # check containers are running
   docker logs meweb                      # check for cert acquisition
   curl -I https://blog.dreamfold.dev     # confirm 200 with valid TLS
   curl -I https://ntfy.dreamfold.dev     # confirm ntfy is reachable
   ```

   Caddy automatically obtains Let's Encrypt certificates, redirects HTTP to HTTPS, and renews certificates before expiry.

4. **Updating:**
   ```bash
   cd /opt/meWeb/site
   git pull
   docker compose -f docker-compose.production.yml pull
   docker compose -f docker-compose.production.yml up -d
   ```

### CI/CD

- **CI** (`ci.yml`) runs on push to `site/**`: lint, spell check, image validation, unit tests, then builds the Docker image, runs E2E tests against the container, and pushes to GHCR
- **Full browser matrix E2E** runs nightly via `e2e-full.yml`

## Components

### Astro Site

Static site with:
- Blog posts in `site/src/content/post/`
- Reveal.js presentations in `site/src/pages/presentations/`
- Presentation images in `site/public/presentations/`

### Presentations

Source files (Keynote, PowerPoint) are stored in `presentations/` alongside their reveal.js counterparts in the site.

## License

MIT
