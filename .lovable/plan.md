

# Experience Cloud & Akamai Learning Hub

A tile-based learning website to master Adobe Experience Cloud integrations and Akamai — click any tile to dive deep into that topic.

---

## Home Page — Tile Grid

A clean landing page with a brief header ("Experience Cloud & Akamai Learning Hub") and a grid of clickable tiles organized into three groups:

### Adobe Integration Tiles
Each tile shows a "From → To" label, a short one-liner, and an icon/color accent. Clicking opens a full detail page.

- **AEP → RTCDP** — Profile activation & audience distribution
- **AEP → AJO** — Real-time events triggering journeys
- **AEP → CJA** — Dataset connections for cross-channel analytics
- **RTCDP → Destinations** — Segment activation to ad platforms & more
- **CJA → RTCDP** — Publishing computed audiences back for activation
- **AJO → CJA** — Journey event analysis & reporting
- **Launch/Tags → AEP** — Web SDK event collection into AEP
- **Launch → Target** — Delivering personalization experiences
- **Launch → Analytics** — Sending analytics hits via Web SDK
- **Target → AEP / CJA** — Decision data feeding back for reporting
- **GenStudio → AJO** — AI content assets used in campaigns
- **EDS → AEP** — Page interaction events via Web SDK
- **Source Connectors → AEP** — CRM & cloud batch ingestion
- **Streaming API → AEP** — Server-side HTTP ingestion
- **Mobile SDK → AEP** — iOS/Android events via Edge Network

### Akamai Tiles
Distinct teal/green accent. Each tile is a standalone Akamai learning topic.

- **DNS & Edge DNS** — Record types, TTLs, authoritative DNS
- **HTTPS / TLS & Certificates** — Handshake, cert types, chain of trust
- **WAF & DDoS Protection** — Rules, tuning, rate control
- **EdgeWorkers** — JavaScript at the edge
- **Bot Manager** — Bot classification & mitigation
- **Terraform & Jenkins** — Infrastructure as Code & CI/CD for Akamai
- **Akamai Product Map** — Delivery, Security, Compute pillars

### Adobe Use Cases Tile
One special tile (visually distinct, perhaps larger or highlighted) labeled **"Adobe Use Cases"** that opens a page with 4–5 end-to-end scenarios combining multiple Adobe products.

---

## Detail Pages (per tile)

Each tile click navigates to a dedicated route (e.g., `/aep-ajo`, `/akamai-dns`, `/use-cases`). Every detail page includes:

- **Back to Home** navigation
- **Overview** — 2–4 paragraph explanation of what this integration/topic does, using correct terminology
- **How It Works** — Visual flow diagram (cards + arrows showing data flow between products/services)
- **Key Concepts** — Tabbed or accordion sections covering the important sub-topics (e.g., for AEP→CJA: Connections, Data Views, Workspace)
- **Example** — A realistic code/config snippet or walkthrough (XDM JSON, segment rule, TLS handshake steps, Terraform HCL, etc.)
- **When to Use** — 3–5 bullet points on practical scenarios

---

## Adobe Use Cases Page

A dedicated page with 4–5 real-world scenarios, each presented as an expandable card:

1. **Cart Abandonment Recovery** — Web SDK (Launch) captures events → AEP builds real-time profile → RTCDP segments "cart abandoners" → AJO triggers a multi-step email/push journey → CJA measures conversion lift

2. **Cross-Channel Loyalty Program** — Source Connectors ingest CRM loyalty data → AEP unifies identity → RTCDP creates loyalty tier segments → AJO sends personalized offers across email/SMS/push → CJA analyzes engagement by tier

3. **Personalized Web Experience** — Launch/Web SDK collects behavior → AEP real-time profile → Target delivers personalized content via edge decisioning → Analytics/CJA measures A/B test results (A4T)

4. **Multi-Brand Audience Activation** — Multiple data sources into AEP → RTCDP builds cross-brand audiences → Destinations activate to Google Ads, Facebook, Trade Desk → CJA reports on media performance

5. **AI-Powered Campaign Creation** — GenStudio generates content variants → AJO builds multi-variant campaign → RTCDP provides target audience → CJA analyzes variant performance and attribution

Each use case shows: a narrative walkthrough, a visual flow of products involved, and key takeaways.

---

## Design & UX

- **Color system**: Adobe blue primary, AJO red secondary, Akamai teal for Akamai tiles, warm highlight for Use Cases tile
- **Tile grid**: Responsive — 3 columns on desktop, 2 on tablet, 1 on mobile
- **Animations**: Subtle hover effects on tiles, scroll-triggered fade-in on detail pages
- **Typography**: System sans-serif for UI, monospace for code/config snippets
- **Diagrams**: Built as real UI layouts (flex/grid with cards and arrows), never ASCII art
- **Fully static**: No backend — all content in TypeScript data files, deployable to GitHub Pages
- **React Router**: Each tile links to its own route for clean navigation and bookmarkability

