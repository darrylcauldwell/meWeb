# Portable Observability Stack

A complete, reusable observability solution for Docker-based applications.

## Components

| Service | Purpose | Port |
|---------|---------|------|
| **Prometheus** | Metrics collection and storage | 9090 |
| **Grafana** | Visualization and dashboards | 3000 |
| **Loki** | Log aggregation | 3100 |
| **Promtail** | Log collection from Docker | - |
| **cAdvisor** | Container resource metrics | 8080 |

## Quick Start

### Option 1: Include in your docker-compose.yml

```yaml
include:
  - path: observability/docker-compose.yml

services:
  your-app:
    # ... your app config
    networks:
      - web

networks:
  web:
    driver: bridge
```

### Option 2: Run separately

```bash
docker-compose -f docker-compose.yml -f observability/docker-compose.yml up
```

## Dashboards

The stack includes three pre-configured Grafana dashboards:

| Dashboard | UID | Description |
|-----------|-----|-------------|
| **Container Metrics** | `container-metrics` | CPU, memory, network, disk I/O for all containers |
| **Logs** | `site-logs` | Live container logs with level filtering |
| **Caddy Web Server** | `caddy-metrics` | HTTP traffic metrics (app-specific example) |

## Customization

### Adding Your App's Metrics

1. Edit `prometheus/prometheus.yml`
2. Add a scrape config under "APP-SPECIFIC" section:

```yaml
- job_name: 'my-app'
  static_configs:
    - targets: ['my-app-container:metrics-port']
  metrics_path: /metrics  # if different from default
```

3. Create a custom Grafana dashboard in `grafana/provisioning/dashboards/dashboards/`

### Removing Caddy-Specific Metrics

If your app doesn't use Caddy:

1. Remove the `caddy` job from `prometheus/prometheus.yml`
2. Delete `grafana/provisioning/dashboards/dashboards/caddy.json`

## File Structure

```
observability/
├── docker-compose.yml          # Service definitions
├── README.md                   # This file
├── prometheus/
│   └── prometheus.yml          # Scrape configuration
├── grafana/
│   └── provisioning/
│       ├── datasources/
│       │   └── prometheus.yml  # Prometheus + Loki datasources
│       └── dashboards/
│           ├── dashboard.yml   # Dashboard provider config
│           └── dashboards/
│               ├── containers.json  # Generic container metrics
│               ├── logs.json        # Log viewer
│               └── caddy.json       # Caddy HTTP metrics (example)
├── loki/
│   └── loki-config.yml         # Loki configuration
└── promtail/
    └── promtail-config.yml     # Log collection config
```

## Accessing Services

When running with a reverse proxy (like Caddy):

- Grafana: `http://localhost/grafana`
- Prometheus: `http://localhost/prometheus`

Default Grafana credentials: `admin` / `admin`

## Data Retention

- **Prometheus**: 15 days (configurable in docker-compose.yml)
- **Loki**: 7 days (configurable in loki/loki-config.yml)

## Requirements

- Docker and Docker Compose v2+
- Your application must be on the `web` network
- For container metrics: Docker socket access (already configured)
