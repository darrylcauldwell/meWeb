---
title: "Building LiveRail: How Claude Code Turned a Two-Hour Train Journey Into a Published App"
date: "2026-02-15"
category: "apps"
description: "How a frustrating evening juggling multiple apps led to building a bespoke train tracking solution with Claude Code during a delayed journey home."
tags:
  - "swift"
  - "ios"
  - "ai"
---

Last Wednesday I was in a London bar after work, half-present in conversation while frantically switching between apps. National Rail. Citymapper. Real Time Trains website. TfL Go. Each one gave me a piece of the puzzle, but none of them answered my actual question: **which train should I catch, and when do I need to leave to make it?**

I had an open return ticket. There were trains every hour, but some were delayed, some were on time, and the platforms varied. I needed to pick a train, check the tube journey time to St Pancras, and work out my departure window. All while trying to stay present with colleagues I hadn't seen in months.

## The App Juggling Problem

Here's what I was actually doing in that bar, phone in hand, context-switching between five different apps:

**Real Time Trains** had the detailed information I needed: upcoming departures, exact delay times (not just "delayed"), platform numbers, and a granular view of each train's progress through every landmark on the route. The 18:30 was showing 12 minutes late. The 19:30 was on time. But Real Time Trains doesn't know anything about how I'm getting to the station.

**Citymapper** showed me which tube line to take and how long the journey would be - about 25 minutes door-to-door from the bar. But it couldn't see the train delays. It would happily route me for a train that had already left or was about to leave by the time I reached the platform.

**National Rail Enquiries** gave me a broad overview of services, but its delay information was too coarse. "Expected 19:42" didn't tell me whether that was improving or getting worse.

**TfL Go** tracked the tube status and told me the District line had minor delays. Useful, but now I needed to mentally add that buffer to my Citymapper estimate.

**Google Maps** tried to synthesize everything into a single journey plan, but it couldn't combine real-time train delays with real-time tube routing. Its suggestions were always slightly wrong.

The actual decision tree in my head looked like this:
1. Check upcoming trains on Real Time Trains
2. Pick a target train based on delay status
3. Look up platform number (also on Real Time Trains)
4. Calculate tube journey time to that platform (Citymapper)
5. Add buffer for District line delays (TfL Go)
6. Mentally subtract current time
7. Decide whether to order another drink or leave now

Then, five minutes later, refresh Real Time Trains to see if the delay had changed, and repeat the entire process.

All of this while nodding along to a conversation about someone's house renovation. It felt absurd.

## The Signal Problem

I picked the 19:30, left the bar with what I thought was comfortable margin, and made it to the platform with minutes to spare. The train left on time. So far, so good.

Then it sat stationary for twenty minutes outside Luton with no announcement. When it finally moved, the onboard display showed an estimated arrival time that felt wildly optimistic. I texted my wife: "Running late, not sure when I'll be home." She asked for an ETA. I didn't have one.

The East Midlands line between London and Sheffield is notoriously patchy for mobile signal. Real Time Trains is excellent when you have connectivity - it shows exactly where the train is, which landmarks it's passed, and whether it's on time, early, or delayed by X minutes at each point. But it's a website, and it's useless in a tunnel or between stations when you lose signal.

I kept refreshing, waiting for signal, losing the page, reloading it. By the time I got an update, it was already outdated. The train was somewhere between Wellingborough and Kettering, or maybe past Kettering, or maybe stopped again. I had no idea.

What I needed was simple: an app that shows me upcoming trains and their status when I'm deciding which one to catch, then tracks the specific train I'm on and caches the data locally so I can see the last known position even when offline. Something that polls the live train API when signal is available and holds onto that information when it's not.

That app didn't exist. So I wrote it.

## Two Hours, One Working App (Thanks to Claude Code)

I opened Xcode and Claude Code. The train journey from London to Sheffield is roughly two hours. I had nothing better to do, and I was annoyed enough to be motivated.

Let me be clear: **building this in two hours was only possible because of Claude Code**. I'm not a professional iOS developer. I know Swift, I understand the basics of SwiftUI, but I don't have the Huxley2 API documentation memorized, I don't know SwiftData's caching patterns by heart, and I certainly can't scaffold a complete offline-capable networking layer from memory.

