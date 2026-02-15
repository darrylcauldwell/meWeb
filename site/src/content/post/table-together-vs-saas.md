---
title: "When the Perfect App Doesn't Exist: Building TableTogether Instead of Paying for Paprika 3"
date: "2026-01-15"
category: "apps"
description: "After years of juggling Paprika 3 and MyFitnessPal, I built the meal planning app I actually wanted. Is this the death of SaaS subscriptions, or just what AI-assisted development makes possible?"
tags:
  - "swift"
  - "ai"
---

We've been using Paprika 3 for recipe storage and meal planning for years. It's genuinely good software - well-designed, stable, does what it promises. We also use MyFitnessPal for calorie and macro tracking when we remember to log meals.

Here's the problem: these apps work in isolation. Meal planning in one app. Nutrition tracking in another. They don't talk to each other. They don't know that our household doesn't eat together every night. They don't understand that "Tuesday dinner" might mean one person eats at 6pm, another at 8pm after gym, and our teenager grabs leftovers whenever.

And most critically: Paprika 3 is designed for *a person* planning meals, not *a household* planning together. When my partner adds a recipe, I don't see it until we manually sync. When I plan Monday's dinner, there's no way to indicate who's actually eating it. When we need to track macros, we're manually calculating servings and copying nutrition data between apps.

This isn't Paprika's fault. It's a great app solving a different problem than the one we have.

So I built TableTogether.

## The App Juggling Problem

Our kitchen workflow looked like this:

**Sunday evening:** Open Paprika. Browse recipes. Drag some to the meal calendar. Hope my partner sees the plan.

**Monday morning:** Check MyFitnessPal. Yesterday's lunch wasn't logged. Guess at portion sizes. Manually enter macros from memory.

**Tuesday:** Partner texts "What's for dinner?" I check Paprika. "Chicken stir fry." They reply: "I'm eating out, just cook for you."

**Wednesday:** Open Paprika to see what we're cooking. Recipe serves 4. We're two people. Calculate halved ingredient quantities in my head while shopping.

**Friday:** Look at MyFitnessPal weekly summary. Half the meals not logged because it was too much friction to switch apps, search for recipes, estimate servings, enter everything manually.

This isn't terrible. People manage with worse systems. But it's *fragmented*. The meal planning app doesn't know about nutrition. The nutrition app doesn't know about meal plans. Neither knows about household dynamics.

And I kept thinking: these pieces should work together. Recipe storage + meal planning + macro tracking + household collaboration. One system. One source of truth.

## What I Actually Wanted

The goal was clear:

**Recipe Catalogue** - Store family recipes with structured ingredients (not just text). Import from URLs automatically. Keep photos, notes, prep times. Make them searchable.

**Collaborative Meal Planning** - A weekly view where anyone in the household can see what's cooking. Drag recipes to slots. Assign meals to household members. Mark when someone's eating out or having leftovers.

**Per-Household-Member Macro Tracking** - Track what *I* ate separately from what my partner ate. Even when we cooked the same recipe, we might eat different portions. The app should know this.

**Natural Language Calorie Estimation** - When I eat something not from the meal plan ("grabbed a sandwich at lunch"), describe it in plain English and get approximate macros. No searching databases for "turkey sandwich on wheat with mayo."

**Privacy-Focused** - Nutrition data stays personal. No sharing macro goals between household members. No comparisons. No leaderboards. Just personal insights if you want them.

**Calm Design** - No streaks. No badges. No "you haven't logged today!" notifications. Just a calm place to plan meals and optionally understand eating patterns.

This is what I wanted. This is what didn't exist as a single app.

## What Claude Code Made Possible

In November, I described this to Claude Code: "I want to combine Paprika's meal planning with MyFitnessPal's tracking, but designed for households where people eat apart."

What happened over the next month surprised me.

Claude Code understood the data model immediately. Ingredients as structured objects. Recipes with proper relationships. MealSlots that link to household members. Personal MealLogs separate from shared meal plans. This is complex relational data - the kind that would take days to design properly.

It took hours.

"Users should be able to drag recipes onto the weekly meal calendar, inspired by Things 3."

Claude Code implemented drag-and-drop. Not a prototype. Production-quality draggable recipe cards with drop targets, visual feedback, and proper SwiftData persistence.

"When generating grocery lists, intelligently aggregate ingredients. If two recipes need chicken, show total quantity needed."

