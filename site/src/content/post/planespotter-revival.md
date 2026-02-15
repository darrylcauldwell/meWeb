---
title: "Reviving Planespotter: How Claude Code Rescued a Decade-Old Demo from API Death"
date: "2025-08-22"
category: "automation"
description: "Ten years ago, Yves Fauser built the perfect NSX micro-segmentation demo. Then the APIs died. Claude Code brought it back to life in days."
tags:
  - "python"
  - "kubernetes"
  - "ai"
---

Some demos become legendary. Yves Fauser's Planespotter is one of them.

In the mid-2010s, VMware NSX was revolutionary - software-defined networking that could micro-segment workloads with security policies that followed applications, not network topology. The technology was brilliant. Explaining it was hard. "We can create firewall rules that apply to applications regardless of where they run" sounds abstract until you see it working.

Yves built Planespotter to make it tangible. A microservices application that tracked aircraft using real-time ADS-B data. Multiple services talking to each other. Perfect for demonstrating how micro-segmentation could secure service-to-service communication. He demoed it at Network Field Day 17, and it was **spectacular**.

I was inspired. I took Yves's demo, customized it, and used it countless times to show customers how NSX could secure modern applications. It worked beautifully. Until it didn't.

## When Demos Die

Somewhere around 2019, the APIs Planespotter depended on changed. Some required registration. Some moved to different endpoints. Some just... stopped responding.

The demo stopped working. Searches returned nothing. Position tracking showed empty maps. The application still ran, but it was hollow - a microservices skeleton with no data flowing through it.

This was frustrating. I'd built presentations around this demo. Customers understood micro-segmentation concepts through seeing Planespotter's services talk to each other. Without it, I was back to abstract architecture diagrams.

## Failed Rescue Attempts

I tried to fix it. Multiple times.

**2020**: "I'll just update the API endpoints." Spent a weekend reading API documentation for aircraft tracking services. Found potential replacements. Got overwhelmed by authentication requirements and rate limits. Gave up.

**2021**: "I'll refactor the whole thing." Started rewriting the Flask frontend. Realized the database schema was tightly coupled to the old API response format. Would need to redesign everything. Ran out of time.

**2022**: "Maybe I can find a simpler API." Researched OpenSky Network, ADS-B Exchange, FlightAware. Each had different data formats, authentication schemes, rate limits. The combinatorial complexity of "which API + which auth method + which data format" paralyzed me.

**2023**: "I'll just fork it and document what's broken." Created issues. Wrote TODO lists. Did nothing.

Each attempt followed the same pattern: enthusiasm → complexity → overwhelm → abandonment. The gap between "I know what needs to happen" and "I can make it happen" was too wide. I didn't have the time. I didn't have the skills in the right combination. The demo stayed broken.

## Claude Opus Changes the Equation

In late 2024, I started experimenting with Claude Opus. Everyone was talking about AI-assisted development. I was skeptical - I'd seen overhyped technology before. But I wanted to test it on something real. Something I'd failed at multiple times.

I opened Claude Code and pointed it at my fork of Planespotter.

"This is a microservices demo app. It's broken because the APIs it depends on no longer work. Here's the repository. Help me understand what needs to change."

Claude Code analyzed the codebase. Identified the API dependencies. Explained the problem clearly: the app was using outdated aircraft tracking APIs with authentication requirements that had changed.

"Can we use OpenSky Network API instead? It has free anonymous access."

Claude Code examined OpenSky's API documentation, compared response formats, and suggested a migration path. Not just "yes, you could use OpenSky" but **specific code changes** with data model adjustments.

That's when I realized this was different from my previous attempts. I wasn't staring at API documentation trying to map old schemas to new formats. I was having a conversation about **what needed to happen**, and Claude Code was translating that into **how to make it happen**.

## The Refactoring

Over several evenings, Claude Code and I rebuilt Planespotter:

### Modernized the Stack

**Old**: Flask, outdated SQLAlchemy, custom CSS, Redis
**New**: FastAPI, SQLAlchemy 2.0, Bootstrap 5, Valkey

"The frontend is Flask. Should we stick with Flask or modernize?"

Claude Code suggested FastAPI - better async support, auto-generated API docs, cleaner endpoint definitions. It migrated the routes, updated templates, and generated Swagger documentation automatically.

### Fixed the Data Pipeline

**Old**: Broken APIs, stale data, no updates
**New**: OpenSky Network integration, real-time position tracking, cached positions

"We need to poll OpenSky for aircraft positions and cache them in Valkey. How should this work?"

Claude Code designed the `adsb-sync` service - an async Python worker that polls OpenSky every 30 seconds, caches positions with TTL, and handles rate limits gracefully. It even suggested the exact cache key structure for fast lookups.

### Added Modern Operations

**Old**: No tests, no CI, manual deployment
**New**: pytest test suites, GitHub Actions CI/CD, Docker Compose, Kubernetes manifests

"This needs to be deployable. What does a modern setup look like?"

Claude Code generated Docker Compose for local development, Kubernetes manifests with Kustomize overlays, health checks for liveness/readiness probes, and a complete CI pipeline that runs tests and builds multi-arch images.

