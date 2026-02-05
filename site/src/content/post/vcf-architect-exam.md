---
title: "Preparing for the 2V0-13.25 VMware Cloud Foundation 9.0 Architect Exam"
date: "2026-02-05"
category: "vmware"
tags: ["vcf", "certification", "architect"]
description: "How I'm approaching the VCP-VCF Architect certification exam - breaking down the blueprint, mapping it to real VCF design work, and building study habits that stick."
thumbnail: "clarity-icons/code-144.svg"
---
I've been designing VCF environments for years. I've sat in workshops where stakeholders throw impossible requirements at me. I've drawn architecture diagrams on whiteboards at 2am trying to figure out how to make stretched clusters work across unreliable WAN links.

And yet, staring at the [2V0-13.25 exam guide](https://www.broadcom.com/support/education/vmware/certification/vcp-vcf-architect), I still felt that familiar imposter syndrome creeping in.

Can I actually pass this thing?

This post is me working through that question out loud - breaking down the blueprint, figuring out where to focus, and being honest about what I don't know yet.

## TL;DR

- **Sections 4 and 5 aren't tested** - Don't waste time on install/configure or troubleshoot/optimize content
- **It's a design exam** - You need to think in flows: requirements → conceptual → logical → physical
- **AMPRS is everything** - Availability, manageability, performance, recoverability, security. Every question.
- **Know your trade-offs** - The exam wants you to pick the right pattern and explain why

![VCF Exam Blueprint Structure](/images/vcf-exam-blueprint.svg)

## What this exam actually tests

60 questions. 135 minutes. Passing score of 300.

Those numbers don't tell you much. What matters is the "minimally qualified candidate" description buried in the exam guide. It's not asking if you can click through SDDC Manager. It's asking if you can think.

Can you take fuzzy business requirements and turn them into a VCF design that actually works?

Can you explain why you chose three workload domains instead of two?

Can you articulate the trade-off you made when you picked vSAN over external storage?

That's the exam. Design decisions and their consequences.

Here's what caught my attention: only three of the five blueprint sections have testable objectives. Sections 4 (Install/Configure) and 5 (Troubleshoot/Optimize) are explicitly marked as "no testable objectives."

I'll admit I spent a week studying upgrade procedures before I noticed that. Don't be me.

## Section 1: thinking like an architect

No product names here. Just pure architectural reasoning.

### Sorting stakeholder chaos

Every VCF project starts the same way. Someone says "we need high availability" without defining what that means. Someone else mentions "we have to use the existing network."

The exam expects you to sort this mess:

| Type | Example |
|------|---------|
| **Business requirement** | "Survive a site failure without revenue loss" |
| **Technical requirement** | "RPO 5 minutes, RTO 1 hour for Tier-1" |
| **Constraint** | "Must reuse existing racks and ToR switches" |
| **Risk** | "Only two engineers know NSX" |

That last one hits close to home. I've written it in real design documents.

When you see an exam scenario, train yourself to ask: what can I negotiate, what's fixed, and what might blow up in my face?

### The design layers

This trips people up more than it should.

| Layer | What you're deciding |
|-------|---------------------|
| **Conceptual** | VCF as platform, management domain, N workload domains, maybe multi-site |
| **Logical** | Fleet topology, NSX segments, where Aria lives, automation boundaries |
| **Physical** | Host specs, rack layouts, uplink counts, VLAN assignments |

The conceptual model doesn't have IP addresses. The physical design does. If you're putting `192.168.x.x` in your conceptual diagram, you've gone too far.

I learned this the hard way during a VCDX attempt years ago. The panellists kept pushing me back up the stack. "That's a physical detail. What's your logical justification?"

### AMPRS: the lens for everything

Every design choice affects at least one of these:

- **A**vailability
- **M**anageability
- **P**erformance
- **R**ecoverability
- **S**ecurity

When you pick stretched clusters over separate domains, you're trading manageability for availability. When you add a third site for witness, you're buying recoverability but adding complexity.

The exam wants you to articulate these trade-offs. Not just "I chose X" but "I chose X because it optimises for Y while accepting the risk of Z."

## Section 2: knowing the patterns

One line in the blueprint: "Based on a scenario, differentiate between VMware Cloud Foundation architecture options."

One line. Massive scope.

You need to know:

- Management domain vs VI workload domains
- Single-site vs multi-site
- Stretched clusters vs separate domains for DR
- Where NSX, vSAN, and Aria fit in VCF 9.0
- Principal vs non-principal clusters

The [VCF 9.0 docs](https://docs.vmware.com/en/VMware-Cloud-Foundation/index.html) cover all this. The challenge is knowing which pattern fits which scenario.

Four cameras feeding two inference applications? Probably doesn't need stretched clusters.

Fifty retail stores with local point-of-sale that must survive WAN outages? Different story.

## Section 3: where the exam lives

This section is basically your job description if you design VCF for a living.

### Requirements to conceptual model

Objectives 3.1 and 3.2 are about translating stakeholder input into something you can design against.

- One site or multiple?
- Optimising for availability, cost, or simplicity?
- What regulatory constraints apply?

Get this wrong and everything downstream is wrong too.

### Logical and physical design

Objectives 3.3 and 3.4 mirror each other - same topics, different abstraction levels:

| Design Area | Logical | Physical |
|-------------|---------|----------|
| Fleet topology | Domain count, management separation | Racks, hosts, sites |
| Networking | NSX topology, edge placement | Uplinks, VLANs, switches |
| Automation | Tool placement, integration | Compute footprint |
| Operations | Monitoring architecture | Agent placement |

The exam won't ask which Dell server to use. It will ask whether your physical choices support your logical design.

### The AMPRS objectives

Objectives 3.5 through 3.9 get specific:

| Axis | What you're designing for |
|------|--------------------------|
| **Availability** | Single-zone HA, cross-zone failover |
| **Manageability** | Lifecycle management, scalability |
| **Performance** | Meeting workload requirements |
| **Recoverability** | BC/DR for management and workloads |
| **Security** | Hardening management and workload layers |

### Migration, consumption, monitoring

The final objectives cover what happens after deployment:

- **Migration** - How do existing workloads get into VCF?
- **Consumption** - Tenant design, self-service, governance
- **Monitoring** - Observability for both management and workloads

This is where Aria experience matters. The blueprint expects you to think beyond "the platform boots" to "teams can actually use this."

## Back to the question

Can I pass this exam?

Honestly, I don't know yet. The blueprint is clear about what it tests. The [official docs](https://docs.vmware.com/en/VMware-Cloud-Foundation/index.html) cover the content. The patterns are familiar from real projects.

But there's a gap between doing the work and articulating why you did it that way.

That's what I'm working on. Taking designs I've already built and forcing myself to explain the trade-offs. Writing out the AMPRS justification for choices I made instinctively.

If you're preparing for this exam too, my advice is simple: don't study install procedures for sections that aren't tested. Focus on design decisions. Practice explaining your choices out loud.

The exam isn't checking if you can click buttons. It's checking if you can think like an architect.

And if you've been doing this work, you probably already can. You just need to prove it in 135 minutes.
