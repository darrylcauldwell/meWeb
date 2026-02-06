# Multi-stage Dockerfile for Astro site
# Stage 1: Build the Astro site
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the site and generate Pagefind index
RUN npm run build

# Stage 2: Serve with Caddy
FROM caddy:2-alpine

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Copy built site from builder stage
COPY --from=builder /app/dist /srv

# Copy static support site
COPY support /srv/support

# Health check (use --no-check-certificate as Caddy redirects HTTP to HTTPS)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider --no-check-certificate https://127.0.0.1/healthz || exit 1

# HTTP port
EXPOSE 80
# HTTPS port (for production)
EXPOSE 443
# Metrics port
EXPOSE 2019

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
