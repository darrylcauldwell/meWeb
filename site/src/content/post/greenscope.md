---
title: "From Presentation Slides to Production Metrics: Actually Measuring the Carbon Cost of My Software"
date: "2026-03-04"
category: "apps"
description: "I gave a talk about sustainable software with nine takeaways. Then I spent years not following any of them. GreenScope is what happens when you finally put your own slides into practice."
tags:
  - "python"
  - "observability"
  - "sustainability"
---

A few years ago I stood in front of a room and delivered a presentation called [Sustainable Enterprise Software](https://blog.dreamfold.dev/presentations/sustainable-software/). It had nine carefully researched takeaways. Migrate to efficient facilities. Schedule workloads during low-carbon windows. Implement continuous monitoring for waste elimination. I had charts. I had statistics. I referenced the GHG Protocol, the UN Sustainable Development Goals, Power Usage Effectiveness ratios. It was thorough.

I then proceeded to follow precisely none of my own advice.

Not because I disagreed with it. Because measuring carbon is hard, and talking about measuring carbon is easy. I had a production server running five containerised applications on a DigitalOcean droplet in London, and I had absolutely no idea what any of them cost the planet per request. Not even a rough guess.

That gap between knowing what you should measure and actually measuring it bothered me for a long time. So I built [GreenScope](https://dreamfold.dev/apps/greenscope/).

## What Gets Measured Gets a Score

GreenScope is a real-time Software Carbon Intensity dashboard. It calculates and displays the carbon footprint of each application running on my droplet, expressed as grams of CO2 equivalent per HTTP request. That metric follows the SCI specification from the Green Software Foundation, which was formalised as ISO/IEC 21031:2024.

The SCI formula looks deceptively simple:

**SCI = ((E x I) + M) / R**

Where **E** is energy consumed in kilowatt-hours, **I** is the carbon intensity of the electricity grid in gCO2eq/kWh, **M** is the amortised embodied emissions of the hardware in gCO2e, and **R** is your functional unit.

Four variables. One division. And an enormous amount of complexity hiding behind each letter.

## The Functional Unit is Fractal

That **R** looked like the simplest variable in the formula. Pick a unit, divide by it, done. But even on my modest droplet running five apps, I discovered that **R** isn't a single thing -- it changes depending on where you're standing.

At the application level, the natural functional unit is an HTTP request. How many grams of CO2 does it cost to serve one page of my venue management system? That's the question a developer cares about. GreenScope calculates this per-app: total carbon divided by request count gives you gCO2e per request.

But zoom out to the droplet level and requests stop making sense. The droplet doesn't serve requests -- it hosts containers. So GreenScope's droplet view uses a different functional unit entirely: the container. Total carbon for the host divided by the number of running containers gives you gCO2e per container. That's the question an infrastructure operator cares about. How efficiently am I packing workloads onto this machine?

And the pattern keeps going. If I had visibility into DigitalOcean's datacentre, their natural functional unit would be the droplet VM. How much carbon per virtual machine? At corporate level, the functional unit might be the datacentre itself -- how much carbon per region?

The SCI specification is deliberately agnostic about what **R** should be. It just says you have to declare it and be consistent. That seemed like a minor implementation detail when I read the spec. In practice, it turned out to be one of the most interesting design decisions in the whole project. The same numerator -- the same energy, the same carbon intensity, the same embodied emissions -- tells a completely different story depending on what you divide it by. A developer optimising per-request carbon might containerise more aggressively. An operator optimising per-container carbon might consolidate workloads onto fewer, larger hosts. Both are valid. Both are measuring the same underlying emissions. The functional unit just determines who the number is useful for.

## The Energy Nobody Tells You About

My presentation had a statistic that stuck with me: for a typical server, 80% of its lifetime carbon footprint comes from Scope 3 emissions -- the embodied carbon baked into manufacturing the hardware. Only 20% comes from the electricity it consumes during operation. We obsess over runtime efficiency while the carbon was already spent before the machine was ever powered on.

The SCI specification handles this with the **M** term. GreenScope amortises the manufacturing carbon of the host server across its expected lifespan, then allocates a share to each application based on how much CPU time it consumed relative to total available capacity. The formula is `TE x TS x RS` -- total embodied emissions, multiplied by the time share of the calculation period, multiplied by the resource share the app consumed.

For my droplet, I'm using a reference server figure of 1,205.52 kgCO2e with a four-year lifespan. DigitalOcean doesn't publish per-instance embodied carbon data -- nobody does, really -- so this is an acknowledged approximation. The methodology page in GreenScope documents this openly, because the SCI specification requires transparency about your assumptions. I like that requirement. Too many carbon calculators present a number with false precision and no explanation of where it came from.

## Talking to the Grid

The **I** variable is where things get genuinely interesting. Carbon intensity of the electricity grid isn't a fixed number. It changes every thirty minutes depending on the generation mix -- how much wind, solar, gas, nuclear, and biomass is feeding the grid at any given moment.

In my presentation, I showed how Google Cloud publishes regional carbon-free energy percentages. Finland's `europe-north1` region runs at 94% carbon-free energy with 133 gCO2/kWh. Singapore's `asia-southeast1` manages just 4% carbon-free at 493 gCO2/kWh. Same workload, same code, wildly different carbon cost depending on where the server sits.

GreenScope pulls real-time carbon intensity data from the UK National Grid ESO Carbon Intensity API. Since my droplet lives in DigitalOcean's LON1 region (physically in Slough), it queries regional intensity for the SSE South zone. Right now, at the time I'm writing this, the generation mix might be 40% gas, 25% wind, 15% nuclear, and a smattering of solar, biomass, and interconnectors. Tomorrow morning, if the wind picks up, the grid gets cleaner. Tomorrow evening, when demand peaks and gas turbines ramp up, it gets dirtier.

The same application serving the same request at 3am costs the planet less than at 6pm. That's not something I could have articulated with real numbers before GreenScope.

## Plumbing the Metrics Pipeline

The energy calculation needs CPU time per container. For that, GreenScope queries Prometheus, which scrapes cAdvisor metrics from every running container. The `container_cpu_usage_seconds_total` counter gives cumulative CPU time. Taking the rate of increase over a fifteen-minute window tells me how many CPU-seconds each container consumed.

From CPU-seconds, the conversion to kilowatt-hours is straightforward physics: multiply by watts per core (the host's TDP divided by core count), divide by 3,600,000 to convert joules to kilowatt-hours, then multiply by the Power Usage Effectiveness factor to account for cooling and power distribution overhead. My droplet uses a PUE of 1.2, which is a reasonable estimate for a cloud datacentre.

For the request count -- the **R** denominator -- GreenScope pulls HTTP request counters from FastAPI's `prometheus-fastapi-instrumentator` for the Python apps and from Caddy's built-in metrics for the static sites. Each application maps to a set of container names and a Prometheus job, all configurable via environment variables.

Every fifteen minutes, an APScheduler background job orchestrates the whole pipeline: fetch CPU metrics, fetch request counts, fetch grid carbon intensity, calculate energy, calculate operational emissions, calculate embodied emissions, compute SCI, write to SQLite, update Prometheus gauges. Six custom metrics get exposed -- `greenscope_sci_score_gco2_per_request`, `greenscope_energy_kwh`, `greenscope_carbon_intensity_gco2_per_kwh`, and three more -- so the SCI data is dashboardable in Grafana alongside everything else.

## What If You Were Somewhere Else?

One of my presentation takeaways was "migrate workloads to facilities with lower Power Usage Effectiveness." GreenScope's What-If comparison page makes this tangible. It takes the current workload and recalculates the SCI score as if the same application were running in over a hundred different cloud regions across AWS, Azure, GCP, and DigitalOcean.

The current datacenter uses real-time grid intensity from the UK API. Every other region uses published annual average carbon intensity and PUE values from provider sustainability reports and the Green Software Foundation's dataset. The result is a sortable table showing where my workload would have the lowest carbon footprint right now.

It's a humbling exercise. A Norwegian or Icelandic region running on near-100% hydroelectric power will always demolish a UK-based server that's partially gas-powered. The numbers make the geography of carbon impossible to ignore.

But they also reveal nuance. A region with slightly higher carbon intensity but a much better PUE can sometimes win. Infrastructure efficiency matters alongside grid cleanliness. My presentation covered PUE as a concept. GreenScope turns it into a comparison you can actually use to make decisions.

## The Broker That Doesn't Exist Yet

Staring at the What-If table, a thought kept nagging me. If I can see that my workload would produce a third of the carbon in `europe-north1` compared to `lon1`, why am I still running it in London? And if grid intensity fluctuates every thirty minutes, why does my workload have to stay in the same region all day?

The logical conclusion of What-If comparison is a cloud consumption layer that acts on it. A broker that sits between your application and the cloud providers, continuously evaluating SCI scores across regions and migrating workloads to whichever landing zone is cheapest in carbon terms right now. Not a static placement decision made once at deployment time. A dynamic one, responding to the grid in real time.

The pieces already exist. Container orchestration can move workloads between clusters. Carbon intensity APIs publish regional data with thirty-minute granularity. Cloud providers offer multi-region infrastructure. The SCI formula standardises how to compare them. What's missing is the decision layer in the middle -- something that takes the same What-If calculation GreenScope does and turns it from a comparison table into an automated placement policy.

It wouldn't be trivial. Latency constraints mean not every workload can chase the cheapest carbon. Data sovereignty rules pin some applications to specific geographies. And the embodied cost of running infrastructure in multiple regions simultaneously could outweigh the operational savings from carbon-aware placement. But for stateless workloads with flexible latency budgets -- batch processing, CI pipelines, model training, static site builds -- the economics of carbon-aware brokering seem inevitable.

GreenScope shows you where your workload *should* be. The next step is software that puts it there.

## The Stack Under the Hood

GreenScope runs as a FastAPI application on Python 3.13 with an async-first architecture throughout. All I/O -- HTTP calls to the carbon intensity API, Prometheus queries, SQLite writes -- uses `async`/`await`. A single uvicorn worker handles API requests and the background calculation job without blocking.

The frontend is server-rendered Jinja2 templates styled with Tailwind CSS 4.0, with Chart.js providing interactive trend charts showing SCI scores, emissions breakdowns, and the electricity generation mix over twenty-four hours. No JavaScript framework. No build pipeline beyond a Tailwind compilation step in a multi-stage Docker build.

The whole thing runs in a container limited to 256MB of RAM and half a CPU core. It has its own observability stack -- Prometheus, Grafana, Loki, Promtail -- following the same pattern as every other app on the droplet. GreenScope monitors the apps. The observability stack monitors GreenScope. Turtles all the way down.

## Honesty About the Gaps

I want to be clear about what GreenScope doesn't measure. It only accounts for CPU energy. Memory, storage I/O, and network energy are excluded because cAdvisor doesn't expose those metrics in a way that converts cleanly to watts. Client-side energy -- the phone or laptop rendering the response -- isn't captured at all. Neither is the energy consumed by the network infrastructure between server and client.

The embodied carbon figure is a reference estimate, not a measured value for my specific hardware. The PUE is an informed assumption, not a reading from the datacentre's power distribution unit. When traffic drops to zero requests in a period, SCI is mathematically undefined, so GreenScope returns zero rather than infinity -- reasonable, but worth noting.

All of this is documented on the methodology page. Every formula, every assumption, every data source, every limitation. The SCI specification encourages this transparency, and I think it's the most important feature of the whole application. A carbon number without methodology is just greenwashing with extra steps.

## What Changes When the Infrastructure Talks Back

Most of GreenScope's gaps come down to one problem: DigitalOcean gives me a droplet and a bill, not telemetry. I'm estimating TDP from a reference server spec. I'm assuming PUE from industry averages. I'm blind to the actual power draw of the hardware my containers run on.

But imagine the same application running on a VMware VM instead. VCF Operations collects live power draw metrics from every host in a vSphere cluster. Not reference TDP values -- actual watt readings from the baseboard management controller. Suddenly the **E** variable in the SCI formula stops being an estimate and becomes a measurement. The cluster itself becomes the SCI boundary with VMs as its functional unit -- gCO2e per VM, calculated from real power data, with the embodied carbon of specific server models rather than a generic reference figure.

Add vSphere Kubernetes Service into the picture and another layer of the hierarchy appears. VKS runs Kubernetes clusters inside vSphere namespaces, each namespace with its own resource boundaries. The SCI formula applies at the namespace level -- gCO2e per Kubernetes cluster -- or within a cluster at the namespace or pod level. A platform team gets the carbon cost of each tenant's Kubernetes estate. An application team gets the carbon cost of their individual services. Different viewpoints, same method, same power data flowing up from VCF Operations underneath.

Scale that out to a datacentre with multiple clusters and VCF Operations gives you the SCI viewpoint at the landing zone level. Which cluster is the most carbon-efficient place to provision the next workload? Not a guess based on published specs, but a live answer derived from actual utilisation and power consumption across the fleet.

Then there's PUE. Right now I'm using 1.2 as a static assumption. In a datacentre with Flowgate ingesting data from the facility layer -- HVAC systems, power distribution units, cooling infrastructure -- PUE becomes a live metric. Total facility power divided by IT equipment power, updated continuously. On a cool winter night with free-air cooling, PUE drops. On a scorching August afternoon with chillers running flat out, it climbs. That variability feeds directly into the SCI formula. Combine live PUE from Flowgate with live host power from VCF Operations and you have SCI at the datacentre level -- not estimated, measured.

And if VCF Operations runs in fleet mode across multiple datacentres, the whole hierarchy materialises. Containers within VMs. VMs within clusters. Clusters within datacentres. Datacentres within regions. Each level with its own functional unit, each level with progressively more accurate data feeding the same SCI formula. The fractal functional unit pattern I discovered on my single droplet extends all the way up to a global infrastructure view.

I'm running GreenScope on one $24-a-month droplet with estimated inputs and a handful of containers. The formula is the same one that could drive carbon-aware placement across a fleet of datacentres with thousands of hosts. The difference is just data. Better inputs, same maths, sharper answers.

## Closing the Loop

In my presentation, I listed nine takeaways for building sustainable software. Continuous monitoring was number six. It only took me several years to actually implement it.

But GreenScope isn't just a belated checkbox. Building it forced me to confront the difference between understanding sustainability concepts and operationalising them. I knew about PUE. I didn't know my droplet's PUE. I knew about grid carbon intensity variability. I didn't know that a request to my venue management system at 3am costs roughly half the carbon of the same request at peak demand. I knew embodied emissions dominate server carbon footprints. I hadn't worked through the maths of amortising them across containerised workloads.

The SCI specification, now formalised as ISO/IEC 21031:2024, gives this work structure. It doesn't pretend that measuring software carbon is simple or precise. It asks you to be transparent about your functional unit, your energy model, your carbon intensity source, your embodied emissions estimate, and the boundaries of what you're measuring. That honesty is built into the standard.

My droplet in Slough serves five applications to a handful of users. Its carbon footprint is a rounding error in the global scheme. But the approach scales. The same pipeline -- container CPU metrics, grid carbon intensity API, embodied emissions amortisation, per-request normalisation -- works whether you're monitoring five containers or five thousand. The SCI specification doesn't care about scale. It cares about measurement.

I spent years with a slide deck full of good intentions. Now I have a dashboard full of real numbers. The numbers aren't always comfortable, but they're honest. And that's the point.
