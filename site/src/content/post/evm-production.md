---
title: "From Expired Certificate to Production HR System: Building Equestrian Venue Manager with Claude Code"
date: "2026-01-28"
category: "apps"
description: "How an expired SSL certificate led to building a full equestrian management system that became a production HR platform people's paychecks depend on."
tags:
  - "python"
  - "react"
  - "ai"
---

Our horse lives at what I can only describe as a cross between a health spa and a five-star all-inclusive hotel. The yard is exceptional - genuinely focused on horse welfare, with staff who understand that horses have personalities, preferences, and moods just like people do.

But in late October, their website SSL certificate expired. Bookings stopped. Phones rang constantly. The frustration was palpable.

They had a WordPress site with some booking plugins. Functional, but fragile. When the certificate expired, they lost bookings for weeks while sorting out renewal with their web provider. By the time I'd built them a replacement booking system, they'd already renewed the certificate and the urgency had passed. The code sat on my laptop, unused.

## November: A Second Chance

In early November, I was exploring Claude Code and looking for a real-world project to understand its capabilities beyond toy examples. I remembered the stale booking system code and thought: what if I could turn this into something more useful?

I opened Claude Code and described the problem: "I have a basic arena booking system. Equestrian yards need more than bookings - they need horse management, turnout planning, health tracking, and billing. Can we expand this?"

What happened over the next month surprised me.

## Building in Public (Sort Of)

I wasn't building with a customer in mind. I was exploring what Claude Code could do when given a complex domain with real constraints. Equestrian venues have intricate workflows:

- Horses have companion preferences. Some get on, some don't, some absolutely cannot be in the same field.
- Turnout planning isn't just "put horses outside" - it's a daily puzzle of relationships, field capacity, and weather.
- Health tracking isn't optional. Farrier visits every 6-8 weeks. Vaccinations annually. Worming on rotation. Miss these and you have welfare issues.
- Rehabilitation horses need custom care plans with daily task schedules. Insurance companies need detailed statements.

I described these workflows to Claude Code. It suggested data models. I reviewed them. We iterated. Features emerged:

- Arena booking with Stripe integration
- Horse profiles with photos, personality traits, and special requirements
- Turnout management with companion validation
- Comprehensive health tracking (farrier, dentist, vaccinations, worming, weight, body condition scoring)
- Rehabilitation program management with insurance statement generation
- Livery billing with pro-rata calculations and PDF invoices

By mid-December, I had something that looked like a real system. Contract management with DocuSign integration. A professional directory for farriers and vets. A community noticeboard. Land management with government grant tracking.

It was impressive. It was also entirely theoretical. No one was using it.

## The Christmas Conversation

A week before Christmas, I was at the yard and mentioned to the owners that I'd been building a venue management system. "Would it work as a timesheet and holiday booking system?" they asked.

This was not the question I expected.

They explained: staff were tracking hours on paper. Holiday requests were verbal. Payroll was manual spreadsheet work. They'd been looking at HR software but everything was either too expensive or too generic - designed for offices, not yards where "clock in" might happen while feeding horses in the dark at 6am.

"I think so," I said. "Let me look."

## The Christmas Gift

I spent the week before Christmas focused entirely on HR features. Not the fun stuff. The essential, paycheck-depending-on-this stuff:

- **Digital timesheets** with clock-in/out and break tracking
- **Holiday request workflow** with approval chain and balance tracking
- **Annual leave dashboard** showing entitlement, taken, pending, and remaining days
- **Unplanned absence recording** for sickness and emergencies
- **Payroll information management** with bank details and hourly rates

Claude Code handled the complexity surprisingly well. "I need leave requests to check if someone already has approved leave for those dates." It generated the validation logic. "Payroll export needs to include regular hours, tips from the thanks feature, and any adjustments." It built the export function.

On Christmas Eve, I delivered it. They started using it immediately.

## Production Changes Everything

For the past month, this has been their HR system. Staff clock in and out daily. Holiday requests flow through the approval process. Payroll happens from exported timesheets.

This changed how I use Claude Code.

When it's a proof of concept, you forgive rough edges. When people's paychecks depend on it, every edge case matters.

A staff member tried to request holiday for dates they'd already requested. The system allowed it. That shouldn't happen. "Prevent duplicate leave requests for the same date range," I told Claude Code. It added the validation.

Someone clocked in, forgot to clock out, and their timesheet showed 16 hours worked. We needed a maximum shift length check. Claude Code added it.

The payroll export rounded hours to 2 decimal places, but the client needed 4 decimal places for their accounting system. "Change rounding precision in payroll export." Done.

These aren't interesting problems. They're tedious, essential problems. The kind that make production systems work or break them.

## The Unexpected Workflow

What's fascinating is how the yard actually uses EVM. They didn't adopt it all at once. They started with timesheets and holidays because those were painful. Then they added staff profiles with qualifications and DBS checks because BHS inspections require them. Then they started using the thanks feature - livery owners can send appreciation messages to staff, with optional tips.

