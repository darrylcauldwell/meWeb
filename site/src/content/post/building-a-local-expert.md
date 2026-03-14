---
title: "Building a Local Expert That Actually Knows the Docs"
date: "2026-03-14"
category: "ai"
description: "How a frustrating loop of muddled HealthKit code led to a local AI knowledge system, study material generator, and text-to-speech learning tool"
tags:
  - "ai"
  - "rag"
  - "ollama"
  - "mcp"
---

This morning Claude kept getting in a muddle with HealthKit code.

Not dramatically wrong — more like a bright colleague working from memory instead of checking the docs. It would pull from various pages across the internet, mix approaches from different API versions, and produce something that was close but not quite right. We were like two people giving each other directions from memory when there was a perfectly good map in the glovebox.

The thing is, Apple's documentation is actually good — thorough, well-structured, authoritative. The problem wasn't Claude's capability. It was the gap between what Claude could find in the moment and what the official documentation actually said.

So I went looking for a better way to bridge that gap.

## The Hidden API Nobody Talks About

Turns out Apple Developer documentation has an undocumented API that returns structured JSON for the entire documentation tree. Not scraped HTML. Not PDFs. Clean, hierarchical JSON with every framework, class, method, and discussion section properly structured. I'd spent hours wrestling with documentation access and the answer had been sitting there the whole time, quietly returning JSON to anyone who thought to ask.

This changed everything. Instead of hoping Claude would stumble onto the right documentation page, I could ingest the whole thing into a system designed for semantic search.

## Enter localExpert

The approach I wanted is called Retrieval-Augmented Generation — RAG for short. The idea is simple: instead of relying on an AI model's training data and whatever it can scrape on the fly, you give it access to a curated knowledge base. When the model needs to answer a question, it first retrieves the most relevant documents from that knowledge base, then generates its response grounded in that real source material. The "retrieval" part is what makes it different from just asking a chatbot and hoping for the best.

I built `localExpert` around a `pgvector` database — PostgreSQL with vector similarity search. Chunk the Apple documentation into meaningful segments, generate embeddings, store them, and expose a search interface that returns the most relevant documentation for any query.

Ingestion was the first challenge. Apple's documentation isn't flat — it's deeply nested with frameworks containing classes containing methods containing discussion sections. Getting the chunking right mattered. Too coarse and you lose precision. Too fine and you lose context. I landed on a strategy that preserved the hierarchical relationships while keeping chunks small enough for meaningful similarity matching.

One thing I learned early is that RAG works significantly better with smaller, focused datasets than with one massive pool of everything. Dumping all of Apple's documentation into a single collection and hoping similarity search would find the right needle was far less effective than partitioning by framework. `pgvector` collections made this straightforward — each framework gets its own collection, so when Claude asks about HealthKit, the search is scoped to HealthKit documentation, not competing with every SwiftUI tutorial and CoreData migration guide in the database. The precision improvement was noticeable immediately.

To validate that ingestion actually worked — that the vectors were sensible and the search returned relevant results rather than nonsense — I built an AI Workbench using Jupyter notebooks. Nothing fancy. Just a place to run queries, inspect results, and iterate on the chunking and embedding strategy without rebuilding the whole pipeline each time.

## Making Claude Ask the Expert

With a working knowledge base, the next step was obvious: give Claude direct access to it.

I built a local MCP server that exposes the `localExpert` search as a tool Claude Opus 4.6 can call. Now when Claude needs to write HealthKit code, instead of working from memory, it queries the local expert, gets back the actual Apple documentation, and writes code that matches reality.

The difference was immediate. No more circular corrections. No more mixed-up API versions. Claude would query the local expert, get the authoritative documentation back, and produce code that actually compiled.

## What Else Could a Local Expert Do?

This is where the day got interesting.

I'd solved my original problem — Claude getting muddled with HealthKit code — but I was sitting on something more general. A system that could ingest structured documentation, store it as searchable vectors, and serve it to any AI model that asked. The HealthKit use case was just the first instance.

I added Qwen3.5:27b running locally via Ollama and put a FastAPI UI in front of it. Now I had a local AI that could query the same knowledge base, completely independent of Claude, completely offline, completely private. For context, all of this runs on a MacBook Air M4 with 32GB RAM. The Qwen3.5:27b model alone needs around 16GB, so the extra headroom matters — there's the vector database, the FastAPI server, and Ollama all running alongside it. The Air handles it without complaint, which still feels like witchcraft.