It wrote the aggregation logic. Handled unit conversions. Grouped by ingredient category to match store layouts.

"Add natural language macro estimation - user types 'medium apple' and we approximate calories."

This was the part I thought would be hard. Claude Code integrated a macro estimation system based on common portion descriptions. Not perfect, but good enough for personal tracking.

By mid-December, I had TableTogether. Full recipe import. Collaborative meal planning with iCloud sync. Automated grocery lists. Personal macro tracking with natural language input. Built for actual household dynamics.

The app we actually needed.

## The Death of SaaS?

Here's the uncomfortable question: if I can build exactly the app I want in a month using Claude Code, why would I pay for existing apps that almost-but-not-quite fit my needs?

Paprika 3 is $5. MyFitnessPal is free with ads, or $10/month premium. Call it $10/month combined for both services.

TableTogether cost me... what exactly? A month of evenings. No subscription fees. No privacy compromises from free-tier data mining. No "almost what I need but not quite" friction. Just the exact tool for the exact problem.

This feels like a turning point.

**Before AI-assisted development:** You accept that paid apps won't perfectly fit your needs. The cost of building custom software was too high. You adapt your workflow to the tools available.

**After AI-assisted development:** The cost of building custom software collapsed. If an existing app is 80% of what you need, you can build the 100% version yourself in weeks instead of months.

Is this the death of SaaS apps like Paprika?

No. Not yet. Maybe not ever.

But it's a shift.

## What Still Works About Paid Apps

Paprika 3 is polished in ways TableTogether isn't. Years of edge case handling. Professional design. Comprehensive testing. Support infrastructure.

MyFitnessPal has a massive food database built over a decade. Barcode scanning. Restaurant menus. Community-contributed nutrition data.

TableTogether has none of this. It's tailored exactly to our household's needs, which means it wouldn't work for many other households. There's no onboarding flow for non-technical users. No customer support. No food database beyond what I've manually added.

For most people, Paprika 3 is still the better choice. It just works. No setup. No maintenance. No Claude Code required.

But for *us*? TableTogether is better. Not because it's more sophisticated. Because it's more *ours*.

## What AI-Assisted Development Changes

The critical shift isn't that Claude Code writes perfect code (it doesn't). It's that it collapsed the time between "I wish this worked differently" and "I built it to work differently."

**Recipe import from URLs?** Described the feature, Claude Code implemented a parser using standard Schema.org recipe markup. Took an afternoon, not a week.

**Household member assignment with iCloud sync?** Explained the data relationships, Claude Code wrote the SwiftData models with CloudKit integration. Two days, not two weeks.

**Natural language calorie estimation?** This one took iteration. First version was too rigid. Second version over-estimated everything. Third version balanced accuracy with simplicity. But we got there in days, not months.

This is the pattern: describe what you want, get working code, iterate until it fits, ship it.

The economic equation for "build vs. buy" fundamentally changed. Not for everyone. Not for every app. But for apps like this - tools that *almost* exist but not quite - the calculus shifted hard toward "build."

## What We Actually Use

TableTogether has been our household's meal planning system since early December. Real usage. Real grocery lists. Real tracked meals.

Here's what that looks like:

**Sunday evenings:** We drag recipes onto the weekly meal plan together. Partner adds Wednesday dinner. I add Thursday. We mark Friday as "eating out." Takes 10 minutes. Everyone sees the same plan instantly via iCloud.

**Grocery shopping:** Tap "Build Grocery List." TableTogether aggregates ingredients from the week's meals. Groups them by category (produce, protein, dairy). We shop from one shared list that both our phones can check off in real-time.

**Cooking:** Open the meal plan, tap the day's recipe, follow the instructions. Servings auto-adjust if we planned for 2 instead of the recipe's default 4.

**Macro tracking (optional):** After eating, I log "1.5 servings" to my personal meal log. TableTogether calculates macros from the recipe. Or I type "banana and peanut butter" and it estimates ~250 calories without me searching a database.

**Weekly insights (very optional):** Check the Insights tab. See a calm summary of the week's eating patterns. No judgment. No streaks. Just "steady protein intake this week" and a sparkline chart.

This is the workflow we wanted. Not Paprika's workflow. Not MyFitnessPal's workflow. Ours.

## The Economics Are Weird

I spent a month building this. That month could have been spent on paid work, or family time, or other projects. The opportunity cost isn't zero.