Claude Code does all of that.

The core functionality was straightforward:
- Fetch live train data from an API
- Show upcoming departures with delay information
- Let me select a specific train to track
- Cache the responses locally
- Update the UI with current position and estimated arrival
- Continue displaying cached data when offline

I described what I wanted in plain English. Claude Code scaffolded the SwiftUI app structure, suggested using Huxley2 (a REST proxy for National Rail's Darwin OpenLDBWS that I'd never heard of), and wrote the API service:

```swift
let response = try await session.data(
    from: URL(string: "https://huxley2.azurewebsites.net/departures/\(origin)/to/\(destination)")!
)
```

When I asked for offline caching, Claude Code implemented a SwiftData-backed cache service with automatic fallback:

```swift
func cacheDepartures(_ board: DepartureBoard, origin: String, destination: String) {
    let data = try JSONEncoder().encode(board)
    let cached = CachedDeparture(
        cacheKey: "\(origin)_\(destination)",
        jsonData: data
    )
    modelContext.insert(cached)
}
```

When I wanted connectivity monitoring so the app knows when to use cached data, Claude Code added `NWPathMonitor` with a reconnection callback that automatically resumes polling when signal returns.

I focused on describing the behavior I wanted. Claude Code handled the implementation details, API integration patterns, and SwiftData relationships. When something didn't work (and plenty didn't - train APIs return some wonderfully inconsistent data), I pasted the error, described what I expected, and Claude Code fixed it.

By the time I reached Sheffield, I had a functional app running in the iOS simulator on my laptop. It showed departures, tracked a service, and gracefully handled offline mode. The UI was basic but worked.

Two hours. One delayed train. One AI coding assistant.

## Saturday: The Surprisingly Quick Polish

On Saturday morning I decided to actually submit this to the App Store. That meant adding the features that make an iOS app feel native rather than just functional.

Again, Claude Code made this absurdly fast.

**Live Activities** took about 30 minutes. I told Claude Code I wanted lock screen tracking with progress updates. It scaffolded the `TrainActivityAttributes` struct, designed the compact and expanded views, and wired up ActivityKit with periodic 30-second updates. Now the train progress shows on my lock screen without opening the app.

**CarPlay** was another 30 minutes. I said "add CarPlay support for viewing departures." Claude Code created the `CarPlaySceneDelegate`, implemented the list and detail templates, and handled all the scene lifecycle. Perfect for checking trains while parked before leaving for the station.

**Home Screen Widget** took about 45 minutes. Claude Code generated the WidgetKit timeline provider, entry views, and configuration. The widget shows the next departure from saved journeys with automatic refresh.

**Saved Journeys** was trivial - Claude Code added the SwiftData model with origin and destination CRS codes, created the favorites UI with star icons, and implemented quick access buttons on the home screen.

**Multi-language support** was surprisingly fast. I asked for Welsh, French, German, and Spanish translations. Claude Code exported the String catalog, provided the translations, and imported them back. Five languages in about an hour.

The app icon took longer than any of these features. I'm not a designer, and neither is Claude Code.

Total time Saturday: about four hours. By Saturday afternoon, I submitted LiveRail to the App Store.

## The AI-Assisted Development Shift

Here's what actually happened: I described problems in English, and Claude Code translated them into working Swift. Not pseudocode. Not sketches. Production-quality code with proper error handling, Swift concurrency, and idiomatic patterns.

"I need to cache API responses for offline use with SwiftData" becomes a complete `CacheService` with fetch descriptors, expiration logic, and prune operations.

"Add CarPlay support" becomes a fully implemented scene delegate with list templates and detail views.

This isn't code completion or snippet insertion. Claude Code understands context across files, suggests architecture patterns, catches bugs before I run the code, and explains why certain approaches work better than others.

The mental model is completely different from traditional development. Instead of:
1. Research API documentation
2. Figure out the pattern
3. Write boilerplate
4. Handle edge cases
5. Debug weird errors

It's:
1. Describe what you want
2. Review the implementation
3. Ship it

The bottleneck is no longer "how long does it take to write this?" It's "how clearly can I articulate what I need?"

## Modern Frameworks + AI = Superpower

