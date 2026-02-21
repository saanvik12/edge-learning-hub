export interface UseCase {
  id: string;
  title: string;
  summary: string;
  narrative: string[];
  products: string[];
  flow: { label: string; product: string; description: string }[];
  keyTakeaways: string[];
}

export const useCases: UseCase[] = [
  {
    id: "cart-abandonment",
    title: "Cart Abandonment Recovery",
    summary: "Web SDK captures events → AEP builds real-time profile → RTCDP segments 'cart abandoners' → AJO triggers a multi-step email/push journey → CJA measures conversion lift",
    narrative: [
      "A customer browses an e-commerce website, adds a pair of running shoes and a water bottle to their cart, but leaves without purchasing. The Adobe Web SDK (deployed via Launch/Tags) captures the 'commerce.cartAbandoned' ExperienceEvent with product details, cart value ($165.49), and the customer's ECID.",
      "Within seconds, AEP's streaming ingestion processes the event, resolves the customer's identity (linking ECID to their email via a previous login), and updates their Real-Time Customer Profile. The profile now shows: 3 site visits this week, 2 previous purchases, loyalty tier 'Silver', and an abandoned cart.",
      "RTCDP's streaming segmentation engine evaluates the profile against the 'Cart Abandoners – Last 2 Hours' segment. The customer qualifies immediately. This segment qualification event triggers an AJO journey designed for cart recovery.",
      "The AJO journey executes a multi-step sequence: (1) Wait 1 hour — check if they purchased (exit condition). (2) Send recovery email with personalized product images and a 10% discount. (3) Wait 24 hours — check again. (4) Send push notification reminder. (5) Wait 48 hours — final SMS with urgency messaging. Each message is personalized using profile attributes (first name, loyalty tier, cart contents).",
      "All journey interaction data (email opens, push clicks, SMS deliveries) flows back to AEP as ExperienceEvents. In CJA, analysts connect these datasets to measure: cart recovery rate (18%), revenue recovered ($42K/month), channel effectiveness (email: 65% of recoveries, push: 25%, SMS: 10%), and overall journey ROI. The insight that push notifications perform best for app-installed users leads to journey optimization."
    ],
    products: ["Launch/Tags", "Web SDK", "AEP", "RTCDP", "AJO", "CJA"],
    flow: [
      { label: "Cart Abandon Event", product: "Launch / Web SDK", description: "Captures cart abandonment with product & value data" },
      { label: "Profile Update", product: "AEP", description: "Identity resolved, profile updated with cart data" },
      { label: "Segment Qualification", product: "RTCDP", description: "Customer enters 'Cart Abandoners' segment in real-time" },
      { label: "Journey Trigger", product: "AJO", description: "Multi-step recovery journey: email → push → SMS" },
      { label: "Performance Analysis", product: "CJA", description: "Conversion lift, channel effectiveness, journey ROI" }
    ],
    keyTakeaways: [
      "Streaming segmentation enables sub-minute journey triggering — critical for time-sensitive abandonment scenarios",
      "AJO's multi-step journeys with exit conditions prevent messaging customers who already converted",
      "CJA provides cross-channel attribution that AJO's native reports cannot — showing which touchpoint drove the conversion",
      "Identity resolution in AEP is the linchpin — without linking ECID to email, the recovery email can't be sent",
      "This use case demonstrates the core AEP → RTCDP → AJO → CJA pipeline that most Adobe implementations build first"
    ]
  },
  {
    id: "loyalty-program",
    title: "Cross-Channel Loyalty Program",
    summary: "Source Connectors ingest CRM loyalty data → AEP unifies identity → RTCDP creates loyalty tier segments → AJO sends personalized offers across email/SMS/push → CJA analyzes engagement by tier",
    narrative: [
      "A retail brand operates a loyalty program with data stored in Salesforce CRM (member profiles, tier status, points balance) and a cloud data warehouse in Snowflake (transaction history, point redemptions). This data needs to be combined with digital behavior (web browsing, app usage) to deliver personalized loyalty experiences.",
      "AEP Source Connectors are configured to ingest from both systems: Salesforce CRM connector runs every 6 hours, pulling updated member profiles with loyalty tier, points balance, and preferences. Snowflake connector runs daily, importing transaction records. Both map source fields to XDM schemas — CRM data to Individual Profile, transactions to ExperienceEvent.",
      "AEP's Identity Service resolves identities across sources: CRM ID (Salesforce) ↔ Loyalty ID (Snowflake) ↔ ECID (website) ↔ IDFA (mobile app). The unified profile shows a complete view: loyalty tier Gold, 12,500 points, last in-store purchase 3 days ago, browsed 'Premium Collection' online yesterday.",
      "RTCDP creates tier-based segments: Platinum members (top 5%), Gold approaching Platinum (within 2,000 points), Silver with declining engagement (no purchase in 60 days), and New Members (joined last 30 days). Each segment has a distinct communication strategy in AJO.",
      "AJO runs parallel journeys: 'Gold to Platinum Accelerator' sends personalized offers highlighting how many points they need and suggesting products. 'Silver Re-engagement' sends SMS with double-points promotions. 'New Member Welcome' delivers an onboarding series. All messages reference the member's actual points balance and tier using AEP profile attributes.",
      "CJA analyzes loyalty program performance: points earned vs redeemed by tier, tier upgrade rates, digital engagement correlation with in-store spending, journey-driven incremental revenue by tier. A key insight: Gold members who receive the 'approaching Platinum' journey upgrade 3x faster than those who don't — validating the program's ROI."
    ],
    products: ["Source Connectors", "AEP", "Identity Service", "RTCDP", "AJO", "CJA"],
    flow: [
      { label: "CRM & Warehouse Ingestion", product: "Source Connectors", description: "Salesforce + Snowflake data imported on schedule" },
      { label: "Identity Resolution", product: "AEP", description: "CRM ID, Loyalty ID, ECID, IDFA linked per person" },
      { label: "Tier Segmentation", product: "RTCDP", description: "Segments by loyalty tier + behavioral triggers" },
      { label: "Personalized Journeys", product: "AJO", description: "Tier-specific campaigns with dynamic points/offers" },
      { label: "Program Analytics", product: "CJA", description: "Tier migration, engagement correlation, journey ROI" }
    ],
    keyTakeaways: [
      "Source Connectors eliminate the need for custom ETL — pre-built Salesforce and Snowflake integrations handle scheduling and mapping",
      "Identity resolution across 4+ identifiers (CRM, Loyalty, ECID, IDFA) requires careful namespace configuration in AEP",
      "RTCDP segments can combine offline CRM attributes (tier, points) with online behavior (browsing) for powerful targeting",
      "AJO message personalization pulls real-time profile data — points balances, tier status — directly from AEP",
      "CJA's cross-channel analysis proves program ROI by correlating digital engagement journeys with offline purchase outcomes"
    ]
  },
  {
    id: "personalized-web",
    title: "Personalized Web Experience",
    summary: "Launch/Web SDK collects behavior → AEP real-time profile → Target delivers personalized content via edge decisioning → Analytics/CJA measures A/B test results (A4T)",
    narrative: [
      "A financial services company wants to personalize its website for different customer segments: first-time visitors see educational content, existing customers see relevant product offers, and high-value customers see premium services and dedicated support options.",
      "Launch/Tags deploys the Web SDK with Target enabled in the Datastream. On every page load, Web SDK sends a request to Adobe Edge Network that includes the visitor's ECID. Edge Network queries the AEP Real-Time Profile for this visitor — retrieving their segment memberships, product holdings, and interaction history.",
      "Adobe Target, also running on Edge Network, receives this profile context and evaluates its activities. An Auto-Target activity uses machine learning to select the best homepage hero experience from 4 variants based on the visitor's profile: (A) Generic brand message, (B) Product recommendation based on browsing history, (C) Premium tier upgrade offer for qualified customers, (D) Educational content for new visitors.",
      "The Target decision is made in under 100ms at the edge — no round-trip to a centralized server. The response includes the selected experience content (HTML/JSON), which the Web SDK renders on the page. The visitor sees their personalized experience without perceiving any delay.",
      "Analytics for Target (A4T) ensures that both the Target decision and the subsequent Analytics page view are captured in the same Web SDK event — eliminating data discrepancy between Target and Analytics reporting. The data flows to both Analytics (for operational reporting) and AEP/CJA (for advanced cross-channel analysis).",
      "In CJA, analysts measure each variant's impact on downstream conversions: not just click-through rate, but application completion rate (measured 7 days later), call center contact rate, and customer lifetime value over 90 days. Variant B (product recommendations) shows 23% higher application completion — leading to its selection as the default experience."
    ],
    products: ["Launch/Tags", "Web SDK", "AEP", "Target", "Analytics", "CJA"],
    flow: [
      { label: "Page Load + Profile", product: "Web SDK / AEP", description: "Web SDK sends request, Edge returns profile context" },
      { label: "Target Decisioning", product: "Target", description: "Auto-Target ML selects best experience variant" },
      { label: "Personalized Render", product: "Web SDK", description: "Selected content rendered on page (<100ms)" },
      { label: "A4T Tracking", product: "Analytics", description: "Decision + page view captured in single hit" },
      { label: "Impact Analysis", product: "CJA", description: "Long-term conversion and LTV analysis per variant" }
    ],
    keyTakeaways: [
      "Edge decisioning (Target on Edge Network) delivers sub-100ms personalization without origin round-trips",
      "Auto-Target's ML model continuously optimizes variant allocation — shifting traffic to winning experiences",
      "A4T eliminates reporting discrepancies by using a single data collection mechanism for both Target decisions and Analytics tracking",
      "CJA extends A4T beyond click metrics to measure long-term business outcomes (LTV, retention, cross-sell)",
      "This use case demonstrates real-time personalization powered by unified profiles — the core value proposition of AEP + Target"
    ]
  },
  {
    id: "audience-activation",
    title: "Multi-Brand Audience Activation",
    summary: "Multiple data sources into AEP → RTCDP builds cross-brand audiences → Destinations activate to Google Ads, Facebook, Trade Desk → CJA reports on media performance",
    narrative: [
      "A media conglomerate operates three brands — a news site, a streaming service, and an e-commerce marketplace. Each brand has separate data collection but the company wants to build unified audiences across all three for advertising campaigns on Google Ads, Facebook, and The Trade Desk.",
      "Each brand's Web SDK and mobile SDK send behavioral data to a shared AEP instance, each into brand-specific datasets with brand-specific XDM schemas. AEP's Identity Service links users across brands using shared identifiers: email (logged-in users), ECID (cross-site if same-origin), and a company-wide customer ID (shared loyalty program).",
      "RTCDP creates cross-brand audience segments that no single brand could build alone: 'News readers who also stream sports content and have purchased sports merchandise' — a high-value audience for sports advertisers. 'Streaming subscribers who read financial news and shop in electronics' — valuable for tech advertisers.",
      "These segments are activated through RTCDP Destinations to Google Ads (Customer Match via hashed email), Facebook (Custom Audiences), and The Trade Desk (UID2-based). DULE governance ensures that streaming-only users who haven't consented to cross-brand data sharing are excluded. Each destination receives only the identifiers it needs — no raw PII leaves the platform.",
      "CJA connects all three brands' datasets plus destination activation data to create a unified media performance dashboard. Analysts measure: audience reach per platform, impression-to-conversion rates per segment, cross-brand audience overlap (Venn diagrams), and media spend efficiency (ROAS) by segment × destination combination. The 'sports enthusiast' cross-brand segment delivers 3.2x ROAS compared to single-brand segments."
    ],
    products: ["Web SDK", "AEP", "Identity Service", "RTCDP", "Destinations", "CJA"],
    flow: [
      { label: "Multi-Brand Data", product: "Web SDK / AEP", description: "Three brands' data flows into shared AEP instance" },
      { label: "Cross-Brand Identity", product: "Identity Service", description: "Users linked across brands via email, customer ID" },
      { label: "Audience Building", product: "RTCDP", description: "Cross-brand segments combining behaviors from all three" },
      { label: "Platform Activation", product: "Destinations", description: "Segments pushed to Google, Facebook, TTD with governance" },
      { label: "Media Reporting", product: "CJA", description: "Cross-platform ROAS, reach, and segment performance" }
    ],
    keyTakeaways: [
      "AEP's multi-brand data model uses separate datasets per brand but shared identity resolution for cross-brand profiles",
      "RTCDP's unique value here is creating audiences that combine signals from multiple brands — impossible in single-brand tools",
      "DULE governance is critical in multi-brand scenarios — consent boundaries between brands must be respected automatically",
      "Destination identity mapping handles different identifier requirements per ad platform (hashed email, GAID, UID2)",
      "CJA becomes the single source of truth for cross-brand, cross-platform media performance analysis"
    ]
  },
  {
    id: "ai-campaign",
    title: "AI-Powered Campaign Creation",
    summary: "GenStudio generates content variants → AJO builds multi-variant campaign → RTCDP provides target audience → CJA analyzes variant performance and attribution",
    narrative: [
      "A travel company is launching a summer campaign targeting three audience segments: adventure travelers, luxury seekers, and family vacationers. The creative team needs dozens of email variants — different subject lines, hero images, body copy, and CTAs — optimized for each segment. GenStudio accelerates this by generating content at scale.",
      "The creative director inputs campaign briefs into GenStudio for Performance Marketing: brand guidelines (color palette, font, tone of voice), campaign objective (summer bookings), and three audience personas with their motivations. GenStudio's AI generates 5 subject line variants, 3 hero image styles, 4 body copy variants, and 3 CTA options per persona — totaling 45+ unique content combinations per segment.",
      "The creative team reviews variants in GenStudio, making edits for accuracy (destination names, pricing) and brand fit. Approved variants are exported as content fragments to AJO. Each fragment is tagged with its target persona and content theme.",
      "In AJO, the campaign manager creates three campaigns — one per segment. Each campaign uses AJO's content experiment feature to A/B test the GenStudio variants: 5 subject lines tested against each other (20% allocation each, optimized for open rate), and 3 body copy variants tested (optimized for click-through rate). RTCDP provides the audience segments.",
      "AJO's experimentation engine collects performance data over 14 days, then automatically selects winning variants based on statistical significance. The adventure segment responds best to action-oriented subject lines ('Your Next Summit Awaits') with photography hero images. Luxury seekers prefer aspirational language ('Exclusive Escapes, Curated for You') with lifestyle imagery.",
      "CJA provides the deeper analysis: not just open/click rates, but booking conversion rates per variant, revenue per variant, customer satisfaction (post-trip survey) correlation, and long-term engagement (do AI-variant recipients return to the site more?). Attribution modeling across email + web + app shows which variant combinations drive the highest total booking value."
    ],
    products: ["GenStudio", "AJO", "RTCDP", "CJA"],
    flow: [
      { label: "AI Content Generation", product: "GenStudio", description: "45+ variants generated from briefs and brand guidelines" },
      { label: "Content Review", product: "GenStudio", description: "Team edits and approves variants for accuracy" },
      { label: "Campaign Setup", product: "AJO", description: "Multi-variant campaigns with content experiments" },
      { label: "Audience Targeting", product: "RTCDP", description: "Three persona-based segments for campaign delivery" },
      { label: "Performance Analysis", product: "CJA", description: "Variant conversion, revenue impact, and attribution" }
    ],
    keyTakeaways: [
      "GenStudio reduces content creation time from weeks to hours — enabling true variant testing at scale",
      "AJO's content experiments provide statistical rigor to variant selection — not just gut feel",
      "The GenStudio → AJO workflow bridges creative (content) and marketing ops (delivery) teams",
      "CJA measures what matters beyond opens/clicks — actual business outcomes (bookings, revenue, satisfaction)",
      "This use case shows how AI-generated content + automated optimization + unified analytics create a compound advantage"
    ]
  }
];