### Integrated Observability

**Old**: Logs to stdout, no metrics, manual debugging
**New**: Prometheus metrics, Loki logs, Promtail collection, Grafana dashboards

"I want observability - Prometheus, Loki, Grafana. How do we instrument this?"

Claude Code added Prometheus metrics endpoints to each service, configured Loki for log aggregation, set up Promtail for log shipping, and suggested a Grafana dashboard structure. This wasn't just "here's a config file" - it explained **why** each metric mattered for microservices monitoring.

## What Actually Happened

The entire refactoring took about a week of evenings. Not months. Not a failed attempt that got abandoned. **A week**.

Each evening, I'd describe what I wanted next:
- "Make the search faster by adding indexes"
- "Add health checks that verify database and cache connectivity"
- "Create a GitHub Actions workflow that builds and pushes images"
- "Write pytest tests for the API endpoints"

Claude Code would implement it. I'd review. We'd iterate. The codebase improved incrementally, steadily, without the paralysis of "where do I even start?"

By the end, Planespotter wasn't just **working** - it was **better than the original**. Modern framework. Clean architecture. Tested. Deployable. Observable. Production-ready.

## The Demo Lives Again

I deployed the refactored Planespotter to my homelab. Opened the frontend. Searched for aircraft.

**It worked.**

Real aircraft. Real positions. Live tracking on a map. The microservices talking to each other exactly how Yves designed a decade ago, but with modern infrastructure underneath.

I could demo NSX micro-segmentation again. Show how policies can isolate the database, restrict API access, secure service-to-service communication. The demo Yves built to make abstract networking concepts tangible was tangible again.

## What Made This Different

I'd tried to fix Planespotter four times before Claude Code. Each attempt failed for the same reason: the gap between understanding **what** needed to happen and knowing **how** to implement it was too wide.

With Claude Code, that gap disappeared.

"We need to migrate from the old API to OpenSky" became concrete code changes. "This needs tests" became a test suite. "I want observability" became instrumented services with dashboards.

The multiplier isn't just speed. It's **removing blockers**. When you hit "I don't know how to do this part," Claude Code knows how. The stopping point becomes "I've run out of time" not "I've hit something I can't figure out."

## Lessons from Resurrection

**1. Technical debt has a shelf life**

Planespotter worked for years, then died because dependencies changed. This happens to all software. The question isn't "will this break?" but "can I fix it when it breaks?" AI-assisted development changes the answer from "probably not" to "probably yes."

**2. Modernization is easier than I thought**

Migrating from Flask to FastAPI, adding CI/CD, instrumenting observability - these felt like huge projects. With Claude Code, they were afternoon tasks. The barrier to "let's modernize this" dropped dramatically.

**3. Demo apps matter**

Planespotter taught customers about micro-segmentation better than any diagram could. When it died, I lost an effective teaching tool. Having it back isn't just nostalgia - it's practical. Good demos have lasting value.

**4. Standing on giants' shoulders**

Yves built something brilliant in 2017. I get to maintain and extend it in 2025 with tools he didn't have. The demo is his. The modernization is mine. The collaboration across time and technology is satisfying.

## What's Next

Planespotter is deployed at [planespotter.dreamfold.dev](https://planespotter.dreamfold.dev). The code is on GitHub. The observability stack runs in my homelab alongside other monitoring.

More importantly, I can demo NSX concepts again. Show customers how micro-segmentation works with real traffic flowing between real services. The demo Yves built a decade ago works again, and that feels like preserving something valuable.

I've sent Yves a message letting him know his demo lives on. I don't know if he still thinks about Planespotter - he's moved on to other brilliant work. But I wanted him to know: the thing he built to make complex networking concepts tangible still does that job. Just with FastAPI instead of Flask, and Valkey instead of Redis.

Some demos deserve to keep flying.

## Technical Notes

For those interested in the modernization details:

**Architecture:**
```
Browser → Frontend (FastAPI + Jinja2)
       → API Server (FastAPI + SQLAlchemy 2.0)
       → PostgreSQL 15 (aircraft metadata)
       → Valkey 8 (position cache) ← ADSB-Sync (OpenSky poller)
```

**Stack Changes:**
- Python 3.11 (from 2.7)
- FastAPI (from Flask)
- SQLAlchemy 2.0 (from 1.x)
- Valkey (from Redis)
- Bootstrap 5 (from custom CSS)
- OpenSky Network API (from defunct APIs)

**New Capabilities:**
- pytest test suites with coverage
- GitHub Actions CI/CD
- Multi-arch container images (amd64/arm64)
- Kubernetes deployment with Kustomize
- Prometheus + Loki + Grafana observability
- Health checks for liveness/readiness

The refactoring preserved Yves's original MIT license and architecture vision while modernizing everything else. The demo works. The code is maintainable. The deployment is automated.

That's all I wanted, four failed attempts ago.

---

**View the live demo:** [planespotter.dreamfold.dev](https://planespotter.dreamfold.dev)
**Source code:** [GitHub](https://github.com/darrylcauldwell/planespotter)
**Original by Yves Fauser:** Network Field Day 17 (2017)