It worked brilliantly.

## From Documentation to Study Material

I'd been reading about Alpha School — the approach that uses AI to enhance learning of complex technical topics. Not replacing teachers, but creating personalised study material that adapts to the learner. The idea stuck with me.

If I had a knowledge base I could populate with any domain, and a local AI that could query it, I could build a study system. Load authoritative source material, let the AI generate explanations, and create structured learning paths through complex topics.

Qwen3.5:27b is a strong technical model. Solid at reasoning through infrastructure and virtualisation concepts. So I started with something I know well: VMware VCAP exam preparation.

I loaded the exam guide — the official document that lists every objective and sub-objective the exam covers. For each objective, the system generates a detailed technical explanation grounded in the source material. Not generic summaries scraped from blog posts. Actual explanations built from the authoritative exam blueprint.

The text explanations were good. Clear, technically accurate, properly scoped to each objective.

Then I thought about when I actually have time to study.

## Learning While Walking the Dogs

Most of my spare time isn't spent at a desk. It's spent walking the dogs, driving, doing the hundred small errands that fill a day. Text-based study material is useless during any of that.

Piper TTS solved this. It takes the generated explanations and produces spoken audio — natural enough to listen to comfortably, fast enough to generate on demand. Now each exam objective has a corresponding audio file. Load them onto my phone, clip the leads on, and I'm studying VCAP objectives on a Tuesday morning walk through the park. There's a certain absurdity to learning enterprise virtualisation architecture while waiting for two spaniels to finish investigating a hedge.

There's something satisfying about a system where the knowledge flows from an official exam guide, through a vector database, into a local AI for explanation, and out through text-to-speech into my earbuds. Every link in that chain runs locally. No API calls to external services. No data leaving my machine.

## The Day That Kept Expanding

Today started with a specific annoyance — Claude getting muddled with Apple framework code — and ended with a local AI study system that generates audio learning material for professional certifications.

I didn't plan any of this as a single project. Each piece solved one problem, and each solution lined you up for the next — like a course where every fence sets the approach for the one after it. Fix the documentation access problem. Realise the fix is general-purpose. Add a local model. Realise the local model can do more than answer code questions. Add study material generation. Realise reading is a bottleneck. Add speech synthesis.

That's the trajectory that makes local AI exciting right now. Not because any single piece is revolutionary, but because the pieces compose. A vector database is just a database until you connect it to a language model. A language model is just a chatbot until you give it domain-specific knowledge. Text-to-speech is just a novelty until you connect it to generated content worth listening to.

## What's Next

The obvious next step is making the conversation bidirectional. Right now, I ask Qwen questions and it explains things. But real learning isn't one-directional. The most effective study technique I've ever used is being questioned — having someone probe whether I actually understand a concept or just recognise the words.

What if Qwen could ask me questions? Present a scenario from the VCAP objectives, ask me to explain the approach, then evaluate my answer against the source material in the knowledge base. Not a quiz with multiple-choice answers. An actual conversation where the AI probes my understanding, identifies gaps, and adapts its questions based on what I get wrong.

That's not a massive technical leap from where I am today. The knowledge base exists. The conversational model exists. The evaluation capability exists. It's mostly a matter of building the right prompting and conversation flow to tie them together.

And then there's the question of where it runs. The Qwen3.5:27b model I'm using needs around 16GB of RAM — fine on my MacBook Air M4 with 32GB, but too large for a phone. However, the iPhone 17 Pro Max ships with 12GB of RAM, and a quantised Qwen3.5:9b model fits comfortably within that. Smaller than the 27B I'm running on the Mac, but backed by a focused knowledge base, a 9B model could hold a genuinely useful technical conversation. The `pgvector` database lives on my Mac, so the iPhone would need its own lightweight vector store — but for a focused dataset like one exam guide, that's a solved problem. SQLite with vector extensions runs natively on iOS, and a single collection's worth of embeddings is small enough to bundle with an app. I wouldn't need pre-generated audio at all — just me, the dogs, and a pocket-sized subject matter expert. That's the part I want to test next.

I started this morning with Claude getting muddled over HealthKit. I'm ending it thinking about having conversations with a local AI tutor on my morning walk. Some days the thread just keeps pulling. I should probably walk the actual dogs now. The horse won't muck out its own stable either.
