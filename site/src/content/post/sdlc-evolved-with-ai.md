---
title: "Experience First, Architecture After: How AI Inverted My Thirty-Year Development Process"
date: "2026-03-03"
category: "career"
description: "For thirty years I started every feature in Sparx Enterprise Architect. Now I start by describing what a user does. Here's how AI-assisted development inverted my entire SDLC."
tags:
  - "ai"
---

I caught myself doing something strange this weekend. I was reviewing a feature I'd built with Claude Code - the running session tracker in TetraTrack - and I realised I hadn't once looked at the code structure. Not the view hierarchy. Not the data model. Not the separation of concerns.

Instead, I'd opened the app on my phone, started a run, watched the live stats update, and asked: **does this feel right?**

That's when it hit me. My entire development process has inverted. Not tweaked. Not adjusted. **Inverted.**

## The Old Way

For thirty years, my development process followed the same pattern. I was taught software engineering principles early in my career - structured analysis, design before code, formal SDLC - and they stuck.

**Start with the model.** Open Sparx Enterprise Architect. Draw the UML class diagrams. Map out the sequence diagrams. Get the model right first, then write the implementation to match. The code was an expression of the design, never the other way around.

**Code reviews were technical.** Does this follow SOLID principles? Does the implementation match the model? The review was about the code as an artefact.

**User experience came last.** Build the system, then wire up a UI. If the architecture was clean, the UX would follow. Or at least, that was the theory.

This produced maintainable systems with documented designs you could hand to new team members. But features took weeks, architecture decisions gated progress, and sometimes you'd build a beautifully modelled system that felt clunky to actually use.

## Experience First, Architecture After

Claude Code doesn't care about your sequence diagrams.

When I describe a feature now, I don't specify class hierarchies and pipeline patterns. I say **"a rider starts a session, puts their phone in a pocket, and sees live gait transitions on their Apple Watch."**

The features got better. Not because Claude Code is a better architect than me. Because starting with the experience forced me to think about what actually matters first.

I plan work the same way. GitHub issues describe **user outcomes**, not technical decomposition. Not "implement `RunSession` model with heart rate zone tracking" but "As a runner, I need to see my pace and heart rate zones during a session so I can stay in my target zone." Issues grouped into milestones that represent real capabilities - "running session tracking", not "v1.2 sensor refactor."

Each issue is a self-contained description of user value. I hand it to Claude Code, it picks the implementation, and I verify the outcome. Architecture still matters - but it happens **after** the experience works, not before.

## Reviewing by Using

I used to review pull requests by reading diffs line by line. **Technical review.** Now I review by using the app.

Claude Code generates the code. CI validates it compiles and passes tests. Fastlane pushes it to TestFlight. Then I pick up my phone and **use the feature as a real user would**.

I have Claude Code generate a user experience checklist for each feature - the manual steps to exercise the new functionality. Start a running session. Check the watch complication updates. Pause mid-run. Resume. End the session. Review the summary. I work through that checklist on a real device, on my wrist, in my hand.

Unit tests catch logic errors. SwiftLint catches style violations. The CI pipeline handles what I used to do manually in code review. What's left for me is the thing no automated system can evaluate: **does this actually solve the user's problem?**

## The Safety Net

Working this way requires trust, and that trust comes from automation.

A preflight check runs before every commit - unit tests and lint checks that take seconds and catch the obvious problems. Behind that, the full CI pipeline runs on every push: build for iPhone and iPad, build the watch app, run the tests. Fastlane archives and pushes to TestFlight so I can test on a real device within minutes.

This pipeline is what makes experience-focused review possible. The machines validate correctness. I validate the experience.

## Codifying It All

Here's where it gets meta: I've codified this entire workflow as rules that Claude Code follows.

A **global** `.claude/CLAUDE.md` applies to every project - the patterns that work everywhere. Issues-driven development: no work without a GitHub issue, every issue has acceptance criteria, every issue belongs to a milestone. Commit discipline: reference the issue number, keep commits atomic, never close issues automatically - I verify acceptance criteria myself on a real device. Plus testing patterns and security rules.

Then each project gets its own **project-level** `CLAUDE.md` with specific conventions. The iOS apps specify SwiftUI patterns with `@Observable` and Swift Testing. The web apps specify Docker conventions with Playwright. Same principles, different implementations. When they conflict, project rules win.

The result? When I start a new conversation with Claude Code on any project, it already knows how I work. **I've turned my development process into configuration.**

## The Uncomfortable Admission

I'm a better product developer now than I was as a code reviewer.

I spent decades getting good at reading code, spotting bugs, and understanding system design. Those skills aren't gone - they inform how I evaluate what Claude Code produces. But they're no longer the primary thing I do.

The primary thing I do is **decide if something works for users**. A perfectly modelled feature that nobody wants to use is worth less than a rough feature that solves a real problem.

## What This Means

My SDLC didn't just change tools. It changed **direction**.

**Before:** Design model drives architecture. Architecture drives code. Code gets reviewed against the model. Users adapt to what was built.

**After:** User experience drives features. Features get built. Architecture supports the features. Code gets validated automatically. I work through the experience checklist on a real device. I review the outcome.

Is this the right approach for every team? Probably not. Large teams need architectural governance that can't be captured in a markdown file. Complex distributed systems need upfront design that can't emerge from user stories alone.

But for a solo developer building production applications with AI assistance? Starting with experience, automating the technical review, and codifying the workflow in CLAUDE.md is the most productive way of working I've ever had.

And I say that as someone who's spent thirty years doing it the other way.