The features I thought would be most valuable - arena bookings, turnout management, health tracking - they're using occasionally but not religiously. The HR features are mission-critical. People check their holiday balance before booking flights. Payroll happens from the system exports. Gate codes rotate automatically.

This is the difference between building something neat and building something people depend on.

## What Claude Code Gets Right in Production

**1. Validation Logic**

I can describe business rules in plain English and Claude Code translates them into database constraints, API validation, and frontend checks. "A staff member can't request leave if they already have approved leave for those dates." It generates the SQL query, the FastAPI endpoint validation, and the React form error handling.

**2. Edge Case Handling**

"What happens if someone clocks in twice without clocking out?" Claude Code doesn't just fix the immediate bug - it suggests related fixes. "Should we also prevent clocking out without clocking in? Should we limit maximum shift duration?"

**3. Data Migration**

When I realized we needed to track annual leave entitlements separately from used leave (because entitlements change annually), Claude Code wrote the Alembic migration, updated the models, modified the API endpoints, and adjusted the frontend calculations. In production. Without breaking existing data.

## What's Still Hard

**Testing production data**. Claude Code can write unit tests beautifully. Integration tests require more hand-holding. But the hardest part is testing with real data that has accumulated over weeks of use. "Make sure this change doesn't break payroll exports" means I need to verify against actual timesheet data, not synthetic test data.

**Performance at scale**. The leave overview dashboard loads instantly for 6 staff members. What happens with 30? 60? Claude Code can suggest optimizations, but I need to measure and validate them.

**Security review**. Claude Code generates authentication checks and role-based access control. But verifying that no endpoint accidentally exposes data it shouldn't requires systematic review. I trust Claude Code's code generation. I don't trust that I've asked it the right security questions.

## The Features They Actually Want

After a month in production, here's what the yard is asking for:

- **SMS notifications** when leave requests are approved/denied
- **Shift swap requests** between staff members
- **Birthday and work anniversary alerts** for the admin dashboard (this one's sweet - they want to celebrate milestones)
- **Staff appreciation wall** showing recent thanks messages (anonymized)

None of these were in my original vision. They emerged from actual use.

## Lessons from Production

**1. You don't know what matters until it's live**

I thought turnout management would be the killer feature. It's used, but it's not essential. Timesheets are essential. This only becomes clear when real money depends on the system.

**2. Edge cases appear slowly**

The first week in production was smooth. The second week revealed issues with leave request validation. The third week exposed rounding precision problems in payroll. The fourth week showed timezone handling bugs in shift scheduling. These aren't failures of Claude Code - they're failures of imagination. You can't anticipate every edge case. Production finds them for you.

**3. Data migration is scarier than new features**

Adding a new feature? Easy. Changing how existing data works? Terrifying. Claude Code handles migrations well technically, but the risk assessment is all mine. "If this migration fails, does it corrupt existing timesheets?" That's not a question Claude Code can answer.

**4. Production debugging is different**

"The leave approval button isn't working" becomes a detective story. Is it frontend validation? API endpoint logic? Database constraint? Claude Code can help debug each layer, but I need to know which layer to investigate first.

**5. You become the support team**

At 9pm on a Friday, a staff member texts: "I can't clock out." This is now my problem. Claude Code doesn't answer support texts. Understanding the system well enough to diagnose issues remotely is essential.

## What's Next

The yard wants to expand EVM to other features now that HR is solid. Arena bookings with automatic free access for livery clients. Horse health tracking with automated reminders for farrier visits. Rehabilitation program management for their injury recovery horses.

But the foundation is HR. Because that's what they need every single day. Everything else builds on that trust.

## The Meta-Lesson

Building LiveRail taught me that Claude Code makes rapid prototyping absurdly fast. Building EVM and watching it go into production taught me something different: **AI-assisted development still requires judgment, testing, and responsibility.**

Claude Code writes code faster than I can. It suggests solutions I wouldn't have thought of. It handles boilerplate beautifully. But it doesn't know that this system calculates paychecks. It doesn't feel the weight of "if this breaks, people don't get paid."

That part is still mine.

## Conclusion

From an expired SSL certificate to a production HR system people's livelihoods depend on - via Claude Code and a Christmas deadline. It's been a month of production use. Zero critical bugs. A few minor fixes. Steady feature requests driven by actual workflow needs.

The most surprising part? The yard owners asked me yesterday: "Could other equestrian venues use this?"

Maybe. The code is there. The domain knowledge is there. The production validation is happening right now, one payroll cycle at a time.

For now, it's one yard's solution to one problem. But it's a real solution. To a real problem. Built with AI assistance. Running in production.

And that feels like something worth writing about.

---

**Equestrian Venue Manager** is a comprehensive management system for equestrian venues. Learn more at [evm.dreamfold.dev](https://evm.dreamfold.dev).