What struck me most wasn't just that Claude Code writes code quickly - it's that the combination of modern frameworks and AI assistance makes "sophisticated" features trivially easy.

Live Activities, CarPlay, and widgets are frameworks that would have required weeks of custom development five years ago. Now they're pre-built systems that you wire up to your data models. But even with these frameworks, you still need to:
- Understand the framework's architecture
- Read the documentation
- Handle the lifecycle correctly
- Write the boilerplate

Claude Code knows all of this. It's read every WWDC session, every API reference, every Stack Overflow answer. It knows that ActivityKit needs a `ContentState` struct, that CarPlay uses template-based navigation, that WidgetKit requires timeline providers. It handles the boilerplate correctly the first time.

SwiftUI's declarative syntax means the UI updates automatically when data changes. SwiftData handles persistence with minimal code. ActivityKit manages lock screen updates. WidgetKit handles scheduling. Claude Code wires them all together.

The economic calculation has completely shifted. The question isn't "can I justify building this?" anymore. It's "is this friction annoying enough to spend a weekend describing it to Claude Code?"

## The Case for Bespoke

This isn't a criticism of existing apps. National Rail Enquiries, Citymapper, and Real Time Trains are excellent tools built by talented teams. They serve millions of users with diverse needs, and they do it well.

But general-purpose apps make trade-offs. They need to work for commuters, tourists, business travelers, and casual users. They need broad feature sets, accessibility compliance, multi-platform support, and complex UI to handle edge cases. That complexity has a cost in speed, focus, and simplicity.

A bespoke app serves an audience of one. It can be ruthlessly focused on a single use case. LiveRail doesn't need to handle buses, bikes, or walking directions. It doesn't need journey planning or ticket booking. It shows upcoming trains filtered by my destination, tracks the one I'm on, works offline, and tells me when I'll be home. That's it.

The constraints of mobile development have changed. Modern frameworks reward focused, single-purpose apps. The features that make apps feel polished - lock screen integration, CarPlay, widgets - are now commodity functionality that takes hours, not weeks.

## When Bespoke Makes Sense

Not every problem needs a custom solution. If a standard app does 95% of what you need, use the standard app. The remaining 5% is rarely worth the effort.

But when the friction becomes routine, when you find yourself repeating the same awkward workflow every week, when you're stitching together three apps to accomplish one task, that's when it's worth asking: could I just build this?

The threshold isn't "is this technically possible?" anymore. It's "is this annoying enough to justify a weekend of coding?" For me, standing in a London bar juggling five apps to answer a simple question, the answer was yes.

## What I Learned

Building LiveRail reminded me that **software is just automation**, and AI has fundamentally changed who can do the automation.

Five years ago, this story would have required a professional iOS developer with deep framework knowledge. Ten years ago, it would have required a team. Today, with Claude Code, modern frameworks, and public APIs, anyone who can clearly describe a problem can build a solution in a weekend.

The barrier to entry has collapsed. Not because the frameworks got simpler - ActivityKit and CarPlay are still complex systems. But because Claude Code handles the complexity. It knows the patterns, the gotchas, the best practices. It translates "I want lock screen tracking" into production-quality ActivityKit implementation.

This isn't about replacing developers. It's about removing the gap between having an idea and having a working implementation. I still made all the decisions: what features to include, which UX patterns to follow, what trade-offs to accept. But Claude Code handled the translation from intention to implementation.

The most striking realization: **the hard part of building LiveRail wasn't the coding**. It was clearly articulating what I wanted. Once I could describe the behavior precisely, Claude Code made it real.

## Conclusion

LiveRail won't have a million users. It doesn't need to. It solves my problem perfectly. If you're on a UK rail line with patchy signal wondering when you'll be home, it might solve yours too.

But the real point isn't the app. It's that the economics of bespoke software have fundamentally changed. The question is no longer "can I afford to build this?" It's "can I afford not to?"

If you're a developer frustrated by the gap between what exists and what you need, that gap is now measured in weekends, not months. If you can describe the problem clearly enough for another person to understand, you can describe it clearly enough for Claude Code to implement.

The next time I'm in that London bar deciding when to leave, I'll open one app instead of five. And if that app doesn't exist, I'll spend the train ride home building it.
