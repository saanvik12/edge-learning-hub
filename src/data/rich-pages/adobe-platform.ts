import type { RichPageData } from "@/components/rich-detail/types";

export const adobePlatformPages: Record<string, RichPageData> = {
  "aep-rtcdp": {
    id: "aep-rtcdp",
    hero: {
      badge1: { label: "AEP", color: "primary" },
      badge2: { label: "RTCDP", color: "secondary" },
      title: "AEP → RTCDP",
      subtitle: "Profile Activation & Audience Distribution",
      description: "AEP ingests, unifies, and enriches customer data. RTCDP is the activation layer built on top — enabling marketers to build segments and push them to destinations like ad platforms, email providers, and personalization engines.",
      highlights: [
        { icon: "🧠", label: "Data Foundation", detail: "XDM schemas, identity resolution, profile construction" },
        { icon: "🎯", label: "Audience Activation", detail: "Segments pushed to 100+ destinations in real-time" },
      ],
      mentalModel: "AEP is the data engineer's domain: ingestion pipelines, XDM schemas, identity graphs, merge policies. RTCDP is the marketer's layer: audience builder, governance enforcement, and destination activation. They share the same infrastructure — the Real-Time Customer Profile — but serve different personas and workflows.",
    },
    architecture: {
      sectionLabel: "Data Pipeline",
      title: "How Data Flows from AEP to RTCDP",
      description: "Data enters AEP from multiple sources, gets unified into profiles, then RTCDP segments and activates those profiles to downstream destinations.",
      pipeline: [
        { label: "Data Sources", description: "CRM, web, mobile, POS data flows into AEP", badgeColor: "muted" },
        { label: "AEP – XDM & Identity", description: "Data mapped to XDM schemas, identities resolved", badge: "AEP", badgeColor: "primary" },
        { label: "Real-Time Profile", description: "Unified customer profile assembled from all sources", badge: "AEP", badgeColor: "primary" },
        { label: "RTCDP Segmentation", description: "Marketers build audience segments on unified profiles", badge: "RTCDP", badgeColor: "secondary" },
        { label: "Destinations", description: "Segments activated to Google Ads, Facebook, email, etc.", badgeColor: "muted" },
      ],
    },
    concepts: [
      { title: "XDM Schemas", content: "Experience Data Model (XDM) is the standardized data framework. Every dataset in AEP must conform to an XDM schema — either ExperienceEvent (time-series behavioral data) or Individual Profile (record-based attributes). Schemas use field groups to organize related fields (e.g., Commerce Details, Demographic Details). Custom field groups extend the model for business-specific needs." },
      { title: "Identity Service & Graph", content: "Identity Service stitches together disparate identifiers (ECID, email, CRM ID, loyalty ID) into a single identity graph per person. Each identity has a namespace. The identity graph determines which profile fragments belong to the same individual, enabling the Real-Time Profile to merge them. Cross-device and cross-channel identity resolution happens here." },
      { title: "Merge Policies", content: "Merge policies define how profile fragments from different datasets are combined when identities overlap. Options include timestamp-ordered (most recent wins), dataset precedence (trusted source wins), and ID stitching strategies. The default merge policy uses timestamp ordering, but custom policies can prioritize specific datasets like CRM over web behavioral data." },
      { title: "Segment Evaluation Types", content: "RTCDP supports three evaluation methods: Streaming (real-time, evaluated as events arrive), Batch (scheduled, runs periodically), and Edge (evaluated at the edge for sub-second personalization). Streaming segments update within minutes, batch segments run on a schedule (typically daily), and edge segments evaluate on Adobe Edge Network for instant decisioning." },
      { title: "DULE Governance Labels", content: "Data Usage Labeling & Enforcement (DULE) lets you label data fields (e.g., C1=No third-party export, I1=Directly identifiable). Marketing policies reference these labels to automatically block sensitive data from flowing to inappropriate destinations. Enforcement is automatic at segment export time — not just documentation." },
    ],
    comparisons: [
      {
        title: "Segment Evaluation Methods",
        description: "Choosing the right evaluation type is a critical architectural decision that affects latency, complexity, and use cases.",
        items: [
          { icon: "⚡", label: "Streaming (Real-Time)", description: "Events evaluated as they arrive — membership updates within seconds.", points: ["Best for: time-sensitive triggers (cart abandon, price alerts)", "Latency: seconds to minutes", "Supports: profile attribute and event-based rules", "Limitation: cannot use complex lookbacks (90-day aggregations)"] },
          { icon: "🗓️", label: "Batch (Scheduled)", description: "Evaluated on a schedule — typically once or twice daily.", points: ["Best for: stable audiences (demographic segments, loyalty tiers)", "Latency: hours (runs on schedule)", "Supports: complex queries with large lookback windows", "Limitation: not suitable for real-time personalization"] },
          { icon: "🌐", label: "Edge (Sub-Second)", description: "Evaluated on Adobe Edge Network for instant decisioning.", points: ["Best for: same-page personalization, Target integration", "Latency: <100ms", "Supports: simple profile attribute rules", "Limitation: limited rule complexity, requires Edge Segmentation enabled"] },
        ],
        tip: "Start with streaming segments for real-time use cases, batch for everything else. Edge segments are specialized — only use when you need sub-second evaluation at the CDN layer.",
      },
    ],
    codeExamples: [
      { title: "XDM ExperienceEvent Schema (Product View)", language: "json", code: `{
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
  "xdm:productListItems": [{
    "xdm:SKU": "SKU-12345",
    "xdm:name": "Running Shoes Pro",
    "xdm:priceTotal": 129.99,
    "xdm:currencyCode": "USD"
  }]
}` },
      { title: "PQL Segment Definition (High-Value Cart Abandoners)", language: "json", code: `{
  "segmentName": "High-Value Cart Abandoners",
  "evaluationType": "streaming",
  "expression": {
    "type": "PQL",
    "format": "pql/text",
    "value": "select profile where commerce.checkouts.value = 0 AND productListItems.priceTotal > 100 AND homeAddress.countryCode = 'US' AND segmentMembership.get('loyalty-members').status = 'realized'"
  },
  "mergePolicyId": "default-merge-policy",
  "estimatedSize": 42500
}` },
      { title: "Identity Graph Example", language: "json", code: `{
  "identityGraph": {
    "person": "Jane Doe",
    "identities": [
      { "namespace": "ECID", "id": "38400000-04cb-...", "source": "Web SDK" },
      { "namespace": "Email", "id": "jane@example.com", "source": "Login" },
      { "namespace": "CRMId", "id": "CRM-789456", "source": "Salesforce Connector" },
      { "namespace": "LoyaltyId", "id": "LOY-123456", "source": "POS System" }
    ],
    "linkedProfiles": 4,
    "mergePolicy": "timestamp-ordered"
  }
}` },
    ],
    glossary: [
      { title: "AEP Terms", color: "primary", terms: [
        { term: "XDM", definition: "Experience Data Model — the standard schema framework for all AEP data" },
        { term: "Schema", definition: "Defines structure, fields, and data types (Individual Profile or ExperienceEvent)" },
        { term: "Dataset", definition: "A container for data records or files, tied to a specific Schema" },
        { term: "Real-Time Profile", definition: "A unified, stitched view of a customer across all channels" },
        { term: "Identity Graph", definition: "Stitches multiple identifiers (ECID, email, loyaltyId) to one profile" },
        { term: "Merge Policy", definition: "Rules for combining profile fragments when identities overlap" },
        { term: "DULE Labels", definition: "Data Usage Labeling & Enforcement — governance controls on data fields" },
      ]},
      { title: "RTCDP Terms", color: "secondary", terms: [
        { term: "Segment", definition: "A named group of profiles matching defined attribute + event rules" },
        { term: "Destination", definition: "An external platform where segments are activated (Google Ads, email, etc.)" },
        { term: "Streaming Segmentation", definition: "Real-time segment evaluation as profile events arrive" },
        { term: "Batch Segmentation", definition: "Scheduled segment evaluation run on a defined interval" },
        { term: "Edge Segmentation", definition: "Sub-second evaluation on Adobe Edge Network" },
        { term: "PQL", definition: "Profile Query Language — used to define segment rules" },
        { term: "Governance Policy", definition: "Rules that enforce data usage restrictions on export" },
      ]},
    ],
    tips: [
      "AEP is the data layer (ingestion, schema, identity); RTCDP is the activation layer (segments, destinations)",
      "Identity Service is the linchpin — poor identity configuration breaks everything downstream",
      "Start with streaming segments for real-time use cases, batch for everything else",
      "Merge policies determine whose data wins when identities conflict — configure these early",
      "DULE governance labels are enforced automatically at destination export — not just policy documents",
    ],
    whenToUse: [
      "You need to unify customer data from multiple sources into a single profile before segmenting audiences",
      "Marketing teams need self-service audience building on top of a governed data foundation",
      "You want to activate the same audience definition across multiple destinations simultaneously",
      "Real-time profile updates should immediately reflect in audience membership",
      "Data governance policies must be enforced before data leaves the platform",
    ],
  },

  "aep-cja": {
    id: "aep-cja",
    hero: {
      badge1: { label: "AEP", color: "primary" },
      badge2: { label: "CJA", color: "secondary" },
      title: "AEP → CJA",
      subtitle: "Cross-Channel Analytics on Unified Data",
      description: "Customer Journey Analytics (CJA) reads directly from AEP datasets to provide Analysis Workspace-style reporting on cross-channel, identity-stitched data — without the limitations of traditional Adobe Analytics.",
      highlights: [
        { icon: "📊", label: "Full Data Lake", detail: "Query any AEP dataset — not just Analytics hits" },
        { icon: "🔗", label: "Cross-Device Stitching", detail: "CJA uses AEP identity to stitch sessions across devices" },
      ],
      mentalModel: "CJA is the reporting layer on top of AEP's data lake. Unlike traditional Analytics which has its own data pipeline, CJA reads AEP datasets directly via Connections, maps them to a Data View (virtual report suite), and lets analysts explore in Workspace. This means any data in AEP — web, mobile, CRM, call center, POS — becomes queryable in a single analytics interface.",
    },
    architecture: {
      sectionLabel: "Data Pipeline",
      title: "How AEP Data Powers CJA",
      description: "CJA doesn't copy data from AEP — it reads datasets directly via Connections and applies Data View transformations at query time.",
      pipeline: [
        { label: "AEP Datasets", description: "ExperienceEvent + Profile datasets in the data lake", badge: "AEP", badgeColor: "primary" },
        { label: "CJA Connection", description: "Selects which datasets to include, enables backfill", badge: "CJA", badgeColor: "secondary" },
        { label: "Identity Stitching", description: "Cross-device identity resolution using AEP graph", badge: "CJA", badgeColor: "secondary" },
        { label: "Data View", description: "Virtual report suite — maps XDM fields to dimensions/metrics", badge: "CJA", badgeColor: "secondary" },
        { label: "Workspace", description: "Drag-and-drop analysis, panels, visualizations", badge: "CJA", badgeColor: "secondary" },
      ],
    },
    concepts: [
      { title: "Connections", content: "A CJA Connection defines which AEP datasets to pull in. You select one or more datasets (e.g., Web SDK events, CRM records, call center logs), set a backfill window, and CJA begins indexing. Connections support both ExperienceEvent (time-series) and Profile (lookup) datasets. Once connected, data flows automatically as new records arrive in AEP." },
      { title: "Data Views", content: "A Data View is like a virtual report suite. It sits on top of a Connection and defines how XDM fields map to analytics dimensions and metrics. You can rename fields, apply formatting (currency, percentage), create derived fields (CASE WHEN logic), set attribution models, and filter data — all without modifying the underlying AEP data." },
      { title: "Cross-Channel Stitching", content: "CJA's stitching uses AEP's identity graph to merge anonymous (ECID-based) and authenticated (email, CRM ID) sessions into a single person's journey. Field-based stitching uses a chosen identifier; graph-based stitching leverages AEP Identity Service. Stitching runs retrospectively — it can fix past sessions when a user later authenticates." },
      { title: "Derived Fields", content: "Derived Fields let you create new dimensions/metrics at query time using a visual function builder. Examples: CASE WHEN page URL contains '/checkout' → 'Checkout Step', CONCAT first_name + last_name, LOOKUP against a reference dataset. This eliminates the need to re-process data in AEP for reporting transformations." },
      { title: "Audiences in CJA", content: "CJA can publish audiences back to RTCDP. When you identify an interesting cohort in Workspace (e.g., users who dropped off at step 3 of checkout), you can save it as an audience. CJA pushes this audience definition back to AEP's Real-Time Profile, making it available for activation in RTCDP and AJO." },
    ],
    comparisons: [
      {
        title: "CJA vs. Traditional Adobe Analytics",
        description: "Understanding the paradigm shift from prop/eVar-based analytics to XDM-based cross-channel analysis.",
        items: [
          { icon: "🆕", label: "CJA (XDM-Based)", description: "Reads from AEP data lake with unlimited dimensions, cross-channel data, and flexible schemas.", points: ["No prop/eVar limits — any XDM field is a dimension", "Cross-channel: web + app + CRM + call center in one view", "Identity stitching: merge anonymous + known sessions", "Derived fields: query-time transformations", "Audience publishing back to RTCDP"] },
          { icon: "📉", label: "Adobe Analytics (Legacy)", description: "Separate data pipeline with fixed schema, limited to web/app data.", points: ["75 props + 250 eVars per report suite", "Primarily web + mobile app data", "Device-based reporting (limited cross-device)", "Processing rules: transform at collection time", "Segments stay within Analytics ecosystem"] },
        ],
        tip: "CJA is the strategic replacement for Adobe Analytics. New implementations should go directly to CJA via Web SDK + AEP. Existing AA customers can run both in parallel during migration.",
      },
    ],
    codeExamples: [
      { title: "CJA Connection Configuration", language: "json", code: `{
  "connectionName": "Production - All Channels",
  "sandboxId": "prod",
  "datasets": [
    {
      "datasetId": "web-sdk-events",
      "type": "event",
      "personId": "identityMap.ECID",
      "timestamp": "timestamp",
      "backfill": "13_months"
    },
    {
      "datasetId": "crm-profile-records",
      "type": "lookup",
      "matchKey": "identityMap.CRMId"
    },
    {
      "datasetId": "call-center-interactions",
      "type": "event",
      "personId": "identityMap.PhoneNumber",
      "backfill": "3_months"
    }
  ],
  "stitching": {
    "type": "graph-based",
    "namespace": "ECID",
    "identityGraph": "production-graph"
  }
}` },
      { title: "Data View — Derived Field Example", language: "json", code: `{
  "derivedField": {
    "name": "Funnel Step",
    "type": "CASE_WHEN",
    "rules": [
      { "when": "page_url CONTAINS '/cart'", "then": "1. Cart" },
      { "when": "page_url CONTAINS '/checkout/shipping'", "then": "2. Shipping" },
      { "when": "page_url CONTAINS '/checkout/payment'", "then": "3. Payment" },
      { "when": "page_url CONTAINS '/order-confirmation'", "then": "4. Confirmation" },
      { "default": "Other" }
    ]
  }
}` },
      { title: "Web SDK Event Feeding CJA", language: "javascript", code: `// This event lands in AEP → CJA reads it via Connection
alloy("sendEvent", {
  xdm: {
    eventType: "web.webpagedetails.pageViews",
    web: {
      webPageDetails: {
        name: "Product Detail - Running Shoes",
        URL: "https://shop.example.com/products/running-shoes",
        siteSection: "Products"
      }
    },
    commerce: {
      productViews: { value: 1 }
    },
    productListItems: [{
      SKU: "RS-100",
      name: "Running Shoes Pro",
      priceTotal: 129.99
    }]
  }
});` },
    ],
    glossary: [
      { title: "CJA Terms", color: "secondary", terms: [
        { term: "Connection", definition: "Links AEP datasets to CJA for analysis" },
        { term: "Data View", definition: "Virtual report suite mapping XDM fields to dimensions/metrics" },
        { term: "Derived Field", definition: "Query-time transformation creating new dimensions from existing data" },
        { term: "Stitching", definition: "Cross-device identity resolution merging anonymous + known sessions" },
        { term: "Workspace", definition: "Drag-and-drop analysis interface with panels and visualizations" },
        { term: "Fallout", definition: "Visualization showing drop-off rates between funnel steps" },
        { term: "Flow", definition: "Visualization showing paths users take between pages/events" },
        { term: "Audience Publishing", definition: "Pushing CJA cohorts back to RTCDP as activatable audiences" },
      ]},
      { title: "AEP Terms", color: "primary", terms: [
        { term: "Dataset", definition: "Storage container for records conforming to an XDM schema" },
        { term: "ExperienceEvent", definition: "Time-series schema for behavioral data (clicks, purchases, calls)" },
        { term: "Profile Schema", definition: "Record-based schema for static attributes (name, tier, preferences)" },
        { term: "Identity Graph", definition: "Maps multiple identifiers to a single person for stitching" },
      ]},
    ],
    tips: [
      "CJA reads AEP data directly — no ETL or data copy needed. Changes in AEP flow through automatically.",
      "Use Data Views to create different 'lenses' on the same Connection — e.g., Marketing view vs. Product view",
      "Graph-based stitching gives better cross-device resolution than field-based, but requires AEP Identity Service",
      "Derived Fields replace the need for processing rules and classification files from legacy Analytics",
    ],
    whenToUse: [
      "You need cross-channel analytics combining web, app, CRM, and offline data in a single view",
      "Traditional Adobe Analytics prop/eVar limits are blocking your analysis needs",
      "You want to leverage AEP's identity graph for cross-device session stitching",
      "Analysts need to create audience definitions and push them back to RTCDP for activation",
      "You need query-time data transformations without re-processing upstream data",
    ],
  },

  "rtcdp-destinations": {
    id: "rtcdp-destinations",
    hero: {
      badge1: { label: "RTCDP", color: "secondary" },
      badge2: { label: "DST", color: "accent" },
      title: "RTCDP → Destinations",
      subtitle: "Segment Activation Across the Ecosystem",
      description: "RTCDP destinations are the exit points for your audience segments. Activate profiles to advertising platforms, email services, cloud storage, personalization engines, and custom APIs — all with governance controls enforced automatically.",
      highlights: [
        { icon: "📡", label: "100+ Destinations", detail: "Google, Meta, Salesforce, Braze, S3, custom webhooks" },
        { icon: "🔒", label: "Governance Enforced", detail: "DULE labels block sensitive data at export time" },
      ],
      mentalModel: "Think of RTCDP as the central hub with spokes extending to every channel. You build segments once, then activate them to multiple destinations simultaneously. RTCDP handles identity matching (hashing emails for ad platforms), data formatting (CSV for cloud storage, API calls for streaming), and governance (blocking PII to non-compliant destinations).",
    },
    architecture: {
      sectionLabel: "Activation Pipeline",
      title: "From Segment to Destination",
      description: "Segments are evaluated, governance policies are checked, identities are mapped, and data is exported in the format each destination expects.",
      pipeline: [
        { label: "Segment Evaluation", description: "Streaming, batch, or edge evaluation qualifies profiles", badge: "RTCDP", badgeColor: "secondary" },
        { label: "Governance Check", description: "DULE labels validated against destination marketing actions", badge: "RTCDP", badgeColor: "secondary" },
        { label: "Identity Mapping", description: "Map source identities to destination identifiers (email → hashed email)", badge: "RTCDP", badgeColor: "secondary" },
        { label: "Data Formatting", description: "Payload shaped to destination requirements (JSON, CSV, API)", badge: "RTCDP", badgeColor: "secondary" },
        { label: "Delivery", description: "Profiles exported via streaming API, batch file, or webhook", badgeColor: "muted" },
      ],
    },
    concepts: [
      { title: "Destination Types", content: "RTCDP destinations fall into categories: Advertising (Google Ads, Meta, TikTok — for audience matching), Marketing Automation (Braze, Salesforce MC — for campaign triggers), Cloud Storage (S3, Azure Blob, SFTP — for batch file delivery), Personalization (Target, Custom Personalization — for real-time decisioning), and Social (Facebook, LinkedIn — for social campaigns)." },
      { title: "Streaming vs. File-Based Export", content: "Streaming destinations receive profile updates in real-time via API calls as segment membership changes. File-based destinations receive periodic batch exports (CSV/Parquet files) on a schedule. Streaming is ideal for ad platforms needing fresh audiences; file-based works for CRM syncs, data warehouses, and partner data shares." },
      { title: "Identity Mapping", content: "Each destination requires specific identity namespaces. When activating to Google Ads, you map your Email namespace to Google's hashed email format. RTCDP handles SHA-256 hashing automatically. For mobile ad platforms, you map IDFA/GAID. Custom destinations can use any namespace. Unmatchable profiles are excluded from export." },
      { title: "Dataflow Monitoring", content: "Every segment activation creates a dataflow that can be monitored in the RTCDP UI. You can see: profiles evaluated, profiles qualified, profiles exported, errors/skipped records, and export timestamps. Failed records show specific error reasons (identity mismatch, governance block, rate limit exceeded)." },
    ],
    comparisons: [
      {
        title: "Streaming vs. File-Based Destinations",
        description: "Choose based on destination capabilities and freshness requirements.",
        items: [
          { icon: "⚡", label: "Streaming Destinations", description: "Real-time API-based delivery as segment membership changes.", points: ["Google Ads, Meta Custom Audiences, TikTok", "Profile updates delivered within minutes", "Incremental updates (only changed profiles)", "Rate-limited by destination API quotas", "Best for: ad platform audience sync, real-time personalization"] },
          { icon: "📁", label: "File-Based Destinations", description: "Scheduled batch exports as CSV/Parquet/JSON files.", points: ["S3, Azure Blob, SFTP, Google Cloud Storage", "Full or incremental snapshot on schedule", "Supports large volumes (millions of profiles per export)", "Configurable file formatting and compression", "Best for: data warehouse sync, partner data shares, CRM imports"] },
        ],
        tip: "Streaming destinations have rate limits — large initial syncs may take hours. File-based destinations handle bulk better but aren't real-time.",
      },
    ],
    codeExamples: [
      { title: "Destination Configuration — Google Ads Customer Match", language: "json", code: `{
  "destinationId": "google-customer-match",
  "connectionSpec": "google-ads-v2",
  "segments": [
    { "segmentId": "high-value-cart-abandoners", "mappingId": "map-001" },
    { "segmentId": "loyalty-gold-members", "mappingId": "map-002" }
  ],
  "identityMapping": {
    "sourceNamespace": "Email",
    "targetNamespace": "google_hashed_email",
    "hashFunction": "SHA256",
    "normalization": "lowercase_trim"
  },
  "schedule": {
    "type": "streaming",
    "frequency": "on_segment_change"
  },
  "governance": {
    "enforcedLabels": ["C1", "C5"],
    "blockedFields": ["personalEmail.address"]
  }
}` },
      { title: "File-Based Export — S3 Configuration", language: "json", code: `{
  "destinationId": "s3-data-warehouse",
  "bucket": "my-company-audiences",
  "path": "/rtcdp-exports/{SEGMENT_NAME}/{DATETIME}",
  "fileFormat": {
    "type": "CSV",
    "delimiter": ",",
    "compression": "GZIP",
    "quoteAll": true
  },
  "schedule": {
    "type": "batch",
    "frequency": "daily",
    "startTime": "02:00 UTC"
  },
  "exportMode": "incremental",
  "includedAttributes": [
    "person.name.firstName",
    "personalEmail.address",
    "segmentMembership",
    "loyalty.tier"
  ]
}` },
    ],
    glossary: [
      { title: "Destination Terms", color: "accent", terms: [
        { term: "Destination", definition: "External platform where RTCDP exports audience segments" },
        { term: "Dataflow", definition: "A configured pipeline moving segment data to a specific destination" },
        { term: "Identity Mapping", definition: "Translation of AEP namespaces to destination-specific identifiers" },
        { term: "Export Mode", definition: "Full snapshot (all profiles) vs. incremental (only changes)" },
        { term: "Marketing Action", definition: "A governance label defining allowed data uses per destination" },
        { term: "Connection Spec", definition: "The technical blueprint for connecting to a specific destination type" },
        { term: "Activation", definition: "The process of sending segment profiles to a destination" },
      ]},
      { title: "RTCDP Terms", color: "secondary", terms: [
        { term: "Segment", definition: "A named audience defined by profile attributes and behavioral rules" },
        { term: "DULE Label", definition: "Data governance tag restricting field usage in exports" },
        { term: "Merge Policy", definition: "Rules for combining profile fragments from different sources" },
      ]},
    ],
    tips: [
      "Always test with a small test segment before activating large audiences to production destinations",
      "Use governance labels proactively — they prevent accidental PII leaks to non-compliant destinations",
      "Streaming destinations have rate limits; large initial segment syncs may take hours to complete",
      "File-based exports support scheduling — use incremental mode to minimize file sizes",
    ],
    whenToUse: [
      "You need to push audience segments to advertising platforms for targeted campaigns",
      "Marketing automation tools (Braze, SFMC) need audience lists from your CDP",
      "Data warehouse or analytics teams need periodic audience snapshots via cloud storage",
      "You want a single, governed pipeline for exporting audience data to multiple channels",
    ],
  },

  "cja-rtcdp": {
    id: "cja-rtcdp",
    hero: {
      badge1: { label: "CJA", color: "secondary" },
      badge2: { label: "RTCDP", color: "primary" },
      title: "CJA → RTCDP",
      subtitle: "Publishing Computed Audiences for Activation",
      description: "CJA can publish audiences discovered during analysis back to RTCDP for activation. Found an interesting cohort in Workspace? Push it to RTCDP and activate it across destinations — closing the loop between insight and action.",
      highlights: [
        { icon: "💡", label: "Insight → Action", detail: "Discover cohorts in analytics, activate them instantly" },
        { icon: "🔄", label: "Continuous Refresh", detail: "Published audiences auto-refresh as data updates" },
      ],
      mentalModel: "CJA is where analysts explore data and discover 'who are these users?' moments. When they find a valuable cohort (e.g., users who viewed 3+ products but never added to cart), they can publish it as an audience. CJA writes this audience back to AEP's Real-Time Profile, making it available in RTCDP for segment activation and in AJO for journey targeting.",
    },
    architecture: {
      sectionLabel: "Audience Pipeline",
      title: "From CJA Insight to RTCDP Activation",
      description: "Audiences flow from CJA's analysis workspace back into AEP's profile store, where RTCDP can activate them.",
      pipeline: [
        { label: "Workspace Analysis", description: "Analyst discovers a cohort through exploration", badge: "CJA", badgeColor: "secondary" },
        { label: "Audience Definition", description: "Define audience criteria from analysis filters", badge: "CJA", badgeColor: "secondary" },
        { label: "Publish to AEP", description: "CJA writes audience membership to Real-Time Profile", badge: "AEP", badgeColor: "primary" },
        { label: "RTCDP Segment", description: "Audience appears as a segment available for activation", badge: "RTCDP", badgeColor: "primary" },
        { label: "Destination Activation", description: "Segment pushed to ad platforms, email, personalization", badgeColor: "muted" },
      ],
    },
    concepts: [
      { title: "Audience Publishing", content: "CJA audiences are published to AEP as real-time segments. The audience definition (filter criteria from Workspace) is converted to segment rules that AEP's segmentation engine evaluates. Audiences can be one-time (static snapshot) or recurring (refreshed at configurable intervals — typically every 4 hours)." },
      { title: "Audience Refresh Cadence", content: "Published audiences are not static exports. CJA can refresh the audience membership on a recurring schedule (every 4 hours by default). As new data arrives in AEP and flows through the CJA Connection, the audience is re-evaluated and membership updated automatically. This means RTCDP destinations always have fresh audience data." },
      { title: "Filter-Based Audiences", content: "CJA audiences are defined using the same filter logic available in Workspace: sequential filters (did A then B), time-constrained filters (within 7 days), and nested filters (AND/OR combinations). This makes it easy to go from 'I see an interesting pattern in this fallout' to 'let me activate this group.'" },
      { title: "Audience Limitations", content: "CJA audiences have some constraints: maximum of 75 active audiences per Connection, audience refresh takes ~4 hours for recurring audiences, and the audience definition must map to AEP-compatible segment rules. Complex derived field logic may not translate directly to RTCDP PQL rules." },
    ],
    comparisons: [
      {
        title: "CJA Audiences vs. RTCDP Native Segments",
        description: "Both produce activatable audiences, but they're created in different contexts with different strengths.",
        items: [
          { icon: "📊", label: "CJA Audiences", description: "Born from analysis — discovered through data exploration in Workspace.", points: ["Created by analysts during exploration", "Can use cross-channel stitched data", "Refresh cadence: ~4 hours", "Max 75 active audiences per Connection", "Best for: analytically-derived cohorts"] },
          { icon: "🎯", label: "RTCDP Native Segments", description: "Built by marketers in the Segment Builder with real-time evaluation.", points: ["Created by marketers using Segment Builder UI", "Real-time streaming evaluation available", "No limit on active segments", "Full PQL expression support", "Best for: operational segments with real-time needs"] },
        ],
        tip: "Use CJA audiences for discovery-driven cohorts ('I found something interesting'). Use RTCDP native segments for operational audiences that need real-time evaluation.",
      },
    ],
    codeExamples: [
      { title: "CJA Audience Configuration", language: "json", code: `{
  "audienceName": "High Intent - Cart Viewers Without Purchase",
  "connection": "production-all-channels",
  "dataView": "marketing-view",
  "definition": {
    "filters": [
      { "type": "event", "event": "commerce.productViews", "count": ">= 3", "window": "7_days" },
      { "type": "event", "event": "commerce.productListAdds", "count": ">= 1", "window": "7_days" },
      { "type": "exclude", "event": "commerce.purchases", "window": "7_days" }
    ],
    "logic": "include_all AND exclude_all"
  },
  "publishSettings": {
    "target": "AEP_RTCDP",
    "refreshCadence": "every_4_hours",
    "namespace": "ECID"
  }
}` },
      { title: "Published Audience in AEP Profile", language: "json", code: `{
  "segmentMembership": {
    "cja_audiences": {
      "high-intent-cart-viewers": {
        "status": "realized",
        "lastQualificationTime": "2024-01-15T14:00:00Z",
        "source": "CJA",
        "audienceId": "cja-aud-12345",
        "refreshedAt": "2024-01-15T14:00:00Z"
      }
    }
  }
}` },
    ],
    glossary: [
      { title: "CJA Terms", color: "secondary", terms: [
        { term: "Audience Publishing", definition: "Pushing CJA-discovered cohorts to AEP as activatable segments" },
        { term: "Filter", definition: "CJA's equivalent of a segment rule — defines audience criteria" },
        { term: "Sequential Filter", definition: "Defines ordered event sequences (did A then B)" },
        { term: "Refresh Cadence", definition: "How often a published audience re-evaluates membership" },
        { term: "Workspace", definition: "CJA's analysis interface for drag-and-drop exploration" },
      ]},
      { title: "RTCDP Terms", color: "primary", terms: [
        { term: "Segment", definition: "An activatable audience in RTCDP" },
        { term: "Activation", definition: "Exporting segment profiles to a destination" },
        { term: "PQL", definition: "Profile Query Language for defining segment rules" },
      ]},
    ],
    tips: [
      "CJA audiences auto-refresh every 4 hours — no manual re-publishing needed",
      "Use CJA audiences for complex analytically-derived cohorts that are hard to express in RTCDP's Segment Builder",
      "Max 75 active audiences per CJA Connection — prioritize high-value cohorts",
      "Published audiences appear alongside native RTCDP segments and can be activated to any destination",
    ],
    whenToUse: [
      "Analysts discover a valuable cohort during exploration and want to activate it immediately",
      "You need cross-channel audience definitions that span web + app + CRM + offline data",
      "Sequential behavior patterns (did A then B within 7 days) are central to the audience logic",
      "You want analytics-driven audience creation without requiring marketers to rebuild in RTCDP",
    ],
  },

  "ajo-cja": {
    id: "ajo-cja",
    hero: {
      badge1: { label: "AJO", color: "secondary" },
      badge2: { label: "CJA", color: "primary" },
      title: "AJO → CJA",
      subtitle: "Journey & Campaign Analytics",
      description: "AJO writes all journey and campaign interaction events back to AEP as ExperienceEvents. CJA reads these events for deep-dive analysis — going far beyond AJO's built-in reporting with custom attribution, cross-channel correlation, and cohort analysis.",
      highlights: [
        { icon: "📧", label: "Message Events", detail: "Sends, opens, clicks, bounces, unsubscribes" },
        { icon: "📈", label: "Advanced Analysis", detail: "Attribution, funnel, cohort analysis in CJA Workspace" },
      ],
      mentalModel: "AJO's built-in reports show you surface-level metrics: delivery rates, open rates, click rates. But for real analysis — which journey drives the most revenue? How do email-engaged users behave differently across channels? — you need CJA. AJO writes all interaction events as AEP ExperienceEvents, and CJA picks them up through its Connection to provide Workspace-level analysis.",
    },
    architecture: {
      sectionLabel: "Reporting Pipeline",
      title: "From Journey Interaction to CJA Analysis",
      description: "Every AJO action generates ExperienceEvents in AEP, which CJA reads for analysis.",
      pipeline: [
        { label: "AJO Action", description: "Email sent, push delivered, SMS sent", badge: "AJO", badgeColor: "secondary" },
        { label: "Interaction Event", description: "User opens, clicks, or ignores the message", badgeColor: "muted" },
        { label: "AEP ExperienceEvent", description: "Event written to AEP dataset with full context", badge: "AEP", badgeColor: "primary" },
        { label: "CJA Connection", description: "AJO events included in CJA Connection", badge: "CJA", badgeColor: "primary" },
        { label: "Workspace Analysis", description: "Custom reports, attribution, funnel, cohort analysis", badge: "CJA", badgeColor: "primary" },
      ],
    },
    concepts: [
      { title: "AJO Event Schema", content: "AJO writes events using specific XDM field groups: _experience.customerJourneyManagement covers message delivery, feedback (opens/clicks/bounces), and journey step events. Each event includes the journeyVersionId, journeyActionId, messageId, and channel — enabling CJA to break down performance by journey, step, and channel." },
      { title: "Message Feedback Events", content: "AJO generates feedback events for every message interaction: send, delivered, open, click, bounce (hard/soft), unsubscribe, spam complaint. These events arrive in AEP within minutes (email opens depend on pixel loading). CJA can use these to build engagement funnels: sent → delivered → opened → clicked → converted." },
      { title: "Cross-Channel Attribution", content: "CJA's attribution models (first touch, last touch, linear, time decay, algorithmic) can be applied to AJO interactions alongside web/app data. This answers: 'Did the recovery email actually drive the purchase, or did the user come back organically?' CJA can correlate AJO message clicks with downstream conversion events from web/app." },
      { title: "Journey Step Events", content: "Beyond message interactions, AJO writes journey lifecycle events: journey entry, step executed, condition evaluated, wait completed, journey exit. CJA can use these to analyze journey completion rates, drop-off points, and average time-to-completion — insights not available in AJO's built-in reports." },
    ],
    comparisons: [
      {
        title: "AJO Built-in Reports vs. CJA Analysis",
        description: "AJO's reporting is operational; CJA's analysis is strategic.",
        items: [
          { icon: "📊", label: "AJO Built-in Reports", description: "Quick operational metrics for day-to-day campaign monitoring.", points: ["Pre-built dashboards (delivery, engagement, conversion)", "Real-time data (minutes delay)", "Limited to AJO-specific metrics", "No cross-channel correlation", "Best for: daily monitoring, delivery health checks"] },
          { icon: "🔬", label: "CJA Advanced Analysis", description: "Deep analytical exploration across all channels and touchpoints.", points: ["Custom dimensions, metrics, and calculated fields", "Cross-channel correlation (email + web + app)", "Attribution modeling (first/last/linear/algorithmic)", "Cohort analysis, sequential segmentation", "Best for: strategic analysis, ROI measurement, optimization"] },
        ],
        tip: "Use AJO reports for operational monitoring. Use CJA for strategic questions like 'which journey drives the most incremental revenue?'",
      },
    ],
    codeExamples: [
      { title: "AJO Message Feedback Event (in AEP)", language: "json", code: `{
  "eventType": "message.feedback",
  "timestamp": "2024-01-15T14:35:00Z",
  "_experience": {
    "customerJourneyManagement": {
      "messageExecution": {
        "messageExecutionID": "msg-exec-12345",
        "journeyVersionID": "jv-cart-abandon-v2",
        "journeyActionID": "action-recovery-email"
      },
      "messageDeliveryFeedback": {
        "feedbackStatus": "delivered",
        "messageFailure": null
      },
      "emailInteraction": {
        "opens": 1,
        "clicks": 1,
        "clickedURL": "https://shop.example.com/cart?utm_source=ajo"
      }
    }
  },
  "identityMap": {
    "Email": [{ "id": "user@example.com" }]
  }
}` },
      { title: "CJA Calculated Metric — Email-to-Purchase Rate", language: "json", code: `{
  "calculatedMetric": {
    "name": "Email Click-to-Purchase Rate",
    "formula": "purchases_within_24h_of_email_click / email_clicks * 100",
    "filters": [
      { "dimension": "channel", "value": "email" },
      { "dimension": "journey_name", "value": "Cart Abandonment Recovery v2" }
    ],
    "attribution": {
      "model": "time_decay",
      "lookbackWindow": "7_days"
    }
  }
}` },
    ],
    glossary: [
      { title: "AJO Event Terms", color: "secondary", terms: [
        { term: "Message Feedback", definition: "Events tracking message delivery status and user interactions" },
        { term: "Journey Step Event", definition: "Lifecycle events for each step a profile passes through in a journey" },
        { term: "Feedback Status", definition: "Delivery outcome: sent, delivered, bounced, suppressed" },
        { term: "Message Execution ID", definition: "Unique identifier for a specific message send within a journey" },
      ]},
      { title: "CJA Analysis Terms", color: "primary", terms: [
        { term: "Attribution Model", definition: "Rules for assigning conversion credit across touchpoints" },
        { term: "Cohort Analysis", definition: "Grouping users by shared traits and tracking behavior over time" },
        { term: "Calculated Metric", definition: "Custom metric derived from formulas on existing metrics" },
        { term: "Sequential Filter", definition: "Filter requiring events in a specific order" },
      ]},
    ],
    tips: [
      "AJO events arrive in AEP within minutes — CJA Connection picks them up automatically",
      "Use CJA's attribution models to measure true incremental impact of AJO messages vs. organic behavior",
      "Build journey completion funnels in CJA: entry → step 1 → step 2 → ... → conversion",
      "Correlate AJO email clicks with web conversion events to measure end-to-end ROI",
    ],
    whenToUse: [
      "You need attribution analysis beyond AJO's last-click built-in reporting",
      "Cross-channel impact of AJO messages needs to be measured (email → web → purchase)",
      "Journey completion rates and drop-off analysis across multiple steps",
      "Cohort analysis: how do email-engaged users behave differently over time?",
    ],
  },
};
