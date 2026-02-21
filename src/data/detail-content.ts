export interface FlowStep {
  label: string;
  description: string;
}

export interface ConceptSection {
  title: string;
  content: string;
}

export interface DetailContent {
  id: string;
  title: string;
  overview: string[];
  flow: FlowStep[];
  concepts: ConceptSection[];
  example: { title: string; language: string; code: string };
  whenToUse: string[];
}

export const detailContent: Record<string, DetailContent> = {
  "aep-rtcdp": {
    id: "aep-rtcdp",
    title: "AEP → RTCDP",
    overview: [
      "Adobe Experience Platform (AEP) serves as the foundational data layer where customer data is ingested, unified, and enriched. Real-Time Customer Data Platform (RTCDP) is the activation layer built on top of AEP that enables marketers to build audience segments and activate them to destinations.",
      "When AEP constructs a Real-Time Customer Profile by merging data from multiple sources using Identity Service, RTCDP leverages that unified profile to create segments based on attributes, behaviors, and computed metrics. These segments are then pushed to downstream destinations like ad platforms, email providers, and personalization engines.",
      "The key distinction is that AEP handles data ingestion, schema management (XDM), identity resolution, and profile construction, while RTCDP focuses on audience segmentation, governance enforcement, and destination activation. They share the same underlying infrastructure but serve different personas — data engineers work primarily in AEP, while marketers operate in RTCDP."
    ],
    flow: [
      { label: "Data Sources", description: "CRM, web, mobile, POS data flows into AEP" },
      { label: "AEP – XDM & Identity", description: "Data mapped to XDM schemas, identities resolved" },
      { label: "Real-Time Profile", description: "Unified customer profile assembled from all sources" },
      { label: "RTCDP – Segmentation", description: "Marketers build audience segments on unified profiles" },
      { label: "Destinations", description: "Segments activated to Google Ads, Facebook, email, etc." }
    ],
    concepts: [
      { title: "XDM Schemas", content: "Experience Data Model (XDM) is the standardized data framework. Every dataset in AEP must conform to an XDM schema — either ExperienceEvent (time-series behavioral data) or Individual Profile (record-based attributes). Schemas use field groups to organize related fields (e.g., Commerce Details, Demographic Details). Custom field groups extend the model for business-specific needs." },
      { title: "Identity Service", content: "Identity Service stitches together disparate identifiers (ECID, email, CRM ID, loyalty ID) into a single identity graph per person. Each identity has a namespace. The identity graph determines which profile fragments belong to the same individual, enabling the Real-Time Profile to merge them. Cross-device and cross-channel identity resolution happens here." },
      { title: "Merge Policies", content: "Merge policies define how profile fragments from different datasets are combined when identities overlap. Options include timestamp-ordered (most recent wins), dataset precedence (trusted source wins), and ID stitching strategies. The default merge policy uses timestamp ordering, but custom policies can prioritize specific datasets like CRM over web behavioral data." },
      { title: "Segment Evaluation", content: "RTCDP supports three segment evaluation methods: Streaming (real-time, evaluated as events arrive), Batch (scheduled, runs periodically), and Edge (evaluated at the edge for sub-second personalization). Streaming segments update within minutes, batch segments run on a schedule (typically daily), and edge segments evaluate on Adobe Edge Network for instant decisioning." }
    ],
    example: {
      title: "XDM ExperienceEvent Schema (Product View)",
      language: "json",
      code: `{
  "@type": "https://ns.adobe.com/xdm/context/experienceevent",
  "xdm:timestamp": "2024-01-15T10:30:00Z",
  "xdm:identityMap": {
    "ECID": [{ "id": "38400000-04cb-11ee-be56-0242ac120002" }],
    "Email": [{ "id": "jane.doe@example.com" }]
  },
  "xdm:eventType": "commerce.productViews",
  "xdm:commerce": {
    "productViews": { "value": 1 }
  },
  "xdm:productListItems": [
    {
      "xdm:SKU": "SKU-12345",
      "xdm:name": "Running Shoes Pro",
      "xdm:priceTotal": 129.99,
      "xdm:currencyCode": "USD"
    }
  ]
}`
    },
    whenToUse: [
      "You need to unify customer data from multiple sources into a single profile before segmenting audiences",
      "Marketing teams need self-service audience building on top of a governed data foundation",
      "You want to activate the same audience definition across multiple destinations simultaneously",
      "Real-time profile updates should immediately reflect in audience membership",
      "Data governance policies (DULE labels) must be enforced before data leaves the platform"
    ]
  },

  "aep-ajo": {
    id: "aep-ajo",
    title: "AEP → AJO",
    overview: [
      "Adobe Journey Optimizer (AJO) is built natively on AEP, meaning it directly accesses the Real-Time Customer Profile, segments, and events stored in the platform. When a qualifying event occurs (e.g., a purchase, cart abandonment, or app action), AEP streams that event to AJO's journey orchestration engine.",
      "AJO uses segment qualifications from RTCDP and real-time events from AEP to trigger journeys — multi-step, cross-channel workflows that send emails, push notifications, SMS, and in-app messages based on customer behavior. The tight integration means there's no data copy; AJO reads directly from the AEP profile store.",
      "This integration is what enables true real-time, event-driven marketing. A customer who abandons a cart on the website can receive a recovery email within minutes, followed by a push notification the next day if they haven't returned — all orchestrated by AJO using live AEP profile data."
    ],
    flow: [
      { label: "Customer Action", description: "User triggers an event (purchase, abandon, signup)" },
      { label: "AEP Event Hub", description: "ExperienceEvent ingested and attached to profile" },
      { label: "AJO Journey Trigger", description: "Event matches journey entry criteria" },
      { label: "Profile Lookup", description: "AJO reads full profile context from AEP" },
      { label: "Channel Execution", description: "Email, push, SMS, or in-app message delivered" }
    ],
    concepts: [
      { title: "Unitary Events", content: "Unitary events are individual customer actions (like a purchase or form submission) that trigger journey entry for a single profile at a time. These events are streamed from AEP to AJO in real-time. Each event must have an eventID that AJO uses to match against journey entry conditions. Custom unitary events can be created using AEP schemas with the 'Orchestration' field group." },
      { title: "Segment Qualification", content: "AJO journeys can also be triggered when a profile enters or exits an RTCDP segment. For example, when a customer's lifetime value crosses a threshold and they qualify for the 'VIP' segment, a journey can automatically trigger a welcome-to-VIP campaign. Segment qualification events are generated by AEP's segmentation engine and consumed by AJO." },
      { title: "Journey Canvas", content: "The journey canvas is AJO's visual workflow builder. It supports several node types: Entry (event or segment trigger), Action (send email/push/SMS), Condition (if-then branching based on profile attributes), Wait (time delay), and End. Journeys can run indefinitely or have defined end dates. Re-entrance rules control whether a profile can enter the same journey multiple times." },
      { title: "Message Personalization", content: "AJO messages are personalized using profile attributes from AEP. The Expression Editor uses a Handlebars-like syntax to insert dynamic content: {{profile.person.name.firstName}}, {{profile.loyalty.tier}}, etc. Conditional content blocks can show different sections based on segment membership or attribute values. Offers from Adobe Offer Decisioning can also be embedded in messages." }
    ],
    example: {
      title: "Journey Entry Event (Cart Abandonment)",
      language: "json",
      code: `{
  "header": {
    "datasetId": "cart-events-dataset",
    "imsOrgId": "ABC123@AdobeOrg",
    "flowId": "cart-abandon-flow"
  },
  "body": {
    "xdmEntity": {
      "xdm:eventType": "commerce.cartAbandoned",
      "xdm:timestamp": "2024-01-15T14:30:00Z",
      "xdm:identityMap": {
        "Email": [{ "id": "john@example.com", "primary": true }]
      },
      "xdm:commerce": {
        "cart": {
          "cartID": "CART-98765",
          "priceTotal": 249.99
        }
      },
      "xdm:productListItems": [
        { "xdm:name": "Wireless Headphones", "xdm:SKU": "WH-500" },
        { "xdm:name": "Phone Case", "xdm:SKU": "PC-200" }
      ]
    }
  }
}`
    },
    whenToUse: [
      "You need real-time, event-driven journeys triggered by customer actions (purchases, abandonment, sign-ups)",
      "Campaigns should be personalized using the full customer profile, not just list-based attributes",
      "Multi-step, cross-channel orchestration is required (email → wait → push → SMS fallback)",
      "Journey logic needs to branch based on real-time customer behavior during the journey",
      "You want to combine scheduled segment-based campaigns with real-time triggered journeys in one tool"
    ]
  },

  "aep-cja": {
    id: "aep-cja",
    title: "AEP → CJA",
    overview: [
      "Customer Journey Analytics (CJA) is Adobe's next-generation analytics platform that connects directly to AEP datasets. Unlike traditional Adobe Analytics which requires its own data collection, CJA reads data from AEP's data lake — meaning any data you ingest into AEP (web, mobile, CRM, POS, call center) is available for analysis in CJA.",
      "The connection between AEP and CJA is established through 'Connections' — configurations that point CJA to specific AEP datasets. A Connection can include multiple datasets (ExperienceEvent, Profile, Lookup). On top of Connections, you build 'Data Views' which define dimensions, metrics, and transformations — similar to report suites in traditional Analytics but far more flexible.",
      "This architecture is powerful because it eliminates data silos. A single CJA workspace can analyze web clickstream data alongside call center records, CRM purchases, and IoT signals — all joined at the person level using AEP's identity resolution. Cross-channel funnel analysis, attribution, and cohort analysis become possible without data exports or ETL."
    ],
    flow: [
      { label: "AEP Datasets", description: "ExperienceEvent, Profile, and Lookup datasets in data lake" },
      { label: "CJA Connection", description: "Points CJA to selected AEP datasets for analysis" },
      { label: "Identity Stitching", description: "CJA stitches events to person-level using identity fields" },
      { label: "Data View", description: "Defines dimensions, metrics, filters, and transformations" },
      { label: "Analysis Workspace", description: "Drag-and-drop analytics with freeform tables, visualizations" }
    ],
    concepts: [
      { title: "Connections", content: "A CJA Connection links to one or more AEP datasets. You select the datasets, specify the person ID field for identity stitching, and configure backfill settings (how much historical data to import). Connections can be set to streaming (new data flows in continuously) or one-time import. Each Connection has a data ingestion SLA and you can monitor record counts and latency in the Connection Manager." },
      { title: "Data Views", content: "Data Views sit on top of Connections and define how data is presented to analysts. You select which fields become dimensions (categorical) or metrics (numeric), apply formatting (currency, percentage), set attribution models per metric, create derived fields using functions (CASE WHEN, LOOKUP, etc.), and define session settings (timeout duration, new session triggers). Multiple Data Views can be created on one Connection for different teams." },
      { title: "Cross-Channel Analysis", content: "CJA's primary advantage is joining data across channels. A customer might browse on web (ECID), call support (phone number), and purchase in-store (loyalty ID). If AEP has resolved these identities, CJA can stitch the full journey: web browse → support call → store purchase. This enables true cross-channel funnels, path analysis, and attribution that were impossible in siloed analytics tools." },
      { title: "Derived Fields", content: "Derived fields in Data Views let you transform data without modifying the underlying AEP dataset. Functions include CASE WHEN (conditional logic), LOOKUP (reference tables), CONCATENATE, TRIM, URL PARSE, and MATH operations. For example, you can create a 'Marketing Channel' derived field that classifies traffic sources based on URL parameters and referrer domains — similar to processing rules in Adobe Analytics but applied at query time." }
    ],
    example: {
      title: "CJA Connection Configuration",
      language: "json",
      code: `{
  "connectionName": "Omnichannel Analytics",
  "datasets": [
    {
      "name": "Web Clickstream",
      "datasetId": "web-events-001",
      "type": "ExperienceEvent",
      "personId": "identityMap.ECID",
      "backfill": "13months"
    },
    {
      "name": "Call Center Records",
      "datasetId": "callcenter-events-002",
      "type": "ExperienceEvent",
      "personId": "identityMap.Phone",
      "backfill": "13months"
    },
    {
      "name": "CRM Profile Attributes",
      "datasetId": "crm-profile-003",
      "type": "Profile",
      "personId": "identityMap.CRMId"
    }
  ],
  "stitching": {
    "enabled": true,
    "replayWindow": "7days"
  }
}`
    },
    whenToUse: [
      "You need cross-channel journey analysis combining web, mobile, call center, POS, and CRM data",
      "Traditional Adobe Analytics report suites are too siloed for your analytics needs",
      "You want to analyze AEP datasets (including non-Adobe data) without exporting to a separate analytics tool",
      "Complex attribution models and custom session definitions are required",
      "Data Views need to be customized for different teams without duplicating underlying data"
    ]
  },

  "rtcdp-destinations": {
    id: "rtcdp-destinations",
    title: "RTCDP → Destinations",
    overview: [
      "RTCDP's Destinations framework is the activation engine that pushes audience segments to external platforms. Once marketers build segments on unified profiles, Destinations handles the secure delivery of audience data to advertising platforms (Google Ads, Facebook, The Trade Desk), marketing automation tools, cloud storage, and custom APIs.",
      "Destinations are categorized into several types: Advertising (send audiences to ad platforms for targeting), Social (Facebook, TikTok audiences), Email Marketing (Mailchimp, Salesforce Marketing Cloud), Cloud Storage (S3, Azure Blob, SFTP for batch file export), and Streaming (real-time API-based delivery). Each destination type has specific data export behaviors — some support real-time streaming, others batch on a schedule.",
      "Data governance is enforced at the destination level. DULE (Data Usage Labeling and Enforcement) labels applied to XDM fields in AEP are checked against destination marketing actions. For example, a field labeled 'C3' (cannot be combined with directly identifiable information) will be blocked from export to destinations that require PII matching. This ensures compliance without manual intervention."
    ],
    flow: [
      { label: "RTCDP Segments", description: "Audience segments built on unified profiles" },
      { label: "Governance Check", description: "DULE labels validated against destination policies" },
      { label: "Destination Config", description: "Authentication, mapping, and scheduling configured" },
      { label: "Data Export", description: "Audience members pushed via API or file export" },
      { label: "External Platform", description: "Google Ads, Facebook, S3, email tools receive audiences" }
    ],
    concepts: [
      { title: "Destination Types", content: "Advertising destinations (Google, Facebook, TTD) receive hashed identifiers for audience matching. Cloud storage destinations (S3, Azure, SFTP) export CSV/Parquet files on a schedule. Streaming destinations push profile updates via HTTP API in real-time. Profile export destinations send full profile snapshots. Each type has different latency characteristics — streaming delivers in minutes, batch exports typically run every 3-6 hours." },
      { title: "Identity Mapping", content: "Each destination requires specific identifiers. Google Ads needs GAID/IDFA or hashed email. Facebook requires hashed email or phone. The identity mapping step configures which AEP identity namespaces map to destination-required identifiers. RTCDP can hash identifiers (SHA-256) before export if the destination requires it. If a profile lacks the required identity, it's excluded from that destination's export." },
      { title: "Data Governance (DULE)", content: "Data Usage Labeling and Enforcement labels are applied at the field level in XDM schemas. Labels include C1-C12 for contract restrictions, S1-S2 for sensitivity, and I1-I2 for identity. Marketing actions on destinations (e.g., 'Ad targeting', 'Cross-site targeting') trigger policy evaluation. If a segment uses a field whose label conflicts with the destination's marketing action, export is blocked with a policy violation error." },
      { title: "Scheduling & Monitoring", content: "Batch destinations run on configurable schedules (minimum 3 hours apart). You can monitor dataflow runs in the Destinations workspace — seeing records exported, errors, and latency. Failed exports generate alerts. Incremental exports only send profiles that changed since the last run, while full exports resend the entire segment. Rate limiting and retry logic handle API throttling from destination platforms." }
    ],
    example: {
      title: "Destination Activation Configuration",
      language: "json",
      code: `{
  "destination": "Google Ads Customer Match",
  "segments": [
    {
      "segmentId": "seg-cart-abandoners-30d",
      "segmentName": "Cart Abandoners – Last 30 Days",
      "schedule": "every6hours"
    }
  ],
  "identityMapping": {
    "source": "Email (SHA-256)",
    "target": "google_hashed_email"
  },
  "governance": {
    "enforcedLabels": ["C4", "C5"],
    "marketingAction": "adTargeting",
    "status": "PASSED"
  }
}`
    },
    whenToUse: [
      "You need to activate audience segments to advertising platforms for paid media targeting",
      "Audiences should be exported to cloud storage (S3, Azure) for downstream processing",
      "Real-time segment membership changes must be pushed to personalization engines immediately",
      "Data governance policies must be automatically enforced before data leaves the platform",
      "The same segment definition needs to be activated across multiple channels simultaneously"
    ]
  },

  "cja-rtcdp": {
    id: "cja-rtcdp",
    title: "CJA → RTCDP",
    overview: [
      "CJA's Audience Publishing feature allows analysts to create audiences in CJA Analysis Workspace and publish them back to RTCDP for activation. This closes the analytics-to-action loop — insights discovered through analysis become actionable segments without requiring data engineering work.",
      "When an analyst identifies a high-value behavioral pattern in CJA (e.g., users who viewed 3+ product categories in one session and have LTV > $500), they can create a filter and publish it as an audience to RTCDP. The audience appears in RTCDP's segment inventory alongside segments built natively in the Segment Builder.",
      "Published audiences are refreshed on a schedule (typically every 4 hours) based on the CJA filter definition. They can then be activated through any RTCDP destination — advertising platforms, email tools, personalization engines. This enables a powerful workflow: analyze in CJA → discover patterns → publish audience → activate in RTCDP → measure results in CJA."
    ],
    flow: [
      { label: "CJA Analysis", description: "Analyst discovers behavioral patterns in Workspace" },
      { label: "Create Filter", description: "Define audience criteria using CJA dimensions/metrics" },
      { label: "Publish Audience", description: "Audience published to AEP/RTCDP profile store" },
      { label: "RTCDP Segment", description: "Appears as a segment available for destination activation" },
      { label: "Measure Impact", description: "Activation results flow back to CJA for reporting" }
    ],
    concepts: [
      { title: "Audience Publishing", content: "From CJA Workspace, select profiles using filters, then use 'Publish Audience' to push them to RTCDP. The audience is created as a new segment in RTCDP with metadata indicating its CJA origin. Refresh frequency is configurable (1, 4, 8, or 24 hours). Audiences can have an expiration date after which they stop refreshing. Maximum audience size depends on your AEP contract entitlements." },
      { title: "Filter-Based Audiences", content: "CJA audiences are defined using the same filter logic as Analysis Workspace. This means you can use cross-channel dimensions, derived fields, and complex logic (sequential filters, container nesting) that aren't available in RTCDP's native Segment Builder. For example, 'users who called support within 2 days of a web purchase AND have a derived marketing channel of Paid Search' — this level of complexity is easy in CJA but difficult to replicate in RTCDP alone." },
      { title: "Refresh & Latency", content: "Published audiences are not real-time — they refresh on a schedule. The fastest refresh is every hour. After each refresh, CJA re-evaluates the filter against the latest data and updates the audience membership in RTCDP. New members are added, expired members removed. This makes CJA audiences best suited for batch-oriented use cases (email campaigns, weekly ad audience refreshes) rather than real-time personalization." }
    ],
    example: {
      title: "CJA Audience Publishing Configuration",
      language: "json",
      code: `{
  "audienceName": "High-Intent Multi-Category Browsers",
  "description": "Users who viewed 3+ product categories in one session with LTV > $500",
  "filter": {
    "type": "sequential",
    "containers": [
      {
        "context": "session",
        "criteria": "productCategoriesViewed >= 3"
      },
      {
        "context": "person",
        "criteria": "lifetimeValue > 500"
      }
    ]
  },
  "publishTo": "RTCDP",
  "refreshFrequency": "4hours",
  "expiration": "2024-06-30"
}`
    },
    whenToUse: [
      "Analysts have discovered high-value behavioral patterns in CJA that should be activated as segments",
      "Complex audience definitions require cross-channel data or derived fields not available in RTCDP's Segment Builder",
      "The analytics-to-activation workflow needs to be shortened — no data engineering handoff required",
      "Audiences based on historical behavioral patterns (not real-time) are needed for batch activation",
      "You want to measure the impact of audience activation directly in CJA (closed-loop reporting)"
    ]
  },

  "ajo-cja": {
    id: "ajo-cja",
    title: "AJO → CJA",
    overview: [
      "AJO automatically writes journey and message interaction data back to AEP as ExperienceEvent datasets. These datasets — containing sends, deliveries, opens, clicks, bounces, and custom journey events — are then available for analysis in CJA through standard Connections.",
      "By connecting AJO datasets to CJA, marketers and analysts can analyze journey performance alongside all other customer data. Instead of relying on AJO's built-in reporting (which is channel-specific), CJA provides cross-channel context: How did the email journey affect website visits? Did push notification recipients have higher in-store conversion rates?",
      "This integration enables attribution analysis across journeys and non-journey touchpoints, funnel analysis from message receipt to downstream conversion, and cohort analysis comparing journey participants vs. non-participants."
    ],
    flow: [
      { label: "AJO Journey", description: "Messages sent via email, push, SMS, in-app" },
      { label: "Interaction Events", description: "Opens, clicks, bounces, unsubscribes recorded" },
      { label: "AEP Datasets", description: "Events written as ExperienceEvent datasets in AEP" },
      { label: "CJA Connection", description: "AJO datasets included in CJA Connection" },
      { label: "Cross-Channel Analysis", description: "Journey performance analyzed with full customer context" }
    ],
    concepts: [
      { title: "AJO Datasets", content: "AJO generates several system datasets: Message Feedback Event (delivery status), Message Interaction Event (opens, clicks), Journey Step Event (journey progression), and Push Tracking Event. Each contains standard XDM fields plus AJO-specific fields like journeyVersionID, messageID, and actionExecutionStatus. These datasets are created automatically when AJO is provisioned — you just need to add them to your CJA Connection." },
      { title: "Journey Attribution", content: "In CJA, you can analyze which journeys contribute to conversions using attribution models. For example, assign credit across all touchpoints (email open → web visit → push click → purchase) using Linear, Time Decay, or Algorithmic attribution. This goes beyond AJO's native last-touch reporting and shows the true impact of journey messages within the broader customer journey." },
      { title: "Cohort Comparison", content: "CJA enables comparing journey participants against non-participants. Create a cohort of customers who received the 'Welcome Series' journey and compare their 90-day retention, LTV, and engagement metrics against a control group who didn't enter the journey. This type of holdout analysis is essential for proving journey ROI and is best done in CJA's Workspace with its flexible cohort table visualization." }
    ],
    example: {
      title: "AJO Message Interaction Event in CJA",
      language: "json",
      code: `{
  "xdm:eventType": "message.interaction",
  "xdm:timestamp": "2024-01-15T16:45:00Z",
  "ajo:messageId": "msg-welcome-series-01",
  "ajo:journeyVersionId": "jrn-v2-welcome-2024",
  "ajo:channel": "email",
  "ajo:interactionType": "click",
  "ajo:linkURL": "https://example.com/offers?utm_journey=welcome",
  "xdm:identityMap": {
    "Email": [{ "id": "jane@example.com" }]
  }
}`
    },
    whenToUse: [
      "You need to analyze journey performance beyond AJO's built-in reports (cross-channel attribution, cohort analysis)",
      "Journey impact must be measured against downstream conversions (purchases, renewals, store visits)",
      "Holdout / control group analysis is needed to prove journey ROI",
      "Journey message data needs to be combined with web, mobile, and offline data for holistic reporting",
      "Custom journey metrics and KPIs need to be created using CJA's derived fields and calculated metrics"
    ]
  },

  "launch-aep": {
    id: "launch-aep",
    title: "Launch/Tags → AEP",
    overview: [
      "Adobe Launch (now called Tags in Adobe Experience Platform Data Collection) is the tag management system that deploys the Adobe Web SDK (alloy.js) on websites. The Web SDK is the single client-side library that sends data to Adobe Edge Network, which then routes events to AEP, Analytics, Target, and other Adobe solutions.",
      "A Launch property contains rules that define when and what data to collect. Rules consist of Events (click, page load, custom), Conditions (URL contains, data element value), and Actions (send event via Web SDK). The Web SDK action maps website data to XDM format and sends it to a configured Datastream, which routes the data to AEP and other services.",
      "This integration replaces the legacy approach of using multiple tags (AppMeasurement for Analytics, at.js for Target, separate AEP SDK). With Web SDK + Launch, a single tag handles all Adobe solutions, reducing page weight and simplifying data collection."
    ],
    flow: [
      { label: "Website / App", description: "User interacts with web pages or application" },
      { label: "Launch Rules", description: "Events trigger rules that collect data" },
      { label: "Web SDK (alloy.js)", description: "Data mapped to XDM and sent to Edge Network" },
      { label: "Datastream", description: "Routes data to configured Adobe services" },
      { label: "AEP Ingestion", description: "ExperienceEvents land in AEP datasets" }
    ],
    concepts: [
      { title: "Launch Properties", content: "A property is a container for your tag configuration. Web properties target websites, mobile properties target iOS/Android apps. Each property has its own library of extensions, data elements, and rules. Properties are published through environments (Development, Staging, Production) with approval workflows. The embed code from a property is placed on every page of your website." },
      { title: "Data Elements", content: "Data elements are variables that reference values on the page — DOM attributes, JavaScript variables, query parameters, cookies, or custom code. They abstract data access so rules reference 'Cart Total' instead of 'document.querySelector(\".cart-total\").innerText'. Data elements can be backed by different storage types: JavaScript Variable, DOM Attribute, Query Parameter, Local Storage, or Custom Code." },
      { title: "Web SDK Extension", content: "The Adobe Experience Platform Web SDK extension in Launch configures the alloy.js library. Key settings include: Datastream ID (which datastream to send data to), Edge domain, identity settings (first-party vs third-party cookies), and default consent state. The extension provides the 'Send Event' action type that accepts an XDM object and optional data object." },
      { title: "Datastreams", content: "Datastreams (configured in the Data Collection UI, not in Launch itself) define where Edge Network routes data. A single Datastream can send data to AEP (dataset mapping), Analytics (report suite), Target (property token), and Audience Manager simultaneously. Datastream configurations include environment overrides (dev/stage/prod can route to different AEP sandboxes), event filtering, and data prep transformations." }
    ],
    example: {
      title: "Launch Rule – Send Page View Event",
      language: "json",
      code: `{
  "ruleName": "Page View – All Pages",
  "events": [
    {
      "type": "core.libraryLoaded",
      "trigger": "Library Loaded (Page Top)"
    }
  ],
  "conditions": [],
  "actions": [
    {
      "extension": "Adobe Experience Platform Web SDK",
      "type": "sendEvent",
      "settings": {
        "xdm": {
          "eventType": "web.webpagedetails.pageViews",
          "web": {
            "webPageDetails": {
              "name": "%Page Name%",
              "URL": "%Page URL%",
              "siteSection": "%Site Section%"
            }
          }
        },
        "datasetId": "web-events-dataset"
      }
    }
  ]
}`
    },
    whenToUse: [
      "You're implementing Adobe Web SDK on a website for the first time and need tag management",
      "Multiple Adobe solutions (AEP, Analytics, Target) need to receive data from a single client-side tag",
      "Non-technical users need a UI to manage data collection rules without code deployments",
      "You need environment-based publishing (dev/staging/production) with approval workflows",
      "Website data must be collected in XDM format for AEP ingestion"
    ]
  },

  "launch-target": {
    id: "launch-target",
    title: "Launch → Target",
    overview: [
      "Adobe Target is deployed through Launch via the Web SDK extension, enabling A/B testing, multivariate testing, and AI-powered personalization on websites. When Launch loads the Web SDK, it makes a request to Adobe Edge Network which includes Target's decisioning response — returning personalized content without a separate Target library.",
      "The integration supports two decisioning modes: Server-side (Edge) where Target decisions are made on Adobe Edge Network and returned with the page response, and On-device where a rules artifact is cached in the browser for zero-latency decisions. Launch rules can trigger Target requests on page load or based on specific user actions.",
      "Visual Experience Composer (VEC) modifications and form-based activities are both supported through the Web SDK. The VEC allows non-technical users to visually create variations by pointing and clicking on page elements, while form-based activities use named locations (mboxes) for developer-driven personalization."
    ],
    flow: [
      { label: "Page Load", description: "Launch loads Web SDK with Target enabled in Datastream" },
      { label: "Edge Request", description: "Web SDK sends request to Adobe Edge Network" },
      { label: "Target Decisioning", description: "Target evaluates activities and selects experience" },
      { label: "Response Handling", description: "Personalized content returned and rendered on page" },
      { label: "Reporting", description: "Impressions and conversions tracked back to Target/CJA" }
    ],
    concepts: [
      { title: "Decisioning Methods", content: "Server-side (Edge) decisioning makes a network call to Adobe Edge Network for every decision — supports full catalog of activities including Automated Personalization and Auto-Target with ML models. On-device decisioning downloads a JSON rules artifact and evaluates locally — sub-millisecond decisions but limited to simple A/B and Experience Targeting activities. Hybrid mode combines both, using on-device when possible and falling back to edge." },
      { title: "VEC vs Form-Based", content: "Visual Experience Composer (VEC) lets marketers visually modify page elements — change text, swap images, rearrange layouts — without code. It works by overlaying the website in an iframe. Form-based activities use named decision scopes (formerly mboxes) and return JSON offers that developers render programmatically. Form-based is more flexible for SPAs, dynamic content, and non-HTML channels (email subject lines, app screens)." },
      { title: "A4T (Analytics for Target)", content: "Analytics for Target (A4T) uses Analytics (or CJA) as the reporting source for Target activities instead of Target's built-in reporting. This provides richer segmentation, custom calculated metrics, and longer data retention. With Web SDK, A4T data flows through Edge Network — the same event carries both the Target decision and the Analytics hit, ensuring perfect data alignment. No client-side stitching is needed." },
      { title: "Activity Types", content: "A/B Test: split traffic between 2+ experiences, measure conversion. Multivariate Test (MVT): test combinations of multiple elements simultaneously. Experience Targeting (XT): serve specific experience to specific audience. Automated Personalization (AP): ML selects best content combination per visitor. Auto-Target: ML selects best experience from a set. Recommendations: product/content recommendations based on algorithms." }
    ],
    example: {
      title: "Web SDK – Requesting Target Decisions",
      language: "javascript",
      code: `// In Launch: Custom Code action to request Target personalization
alloy("sendEvent", {
  renderDecisions: true, // Auto-render VEC modifications
  decisionScopes: ["hero-banner", "product-recs"], // Form-based scopes
  xdm: {
    eventType: "decisioning.propositionDisplay",
    web: {
      webPageDetails: {
        name: "Home Page",
        URL: window.location.href
      }
    }
  }
}).then(function(result) {
  // Handle form-based decisions
  const propositions = result.propositions || [];
  propositions.forEach(p => {
    if (p.scope === "hero-banner") {
      document.getElementById("hero").innerHTML = p.items[0].data.content;
    }
  });
});`
    },
    whenToUse: [
      "You need to run A/B or multivariate tests on website content with statistical rigor",
      "AI-powered personalization (Auto-Target, Automated Personalization) should optimize content per visitor",
      "Target is already in use and you're migrating from at.js to Web SDK via Launch",
      "Analytics for Target (A4T) reporting is needed for richer test analysis",
      "On-device decisioning is required for sub-millisecond personalization without network latency"
    ]
  },

  "launch-analytics": {
    id: "launch-analytics",
    title: "Launch → Analytics",
    overview: [
      "Adobe Analytics receives data through Launch via the Web SDK extension. Instead of the legacy AppMeasurement.js library, the Web SDK sends XDM-formatted events to Adobe Edge Network, which maps them to Analytics variables (eVars, props, events) using Datastream-level mapping rules.",
      "The migration from AppMeasurement to Web SDK is a significant shift in data collection architecture. With AppMeasurement, you directly set Analytics-specific variables (s.eVar1, s.prop5, s.events). With Web SDK, you set XDM fields (web.webPageDetails.name, commerce.purchases.value) and configure the Datastream to map XDM fields to Analytics variables. This abstraction means the same data collection feeds Analytics, AEP, and Target simultaneously.",
      "Launch rules for Analytics typically include page view tracking (Library Loaded event → Send Event action), click tracking (Click events with CSS selectors → Send Event with link tracking type), and custom event tracking (rule-based → Send Event with commerce or custom XDM fields)."
    ],
    flow: [
      { label: "User Action", description: "Page view, click, form submit, or custom event" },
      { label: "Launch Rule", description: "Event + conditions trigger a Send Event action" },
      { label: "Web SDK", description: "XDM data sent to Edge Network" },
      { label: "Datastream Mapping", description: "XDM fields mapped to eVars, props, events" },
      { label: "Analytics Processing", description: "Hit processed into report suite" }
    ],
    concepts: [
      { title: "XDM to Analytics Mapping", content: "The Datastream's Analytics configuration maps XDM fields to Analytics variables. Some mappings are automatic: web.webPageDetails.name → pageName, web.webReferrer.URL → referrer. Others require manual mapping in the Datastream's 'Adobe Analytics' section. Custom eVars and props map from XDM custom fields or the 'data.__adobe.analytics' override object. Events map from commerce actions (purchases, productViews) or custom XDM fields." },
      { title: "Processing Rules vs. Datastream Mapping", content: "Datastream mapping replaces many traditional Processing Rules. Instead of processing rules that fire after data hits the report suite, Datastream mapping transforms data at the Edge before it reaches Analytics. This is more reliable and doesn't count against the processing rule limit. However, complex transformations may still require VISTA rules or server-side processing." },
      { title: "Link Tracking", content: "Web SDK supports three link tracking types: download links, exit links, and custom links. In Launch, you configure link tracking via the 'Send Event' action by setting the xdm.web.webInteraction object with name, type (download/exit/other), and URL. Unlike AppMeasurement's automatic link tracking, Web SDK requires explicit configuration but provides more control." }
    ],
    example: {
      title: "XDM to Analytics Variable Mapping",
      language: "json",
      code: `{
  "xdmField": "web.webPageDetails.name",
  "analyticsVariable": "pageName",
  "mappingType": "automatic"
},
{
  "xdmField": "commerce.purchases.value",
  "analyticsVariable": "event1 (Purchase)",
  "mappingType": "automatic"
},
{
  "xdmField": "marketing.campaignName",
  "analyticsVariable": "eVar10",
  "mappingType": "manual (Datastream config)"
},
{
  "xdmField": "productListItems[].name",
  "analyticsVariable": "products string",
  "mappingType": "automatic"
}`
    },
    whenToUse: [
      "You're migrating from AppMeasurement.js to Web SDK and need Analytics data to keep flowing",
      "A single data collection tag should feed both Analytics and AEP simultaneously",
      "Analytics tracking must be implemented alongside Target and other Adobe solutions without separate libraries",
      "XDM-based data collection is the organizational standard and Analytics must consume XDM events",
      "Datastream-level mapping is preferred over client-side Analytics variable setting"
    ]
  },

  "target-aep-cja": {
    id: "target-aep-cja",
    title: "Target → AEP / CJA",
    overview: [
      "Adobe Target generates decision data — which experience each visitor saw, which activity they entered, and which conversion events occurred. This data flows back to AEP as ExperienceEvent datasets, making it available for analysis in CJA and for enriching the customer profile in AEP.",
      "When using Web SDK with Target enabled in the Datastream, Target decisioning events (propositionDisplay, propositionInteract) are automatically recorded as AEP events. These contain the activityId, experienceId, and offer details, enabling downstream analysis of personalization effectiveness.",
      "In CJA, analysts can connect these Target datasets and analyze test results alongside other channel data. This is the Web SDK implementation of A4T (Analytics for Target) — where CJA becomes the reporting engine for Target activities, providing richer segmentation and attribution than Target's built-in reports."
    ],
    flow: [
      { label: "Target Decision", description: "Visitor receives a personalized experience" },
      { label: "Web SDK Event", description: "propositionDisplay event sent to Edge Network" },
      { label: "AEP Dataset", description: "Decisioning data stored as ExperienceEvents" },
      { label: "Profile Enrichment", description: "Target segments and decisions attached to profile" },
      { label: "CJA Analysis", description: "A/B test results analyzed with cross-channel context" }
    ],
    concepts: [
      { title: "Decisioning Events", content: "Web SDK automatically generates two event types: propositionDisplay (visitor saw a Target experience) and propositionInteract (visitor interacted with it, e.g., clicked a personalized banner). These events contain activityId, experienceId, offerIds, and scope — enabling granular analysis of which activities and experiences drive outcomes." },
      { title: "A4T with CJA", content: "Using CJA as the reporting backend for Target activities provides: custom attribution models across Target and non-Target touchpoints, audience breakdown using any CJA dimension, derived metrics specific to your business, and analysis across longer date ranges. Set up by including the Target decisioning dataset in your CJA Connection and creating a Data View with Target-specific dimensions." },
      { title: "Profile Enrichment", content: "Target activity membership and experience assignments can enrich the AEP profile. This allows RTCDP segments to reference Target participation — e.g., create a segment of 'visitors who saw the premium experience in the homepage test AND converted.' This closes the loop between personalization and activation." }
    ],
    example: {
      title: "Target Proposition Display Event",
      language: "json",
      code: `{
  "xdm:eventType": "decisioning.propositionDisplay",
  "xdm:timestamp": "2024-01-15T12:00:00Z",
  "xdm:identityMap": {
    "ECID": [{ "id": "12345-abcde-67890" }]
  },
  "decisioning:propositions": [
    {
      "id": "AT:activity-12345:experience-2",
      "scope": "hero-banner",
      "items": [
        {
          "id": "offer-67890",
          "schema": "https://ns.adobe.com/personalization/html-content-item",
          "data": { "content": "<div>Premium Hero Banner</div>" }
        }
      ]
    }
  ]
}`
    },
    whenToUse: [
      "Target A/B test results need to be analyzed alongside web, mobile, and offline data in CJA",
      "Personalization decisions should enrich the customer profile for downstream segmentation in RTCDP",
      "Custom attribution models are needed to understand Target's contribution to multi-touch conversions",
      "Target activity data must be combined with AJO journey data for holistic experience analysis",
      "You need longer retention and more flexible reporting than Target's native 90-day reports provide"
    ]
  },

  "genstudio-ajo": {
    id: "genstudio-ajo",
    title: "GenStudio → AJO",
    overview: [
      "Adobe GenStudio for Performance Marketing uses generative AI to create content variations — email subject lines, body copy, images, and ad creatives — that align with brand guidelines. These AI-generated assets can be exported and used directly in AJO campaigns and journeys.",
      "The workflow starts with marketers defining brand guidelines, tone of voice, and campaign briefs in GenStudio. The AI generates multiple content variants, which are reviewed, edited, and approved by the team. Approved assets are then imported into AJO as email templates, content fragments, or offer content.",
      "This integration accelerates content creation for personalized campaigns. Instead of manually creating dozens of email variants for different audiences, GenStudio generates them at scale. AJO then handles the audience targeting, delivery timing, and journey orchestration while using GenStudio's AI-crafted content."
    ],
    flow: [
      { label: "Brand Guidelines", description: "Tone, style, and brand rules defined in GenStudio" },
      { label: "AI Content Generation", description: "Multiple content variants created from briefs" },
      { label: "Review & Approve", description: "Team reviews, edits, and approves variants" },
      { label: "Export to AJO", description: "Approved assets imported as templates/fragments" },
      { label: "Campaign Delivery", description: "AJO orchestrates delivery with AI-crafted content" }
    ],
    concepts: [
      { title: "Content Variants", content: "GenStudio generates multiple versions of each asset — different subject lines, different hero images, different CTA copy — all adhering to brand guidelines. These variants can be tested against each other in AJO using content experiments (A/B testing of message content). This combines AI-generated content with AJO's optimization engine for maximum performance." },
      { title: "Brand Guidelines", content: "GenStudio's brand kit defines the guardrails for AI generation: approved logos, color palettes, typography, tone of voice descriptors, prohibited terms, and example copy. This ensures all generated content stays on-brand even at scale. Guidelines can be updated centrally and all future generation adheres to the latest standards." },
      { title: "Content Fragments", content: "AJO supports reusable content fragments — modular blocks of content (header, footer, product showcase, CTA section) that can be assembled into full messages. GenStudio can produce these fragments, which are then used across multiple AJO campaigns and journeys. Changes to a fragment automatically update all messages that reference it." }
    ],
    example: {
      title: "GenStudio Content Brief",
      language: "json",
      code: `{
  "campaignBrief": "Summer Sale Email – Loyalty Members",
  "targetAudience": "Gold and Platinum loyalty tier members",
  "tone": "Warm, exclusive, rewarding",
  "keyMessages": [
    "Early access to summer collection",
    "Extra 20% off for loyalty members",
    "Limited-time offer"
  ],
  "generateVariants": {
    "subjectLines": 5,
    "heroImages": 3,
    "bodyCopy": 3,
    "ctaButtons": 4
  },
  "brandKit": "brand-kit-2024-v2",
  "exportTo": "AJO"
}`
    },
    whenToUse: [
      "High-volume campaigns require many content variants without a large creative team",
      "AI-generated content needs to be tested systematically using AJO's content experiments",
      "Brand consistency must be maintained across dozens of personalized email/push/SMS variants",
      "Creative production is a bottleneck for campaign velocity",
      "Content fragments need to be centrally managed and reused across multiple AJO campaigns"
    ]
  },

  "eds-aep": {
    id: "eds-aep",
    title: "EDS → AEP",
    overview: [
      "Adobe Edge Delivery Services (EDS) is a modern content delivery platform that serves websites built from document-based authoring (Google Docs, Microsoft Word, SharePoint). EDS sites can collect user interaction data and send it to AEP using the Adobe Web SDK, enabling the same analytics and personalization capabilities as traditional websites.",
      "EDS pages automatically include lightweight instrumentation for Core Web Vitals and Real User Monitoring (RUM). For deeper integration with AEP, the Web SDK (alloy.js) is added to the EDS site, typically through a block or script include. This sends ExperienceEvents to AEP via Edge Network, capturing page views, clicks, form interactions, and custom events.",
      "The key benefit is that even document-authored sites — which don't go through traditional CMS development cycles — can feed data into AEP for profile building, segmentation, and personalization. Content authors work in Google Docs; data engineers configure the AEP pipeline; marketers activate audiences — all on the same EDS-published website."
    ],
    flow: [
      { label: "EDS Website", description: "Document-authored pages served by Edge Delivery" },
      { label: "Web SDK Block", description: "alloy.js loaded as an EDS block on pages" },
      { label: "User Interactions", description: "Page views, clicks, and events captured" },
      { label: "Edge Network", description: "XDM events routed through Datastream" },
      { label: "AEP Ingestion", description: "Events stored in AEP datasets for profile & analytics" }
    ],
    concepts: [
      { title: "Document-Based Authoring", content: "EDS sites are authored in Google Docs or Microsoft Word/SharePoint. Editors write content in documents, use tables for structured components (blocks), and publish instantly. No CMS, no code deployment for content changes. The EDS pipeline converts documents to optimized HTML/CSS/JS with built-in performance (100 Lighthouse scores). Adding Web SDK tracking requires a one-time developer setup of a 'tracking' block." },
      { title: "EDS Blocks", content: "Blocks are the component model of EDS. A table in a Google Doc becomes a rendered component on the page. Custom blocks can be created for any functionality — carousels, forms, CTAs, and importantly, analytics tracking. A 'web-sdk' or 'tracking' block initializes the Web SDK and configures event tracking. Once the block is created, content authors automatically get tracking on all pages that use it." },
      { title: "RUM Integration", content: "EDS includes built-in Real User Monitoring (RUM) that collects Core Web Vitals (LCP, CLS, INP) and basic engagement metrics (page views, scroll depth) without any additional setup. RUM data is available in an EDS dashboard. For AEP integration, RUM data can be supplemented with richer Web SDK events that include identity, commerce, and custom dimensions." }
    ],
    example: {
      title: "EDS Web SDK Block Initialization",
      language: "javascript",
      code: `// /blocks/web-sdk/web-sdk.js — EDS block for Web SDK
export default async function decorate(block) {
  // Load Web SDK
  const script = document.createElement('script');
  script.src = 'https://cdn1.adoberesources.net/alloy/2.19.0/alloy.min.js';
  document.head.appendChild(script);

  script.onload = () => {
    alloy('configure', {
      datastreamId: 'your-datastream-id',
      orgId: 'your-org@AdobeOrg',
    });

    // Send page view
    alloy('sendEvent', {
      xdm: {
        eventType: 'web.webpagedetails.pageViews',
        web: {
          webPageDetails: {
            name: document.title,
            URL: window.location.href,
          },
        },
      },
    });
  };
}`
    },
    whenToUse: [
      "Your website is built with Edge Delivery Services and needs to feed data into AEP",
      "Content authors using Google Docs/SharePoint need their pages tracked without developer involvement per page",
      "EDS sites need the same personalization and analytics capabilities as traditional CMS-built sites",
      "You want to unify EDS site data with other channels (mobile, call center) in AEP for cross-channel profiles",
      "Core Web Vitals monitoring (via RUM) needs to be supplemented with business-specific event tracking"
    ]
  },

  "source-connectors-aep": {
    id: "source-connectors-aep",
    title: "Source Connectors → AEP",
    overview: [
      "AEP Source Connectors provide pre-built integrations to ingest data from external systems into AEP datasets. They support CRM systems (Salesforce, Microsoft Dynamics), cloud databases (Snowflake, BigQuery, Redshift), marketing platforms (Marketo, Mailchimp), cloud storage (S3, Azure Blob, Google Cloud Storage), and streaming sources (HTTP API, Kafka).",
      "Source Connectors handle authentication, scheduling, data transformation, and error handling. For batch sources like Salesforce or S3, you configure a connection, map source fields to XDM, and set an ingestion schedule (hourly, daily, weekly). The connector pulls data on schedule, transforms it to XDM, and writes it to the specified AEP dataset.",
      "This is the primary mechanism for bringing non-Adobe data into AEP. Without source connectors, organizations would need to build custom ETL pipelines. Connectors provide a no-code/low-code alternative with built-in monitoring, data validation, and error recovery."
    ],
    flow: [
      { label: "External Source", description: "CRM, database, cloud storage, or marketing tool" },
      { label: "Source Connector", description: "Pre-built integration authenticates and pulls data" },
      { label: "Field Mapping", description: "Source fields mapped to XDM schema fields" },
      { label: "Data Validation", description: "Records validated against schema, errors flagged" },
      { label: "AEP Dataset", description: "Valid records ingested into target dataset" }
    ],
    concepts: [
      { title: "Connector Categories", content: "Adobe applications (Analytics, Audience Manager), Cloud storage (S3, Azure, GCS, SFTP), CRM (Salesforce, Dynamics, HubSpot), Databases (Snowflake, BigQuery, Redshift, PostgreSQL), eCommerce (Shopify), Marketing Automation (Marketo, Mailchimp), Payments (Stripe), and Streaming (HTTP API, Kafka). Each connector type has specific authentication requirements and data format expectations." },
      { title: "Data Mapping", content: "The mapping step converts source data structures to XDM. The UI provides a visual mapper where you drag source fields to target XDM fields. Calculated fields allow transformations (concatenation, date formatting, type casting). Mapping sets can be saved and reused. For complex transformations, Data Prep functions provide dozens of string, date, math, and hierarchy operations." },
      { title: "Scheduling & Monitoring", content: "Batch connectors run on configurable schedules. Each run is a 'dataflow run' with status (success, partial success, failed), record counts (ingested, skipped, errored), and detailed error logs. Alerts can be configured for failures. Backfill options allow ingesting historical data on first connection. Incremental ingestion only pulls records modified since the last run using delta columns." },
      { title: "Streaming Ingestion", content: "The HTTP API source connector enables real-time streaming ingestion. Your server-side applications POST JSON payloads (conforming to XDM) to an AEP streaming endpoint. Each payload is validated, resolved against identity, and merged into the Real-Time Profile within seconds. Rate limits apply (per-minute and per-day quotas based on your AEP license)." }
    ],
    example: {
      title: "Salesforce Source Connector Configuration",
      language: "json",
      code: `{
  "sourceType": "Salesforce CRM",
  "connection": {
    "environmentUrl": "https://myorg.my.salesforce.com",
    "authType": "OAuth 2.0",
    "clientId": "connected-app-client-id"
  },
  "dataflow": {
    "sourceObject": "Contact",
    "targetDataset": "crm-contacts-dataset",
    "schedule": "every6hours",
    "incrementalColumn": "SystemModstamp"
  },
  "mapping": [
    { "source": "Email", "target": "personalEmail.address" },
    { "source": "FirstName", "target": "person.name.firstName" },
    { "source": "LastName", "target": "person.name.lastName" },
    { "source": "Loyalty_Tier__c", "target": "_custom.loyaltyTier" },
    { "source": "LifetimeValue__c", "target": "_custom.lifetimeValue" }
  ]
}`
    },
    whenToUse: [
      "CRM data (Salesforce, Dynamics) needs to be unified with digital behavioral data in AEP",
      "Cloud data warehouse exports (Snowflake, BigQuery) should feed AEP profiles on a schedule",
      "File-based batch data (CSV on S3 or SFTP) needs to be ingested without custom ETL development",
      "Marketing platform data (Marketo leads, Mailchimp engagement) should enrich AEP profiles",
      "A no-code/low-code ingestion solution is preferred over building custom API integrations"
    ]
  },

  "streaming-api-aep": {
    id: "streaming-api-aep",
    title: "Streaming API → AEP",
    overview: [
      "AEP's Streaming Ingestion API (also called the HTTP API Source) allows server-side applications to send data to AEP in real-time via HTTP POST requests. Unlike client-side Web SDK collection, the Streaming API is used for server-to-server data flows — event-driven backends, IoT devices, POS systems, call center platforms, and any system that can make HTTP calls.",
      "Each request contains an XDM-formatted payload that is validated, identity-resolved, and merged into the Real-Time Customer Profile within seconds. The API supports both single-record and batch-record payloads. Authentication uses an IMS service account token (OAuth 2.0 JWT flow).",
      "This integration is critical for organizations that have significant server-side event sources. Web and mobile data comes through client-side SDKs, but transaction processing systems, IoT sensors, and backend services use the Streaming API to complete the customer data picture in AEP."
    ],
    flow: [
      { label: "Server-Side System", description: "POS, IoT, backend service, or event bus" },
      { label: "HTTP POST", description: "XDM payload sent to AEP streaming endpoint" },
      { label: "Validation", description: "Schema validation and identity resolution" },
      { label: "Profile Merge", description: "Data merged into Real-Time Customer Profile" },
      { label: "Downstream", description: "Available for segmentation, journeys, and analytics" }
    ],
    concepts: [
      { title: "Inlet Endpoints", content: "Each AEP streaming connection has a unique inlet URL. Requests are authenticated with a bearer token (IMS access token). The inlet validates the XDM schema, resolves identities, and routes data to the correct dataset. Payloads can include one record or up to 1 MB of batched records per request. The endpoint returns synchronous validation errors for malformed payloads." },
      { title: "XDM Compliance", content: "Every payload must conform to a registered XDM schema in AEP. The schema determines which dataset the data lands in. Required fields must be present, data types must match, and identity fields must use valid namespace identifiers. Failed validation returns a detailed error response with field-level issues." },
      { title: "Rate Limits", content: "Streaming ingestion has rate limits based on your AEP license: typically 20,000 requests/minute per inlet and a daily record cap. Exceeding limits results in HTTP 429 responses. Best practice is to implement exponential backoff retry logic. For high-throughput scenarios, consider batching multiple records per request to stay within request-per-minute limits while maximizing record throughput." }
    ],
    example: {
      title: "Streaming API – POS Transaction Event",
      language: "bash",
      code: `curl -X POST \\
  "https://dcs.adobedc.net/collection/{INLET_ID}" \\
  -H "Authorization: Bearer {ACCESS_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "header": {
      "schemaRef": {
        "id": "https://ns.adobe.com/{TENANT}/schemas/pos-txn",
        "contentType": "application/vnd.adobe.xed-full+json;version=1"
      },
      "imsOrgId": "{ORG_ID}@AdobeOrg",
      "datasetId": "pos-transactions-dataset",
      "flowId": "pos-streaming-flow"
    },
    "body": {
      "xdmMeta": {
        "schemaRef": {
          "id": "https://ns.adobe.com/{TENANT}/schemas/pos-txn"
        }
      },
      "xdmEntity": {
        "xdm:timestamp": "2024-01-15T18:30:00Z",
        "xdm:eventType": "commerce.purchases",
        "xdm:identityMap": {
          "LoyaltyId": [{ "id": "LOY-123456" }]
        },
        "xdm:commerce": {
          "purchases": { "value": 1 },
          "order": {
            "purchaseID": "POS-TXN-789",
            "priceTotal": 85.50,
            "currencyCode": "USD"
          }
        },
        "xdm:productListItems": [
          { "xdm:SKU": "SHOE-BLK-42", "xdm:quantity": 1, "xdm:priceTotal": 85.50 }
        ]
      }
    }
  }'`
    },
    whenToUse: [
      "Server-side systems (POS, backend services, IoT) need to send events to AEP in real-time",
      "Transaction data from non-browser sources must enrich the Real-Time Customer Profile immediately",
      "Client-side SDK collection is not possible (server-to-server integrations, batch processing outputs)",
      "High-frequency event streams (IoT, gaming, streaming media) need to feed AEP",
      "Custom applications need programmatic control over data ingestion timing and payload structure"
    ]
  },

  "mobile-sdk-aep": {
    id: "mobile-sdk-aep",
    title: "Mobile SDK → AEP",
    overview: [
      "The Adobe Experience Platform Mobile SDK (AEP Mobile SDK) is the native library for iOS (Swift) and Android (Kotlin/Java) that collects behavioral events from mobile apps and sends them to AEP via Edge Network. It's the mobile equivalent of the Web SDK — a single SDK that replaces multiple legacy libraries (Analytics SDK, Target SDK, etc.).",
      "The Mobile SDK uses a modular extension architecture. Core extensions handle lifecycle events (app launch, background, crash), identity (ECID generation, syncing custom identifiers), and Edge Network communication. Additional extensions add specific functionality: Consent management, Places (geolocation), Messaging (in-app messages from AJO), Target, and Analytics.",
      "Data flows from the Mobile SDK through the same Datastream and Edge Network infrastructure as Web SDK. This means mobile events and web events share the same routing, identity resolution, and downstream activation — enabling true cross-device customer profiles in AEP."
    ],
    flow: [
      { label: "Mobile App", description: "iOS or Android app with AEP Mobile SDK installed" },
      { label: "SDK Extensions", description: "Lifecycle, Identity, Edge, Consent, Messaging" },
      { label: "Edge Network", description: "Events sent to Adobe Edge Network via SDK" },
      { label: "Datastream", description: "Routes data to AEP, Analytics, Target" },
      { label: "AEP Profile", description: "Mobile events merged into unified customer profile" }
    ],
    concepts: [
      { title: "SDK Architecture", content: "The Mobile SDK uses a hub-and-spoke model. The Core (MobileCore) handles initialization, event dispatch, and extension lifecycle. Extensions register with Core and communicate via an internal event bus. Key extensions: Edge (sends XDM events to Edge Network), Identity (manages ECID and custom IDs), Lifecycle (automatic app open/close/crash tracking), Consent (manages user privacy preferences), and Signal (rules-based postbacks)." },
      { title: "Lifecycle Events", content: "Lifecycle tracking automatically captures: Application Launch (foreground event with session context), Application Close (background event with session duration), Application Crash (detected on next launch), App Install/Upgrade (version changes). These events are sent as XDM ExperienceEvents and are invaluable for app engagement analysis in CJA — session counts, session duration, crash rates, install/upgrade trends." },
      { title: "Identity Syncing", content: "The Mobile SDK generates an ECID (Experience Cloud ID) on first launch and persists it across app sessions. Additional identifiers (CRM ID, loyalty ID, custom user ID) are synced using the Identity extension's syncIdentifiers API. This enables cross-device identity stitching in AEP — linking a user's mobile app ECID with their web ECID via a shared CRM ID, creating a single person-level profile." },
      { title: "In-App Messaging", content: "The AJO Messaging extension enables in-app messages triggered by AJO campaigns or journeys. Messages are fetched from Edge Network when the app launches or when specific conditions are met (segment membership, event trigger). Message formats include full-screen, modal, banner, and native alerts. The SDK handles display, interaction tracking, and suppression rules (frequency capping, priority ordering)." }
    ],
    example: {
      title: "Mobile SDK – Track Commerce Event (Swift)",
      language: "swift",
      code: `import AEPCore
import AEPEdge

// Track a product view event
let xdmData: [String: Any] = [
  "eventType": "commerce.productViews",
  "commerce": [
    "productViews": ["value": 1]
  ],
  "productListItems": [
    [
      "SKU": "SHOE-RED-42",
      "name": "Running Shoes",
      "priceTotal": 129.99,
      "currencyCode": "USD"
    ]
  ]
]

let event = ExperienceEvent(xdm: xdmData)
Edge.sendEvent(experienceEvent: event) { handles in
  for handle in handles {
    print("Handle type: \\(handle.type ?? "")")
  }
}`
    },
    whenToUse: [
      "Native iOS/Android apps need to send behavioral data to AEP for unified customer profiles",
      "Mobile app events should trigger AJO journeys (e.g., app install → welcome push sequence)",
      "Cross-device identity stitching is needed between mobile app and website interactions",
      "In-app messages from AJO need to be delivered and tracked within the mobile app",
      "A single mobile SDK should replace multiple legacy Adobe SDKs (Analytics, Target, Audience Manager)"
    ]
  },

  // ============ AKAMAI TILES ============

  "akamai-dns": {
    id: "akamai-dns",
    title: "DNS & Edge DNS",
    overview: [
      "The Domain Name System (DNS) translates human-readable domain names (example.com) into IP addresses that computers use to communicate. It's the foundational layer of the internet — every web request, API call, and email delivery starts with a DNS lookup.",
      "Akamai's Edge DNS (formerly Fast DNS) is an authoritative DNS service hosted on Akamai's globally distributed edge platform. It provides high-availability, DDoS-resilient DNS resolution with sub-second global response times. Edge DNS leverages the same anycast network that powers Akamai's CDN, meaning DNS queries are answered by the nearest edge server.",
      "Understanding DNS record types, TTL management, and the difference between recursive and authoritative DNS is essential for any technical specialist working with web infrastructure and CDN configurations."
    ],
    flow: [
      { label: "User Query", description: "Browser needs IP for www.example.com" },
      { label: "Recursive Resolver", description: "ISP resolver checks cache, queries root/TLD if needed" },
      { label: "Authoritative DNS", description: "Edge DNS returns the definitive answer" },
      { label: "IP Returned", description: "Resolver caches and returns IP to client" },
      { label: "Connection", description: "Browser connects to the IP address" }
    ],
    concepts: [
      { title: "Record Types", content: "A (IPv4 address), AAAA (IPv6 address), CNAME (alias to another domain — cannot coexist with other records at zone apex), MX (mail server with priority value), TXT (arbitrary text — used for SPF, DKIM, DMARC, domain verification), NS (nameserver delegation), SRV (service location with port and priority), SOA (start of authority — zone metadata, serial number, refresh intervals), PTR (reverse DNS — IP to domain), CAA (certificate authority authorization — restricts which CAs can issue certs)." },
      { title: "TTL (Time to Live)", content: "TTL defines how long (in seconds) a DNS record can be cached by resolvers. Low TTL (60-300s): enables fast failover and frequent changes, but increases DNS query volume. High TTL (3600-86400s): reduces query load and improves performance, but changes propagate slowly. Best practice: use high TTL for stable records (MX, NS) and lower TTL for records that might change (A records during migrations). Reduce TTL before planned changes, then increase after." },
      { title: "Akamai Edge DNS", content: "Edge DNS is hosted on Akamai's anycast network across 4,000+ points of presence. It provides built-in DDoS protection (absorbing volumetric DNS attacks), 100% uptime SLA, DNSSEC support, and sub-second global resolution. Zone management is done through Akamai Control Center or via API/Terraform. Edge DNS supports zone transfer (AXFR) from existing DNS providers for migration." },
      { title: "Zone Apex (Naked Domain)", content: "The zone apex (e.g., example.com without www) can only have A/AAAA records, not CNAMEs (per RFC). This creates a challenge for CDN setups that require CNAME pointing. Solutions: ALIAS/ANAME records (provider-specific pseudo-records that resolve at the DNS level), or using Akamai's GTM (Global Traffic Management) which supports zone apex CNAME-like behavior through A record responses." }
    ],
    example: {
      title: "Common DNS Zone Configuration",
      language: "text",
      code: `; Zone: example.com
; SOA and NS records
example.com.       IN  SOA   ns1.akamai.net. admin.example.com. (
                            2024011501 ; Serial
                            3600       ; Refresh (1 hour)
                            900        ; Retry (15 min)
                            1209600    ; Expire (2 weeks)
                            300        ; Min TTL (5 min)
                        )
example.com.       IN  NS    a1-1.akam.net.
example.com.       IN  NS    a2-2.akam.net.

; A records
example.com.       300 IN  A     203.0.113.10
www.example.com.   300 IN  CNAME example.com.edgesuite.net.

; Mail
example.com.       3600 IN MX    10 mail1.example.com.
example.com.       3600 IN MX    20 mail2.example.com.

; TXT records for email auth
example.com.       3600 IN TXT   "v=spf1 include:_spf.google.com ~all"
_dmarc.example.com. 3600 IN TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com"

; CAA - only allow Let's Encrypt and DigiCert
example.com.       3600 IN CAA   0 issue "letsencrypt.org"
example.com.       3600 IN CAA   0 issue "digicert.com"`
    },
    whenToUse: [
      "You're setting up or migrating authoritative DNS to Akamai Edge DNS for high availability",
      "DNS-level DDoS protection is needed for critical domains",
      "Understanding DNS record types is required for CDN, email, and certificate configurations",
      "TTL tuning is needed for planned infrastructure changes or failover scenarios",
      "DNSSEC implementation is required for domain integrity verification"
    ]
  },

  "akamai-tls": {
    id: "akamai-tls",
    title: "HTTPS / TLS & Certificates",
    overview: [
      "Transport Layer Security (TLS) is the protocol that secures HTTP connections, turning HTTP into HTTPS. It provides three guarantees: confidentiality (data encrypted in transit), integrity (data not tampered with), and authentication (server is who it claims to be via certificates).",
      "The TLS handshake is a multi-step process where client and server negotiate a cipher suite, authenticate via certificates, and establish session keys for encryption. TLS 1.3 simplified this to a single round-trip (1-RTT), while TLS 1.2 requires two round-trips. Akamai terminates TLS at the edge, meaning the handshake happens with the nearest edge server — dramatically reducing latency compared to going all the way to the origin.",
      "Certificates are the trust mechanism. A certificate binds a domain name to a public key, signed by a Certificate Authority (CA) that browsers trust. Akamai offers several certificate options: Standard TLS (shared cert with Akamai SAN), Enhanced TLS (dedicated cert for PCI compliance), and customer-provided certificates (uploaded to Akamai's platform)."
    ],
    flow: [
      { label: "Client Hello", description: "Browser sends supported TLS versions & cipher suites" },
      { label: "Server Hello", description: "Server selects cipher suite, sends certificate" },
      { label: "Certificate Verify", description: "Client validates cert chain up to trusted root CA" },
      { label: "Key Exchange", description: "ECDHE key exchange creates shared session keys" },
      { label: "Encrypted Session", description: "Application data flows over encrypted channel" }
    ],
    concepts: [
      { title: "TLS 1.2 vs 1.3", content: "TLS 1.2 (2008): 2 round-trips for full handshake, supports RSA key exchange (no forward secrecy) and ECDHE (forward secrecy). Cipher suite negotiation is complex with many options. TLS 1.3 (2018): 1 round-trip handshake (1-RTT), supports 0-RTT resumption for repeat visitors, only ECDHE key exchange (forward secrecy mandatory), removes insecure algorithms (RC4, SHA-1, CBC mode), simplified cipher suites. Akamai supports both, with TLS 1.3 preferred for performance and security." },
      { title: "Certificate Types", content: "Domain Validated (DV): proves domain ownership only, issued in minutes, cheapest. Organization Validated (OV): verifies domain + organization identity, issued in days. Extended Validation (EV): rigorous identity verification, shows organization name in some browsers. Wildcard: covers *.example.com (all subdomains, one level). SAN (Subject Alternative Name): single cert covering multiple specific domains. Multi-domain wildcard: combines both." },
      { title: "Chain of Trust", content: "A certificate chain: Server Certificate (your domain) → Intermediate CA (issued by root) → Root CA (built into OS/browser trust store). The server sends its cert + intermediates; the client walks the chain to a trusted root. If the chain is incomplete (missing intermediates), browsers show errors. Certificate pinning (HPKP, now deprecated) and Certificate Transparency (CT) logs add additional trust verification." },
      { title: "Akamai TLS Options", content: "Standard TLS: shared SAN cert on Akamai edge, included at no extra cost, uses *.akamaized.net or customer domain. Enhanced TLS (Secure CDN): dedicated certificate on a separate secure network, required for PCI DSS compliance, supports customer-provided certificates. Both terminate TLS at the edge. Origin connections can use a separate TLS cert between edge and origin server." },
      { title: "Forward Secrecy", content: "Forward secrecy (via ECDHE key exchange) ensures that even if the server's private key is compromised in the future, past session data cannot be decrypted. Each session generates a unique ephemeral key pair that is discarded after the session. This is mandatory in TLS 1.3 and strongly recommended in TLS 1.2 configurations. Without forward secrecy (RSA key exchange), a stolen private key decrypts all past and future traffic." }
    ],
    example: {
      title: "TLS 1.3 Handshake Flow",
      language: "text",
      code: `=== TLS 1.3 Handshake (1-RTT) ===

Client → Server: ClientHello
  - Supported TLS versions: [1.3]
  - Cipher suites: [TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256]
  - Key share: ECDHE public key (X25519)
  - SNI: www.example.com

Server → Client: ServerHello + EncryptedExtensions + Certificate + CertificateVerify + Finished
  - Selected cipher: TLS_AES_256_GCM_SHA384
  - Key share: ECDHE server public key
  - Certificate: www.example.com (issued by DigiCert)
  - CertificateVerify: Signature over handshake transcript
  
Client → Server: Finished
  - Handshake MAC verification

=== Session Established — 1 Round Trip ===
Application data now encrypted with AES-256-GCM
Session keys derived from ECDHE shared secret via HKDF`
    },
    whenToUse: [
      "You need to understand TLS handshake mechanics for performance optimization and debugging",
      "Certificate selection (DV vs OV vs EV, wildcard vs SAN) decisions need to be made",
      "Akamai's TLS termination and certificate options need to be configured for a new property",
      "PCI DSS compliance requires Enhanced TLS with dedicated certificates on Akamai",
      "TLS 1.3 migration is planned and you need to understand the security and performance benefits"
    ]
  },

  "akamai-waf": {
    id: "akamai-waf",
    title: "WAF & DDoS Protection",
    overview: [
      "Akamai's Web Application Firewall (WAF), part of Kona Site Defender and App & API Protector, inspects HTTP/HTTPS traffic at the edge to block application-layer attacks. It protects against OWASP Top 10 threats: SQL injection, cross-site scripting (XSS), command injection, local file inclusion (LFI), and more.",
      "WAF operates by applying rule sets to incoming requests. Akamai's Kona Rule Set (KRS) and Adaptive Security Engine (ASE) provide pre-built rules that are regularly updated as new attack patterns emerge. Each rule has a risk score; administrators set a threshold that determines when requests are blocked vs. alerted.",
      "DDoS protection at Akamai operates at multiple layers: Network-layer (L3/L4) attacks are absorbed by Akamai's massive edge capacity (hundreds of Tbps). Application-layer (L7) attacks (slow POST, HTTP floods) are mitigated by rate controls, bot detection, and WAF rules. Prolexic provides dedicated scrubbing centers for origin infrastructure protection."
    ],
    flow: [
      { label: "Incoming Request", description: "HTTP/HTTPS request arrives at Akamai edge" },
      { label: "Rate Control", description: "Request rate checked against threshold policies" },
      { label: "WAF Inspection", description: "Request body, headers, and URI checked against rules" },
      { label: "Risk Scoring", description: "Matched rules contribute to total risk score" },
      { label: "Action", description: "Allow, alert, deny, or challenge based on score vs threshold" }
    ],
    concepts: [
      { title: "Attack Types", content: "SQL Injection (SQLi): malicious SQL in input fields to extract/modify database data. Cross-Site Scripting (XSS): injecting JavaScript into pages viewed by other users. Command Injection: executing OS commands through vulnerable application inputs. Local File Inclusion (LFI): accessing server files through path traversal. Remote File Inclusion (RFI): loading malicious remote files. Cross-Site Request Forgery (CSRF): tricking authenticated users into unintended actions." },
      { title: "WAF Rule Groups", content: "Akamai organizes WAF rules into attack groups: SQL Injection, XSS, Command Injection, LFI/RFI, Platform Attack (Apache, IIS-specific), and Protocol Attack (HTTP protocol violations). Each group can be set to Alert (log only), Deny (block request), or Custom (return specific status code or redirect). During initial deployment, all groups are set to Alert mode for tuning." },
      { title: "5-Step Tuning Workflow", content: "1) Deploy in Alert mode — all rules log but don't block. 2) Analyze alerts for 7-14 days to identify false positives. 3) Create exceptions for legitimate traffic patterns (e.g., CMS admin paths, specific API parameters). 4) Gradually move rule groups to Deny mode, starting with highest confidence (Protocol, LFI). 5) Monitor continuously and refine — new false positives may emerge with site changes." },
      { title: "Rate Controls", content: "Rate controls limit request volume from individual clients or based on patterns. Configuration includes: threshold (requests per time period), time period (10s, 30s, 60s, 5min), client identification (IP, cookie, header), action when exceeded (alert, deny, slow), and penalty duration (how long the block persists). Use cases: protecting login endpoints from credential stuffing, preventing API abuse, mitigating application-layer DDoS." },
      { title: "Adaptive Security Engine", content: "ASE is Akamai's next-gen WAF engine that uses anomaly scoring instead of binary rule matching. Each rule match adds to a request's anomaly score. If the total score exceeds the configured threshold, the request is blocked. This approach reduces false positives compared to traditional pattern-matching WAFs because a single low-confidence match won't trigger a block — it takes multiple indicators of malicious intent." }
    ],
    example: {
      title: "WAF Rule Group Configuration",
      language: "json",
      code: `{
  "securityPolicy": "api_protection_v2",
  "wafMode": "KRS + Adaptive Security Engine",
  "attackGroupActions": {
    "SQL_INJECTION": { "action": "deny", "exceptions": ["path:/api/search"] },
    "CROSS_SITE_SCRIPTING": { "action": "deny" },
    "COMMAND_INJECTION": { "action": "deny" },
    "LOCAL_FILE_INCLUSION": { "action": "deny" },
    "REMOTE_FILE_INCLUSION": { "action": "deny" },
    "PLATFORM_ATTACK": { "action": "alert" },
    "PROTOCOL_ATTACK": { "action": "deny" }
  },
  "rateControls": [
    {
      "name": "Login Endpoint Protection",
      "path": "/api/auth/login",
      "threshold": 10,
      "period": "60s",
      "clientId": "IP",
      "penaltyAction": "deny",
      "penaltyDuration": "300s"
    }
  ],
  "anomalyScoreThreshold": 50
}`
    },
    whenToUse: [
      "Web applications need protection against OWASP Top 10 vulnerabilities (SQLi, XSS, etc.)",
      "Application-layer DDoS mitigation is needed beyond network-layer protection",
      "API endpoints require rate limiting to prevent abuse and credential stuffing",
      "A new WAF deployment needs to be tuned through the alert → analyze → deny workflow",
      "Compliance requirements (PCI DSS, SOC 2) mandate a WAF in front of web applications"
    ]
  },

  "akamai-edgeworkers": {
    id: "akamai-edgeworkers",
    title: "EdgeWorkers",
    overview: [
      "Akamai EdgeWorkers is a serverless compute platform that runs JavaScript at the edge — on Akamai's 4,000+ points of presence worldwide. EdgeWorkers execute custom logic during HTTP request/response processing, enabling use cases like A/B testing, header manipulation, API orchestration, geolocation-based routing, and dynamic content assembly — all without going to the origin server.",
      "EdgeWorkers use an event-driven lifecycle model with specific hooks: onClientRequest (before the request goes to cache/origin), onOriginRequest (before forwarding to origin), onOriginResponse (after receiving origin response), onClientResponse (before sending response to client), and responseProvider (generate entire responses at the edge). Each hook has access to request/response objects and can modify headers, URLs, status codes, and bodies.",
      "The key advantage is latency reduction. By executing logic at the edge — physically close to the user — you avoid the round-trip to origin servers that might be hundreds of milliseconds away. EdgeWorkers are ideal for lightweight transformations and decisions that benefit from edge proximity."
    ],
    flow: [
      { label: "Client Request", description: "User's request hits nearest Akamai edge server" },
      { label: "onClientRequest", description: "EdgeWorker modifies request, sets routing logic" },
      { label: "Cache/Origin", description: "Request served from cache or forwarded to origin" },
      { label: "onOriginResponse", description: "EdgeWorker transforms response from origin" },
      { label: "Client Response", description: "Modified response delivered to user" }
    ],
    concepts: [
      { title: "Lifecycle Events", content: "onClientRequest: Runs before cache lookup. Use for URL rewrites, header injection, request routing, A/B test assignment. onOriginRequest: Runs if request goes to origin. Modify origin path, add auth headers. onOriginResponse: Runs after origin responds. Transform response headers, modify caching behavior. onClientResponse: Runs before sending to client. Add security headers, modify cookies. responseProvider: Short-circuit entirely — generate response at the edge without cache or origin." },
      { title: "EdgeKV", content: "EdgeKV is a distributed key-value store accessible from EdgeWorkers. Data is replicated across Akamai's edge network for low-latency reads. Use cases: feature flags (read flag value at edge, route accordingly), A/B test configurations, redirect maps, and user-specific settings. EdgeKV has eventual consistency (typically < 10 seconds propagation). Writes are done via API; reads happen in EdgeWorker code." },
      { title: "Resource Limits", content: "EdgeWorkers have execution limits: CPU time (typically 50ms for onClientRequest), memory (128 KB), and code bundle size (1 MB compressed). These constraints encourage lightweight, focused logic. Heavy computation should happen at origin; EdgeWorkers handle routing, transformation, and decision-making. The responseProvider event has more generous limits for generating full responses." },
      { title: "Development Workflow", content: "Write JavaScript locally using the Akamai EdgeWorkers IDE or any editor. Bundle (main.js + bundle.json manifest). Upload via API, CLI (akamai edgeworkers), or Terraform. Activate on staging network, test thoroughly. Promote to production. Versions are immutable — each activation creates a new version. Rollback by activating a previous version. Logs are available via Edge Diagnostics and debug headers." }
    ],
    example: {
      title: "EdgeWorker – A/B Test Routing",
      language: "javascript",
      code: `// main.js — EdgeWorker for A/B test routing
import { Cookies } from 'cookies';
import { logger } from 'log';

export function onClientRequest(request) {
  const cookies = new Cookies(request.getHeader('Cookie'));
  let variant = cookies.get('ab_variant');

  if (!variant) {
    // Assign new visitors to A or B (50/50)
    variant = Math.random() < 0.5 ? 'A' : 'B';
    request.setVariable('PMUSER_SET_COOKIE',
      \`ab_variant=\${variant}; Path=/; Max-Age=2592000\`);
  }

  // Route to variant-specific origin path
  if (variant === 'B') {
    request.route({
      origin: 'experiment-origin',
      path: '/variant-b' + request.path
    });
  }

  logger.log(\`Visitor assigned to variant: \${variant}\`);
}

export function onClientResponse(request, response) {
  const setCookie = request.getVariable('PMUSER_SET_COOKIE');
  if (setCookie) {
    response.addHeader('Set-Cookie', setCookie);
  }
}`
    },
    whenToUse: [
      "Custom request routing or A/B testing logic needs to run at the edge with minimal latency",
      "HTTP headers, cookies, or URLs need to be dynamically manipulated before/after origin",
      "Entire responses need to be generated at the edge without touching the origin server",
      "Geolocation-based content variations or redirects are needed at global scale",
      "Microservice API orchestration or response aggregation should happen closer to users"
    ]
  },

  "akamai-bot-manager": {
    id: "akamai-bot-manager",
    title: "Bot Manager",
    overview: [
      "Akamai Bot Manager detects and manages bot traffic — distinguishing between legitimate bots (search engine crawlers, monitoring tools), unwanted bots (scrapers, credential stuffers, inventory hoarders), and sophisticated bots that mimic human behavior. Bot traffic can represent 30-50% of total web traffic, making bot management critical for security, performance, and business integrity.",
      "Bot Manager uses multiple detection mechanisms: signature-based identification (known bot fingerprints), behavioral analysis (mouse movements, keystroke patterns, navigation paths), browser fingerprinting (JavaScript challenges that verify real browser environment), rate analysis (request patterns that indicate automation), and machine learning models trained on Akamai's visibility across trillions of daily requests.",
      "The platform classifies bots into categories and allows differentiated actions: known good bots (Google, Bing) are allowed, known bad bots (malicious scanners) are blocked, and unknown/sophisticated bots can be challenged with CAPTCHAs, crypto challenges, or served alternate content (tarpit responses, decoy data)."
    ],
    flow: [
      { label: "Incoming Request", description: "Traffic arrives at Akamai edge" },
      { label: "Bot Detection", description: "Signatures, behavior, and fingerprinting analyzed" },
      { label: "Classification", description: "Categorized: known good, known bad, unknown" },
      { label: "Action", description: "Allow, block, challenge, tarpit, or serve alternate" },
      { label: "Reporting", description: "Bot traffic analytics and trend monitoring" }
    ],
    concepts: [
      { title: "Bot Categories", content: "Known Bots: identified by user-agent, IP range, or behavior signature. Examples: Googlebot, Bingbot, monitoring tools (Pingdom, DataDog). Classified as 'good' or 'bad' based on Akamai's intelligence. Unknown Bots: unidentified automated traffic — could be custom scrapers, headless browsers, or sophisticated attack tools. These require behavioral analysis and JavaScript challenges for classification." },
      { title: "Detection Techniques", content: "Signature matching: known bot user-agents and IP ranges. JavaScript challenge: inject JS that only real browsers execute (tests DOM, rendering engine, WebGL). Behavioral analysis: track mouse movements, scroll patterns, click coordinates — bots move differently than humans. Device fingerprinting: collect browser properties (screen size, plugins, timezone, canvas rendering) to identify headless browsers. Rate analysis: request frequency and patterns that indicate automation." },
      { title: "Response Actions", content: "Allow: let request through (for good bots). Monitor: allow but log and track. Challenge: serve CAPTCHA or crypto challenge (slows bots, minimal user friction). Slow: intentionally delay response (tarpit — wastes bot resources). Deny: return 403 or custom error page. Serve Alternate: return different content (decoy/honeypot data to mislead scrapers). Custom: return specific status code or redirect." },
      { title: "Use Cases", content: "Credential Stuffing: bots test stolen username/password combinations on login pages. Web Scraping: competitors or aggregators scrape pricing, inventory, and content. Inventory Hoarding: bots hold limited items in shopping carts without purchasing. Ad Fraud: bots generate fake ad impressions and clicks. API Abuse: automated scripts overwhelm APIs beyond intended usage. Account Creation: bots mass-create fake accounts for spam or fraud." }
    ],
    example: {
      title: "Bot Manager Policy Configuration",
      language: "json",
      code: `{
  "botManagerPolicy": "ecommerce-protection",
  "transactionalEndpoints": [
    {
      "path": "/api/auth/login",
      "method": "POST",
      "protections": ["credential-stuffing-detection", "rate-limiting"]
    },
    {
      "path": "/api/cart/add",
      "method": "POST",
      "protections": ["inventory-hoarding-detection"]
    }
  ],
  "botCategoryActions": {
    "SEARCH_ENGINE": "allow",
    "SITE_MONITOR": "allow",
    "SEO_TOOL": "allow",
    "SCRAPER": "challenge",
    "CREDENTIAL_STUFFER": "deny",
    "HEADLESS_BROWSER": "challenge",
    "UNKNOWN_AUTOMATED": "challenge"
  },
  "javascriptInjection": {
    "enabled": true,
    "injectOn": ["text/html"],
    "challengeType": "crypto"
  }
}`
    },
    whenToUse: [
      "Login endpoints are targeted by credential stuffing attacks using compromised credential lists",
      "Web scrapers are stealing pricing, content, or inventory data from your website",
      "E-commerce sites need protection against inventory hoarding and checkout abuse by bots",
      "You need to allow legitimate bots (search engines, monitors) while blocking malicious automation",
      "Sophisticated bots are bypassing simple rate limits and user-agent blocks, requiring behavioral analysis"
    ]
  },

  "akamai-terraform-jenkins": {
    id: "akamai-terraform-jenkins",
    title: "Terraform & Jenkins",
    overview: [
      "Infrastructure as Code (IaC) brings version control, repeatability, and automation to Akamai configurations. Instead of manually clicking through Akamai Control Center to create and modify CDN properties, DNS zones, WAF policies, and certificates, you define them in Terraform HCL (HashiCorp Configuration Language) files that are stored in Git and applied through CI/CD pipelines.",
      "The Akamai Terraform Provider is officially maintained and supports most Akamai products: Property Manager (CDN configuration), Edge DNS, Application Security (WAF), Bot Manager, GTM, CPS (certificates), EdgeWorkers, Cloudlets, and Identity Management. Terraform's plan/apply workflow lets you preview changes before applying them, reducing the risk of misconfigurations.",
      "Jenkins (or any CI/CD tool — GitHub Actions, GitLab CI, Azure DevOps) automates the Terraform workflow. When a developer pushes a configuration change to Git, Jenkins runs terraform plan, outputs the diff for review, and after approval, runs terraform apply to push changes to Akamai's staging and production networks."
    ],
    flow: [
      { label: "Developer", description: "Writes/modifies Terraform HCL files in Git" },
      { label: "Pull Request", description: "terraform plan runs in CI, diff reviewed by team" },
      { label: "Merge", description: "Approved PR merged to main branch" },
      { label: "Jenkins Pipeline", description: "terraform apply deploys changes to Akamai" },
      { label: "Akamai Network", description: "Changes propagated to staging, then production" }
    ],
    concepts: [
      { title: "Terraform Basics", content: "Terraform uses declarative configuration: you describe the desired state, and Terraform calculates what changes are needed. Key concepts: Providers (plugins for each platform — Akamai, AWS, Azure), Resources (individual infrastructure objects — akamai_property, akamai_dns_record), State (Terraform tracks what it manages in a state file), Plan (preview of changes), Apply (execute changes). State should be stored remotely (S3, Terraform Cloud) for team collaboration." },
      { title: "Akamai Provider", content: "Configure the Akamai provider with API credentials (client_secret, host, access_token, client_token) — these come from Akamai Identity & Access Management. Resources include: akamai_property (CDN properties with rules as JSON), akamai_dns_record (DNS records), akamai_appsec_configuration (WAF policies), akamai_edge_hostname (edge hostnames), akamai_cp_code (content provider codes). Data sources let you read existing Akamai configurations." },
      { title: "Property Manager as Code", content: "CDN property rules (the behavior tree that defines caching, origin, performance, and security settings) can be managed as JSON rule trees in Terraform. The akamai_property resource accepts a rules JSON file. This is the most complex Akamai Terraform resource — rule trees can be thousands of lines. Best practice: use Terraform to manage the property lifecycle and rule tree versioning, with the rule JSON generated from templates or maintained separately." },
      { title: "Jenkins Pipeline", content: "A Jenkinsfile defines the CI/CD pipeline stages: Checkout (pull code from Git), Init (terraform init downloads providers), Validate (terraform validate checks syntax), Plan (terraform plan previews changes and saves plan file), Approval (manual gate — reviewer checks plan output), Apply (terraform apply executes the plan), Verify (smoke tests against staging/production). Environment-specific variables (staging vs production credentials) are managed via Jenkins credentials store." }
    ],
    example: {
      title: "Akamai Terraform Configuration",
      language: "hcl",
      code: `# providers.tf
terraform {
  required_providers {
    akamai = {
      source  = "akamai/akamai"
      version = "~> 6.0"
    }
  }
  backend "s3" {
    bucket = "akamai-terraform-state"
    key    = "prod/cdn.tfstate"
    region = "us-east-1"
  }
}

provider "akamai" {
  config {
    client_secret = var.akamai_client_secret
    host          = var.akamai_host
    access_token  = var.akamai_access_token
    client_token  = var.akamai_client_token
  }
}

# dns.tf — Edge DNS record
resource "akamai_dns_record" "www" {
  zone       = "example.com"
  name       = "www.example.com"
  recordtype = "CNAME"
  ttl        = 300
  target     = ["www.example.com.edgesuite.net."]
}

# property.tf — CDN property
resource "akamai_property" "www" {
  name        = "www.example.com"
  product_id  = "prd_Fresca"
  contract_id = var.contract_id
  group_id    = var.group_id
  
  hostnames {
    cname_from             = "www.example.com"
    cname_to               = akamai_edge_hostname.www.edge_hostname
    cert_provisioning_type = "DEFAULT"
  }

  rules = file("rules/property-rules.json")
}`
    },
    whenToUse: [
      "Akamai configurations need version control, peer review, and audit trails via Git",
      "Multiple environments (dev, staging, production) require consistent, repeatable Akamai setups",
      "Manual Akamai Control Center changes are error-prone and need to be replaced with automation",
      "A CI/CD pipeline should validate, plan, and apply Akamai changes automatically on merge",
      "Team collaboration on Akamai configurations requires pull request workflows and change previews"
    ]
  },

  "akamai-product-map": {
    id: "akamai-product-map",
    title: "Akamai Product Map",
    overview: [
      "Akamai's product portfolio is organized around three pillars: Deliver (content and application delivery), Secure (web and infrastructure security), and Compute (cloud and edge computing). Understanding which products fall into each pillar and how they work together is essential for architecting complete solutions on the Akamai platform.",
      "The Deliver pillar includes Ion (web performance), Dynamic Site Accelerator (DSA), Download Delivery, Media Delivery (Adaptive Media Delivery for video streaming), and API Acceleration. These products optimize content delivery through caching, prefetching, protocol optimization, and route optimization across Akamai's edge network.",
      "The Secure pillar includes Kona Site Defender (WAF), App & API Protector (next-gen WAF), Bot Manager, Prolexic (DDoS scrubbing), Edge DNS, and Guardicore (microsegmentation). The Compute pillar includes Akamai Connected Cloud (Linode-based IaaS), EdgeWorkers (serverless at edge), EdgeKV (key-value store), and Image & Video Manager (edge transformation)."
    ],
    flow: [
      { label: "User Request", description: "Client makes HTTP/S request to your domain" },
      { label: "Edge DNS", description: "Akamai DNS resolves to nearest edge server" },
      { label: "Security Layer", description: "WAF, Bot Manager, and DDoS protection inspect traffic" },
      { label: "Delivery Layer", description: "CDN caching, optimization, and edge compute" },
      { label: "Origin/Compute", description: "Origin server or Akamai cloud compute serves content" }
    ],
    concepts: [
      { title: "Deliver Products", content: "Ion: flagship web delivery product — includes SureRoute (optimal path selection), Prefetching (predictive resource loading), Adaptive Acceleration (learned optimizations per page), Image Manager (automatic image optimization), and mPulse (RUM performance monitoring). DSA: for dynamic, uncacheable content — optimizes TCP/TLS, uses SureRoute, connection multiplexing. API Acceleration: optimizes API traffic with API-aware caching, GraphQL caching, and rate limiting. Download Delivery: large file distribution (software, games). Adaptive Media Delivery: ABR video streaming (HLS, DASH)." },
      { title: "Secure Products", content: "App & API Protector: unified WAF + bot mitigation + API protection, replacing Kona Site Defender for new deployments. Includes Adaptive Security Engine, API schema validation, and automated attack group tuning. Prolexic: DDoS scrubbing service for origin infrastructure (BGP-based traffic diversion). Edge DNS: authoritative DNS with DDoS protection. Guardicore: microsegmentation for data center / cloud workloads (east-west traffic protection). Account Protector: user account abuse detection." },
      { title: "Compute Products", content: "Akamai Connected Cloud (Linode): IaaS with global data centers — Shared CPU, Dedicated CPU, High Memory, GPU instances, Kubernetes (LKE), managed databases, block/object storage. EdgeWorkers: serverless JavaScript at 4,000+ edge PoPs. EdgeKV: distributed key-value store for edge logic. Image & Video Manager: real-time image/video transformation at the edge (resize, crop, format conversion, quality optimization)." },
      { title: "Property Manager", content: "Property Manager is the configuration engine for Akamai's delivery and security products. A 'property' defines how traffic for a hostname is handled: caching rules, origin configuration, performance settings, and security policy attachment. The property is defined as a rule tree (JSON) with match criteria and behaviors. Properties are activated on Akamai's staging network for testing, then promoted to production. This is the core configuration layer that ties all products together." }
    ],
    example: {
      title: "Akamai Product Stack — E-commerce Example",
      language: "text",
      code: `=== E-commerce Site: www.example.com ===

DNS Layer:
  └── Edge DNS — authoritative DNS with DDoS protection

Security Layer:
  ├── App & API Protector — WAF for web + API endpoints
  ├── Bot Manager Premier — credential stuffing & scraping protection  
  └── Account Protector — account takeover detection on login

Delivery Layer:
  ├── Ion Premier — web performance (SureRoute, Prefetch, Adaptive Accel)
  ├── Image Manager — automatic WebP/AVIF conversion, responsive sizing
  └── mPulse — Real User Monitoring (Core Web Vitals)

Compute Layer:
  ├── EdgeWorkers — A/B testing, geolocation routing, header manipulation
  ├── EdgeKV — feature flags, redirect maps, configuration store
  └── Connected Cloud — origin servers (Linode Kubernetes + Managed DB)

Certificate:
  └── Enhanced TLS — dedicated cert for PCI compliance`
    },
    whenToUse: [
      "You need to understand the full Akamai product landscape for solution architecture",
      "A new Akamai deployment requires selecting the right combination of delivery, security, and compute products",
      "Stakeholders need a clear view of how Akamai products map to business requirements",
      "You're studying for Akamai certification and need to understand product capabilities and positioning",
      "An existing Akamai setup needs to be assessed for gaps or optimization opportunities"
    ]
  },
};