But I also learned SwiftUI patterns I'll use elsewhere. Practiced working with Claude Code on complex data models. Understood our household's food patterns better by designing a system around them.

And critically: the app *exists* now. We'll use it for years. No subscription fees. No wondering if the service will shut down. No feature requests that never get implemented because we're not the target market.

The upfront time investment feels worth it.

But would I do this for every app category? No.

**Would I build a custom email client?** Absolutely not. Email is complex. Security is critical. Apple Mail works fine.

**Would I build a custom password manager?** No way. Security-critical infrastructure deserves professional development and auditing.

**Would I build a custom weather app?** Probably not. The built-in Weather app is excellent.

**Would I build a custom meal planner when existing ones are 80% there?** Yes. Because the 20% gap was eating us daily, and AI-assisted development made closing that gap feasible.

This isn't "build everything." It's "build the things that genuinely fit your specific needs better than general solutions."

## What This Means for App Developers

If I'm thinking this way, others are too.

The market for "pretty good apps that kind of fit most people" might shrink. Why pay $10/month for 80% fit when you can build 100% fit in a month?

But the market for "exceptionally polished apps that would take months to replicate even with AI" probably grows. The difference between "working prototype" and "production-quality app with support, polish, and ongoing development" is still massive.

Paprika 3 is still better than TableTogether for most people. It's more complete. More tested. Better designed. Years of refinement show.

But TableTogether is better for *us*. And that's new. The ability to say "I'll just build what I actually want" wasn't economically viable before. Now it is.

## The Uncomfortable Truth

I haven't opened Paprika 3 in six weeks. My partner hasn't either. We're all-in on TableTogether now.

This doesn't mean Paprika is bad. It means the tool we built fits our specific needs better than the general-purpose tool we were adapting to.

That's the uncomfortable truth for SaaS apps in the AI-assisted development era: **"good enough for most people" stops being enough when "perfect for me" becomes achievable.**

Is this the death of SaaS? No.

Is this a warning sign that the bar for paid apps just got higher? Probably.

Users who can describe what they want and use Claude Code to build it won't tolerate "80% fit" anymore. The apps that survive are either:

1. **So polished and complete that replicating them would take months even with AI** (Paprika is close to this, honestly)
2. **So network-dependent that solo development can't match them** (social apps, marketplaces, etc.)
3. **So security-critical that DIY is unwise** (password managers, banking apps)

For everything else? The "I'll just build it" option is now on the table.

## What I Learned

Building TableTogether taught me something important: **the apps we think we need and the apps we actually need aren't always the same thing**.

I thought I needed better recipe organization. What I actually needed was household collaboration that respects that we don't always eat together.

I thought I needed better macro tracking. What I actually needed was low-friction logging that doesn't make eating feel like homework.

I thought I needed more features. What I actually needed was fewer features, better integrated, perfectly fitted to our actual workflow.

You only discover this by building it yourself. Paprika couldn't know our household dynamics. MyFitnessPal couldn't know our privacy preferences. Only we could.

And now, with Claude Code, "only we could" is enough.

## The Future Looks Different

I don't know if TableTogether represents the future of personal software or just a weird edge case enabled by AI-assisted development.

But I know this: I built an app that perfectly fits our household's needs. It replaces two paid apps. It took a month instead of a year. And we're happier with it than with the commercial alternatives.

That feels significant.

Maybe Paprika and MyFitnessPal survive because they're better for the 95% of users who don't want to build their own apps. Maybe they adapt by offering more customization to compete with DIY solutions. Maybe something else happens that I'm not seeing yet.

All I know is: the app I wanted didn't exist. So I built it. And that was suddenly, surprisingly, feasible.

Welcome to the era where "just build it yourself" stops being a punchline and starts being practical advice.

---

**TableTogether** is a household meal planning app built with SwiftUI and SwiftData. Learn more at [tabletogether.dreamfold.dev](https://apps.apple.com/app/table-together/).

**Technical notes:**
- **Stack:** SwiftUI, SwiftData, CloudKit for iCloud sync
- **Platforms:** iOS 17+, iPadOS 17+, tvOS 17+ (planned)
- **Design inspiration:** Things 3 (drag & drop), MacroFactor (calm insights), Paprika (recipe organization)
- **Development time:** ~4 weeks of evenings with Claude Code
- **Features:** Recipe import, collaborative meal planning, automated grocery lists, personal macro tracking, natural language calorie estimation
- **Status:** In daily use by our household since December 2025
