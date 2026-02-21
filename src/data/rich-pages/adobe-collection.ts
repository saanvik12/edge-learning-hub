import type { RichPageData } from "@/components/rich-detail/types";

export const adobeCollectionPages: Record<string, RichPageData> = {
  "launch-aep": {
    id: "launch-aep",
    hero: {
      badge1: { label: "Tags", color: "primary" },
      badge2: { label: "AEP", color: "secondary" },
      title: "Launch/Tags → AEP",
      subtitle: "Web SDK Event Collection",
      description: "Adobe Experience Platform Tags (formerly Launch) is the tag management system that deploys the Web SDK (alloy.js) to your site. Tags configures the Datastream, extensions, rules, and data elements that determine what events are collected and how they're structured before flowing into AEP.",
      highlights: [
        { icon: "🏷️", label: "Tag Management", detail: "Deploy & configure alloy.js without code changes" },
        { icon: "📡", label: "Edge Network", detail: "Events routed through Adobe Edge to AEP" },
      ],
      mentalModel: "Tags is the deployment layer; Web SDK is the collection library; Datastream is the router. Tags publishes alloy.js to your site with a specific Datastream ID. When a user interacts with your site, alloy.js fires sendEvent() calls that hit Adobe Edge Network. The Datastream config tells Edge which AEP Dataset/Schema to use, which Adobe products to enable (Analytics, Target, AJO), and what transformations to apply.",
    },
    architecture: {
      sectionLabel: "Collection Pipeline",
      title: "From Browser to AEP",
      description: "Events flow from the user's browser through Edge Network into AEP datasets.",
      pipeline: [
        { label: "Tags Property", description: "Manages Web SDK extension, rules, data elements", badge: "Tags", badgeColor: "primary" },
        { label: "alloy.js (Web SDK)", description: "Fires sendEvent() with XDM-structured data", badgeColor: "muted" },
        { label: "Edge Network", description: "Routes events based on Datastream configuration", badge: "Edge", badgeColor: "accent" },
        { label: "Datastream", description: "Maps events to AEP dataset, enables services", badge: "Edge", badgeColor: "accent" },
        { label: "AEP Dataset", description: "Events land in XDM-conformant dataset", badge: "AEP", badgeColor: "primary" },
      ],
    },
    concepts: [
      { title: "Web SDK Extension", content: "The Adobe Experience Platform Web SDK extension in Tags configures alloy.js. Key settings: Datastream ID (which Edge config to use), edge domain, identity settings (third-party cookies, first-party device ID), default consent state, and data collection options. The extension replaces multiple legacy extensions (Analytics, Target, Audience Manager) with a single, unified library." },
      { title: "Data Elements", content: "Data elements are reusable variables that extract values from the page — DOM attributes, JavaScript variables, local storage, query parameters. In the Web SDK context, data elements often map to XDM fields. For example: a 'Page Name' data element reads document.title and maps to web.webPageDetails.name in the XDM payload." },
      { title: "Rules & Event Triggers", content: "Tags rules consist of Events (when to fire), Conditions (optional filters), and Actions (what to do). For Web SDK, typical events: Page Load, Click, Custom Event. The action is 'Send Event' with an XDM payload constructed from data elements. Rules can fire on DOMContentLoaded, window load, click, custom code conditions, or data element changes." },
      { title: "Datastream Configuration", content: "The Datastream is server-side config on Edge Network. It specifies: which AEP sandbox, dataset, and schema to use; which Adobe products are enabled (Analytics, Target, AJO); data prep mappings (field transformations before ingestion); and event forwarding rules (send data to third-party endpoints like Google Analytics or Facebook)." },
      { title: "Event Forwarding", content: "Event Forwarding (server-side Tags) lets you route Edge Network events to third-party destinations without additional client-side tags. This means you can send data to Google Analytics, Facebook CAPI, Braze, or custom webhooks from the server side — reducing client-side JavaScript, improving page performance, and increasing data reliability." },
    ],
    comparisons: [
      {
        title: "Web SDK vs. AppMeasurement (Legacy)",
        description: "The Web SDK is the strategic replacement for legacy Adobe libraries.",
        items: [
          { icon: "🆕", label: "Web SDK (alloy.js)", description: "Single library for all Adobe products, XDM-native.", points: ["One library replaces Analytics, Target, AAM extensions", "XDM-structured data from the start", "Server-side processing on Edge Network", "Event Forwarding to third-party destinations", "Future-proof: required for AEP, CJA, AJO"] },
          { icon: "📉", label: "AppMeasurement (Legacy)", description: "Analytics-specific library with prop/eVar model.", points: ["Analytics-only (separate at.js for Target)", "Props, eVars, events — fixed schema", "Client-side processing rules", "Limited server-side capabilities", "Maintenance mode — no new features"] },
        ],
        tip: "All new implementations should use Web SDK. Existing AppMeasurement sites should plan migration — Web SDK is required for AEP, CJA, and AJO.",
      },
    ],
    codeExamples: [
      { title: "Tags Rule — Page View Event", language: "javascript", code: `// Tags Rule Configuration (conceptual)
// Event: Core - Library Loaded (Page Top)
// Action: Adobe Experience Platform Web SDK - Send Event

// XDM payload constructed from Data Elements:
{
  "xdm": {
    "eventType": "web.webpagedetails.pageViews",
    "web": {
      "webPageDetails": {
        "name": "%Page Name%",          // Data Element
        "URL": "%Page URL%",            // Data Element
        "siteSection": "%Site Section%"  // Data Element
      }
    },
    "identityMap": {
      "ECID": [{ "id": "%ECID%", "primary": true }]
    }
  }
}` },
      { title: "alloy.js — Direct sendEvent Call", language: "javascript", code: `// Can also be called directly in custom code
alloy("sendEvent", {
  xdm: {
    eventType: "commerce.productViews",
    commerce: {
      productViews: { value: 1 }
    },
    productListItems: [{
      SKU: document.querySelector('[data-sku]').dataset.sku,
      name: document.querySelector('h1.product-title').textContent,
      priceTotal: parseFloat(document.querySelector('.price').textContent.replace('$', '')),
      quantity: 1
    }]
  }
});` },
      { title: "Datastream Configuration", language: "json", code: `{
  "datastreamId": "ds-12345-prod",
  "name": "Production - Web",
  "services": {
    "aep": {
      "enabled": true,
      "sandboxId": "prod",
      "eventDataset": "web-sdk-events",
      "profileDataset": "web-profiles"
    },
    "analytics": { "enabled": true, "reportSuiteId": "myrsid" },
    "target": { "enabled": true, "propertyToken": "prop-abc" },
    "ajo": { "enabled": true }
  },
  "eventForwarding": {
    "rules": [
      { "destination": "google-analytics-4", "events": ["pageView", "commerce.*"] },
      { "destination": "facebook-capi", "events": ["commerce.purchases"] }
    ]
  }
}` },
    ],
    glossary: [
      { title: "Tags Terms", color: "primary", terms: [
        { term: "Property", definition: "A Tags container that manages extensions, rules, and data elements for a site" },
        { term: "Extension", definition: "A plugin that adds capabilities (Web SDK, Core, Analytics)" },
        { term: "Data Element", definition: "A reusable variable that extracts values from the page" },
        { term: "Rule", definition: "Event + Condition + Action logic that fires tag behavior" },
        { term: "Publishing Library", definition: "A collection of changes staged for deployment" },
        { term: "Environment", definition: "Dev, Staging, or Production embed code targets" },
      ]},
      { title: "Web SDK / Edge Terms", color: "accent", terms: [
        { term: "alloy.js", definition: "Adobe's Web SDK library for collecting browser events" },
        { term: "Datastream", definition: "Server-side config routing Edge events to Adobe products" },
        { term: "Edge Network", definition: "Adobe's global CDN that processes events server-side" },
        { term: "Event Forwarding", definition: "Server-side routing of events to third-party destinations" },
        { term: "sendEvent", definition: "The primary alloy.js method for sending XDM-structured data" },
      ]},
    ],
    tips: [
      "Always use the Web SDK extension in Tags — avoid direct alloy.js script tags for maintainability",
      "Data elements are your friend: map every XDM field to a reusable data element for easy updates",
      "Enable Event Forwarding to reduce client-side third-party tags and improve Core Web Vitals",
      "Test in Tags' staging environment before publishing to production — use the Debugger extension",
    ],
    whenToUse: [
      "You're deploying Adobe Experience Platform data collection on a website",
      "You need a tag management system to control Web SDK configuration without code deploys",
      "Multiple Adobe products (AEP, Analytics, Target, AJO) need to receive the same events",
      "You want server-side event forwarding to third-party platforms (Google, Meta, etc.)",
    ],
  },

  "launch-target": {
    id: "launch-target",
    hero: {
      badge1: { label: "Tags", color: "primary" },
      badge2: { label: "Target", color: "secondary" },
      title: "Launch → Target",
      subtitle: "Delivering Personalization Experiences",
      description: "Tags deploys either the Web SDK or at.js to deliver Adobe Target personalization — A/B tests, multivariate tests, experience targeting, and automated personalization — on your website with minimal development effort.",
      highlights: [
        { icon: "🎯", label: "A/B Testing", detail: "Test variations with statistical confidence" },
        { icon: "🤖", label: "Auto-Personalization", detail: "ML-driven content optimization per visitor" },
      ],
      mentalModel: "Target's job is to decide 'what should this visitor see?' Tags delivers the decisioning library (Web SDK or at.js) that fetches personalization offers from Target's edge decisioning engine. The flow: page loads → Tags fires the library → library calls Target → Target evaluates audiences + activities → returns personalized content → library renders it on the page. All within milliseconds to avoid flicker.",
    },
    architecture: {
      sectionLabel: "Personalization Pipeline",
      title: "From Page Load to Personalized Experience",
      description: "Target decisions are made at the edge and rendered on the page before the user sees default content.",
      pipeline: [
        { label: "Page Load", description: "Tags fires Web SDK or at.js on DOMContentLoaded", badge: "Tags", badgeColor: "primary" },
        { label: "Prefetch Request", description: "Library sends visitor context to Target Edge", badgeColor: "muted" },
        { label: "Target Decisioning", description: "Evaluates activities, audiences, and offers", badge: "Target", badgeColor: "secondary" },
        { label: "Offer Returned", description: "Personalized content/JSON sent back to browser", badge: "Target", badgeColor: "secondary" },
        { label: "DOM Rendering", description: "Content injected into the page, impression tracked", badgeColor: "muted" },
      ],
    },
    concepts: [
      { title: "Activity Types", content: "Target supports: A/B Test (split traffic between variations), Auto-Allocate (automatically shifts traffic to winners), Auto-Target (ML per-visitor optimization), Experience Targeting (rule-based audience→experience mapping), Multivariate Test (test multiple elements simultaneously), and Automated Personalization (ML across all content combinations)." },
      { title: "On-Device Decisioning", content: "On-Device Decisioning downloads the Target rules artifact to the browser/CDN and evaluates decisions locally — achieving <10ms latency with zero network round-trips. This is ideal for simple A/B tests, feature flags, and experience targeting where sub-second performance matters. Complex ML models (Auto-Target, AP) still require server-side decisioning." },
      { title: "A4T (Analytics for Target)", content: "A4T uses Analytics (or CJA) as the reporting backend for Target activities instead of Target's built-in reports. This means Target test data appears in Analytics/CJA alongside all other web data, enabling: unified reporting, custom metrics/segments for test analysis, and avoiding Target's 10-metric reporting limit." },
      { title: "Visual Experience Composer (VEC)", content: "VEC is Target's WYSIWYG editor for creating experience variations without code. Marketers can point-and-click to change text, images, layout, and styling. For SPAs, the VEC supports 'Views' that map to virtual page loads. For cases where VEC can't reach the element, the Form-Based Composer provides a code-centric alternative." },
    ],
    comparisons: [
      {
        title: "Web SDK vs. at.js for Target",
        description: "Two paths to deliver Target — the modern unified approach vs. the legacy dedicated library.",
        items: [
          { icon: "🆕", label: "Web SDK (alloy.js)", description: "Unified library serving Target, Analytics, AEP, and more.", points: ["Single library for all Adobe products", "Personalization via sendEvent() or applyPropositions()", "Required for Edge Decisioning with AEP segments", "Supports Datastream-level Target configuration", "Future-proof: required for AJO web personalization"] },
          { icon: "📦", label: "at.js 2.x (Legacy)", description: "Target-specific library with deep SPA support.", points: ["Target-only — separate AppMeasurement for Analytics", "getOffer() / applyOffer() API", "Mature SPA support with triggerView()", "On-Device Decisioning artifact caching", "Maintenance mode — no new features planned"] },
        ],
        tip: "New implementations: use Web SDK. Existing at.js sites: migrate when ready, but at.js is still fully supported.",
      },
    ],
    codeExamples: [
      { title: "Web SDK — Fetching Target Personalization", language: "javascript", code: `// alloy.js automatically fetches Target decisions
const result = await alloy("sendEvent", {
  renderDecisions: true,  // Auto-render visual offers
  xdm: {
    eventType: "decisioning.propositionDisplay",
    web: {
      webPageDetails: {
        name: "Home Page",
        viewName: "home"  // SPA view for Target VEC
      }
    }
  },
  decisionScopes: ["hero-banner", "product-recs"]
});

// Access JSON offers for manual rendering
const propositions = result.propositions;
propositions.forEach(prop => {
  console.log("Scope:", prop.scope);
  console.log("Items:", prop.items);
});` },
      { title: "Target Activity Configuration", language: "json", code: `{
  "activityName": "Homepage Hero - Q1 Campaign",
  "type": "auto-target",
  "audiences": [
    { "name": "New Visitors", "rule": "profile.isFirstVisit == true" },
    { "name": "Returning - Gold", "rule": "profile.loyaltyTier == 'Gold'" }
  ],
  "experiences": [
    { "name": "Control", "offer": "hero-default.html" },
    { "name": "Promotion", "offer": "hero-promo-20off.html" },
    { "name": "Loyalty", "offer": "hero-loyalty-exclusive.html" }
  ],
  "reporting": { "source": "analytics_for_target", "rsid": "myrsid" },
  "decisioning": "server-side"
}` },
    ],
    glossary: [
      { title: "Target Terms", color: "secondary", terms: [
        { term: "Activity", definition: "A test or personalization campaign in Target" },
        { term: "Experience", definition: "A content variation shown to a specific audience" },
        { term: "Offer", definition: "The actual content (HTML, JSON, redirect) delivered to the visitor" },
        { term: "Mbox", definition: "A location on the page where Target can inject personalized content" },
        { term: "A4T", definition: "Analytics for Target — uses Analytics/CJA as Target's reporting backend" },
        { term: "VEC", definition: "Visual Experience Composer — WYSIWYG editor for creating offers" },
        { term: "Auto-Target", definition: "ML-driven personalization that optimizes per visitor" },
        { term: "On-Device Decisioning", definition: "Local evaluation of Target rules for sub-10ms performance" },
      ]},
    ],
    tips: [
      "Use renderDecisions: true in sendEvent() to auto-render visual VEC offers — no manual DOM manipulation needed",
      "For SPAs, call alloy('sendEvent') with a viewName on virtual page loads to trigger SPA-specific Target activities",
      "Enable A4T to get Target test data in Analytics/CJA — it's far more powerful than Target's built-in reports",
      "On-Device Decisioning eliminates network latency for simple A/B tests — ideal for performance-critical pages",
    ],
    whenToUse: [
      "You need A/B testing or multivariate testing on your website",
      "Personalized content should be delivered based on visitor attributes or behavioral segments",
      "Marketing teams need a WYSIWYG tool to create experience variations without developer involvement",
      "ML-driven automated personalization (Auto-Target, AP) is needed to optimize for each visitor",
    ],
  },

  "launch-analytics": {
    id: "launch-analytics",
    hero: {
      badge1: { label: "Tags", color: "primary" },
      badge2: { label: "AA", color: "secondary" },
      title: "Launch → Analytics",
      subtitle: "Sending Analytics Data via Web SDK",
      description: "Tags deploys the Web SDK to send analytics data to Adobe Analytics — either through the modern XDM-to-Analytics mapping (via Edge Network) or through the legacy AppMeasurement library. The strategic path is Web SDK, which sends data to Analytics and AEP simultaneously.",
      highlights: [
        { icon: "📊", label: "Dual Reporting", detail: "Same event feeds both Analytics and AEP/CJA" },
        { icon: "🔄", label: "Migration Path", detail: "Move from AppMeasurement to Web SDK incrementally" },
      ],
      mentalModel: "With Web SDK, analytics data flows through Edge Network. You send XDM-structured events, and the Datastream's Analytics service maps XDM fields to props/eVars/events automatically. This means one sendEvent() call feeds both Analytics report suites AND AEP datasets — no duplicate tags needed. The mapping happens server-side on Edge, not in the browser.",
    },
    architecture: {
      sectionLabel: "Collection Pipeline",
      title: "Web SDK to Analytics via Edge",
      description: "XDM events are mapped to Analytics variables server-side on Edge Network.",
      pipeline: [
        { label: "Tags + Web SDK", description: "alloy.js sends XDM-structured events", badge: "Tags", badgeColor: "primary" },
        { label: "Edge Network", description: "Receives XDM payload, routes to services", badge: "Edge", badgeColor: "accent" },
        { label: "XDM → Analytics Mapping", description: "Edge maps XDM fields to props/eVars/events", badge: "Edge", badgeColor: "accent" },
        { label: "Analytics Processing", description: "Hit processed into report suite", badge: "AA", badgeColor: "secondary" },
        { label: "AEP Dataset (parallel)", description: "Same event also lands in AEP for CJA", badge: "AEP", badgeColor: "primary" },
      ],
    },
    concepts: [
      { title: "XDM-to-Analytics Variable Mapping", content: "Edge Network automatically maps standard XDM fields to Analytics variables. For example: web.webPageDetails.name → pageName, commerce.purchases.value → purchase event, productListItems[].SKU → products string. Custom mappings can be configured in the Datastream to map non-standard XDM fields to specific props/eVars." },
      { title: "Data Prep for Analytics", content: "Datastream Data Prep lets you transform XDM fields before they reach Analytics. You can: rename fields, concatenate values, apply conditional logic, and map dynamic fields to specific eVars. This is powerful for migration — you can keep your existing Analytics implementation's variable mapping while sending XDM-native data." },
      { title: "Processing Rules vs. Datastream Mapping", content: "In the legacy approach, processing rules in the Analytics admin mapped context data to variables. With Web SDK, this mapping moves to the Datastream (server-side, pre-processing). Datastream mappings are more reliable, version-controlled, and apply before data reaches Analytics — whereas processing rules applied after data collection." },
      { title: "Report Suite Mapping", content: "A single Datastream can map to multiple report suites (dev, staging, production) based on environment configuration. You can also conditionally route events to different report suites using Datastream overrides in Tags rules — useful for multi-brand or multi-region setups sharing one Tags property." },
    ],
    comparisons: [
      {
        title: "Web SDK Analytics vs. AppMeasurement",
        description: "Two approaches to sending data to Analytics from Tags.",
        items: [
          { icon: "🆕", label: "Web SDK → Edge → Analytics", description: "XDM-native, server-side mapping, dual-destination.", points: ["XDM structure maps to Analytics variables on Edge", "Same event feeds Analytics + AEP simultaneously", "Server-side processing — less client-side JavaScript", "Supports Event Forwarding to third parties", "Required path for CJA migration"] },
          { icon: "📉", label: "AppMeasurement (s.pageName)", description: "Direct Analytics calls with prop/eVar syntax.", points: ["Direct s.pageName, s.eVar1, s.events assignments", "Analytics-only — separate implementation for AEP", "Client-side processing rules", "Mature plugin ecosystem (Activity Map, etc.)", "No longer receiving feature updates"] },
        ],
      },
    ],
    codeExamples: [
      { title: "Web SDK — Page View (Analytics + AEP)", language: "javascript", code: `// One sendEvent() feeds both Analytics and AEP
alloy("sendEvent", {
  xdm: {
    eventType: "web.webpagedetails.pageViews",
    web: {
      webPageDetails: {
        name: "Product Detail - Running Shoes",  // → pageName
        URL: window.location.href,
        siteSection: "Products"  // → mapped to prop1 in Datastream
      }
    }
  },
  data: {
    // Non-XDM data for Analytics-specific mappings
    __adobe: {
      analytics: {
        eVar5: "member-logged-in",  // Direct eVar override
        events: "event10"           // Custom event
      }
    }
  }
});` },
      { title: "Datastream — Analytics Variable Mapping", language: "json", code: `{
  "analytics": {
    "reportSuiteId": "myrsid-prod",
    "additionalMappings": [
      { "xdmField": "web.webPageDetails.siteSection", "analyticsVariable": "prop1" },
      { "xdmField": "_mycompany.userType", "analyticsVariable": "eVar10" },
      { "xdmField": "_mycompany.searchTerm", "analyticsVariable": "eVar15" }
    ],
    "automaticMapping": true,
    "linkTrackingEnabled": true
  }
}` },
    ],
    glossary: [
      { title: "Analytics Terms", color: "secondary", terms: [
        { term: "Report Suite", definition: "A data container in Analytics that stores processed hits" },
        { term: "eVar", definition: "Conversion variable — persists across hits with configurable expiration" },
        { term: "prop", definition: "Traffic variable — set per hit, does not persist" },
        { term: "Processing Rules", definition: "Server-side rules that map context data to Analytics variables" },
        { term: "AppMeasurement", definition: "Legacy Analytics JavaScript library (s.pageName syntax)" },
        { term: "s.t() / s.tl()", definition: "Legacy page view and link tracking calls" },
      ]},
      { title: "Web SDK Terms", color: "primary", terms: [
        { term: "Datastream Mapping", definition: "Server-side configuration mapping XDM fields to Analytics variables" },
        { term: "Data Prep", definition: "Transformation layer on Edge Network before data reaches Analytics" },
        { term: "__adobe.analytics", definition: "Non-XDM data object for direct Analytics variable overrides" },
      ]},
    ],
    tips: [
      "Use the __adobe.analytics object in data{} for Analytics-specific overrides that don't fit XDM",
      "Enable automatic XDM mapping in the Datastream — it handles standard commerce and page view fields",
      "Test migration with a dev report suite before switching production traffic from AppMeasurement to Web SDK",
      "One sendEvent() feeds both Analytics and AEP — you get CJA readiness for free",
    ],
    whenToUse: [
      "You're collecting website analytics data using Adobe Analytics",
      "You want to send the same event to Analytics and AEP simultaneously (CJA migration path)",
      "You're migrating from AppMeasurement to Web SDK and need Analytics variable mapping",
      "Server-side processing and Event Forwarding are needed to reduce client-side code",
    ],
  },

  "target-aep-cja": {
    id: "target-aep-cja",
    hero: {
      badge1: { label: "Target", color: "secondary" },
      badge2: { label: "AEP", color: "primary" },
      title: "Target → AEP / CJA",
      subtitle: "Decision Data Feeding Back for Reporting",
      description: "Target's personalization decisions and test results feed back into AEP as ExperienceEvents, enabling CJA to provide deep analysis of A/B test performance, personalization lift, and cross-channel impact of Target activities.",
      highlights: [
        { icon: "📈", label: "A4T in CJA", detail: "Analyze Target tests with full CJA Workspace power" },
        { icon: "🔄", label: "Closed Loop", detail: "Target decisions enrich AEP profiles for downstream use" },
      ],
      mentalModel: "When Target serves a personalization decision via Web SDK, the proposition (which activity, experience, and offer were shown) is captured as part of the XDM event flowing to AEP. CJA reads these proposition events alongside all other web/app data, enabling analysis like: 'Did Experience B drive more revenue, and how did those users behave on mobile afterward?'",
    },
    architecture: {
      sectionLabel: "Feedback Pipeline",
      title: "From Target Decision to CJA Analysis",
      description: "Target propositions flow through Edge Network to AEP datasets, where CJA picks them up.",
      pipeline: [
        { label: "Target Decisioning", description: "Target evaluates activities and returns offers", badge: "Target", badgeColor: "secondary" },
        { label: "Proposition Rendered", description: "Web SDK renders offer and tracks impression", badgeColor: "muted" },
        { label: "Edge → AEP", description: "Proposition display/interact events stored in AEP", badge: "AEP", badgeColor: "primary" },
        { label: "CJA Connection", description: "Proposition events included in CJA Connection", badge: "CJA", badgeColor: "primary" },
        { label: "Workspace Analysis", description: "Test lift, conversion, cross-channel attribution", badge: "CJA", badgeColor: "primary" },
      ],
    },
    concepts: [
      { title: "Proposition Events", content: "When Web SDK renders a Target offer, it generates proposition display (impression) and proposition interact (click/engagement) events. These events contain the activityId, experienceId, offerId, and scope — enabling CJA to break down performance by test, experience, and location on the page." },
      { title: "A4T with CJA", content: "Analytics for Target (A4T) traditionally used Adobe Analytics as Target's reporting source. With Web SDK + AEP, the same proposition data flows to CJA, giving analysts access to unlimited dimensions, attribution models, and cross-channel correlation — far exceeding traditional A4T capabilities." },
      { title: "Profile Enrichment", content: "Target decisions are attached to the AEP profile. This means downstream systems (AJO, RTCDP) can use Target test membership as a signal. For example: 'Users who saw the promotional hero banner' can be a condition in an AJO journey or an RTCDP segment." },
    ],
    comparisons: [
      {
        title: "Target Built-in Reports vs. CJA Analysis",
        description: "Where to analyze Target test results.",
        items: [
          { icon: "🎯", label: "Target Reports", description: "Quick activity-level metrics.", points: ["Conversion rate per experience", "Confidence interval calculation", "Revenue per visitor", "Limited to Target-specific metrics"] },
          { icon: "📊", label: "CJA Analysis", description: "Full analytical power on proposition data.", points: ["Cross-channel impact analysis", "Custom attribution models", "Segment overlap with other behaviors", "Cohort analysis of test participants", "Funnel analysis post-test exposure"] },
        ],
      },
    ],
    codeExamples: [
      { title: "Proposition Display Event (in AEP)", language: "json", code: `{
  "eventType": "decisioning.propositionDisplay",
  "timestamp": "2024-01-15T10:30:00Z",
  "_experience": {
    "decisioning": {
      "propositions": [{
        "id": "prop-12345",
        "scope": "hero-banner",
        "items": [{
          "id": "offer-promo-20off",
          "schema": "htmlContent"
        }],
        "scopeDetails": {
          "activity": {
            "id": "act-homepage-hero-q1",
            "name": "Homepage Hero - Q1 Campaign"
          },
          "experience": {
            "id": "exp-2",
            "name": "Promotion - 20% Off"
          }
        }
      }]
    }
  }
}` },
    ],
    glossary: [
      { title: "Target Feedback Terms", color: "secondary", terms: [
        { term: "Proposition", definition: "A personalization decision containing activity, experience, and offer details" },
        { term: "Proposition Display", definition: "Impression event fired when an offer is rendered on the page" },
        { term: "Proposition Interact", definition: "Engagement event fired when a user clicks/interacts with an offer" },
        { term: "A4T", definition: "Analytics for Target — using Analytics/CJA as Target's reporting backend" },
        { term: "Scope", definition: "A named location (mbox) on the page where Target delivers offers" },
      ]},
    ],
    tips: [
      "Always enable renderDecisions: true so proposition display events are tracked automatically",
      "Use CJA for A4T analysis — it supports attribution models and cross-channel correlation Target reports cannot",
      "Target proposition data enriches AEP profiles — use test exposure as a signal in AJO journeys",
    ],
    whenToUse: [
      "You need advanced analysis of Target A/B test results beyond built-in reporting",
      "Cross-channel impact of personalization decisions needs to be measured",
      "Target test membership should inform downstream activation (AJO, RTCDP)",
    ],
  },

  "genstudio-ajo": {
    id: "genstudio-ajo",
    hero: {
      badge1: { label: "GenAI", color: "accent" },
      badge2: { label: "AJO", color: "secondary" },
      title: "GenStudio → AJO",
      subtitle: "AI Content Assets in Campaigns",
      description: "Adobe GenStudio for Performance Marketing uses generative AI to create on-brand content variations — emails, images, ad copy — that can be directly used in AJO campaigns and journeys, accelerating content creation from weeks to minutes.",
      highlights: [
        { icon: "🤖", label: "Generative AI", detail: "On-brand content created from natural language prompts" },
        { icon: "✉️", label: "Direct to AJO", detail: "Generated assets flow directly into AJO templates" },
      ],
      mentalModel: "GenStudio is the content factory; AJO is the delivery engine. Marketers describe what they want in natural language ('create an email for cart abandonment with a 20% off offer, brand-consistent with our Q1 campaign'), GenStudio generates multiple variations against brand guidelines, and the approved content is pushed to AJO as ready-to-use email/push templates or content fragments.",
    },
    architecture: {
      sectionLabel: "Content Pipeline",
      title: "From AI Generation to Campaign Delivery",
      description: "Content is generated, reviewed, approved, and deployed through AJO channels.",
      pipeline: [
        { label: "Brand Guidelines", description: "Logo, tone, colors, approved imagery uploaded", badge: "GenAI", badgeColor: "accent" },
        { label: "AI Generation", description: "Multiple content variations created from prompts", badge: "GenAI", badgeColor: "accent" },
        { label: "Review & Approve", description: "Marketing team reviews, edits, and approves content", badgeColor: "muted" },
        { label: "AJO Templates", description: "Approved assets published as AJO content fragments", badge: "AJO", badgeColor: "secondary" },
        { label: "Campaign Delivery", description: "Content delivered via email, push, SMS, in-app", badge: "AJO", badgeColor: "secondary" },
      ],
    },
    concepts: [
      { title: "Brand Guidelines", content: "GenStudio uses uploaded brand assets (logos, color palettes, fonts, tone-of-voice documents, approved imagery) to ensure generated content stays on-brand. The AI learns brand patterns and applies them to every generation — preventing off-brand content from reaching customers." },
      { title: "Content Variations", content: "For each prompt, GenStudio generates multiple variations (typically 4-8) with different copy, layouts, and image treatments. Marketers can A/B test these variations in AJO to find the highest-performing content. This replaces the traditional process of creating one asset and hoping it works." },
      { title: "Content Fragments", content: "Approved GenStudio content is published as AJO Content Fragments — reusable content blocks that can be inserted into any email template, push notification, or in-app message. Fragments can contain dynamic personalization (Handlebars syntax) added during generation." },
      { title: "Performance Insights", content: "GenStudio tracks which generated content variations perform best in AJO campaigns (open rates, click rates, conversion). This feedback loop improves future generations — the AI learns which styles, copy approaches, and imagery drive the best results for your brand." },
    ],
    codeExamples: [
      { title: "GenStudio Content Prompt (Conceptual)", language: "json", code: `{
  "prompt": "Create a cart abandonment recovery email",
  "brandProfile": "fashion-brand-q1-2024",
  "constraints": {
    "tone": "friendly, urgent but not pushy",
    "cta": "Complete Your Order",
    "offer": "15% off with code SAVE15",
    "personalization": ["firstName", "cartItems", "loyaltyTier"]
  },
  "variations": 4,
  "channels": ["email"],
  "outputFormat": "ajo_content_fragment"
}` },
      { title: "Generated Content Fragment (AJO-Ready)", language: "html", code: `<!-- GenStudio Output → AJO Content Fragment -->
<div class="email-hero" style="background: #f8f9fa;">
  <h1>Hey {{profile.person.name.firstName}}, you forgot something!</h1>
  <p>Your cart is waiting — and we've got a little something to sweeten the deal.</p>
  
  {{#each context.journey.events.cartAbandoned.productListItems}}
  <div class="product-card">
    <img src="{{this.imageURL}}" alt="{{this.name}}" />
    <h3>{{this.name}}</h3>
    <p class="price">\${{this.priceTotal}}</p>
  </div>
  {{/each}}
  
  {{#if (equals profile.loyalty.tier "Gold")}}
    <p class="offer">Gold exclusive: <strong>20% off</strong> with code GOLD20</p>
  {{else}}
    <p class="offer">Use code <strong>SAVE15</strong> for 15% off</p>
  {{/if}}
  
  <a href="https://shop.example.com/cart" class="cta-button">Complete Your Order →</a>
</div>` },
    ],
    glossary: [
      { title: "GenStudio Terms", color: "accent", terms: [
        { term: "Brand Profile", definition: "Uploaded brand assets and guidelines that constrain AI generation" },
        { term: "Content Variation", definition: "One of multiple AI-generated versions of a content piece" },
        { term: "Content Fragment", definition: "A reusable content block published to AJO for use in templates" },
        { term: "Performance Insights", definition: "Analytics on which generated content performs best in campaigns" },
      ]},
      { title: "AJO Terms", color: "secondary", terms: [
        { term: "Email Template", definition: "The overall email structure that embeds content fragments" },
        { term: "Content Experiment", definition: "AJO's A/B testing for content variations within a journey" },
        { term: "Personalization", definition: "Dynamic content using Handlebars syntax with profile data" },
      ]},
    ],
    tips: [
      "Upload comprehensive brand guidelines to GenStudio — the better the input, the more on-brand the output",
      "Generate 4+ variations and let AJO's Content Experiments pick the winner with real audience data",
      "Use GenStudio for high-volume content needs (seasonal campaigns, localization, variant testing)",
    ],
    whenToUse: [
      "Content creation is a bottleneck in your campaign velocity",
      "You need multiple content variations for A/B testing across channels",
      "Brand consistency is critical and you want AI-enforced brand guidelines",
      "Marketing teams need to iterate on content faster than traditional design workflows allow",
    ],
  },

  "eds-aep": {
    id: "eds-aep",
    hero: {
      badge1: { label: "EDS", color: "accent" },
      badge2: { label: "AEP", color: "primary" },
      title: "EDS → AEP",
      subtitle: "Edge Delivery Services Event Collection",
      description: "Adobe Edge Delivery Services (EDS) sites use the Web SDK to send page interaction events to AEP. EDS's lightweight architecture means Web SDK integration follows specific patterns for document-based authoring and edge-rendered pages.",
      highlights: [
        { icon: "⚡", label: "Edge-First", detail: "EDS pages are pre-rendered at the edge for speed" },
        { icon: "📊", label: "RUM + AEP", detail: "Real User Monitoring data enriched with AEP events" },
      ],
      mentalModel: "EDS pages are built from Google Docs/Sheets and rendered at the edge. They're fast but lightweight — there's no traditional tag manager. Web SDK (alloy.js) is loaded directly as a module, configured with a Datastream, and fires events on page load, link clicks, and custom interactions. These events flow to AEP just like any other Web SDK implementation.",
    },
    architecture: {
      sectionLabel: "Collection Pipeline",
      title: "EDS Page Events to AEP",
      description: "Web SDK on EDS pages sends XDM events through Edge Network to AEP.",
      pipeline: [
        { label: "EDS Page", description: "Document-based page rendered at the edge", badge: "EDS", badgeColor: "accent" },
        { label: "alloy.js Module", description: "Web SDK loaded as ES module on the page", badgeColor: "muted" },
        { label: "Edge Network", description: "Events routed to AEP via Datastream", badge: "Edge", badgeColor: "primary" },
        { label: "AEP Dataset", description: "Events ingested into XDM-conformant dataset", badge: "AEP", badgeColor: "primary" },
      ],
    },
    concepts: [
      { title: "EDS Architecture", content: "Edge Delivery Services renders pages from Google Docs or SharePoint content at the edge. Pages are plain HTML with minimal JavaScript — optimized for Core Web Vitals. This means Web SDK integration must be lightweight: lazy-loaded, deferred, and configured to minimize impact on LCP and INP." },
      { title: "Module-Based Loading", content: "Unlike traditional sites using Tags embed codes, EDS loads alloy.js as an ES module. The Web SDK configuration (Datastream ID, org ID) is set in a dedicated configuration block. This approach avoids the overhead of a full tag manager while maintaining Web SDK's data collection capabilities." },
      { title: "RUM Integration", content: "EDS includes built-in Real User Monitoring (RUM) that tracks Core Web Vitals (LCP, CLS, INP). This data can be correlated with AEP events to understand: 'Do page performance issues affect conversion?' RUM data stays in EDS; behavioral/commerce events go to AEP." },
    ],
    codeExamples: [
      { title: "EDS — Web SDK Integration", language: "javascript", code: `// In an EDS block or script module
import alloy from 'https://cdn.jsdelivr.net/npm/@adobe/alloy@latest/dist/alloy.min.js';

alloy("configure", {
  datastreamId: "ds-eds-prod-12345",
  orgId: "ABC123@AdobeOrg",
  defaultConsent: "in"
});

// Track page view
alloy("sendEvent", {
  xdm: {
    eventType: "web.webpagedetails.pageViews",
    web: {
      webPageDetails: {
        name: document.title,
        URL: window.location.href,
        siteSection: document.querySelector('meta[name="section"]')?.content
      }
    }
  }
});` },
    ],
    glossary: [
      { title: "EDS Terms", color: "accent", terms: [
        { term: "Edge Delivery Services", definition: "Adobe's edge-rendering platform for document-based websites" },
        { term: "Block", definition: "A reusable content component in EDS (similar to a web component)" },
        { term: "RUM", definition: "Real User Monitoring — built-in performance tracking in EDS" },
        { term: "Document-Based Authoring", definition: "Content authored in Google Docs/SharePoint, rendered as HTML" },
      ]},
    ],
    tips: [
      "Lazy-load alloy.js to avoid impacting EDS's excellent Core Web Vitals scores",
      "Use EDS blocks to encapsulate Web SDK event tracking logic for reusability",
      "Correlate RUM performance data with AEP conversion events to find performance-impacting issues",
    ],
    whenToUse: [
      "You're building websites with Adobe Edge Delivery Services and need behavioral event collection",
      "AEP/CJA analytics are needed on EDS-rendered pages",
      "You want to track commerce events (product views, cart adds) from lightweight EDS pages",
    ],
  },

  "source-connectors-aep": {
    id: "source-connectors-aep",
    hero: {
      badge1: { label: "SRC", color: "accent" },
      badge2: { label: "AEP", color: "primary" },
      title: "Source Connectors → AEP",
      subtitle: "CRM & Cloud Batch Ingestion",
      description: "AEP Source Connectors provide pre-built integrations to ingest data from CRM systems (Salesforce, Microsoft Dynamics), cloud storage (S3, Azure, GCS), databases (Redshift, BigQuery), and marketing platforms (Marketo, HubSpot) into AEP datasets — without building custom ETL pipelines.",
      highlights: [
        { icon: "🔌", label: "200+ Connectors", detail: "Pre-built integrations for major platforms" },
        { icon: "📅", label: "Scheduled Sync", detail: "Automated recurring data ingestion" },
      ],
      mentalModel: "Source Connectors are AEP's 'import' mechanism for batch and streaming data from external systems. You configure a connector (credentials, schema mapping, schedule), and AEP pulls data on a recurring basis. Each connector handles authentication, pagination, rate limiting, and error handling — you just map fields to XDM and set a schedule.",
    },
    architecture: {
      sectionLabel: "Ingestion Pipeline",
      title: "From External Source to AEP Dataset",
      description: "Connectors handle authentication, extraction, transformation, and loading into AEP.",
      pipeline: [
        { label: "External Source", description: "Salesforce, S3, BigQuery, Marketo, etc.", badgeColor: "muted" },
        { label: "Source Connector", description: "Pre-built adapter handles auth + extraction", badge: "SRC", badgeColor: "accent" },
        { label: "Data Prep / Mapping", description: "Source fields mapped to XDM schema", badge: "AEP", badgeColor: "primary" },
        { label: "Dataflow", description: "Scheduled or one-time ingestion run", badge: "AEP", badgeColor: "primary" },
        { label: "AEP Dataset", description: "Data lands in XDM-conformant dataset", badge: "AEP", badgeColor: "primary" },
      ],
    },
    concepts: [
      { title: "Connector Categories", content: "Source connectors are grouped: CRM (Salesforce, Dynamics, HubSpot), Cloud Storage (S3, Azure Blob, GCS, SFTP), Databases (Redshift, BigQuery, Snowflake, PostgreSQL), Marketing (Marketo, Mailchimp), Payments (Stripe, PayPal), and Adobe Applications (Analytics, Audience Manager). Each category has specific authentication and configuration requirements." },
      { title: "Dataflows", content: "A dataflow is a configured pipeline that runs on a schedule (hourly, daily, weekly) or as a one-time import. Dataflows track: records processed, records ingested, records failed, run duration, and next scheduled run. Failed records include error details (schema validation, identity resolution, data type mismatch)." },
      { title: "Data Prep Mapping", content: "Before ingestion, you map source fields to XDM fields using AEP's Data Prep UI or API. This supports: direct mapping (source_field → xdm_field), calculated fields (CONCAT, TRIM, UPPER), conditional mapping (IF source.country = 'US' THEN 'United States'), and nested object mapping. Mappings are saved and reused across dataflow runs." },
      { title: "Incremental vs. Full Load", content: "Connectors support two ingestion modes: Full load (import all records every run — simpler but slower) and Incremental (import only records changed since last run — faster, requires a delta column like 'last_modified_date'). For large datasets (millions of rows), incremental is essential for performance." },
    ],
    comparisons: [
      {
        title: "Batch Connectors vs. Streaming Ingestion",
        description: "Choose based on data freshness requirements and source system capabilities.",
        items: [
          { icon: "📦", label: "Batch (Source Connectors)", description: "Scheduled periodic imports from external systems.", points: ["CRM records, loyalty data, historical transactions", "Schedule: hourly to daily", "Handles large volumes (millions of records per run)", "Data Prep transformations applied", "Best for: CRM sync, data warehouse integration"] },
          { icon: "⚡", label: "Streaming (HTTP API / SDK)", description: "Real-time event ingestion as data is generated.", points: ["Web/app events, transactional events, IoT signals", "Latency: seconds to minutes", "Per-record ingestion via HTTP or SDK", "Must conform to XDM schema at send time", "Best for: behavioral events, real-time updates"] },
        ],
      },
    ],
    codeExamples: [
      { title: "Source Connector — Salesforce Configuration", language: "json", code: `{
  "connectionSpec": "salesforce-v2",
  "auth": {
    "type": "oauth2",
    "clientId": "3MVG9...",
    "clientSecret": "***",
    "refreshToken": "***",
    "instanceUrl": "https://mycompany.my.salesforce.com"
  },
  "sourceObject": "Contact",
  "schedule": {
    "frequency": "daily",
    "startTime": "03:00 UTC",
    "mode": "incremental",
    "deltaColumn": "LastModifiedDate"
  },
  "mapping": {
    "Email": "personalEmail.address",
    "FirstName": "person.name.firstName",
    "LastName": "person.name.lastName",
    "Account.Industry": "_mycompany.accountIndustry",
    "MailingCity": "homeAddress.city"
  },
  "targetDataset": "crm-contacts",
  "targetSchema": "XDM Individual Profile"
}` },
      { title: "S3 Cloud Storage Connector", language: "json", code: `{
  "connectionSpec": "s3",
  "auth": {
    "accessKeyId": "AKIA...",
    "secretAccessKey": "***",
    "bucket": "my-company-data-exports",
    "path": "/loyalty-data/daily/"
  },
  "fileFormat": {
    "type": "CSV",
    "delimiter": ",",
    "header": true,
    "encoding": "UTF-8"
  },
  "schedule": {
    "frequency": "daily",
    "mode": "incremental",
    "filePattern": "loyalty_export_{YYYY-MM-DD}.csv"
  }
}` },
    ],
    glossary: [
      { title: "Source Connector Terms", color: "accent", terms: [
        { term: "Connection Spec", definition: "Technical blueprint for connecting to a specific source type" },
        { term: "Dataflow", definition: "A configured, scheduled data pipeline from source to AEP" },
        { term: "Data Prep", definition: "Field mapping and transformation layer before ingestion" },
        { term: "Incremental Load", definition: "Only importing records changed since last run" },
        { term: "Full Load", definition: "Importing all records from the source every run" },
        { term: "Delta Column", definition: "The field used to detect changes for incremental loads" },
        { term: "Backfill", definition: "Initial historical data import when setting up a new connector" },
      ]},
    ],
    tips: [
      "Always use incremental mode for large datasets — full loads waste processing time and quota",
      "Set up monitoring alerts for dataflow failures — a failed CRM sync can cause stale profile data",
      "Use Data Prep calculated fields to normalize data (uppercase emails, standardize country codes) before ingestion",
      "Test connector configuration with a small dataset before scheduling production runs",
    ],
    whenToUse: [
      "CRM data (Salesforce, Dynamics) needs to be unified with behavioral data in AEP profiles",
      "Historical transaction data in cloud storage (S3, Azure) should feed AEP for segmentation",
      "Marketing platform data (Marketo, HubSpot) needs to join the unified profile",
      "Database tables (Redshift, BigQuery) contain attributes needed for RTCDP segmentation",
    ],
  },

  "streaming-api-aep": {
    id: "streaming-api-aep",
    hero: {
      badge1: { label: "API", color: "accent" },
      badge2: { label: "AEP", color: "primary" },
      title: "Streaming API → AEP",
      subtitle: "Server-Side HTTP Ingestion",
      description: "The AEP Data Collection HTTP API enables server-side systems to send real-time events directly to AEP via HTTPS POST requests. This is used for backend-generated events (order confirmations, payments, inventory updates) that don't originate from a browser or mobile app.",
      highlights: [
        { icon: "🔗", label: "Direct HTTP", detail: "Simple HTTPS POST from any server or service" },
        { icon: "⚡", label: "Real-Time", detail: "Events ingested within seconds" },
      ],
      mentalModel: "The Streaming API is AEP's 'back door' for server-side data. While Web SDK handles browser events and Source Connectors handle batch imports, the Streaming API fills the gap: real-time events from your backend (order placed, payment processed, shipment dispatched). Each POST contains an XDM-structured event with schema reference and identity information.",
    },
    architecture: {
      sectionLabel: "Ingestion Pipeline",
      title: "From Backend System to AEP",
      description: "Server-side events are POSTed directly to AEP's streaming endpoint.",
      pipeline: [
        { label: "Backend System", description: "Order service, payment processor, inventory system", badgeColor: "muted" },
        { label: "HTTP POST", description: "XDM-structured JSON sent to streaming endpoint", badge: "API", badgeColor: "accent" },
        { label: "AEP Streaming Inlet", description: "Validates schema, authenticates, ingests", badge: "AEP", badgeColor: "primary" },
        { label: "Real-Time Profile", description: "Event attached to unified customer profile", badge: "AEP", badgeColor: "primary" },
      ],
    },
    concepts: [
      { title: "Streaming Inlet", content: "A Streaming Inlet is an authenticated endpoint unique to your AEP organization. It accepts XDM-structured JSON payloads via HTTPS POST. Each inlet is associated with a specific Datastream or Dataset. Authentication uses either an IMS access token (OAuth) or a Streaming Connection ID for simpler setups." },
      { title: "Message Validation", content: "Every incoming message is validated against the referenced XDM schema. If the payload doesn't match (wrong field types, missing required fields), the message is rejected with a 400 error and detailed validation errors. This ensures only clean, schema-conformant data enters AEP." },
      { title: "Batch Optimization", content: "The Streaming API supports sending multiple events in a single POST (up to 1MB or 5000 events per batch). This reduces HTTP overhead for high-volume backends. Each event in the batch is processed independently — a single validation failure doesn't reject the entire batch." },
      { title: "Guaranteed Delivery", content: "The Streaming API provides at-least-once delivery guarantees. If a message is accepted (HTTP 200), it will eventually appear in the target dataset and profile. For exactly-once semantics, use idempotency keys in your event payloads to deduplicate on the AEP side." },
    ],
    codeExamples: [
      { title: "Streaming API — Order Confirmation Event", language: "bash", code: `# POST to AEP Streaming Endpoint
curl -X POST "https://dcs.adobedc.net/collection/{INLET_ID}" \\
  -H "Content-Type: application/json" \\
  -H "x-adobe-flow-id: flow-order-events" \\
  -d '{
    "header": {
      "schemaRef": {
        "id": "https://ns.adobe.com/{TENANT}/schemas/order-events",
        "contentType": "application/vnd.adobe.xed-full+json;version=1.0"
      },
      "imsOrgId": "ABC123@AdobeOrg",
      "datasetId": "ds-order-events"
    },
    "body": {
      "xdmMeta": {
        "schemaRef": {
          "id": "https://ns.adobe.com/{TENANT}/schemas/order-events"
        }
      },
      "xdmEntity": {
        "eventType": "commerce.purchases",
        "timestamp": "2024-01-15T14:30:00Z",
        "commerce": {
          "purchases": { "value": 1 },
          "order": {
            "purchaseID": "ORD-98765",
            "priceTotal": 349.99,
            "currencyCode": "USD"
          }
        },
        "productListItems": [
          { "SKU": "WH-500", "name": "Wireless Headphones", "quantity": 1, "priceTotal": 199.99 },
          { "SKU": "PC-200", "name": "Phone Case", "quantity": 1, "priceTotal": 49.99 }
        ],
        "identityMap": {
          "Email": [{ "id": "user@example.com", "primary": true }]
        }
      }
    }
  }'` },
      { title: "Node.js — Streaming API Client", language: "javascript", code: `const axios = require('axios');

async function sendToAEP(event) {
  const response = await axios.post(
    'https://dcs.adobedc.net/collection/{INLET_ID}',
    {
      header: {
        schemaRef: { id: "https://ns.adobe.com/{TENANT}/schemas/order-events" },
        imsOrgId: "ABC123@AdobeOrg",
        datasetId: "ds-order-events"
      },
      body: {
        xdmEntity: {
          eventType: event.type,
          timestamp: new Date().toISOString(),
          commerce: event.commerce,
          productListItems: event.products,
          identityMap: { Email: [{ id: event.email, primary: true }] }
        }
      }
    },
    { headers: { 'Content-Type': 'application/json' } }
  );
  console.log('Ingested:', response.status);
}` },
    ],
    glossary: [
      { title: "Streaming API Terms", color: "accent", terms: [
        { term: "Streaming Inlet", definition: "An authenticated HTTPS endpoint for receiving real-time events" },
        { term: "Schema Reference", definition: "The XDM schema ID that the payload must conform to" },
        { term: "Flow ID", definition: "Identifies the streaming dataflow for monitoring purposes" },
        { term: "Batch Message", definition: "Multiple events sent in a single HTTP POST request" },
        { term: "At-Least-Once Delivery", definition: "Guarantee that accepted messages will be processed" },
      ]},
    ],
    tips: [
      "Always include the schema reference in the header — messages without it are rejected",
      "Use batch mode for high-volume backends (up to 5000 events per POST)",
      "Implement retry logic with exponential backoff for transient errors (429, 503)",
      "Monitor ingestion latency in AEP's Monitoring dashboard — typical latency is <60 seconds",
    ],
    whenToUse: [
      "Backend systems need to send real-time events to AEP (order confirmations, payments, status updates)",
      "Events don't originate from a browser or mobile app (server-to-server)",
      "You need sub-minute ingestion latency for time-sensitive profile updates",
      "IoT devices, kiosks, or POS systems need to feed data to AEP",
    ],
  },

  "mobile-sdk-aep": {
    id: "mobile-sdk-aep",
    hero: {
      badge1: { label: "SDK", color: "accent" },
      badge2: { label: "AEP", color: "primary" },
      title: "Mobile SDK → AEP",
      subtitle: "iOS/Android Events via Edge Network",
      description: "The Adobe Experience Platform Mobile SDK collects behavioral events from iOS and Android apps, sending them through Edge Network to AEP. It's the mobile equivalent of the Web SDK — providing unified data collection, identity management, and multi-product support in a single SDK.",
      highlights: [
        { icon: "📱", label: "Native SDKs", detail: "Swift (iOS), Kotlin (Android), React Native, Flutter" },
        { icon: "🔗", label: "Unified Identity", detail: "Mobile identifiers (ECID, IDFA/GAID) stitch to web profiles" },
      ],
      mentalModel: "The Mobile SDK does for apps what alloy.js does for websites. It sends XDM-structured events through Edge Network to AEP, supports Target personalization, AJO push/in-app messaging, and Analytics — all through a single SDK. The key difference is identity: mobile uses ECID + device IDs (IDFA/GAID) + customer IDs, stitched together by AEP's Identity Service.",
    },
    architecture: {
      sectionLabel: "Mobile Collection Pipeline",
      title: "From App Event to AEP Profile",
      description: "Mobile events flow through Edge Network just like web events.",
      pipeline: [
        { label: "Mobile App", description: "iOS (Swift) or Android (Kotlin) app", badgeColor: "muted" },
        { label: "AEP Mobile SDK", description: "Edge extension sends XDM events", badge: "SDK", badgeColor: "accent" },
        { label: "Edge Network", description: "Routes events based on Datastream config", badge: "Edge", badgeColor: "primary" },
        { label: "AEP Profile", description: "Events stitched to unified cross-device profile", badge: "AEP", badgeColor: "primary" },
      ],
    },
    concepts: [
      { title: "SDK Extensions", content: "The Mobile SDK is modular — you install only the extensions you need: Core (lifecycle, identity), Edge (AEP data collection), Analytics (report suite tracking), Target (personalization), Messaging (AJO push/in-app), Places (geo-fencing), and Assurance (debugging). Each extension is a separate dependency." },
      { title: "Lifecycle Events", content: "The SDK automatically tracks app lifecycle events: app install, app launch, app foreground/background, app crash, and session length. These events flow to AEP as ExperienceEvents, providing baseline engagement metrics without any custom code." },
      { title: "Cross-Device Identity", content: "Mobile SDK generates an ECID (Experience Cloud ID) for each app install. When a user logs in, you call setCustomerIds() with their email, CRM ID, or loyalty ID. AEP's Identity Service then stitches mobile ECID + customer ID + web ECID into a unified profile — enabling true cross-device journeys." },
      { title: "Push Token Registration", content: "For AJO push notifications, the Mobile SDK registers the device's push token (APNs for iOS, FCM for Android) with AEP. This token is stored in the profile's push surface, enabling AJO journeys to send push notifications as an action step." },
    ],
    comparisons: [
      {
        title: "iOS (Swift) vs. Android (Kotlin)",
        description: "Same SDK capabilities, platform-specific implementation.",
        items: [
          { icon: "🍎", label: "iOS (Swift)", description: "Swift Package Manager or CocoaPods.", points: ["SPM: github.com/adobe/aepsdk-core-ios", "AppDelegate: MobileCore.registerExtensions()", "ATT Framework for IDFA consent", "APNs for push token registration"] },
          { icon: "🤖", label: "Android (Kotlin)", description: "Gradle (Maven Central).", points: ["implementation 'com.adobe.marketing.mobile:core:2.+'", "Application.onCreate(): MobileCore.registerExtensions()", "Google Play Services for GAID", "FCM for push token registration"] },
        ],
      },
    ],
    codeExamples: [
      { title: "iOS (Swift) — Product View Event", language: "swift", code: `import AEPCore
import AEPEdge

// Track product view
let xdmData: [String: Any] = [
    "eventType": "commerce.productViews",
    "commerce": [
        "productViews": ["value": 1]
    ],
    "productListItems": [
        [
            "SKU": "RS-100",
            "name": "Running Shoes Pro",
            "priceTotal": 129.99,
            "quantity": 1
        ]
    ]
]

let event = ExperienceEvent(xdm: xdmData)
Edge.sendEvent(experienceEvent: event) { handles in
    handles.forEach { handle in
        print("Response: \\(handle.type)")
    }
}` },
      { title: "Android (Kotlin) — Commerce Event", language: "kotlin", code: `import com.adobe.marketing.mobile.Edge
import com.adobe.marketing.mobile.ExperienceEvent

// Track add-to-cart
val xdmData = mapOf(
    "eventType" to "commerce.productListAdds",
    "commerce" to mapOf(
        "productListAdds" to mapOf("value" to 1)
    ),
    "productListItems" to listOf(
        mapOf(
            "SKU" to "RS-100",
            "name" to "Running Shoes Pro",
            "priceTotal" to 129.99,
            "quantity" to 1
        )
    )
)

val event = ExperienceEvent.Builder()
    .setXdmSchema(xdmData)
    .build()

Edge.sendEvent(event) { handles ->
    handles.forEach { println("Response: \${it.type}") }
}` },
      { title: "Cross-Device Identity Linking", language: "swift", code: `import AEPIdentity

// On user login — link mobile ECID to customer ID
Identity.updateIdentities(with: IdentityMap(items: [
    "Email": [IdentityItem(id: "user@example.com", authenticatedState: .authenticated, primary: true)],
    "CRMId": [IdentityItem(id: "CRM-789456", authenticatedState: .authenticated)]
]))

// AEP Identity Service now stitches:
// Mobile ECID + Email + CRMId + Web ECID → unified profile` },
    ],
    glossary: [
      { title: "Mobile SDK Terms", color: "accent", terms: [
        { term: "ECID", definition: "Experience Cloud ID — unique identifier per app install" },
        { term: "IDFA", definition: "Identifier for Advertisers — Apple's device advertising ID" },
        { term: "GAID", definition: "Google Advertising ID — Android's device advertising ID" },
        { term: "Lifecycle Events", definition: "Automatic tracking of install, launch, foreground, background, crash" },
        { term: "Push Token", definition: "Device-specific token for sending push notifications (APNs/FCM)" },
        { term: "Extension", definition: "A modular SDK plugin (Core, Edge, Analytics, Target, Messaging)" },
        { term: "Assurance", definition: "Adobe's real-time debugging tool for Mobile SDK events" },
      ]},
    ],
    tips: [
      "Always call MobileCore.registerExtensions() before any other SDK call — order matters",
      "Use Assurance for real-time debugging of SDK events flowing to Edge Network",
      "Call updateIdentities() on login and resetIdentities() on logout to maintain clean identity graphs",
      "Register push tokens early in the app lifecycle to ensure AJO can reach the device",
    ],
    whenToUse: [
      "You have iOS or Android apps that need to send behavioral events to AEP",
      "Cross-device identity stitching (web ↔ mobile) is needed for unified customer profiles",
      "AJO push notifications or in-app messages need to be delivered to the app",
      "Target personalization experiences should be served within the mobile app",
    ],
  },
};
