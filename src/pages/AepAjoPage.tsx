import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, Lightbulb, ChevronRight, ArrowRight, Zap, Calendar, Globe, Brain } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// ─── Copy Button ───
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

const CodeBlock = ({ title, language, code }: { title: string; language: string; code: string }) => (
  <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
    <div className="px-4 py-2.5 border-b border-border bg-muted/50 flex items-center justify-between">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">{language}</span>
    </div>
    <div className="relative">
      <CopyButton text={code} />
      <pre className="p-4 text-sm overflow-x-auto bg-[hsl(220,25%,6%)]">
        <code className="font-mono text-[hsl(220,15%,80%)] whitespace-pre leading-relaxed">{code}</code>
      </pre>
    </div>
  </div>
);

// ─── Section Nav ───
const sections = [
  { id: "overview", label: "Overview" },
  { id: "data-flow", label: "AEP Data Flow" },
  { id: "segmentation", label: "Segmentation" },
  { id: "ajo-journeys", label: "AJO Journeys" },
  { id: "use-cases", label: "Use Cases" },
  { id: "glossary", label: "Glossary" },
];

const SectionNav = ({ activeSection }: { activeSection: string }) => (
  <nav className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-1 overflow-x-auto py-1">
        <Link to="/" className="shrink-0 mr-4 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft size={14} /> Home
        </Link>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className={`shrink-0 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === s.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  </nav>
);

// ─── Glossary Term ───
const GlossaryTerm = ({ term, definition, color }: { term: string; definition: string; color: "blue" | "red" }) => {
  const [show, setShow] = useState(false);
  const colorClass = color === "blue" ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" : "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20";
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${colorClass}`}
      >
        {term}
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg text-xs leading-relaxed z-30">
          <p className="font-semibold mb-1">{term}</p>
          <p className="text-muted-foreground">{definition}</p>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ───
const AepAjoPage = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [activeIngestionTab, setActiveIngestionTab] = useState<"websdk" | "batch" | "streaming">("websdk");
  const [activeSegmentTab, setActiveSegmentTab] = useState<"ecommerce" | "travel">("ecommerce");
  const [activeActivityTab, setActiveActivityTab] = useState<"events" | "orchestration" | "actions">("events");
  const [activeActivityDetail, setActiveActivityDetail] = useState("audience-qual");

  // Intersection observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SectionNav activeSection={activeSection} />

      {/* ════════════════════════════════════════════════
          SECTION 1: HERO / OVERVIEW
          ════════════════════════════════════════════════ */}
      <section id="overview" className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Logo badge */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">AEP</div>
            <span className="text-2xl text-muted-foreground font-light">+</span>
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-lg shadow-lg">AJO</div>
            <span className="ml-2 text-lg font-semibold text-muted-foreground">Developer Guide</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2">Understanding AEP + AJO</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6">A Developer's Visual Guide</p>
          <p className="text-base text-muted-foreground max-w-3xl leading-relaxed mb-8">
            Explore how data flows from raw sources into Adobe Experience Platform — where it's ingested, unified, and segmented — then activates personalized experiences through Adobe Journey Optimizer.
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-5 py-3">
              <span className="text-lg font-semibold text-primary">AEP</span>
              <span className="text-sm text-muted-foreground">= the brain (data + intelligence)</span>
            </div>
            <div className="flex items-center gap-3 bg-secondary/5 border border-secondary/20 rounded-xl px-5 py-3">
              <span className="text-lg font-semibold text-secondary">AJO</span>
              <span className="text-sm text-muted-foreground">= the hands (execution + delivery)</span>
            </div>
          </div>

          {/* Use case badges */}
          <div className="flex flex-wrap gap-4 mb-12">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-start gap-3 max-w-xs">
              <span className="text-2xl">🛒</span>
              <div>
                <p className="font-semibold text-foreground text-sm">E-commerce</p>
                <p className="text-xs text-muted-foreground">Cart abandonment journeys</p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-start gap-3 max-w-xs">
              <span className="text-2xl">✈️</span>
              <div>
                <p className="font-semibold text-foreground text-sm">Travel</p>
                <p className="text-xs text-muted-foreground">Loyalty re-engagement</p>
              </div>
            </div>
          </div>

          {/* Ecosystem overview */}
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ecosystem Overview</h2>
          <h3 className="text-2xl font-bold text-foreground mb-4">The Big Picture</h3>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            AEP collects, unifies, and segments customer data. AJO activates that intelligence into real-time, personalized experiences. Together they form a closed loop.
          </p>

          {/* 3-block pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 mb-12">
            {[
              { label: "Raw Data Sources", sub: "Web SDK · Batch · Streaming API", color: "border-muted-foreground/30 bg-muted/30", badge: "" },
              { label: "AEP", sub: "Ingest → Schema → Profile → Segments", color: "border-primary/40 bg-primary/5", badge: "AEP" },
              { label: "AJO", sub: "Journeys · Campaigns · Actions", color: "border-secondary/40 bg-secondary/5", badge: "AJO" },
            ].map((block, i) => (
              <div key={i} className="flex items-center">
                <div className={`flex-1 rounded-xl border-2 ${block.color} p-6 text-center hover:shadow-md transition-shadow`}>
                  {block.badge && (
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 ${block.badge === "AEP" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{block.badge}</span>
                  )}
                  <p className="font-semibold text-foreground">{block.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{block.sub}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex items-center px-2">
                    <ArrowRight size={20} className="text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Developer mental model */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={18} className="text-primary" />
              <h4 className="font-semibold text-foreground text-sm">Developer Mental Model</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Think of AEP as the intelligence layer — it ingests events from your web/mobile properties via the <code className="text-primary font-mono text-xs">alloy.js</code> SDK, normalizes them against XDM schemas, builds unified customer profiles, and evaluates segment membership in real-time. AJO then reads those audiences and triggers journeys or campaigns — sending emails, SMS, push, or calling custom endpoints — and writes interaction events back to AEP to close the loop.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 2: DATA INGESTION
          ════════════════════════════════════════════════ */}
      <section id="data-flow" className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">AEP · Step 1</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">Data Ingestion</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Three lanes carry data into AEP. Each is normalized against an XDM schema before merging into the Real-Time Customer Profile.
          </p>

          {/* Info callout */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-8 max-w-3xl">
            <div className="flex items-start gap-2">
              <Lightbulb size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm mb-1">Why does the JSON structure change?</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-muted-foreground">
                  <div><span className="font-semibold text-foreground">Web SDK (alloy.js)</span><br />Uses <code className="text-primary">"xdm":</code> wrapper. Metadata (OrgID, Schema) is handled by the Datastream config.</div>
                  <div><span className="font-semibold text-foreground">Batch Ingestion</span><br />Flat JSON. No wrapper needed because Metadata is provided externally via the Batch API/Dataset ID.</div>
                  <div><span className="font-semibold text-foreground">Streaming API</span><br />Wrapped JSON. Each message is independent and must include a header with the Schema Reference.</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Lane Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: "🌐", title: "Web / Mobile SDK", sub: "alloy.js / Adobe Experience SDK", desc: "Real-time behavioral events triggered by user actions in the browser or app", tab: "websdk" as const },
              { icon: "📦", title: "Batch Ingestion", sub: "SFTP / S3 / API · CSV / Parquet", desc: "Historical CRM records, purchase history, loyalty data — scheduled daily/hourly", tab: "batch" as const },
              { icon: "⚡", title: "Streaming API", sub: "HTTP Data Collection API / Kafka", desc: "Transactional events from backend systems — order confirmations, payments, status updates", tab: "streaming" as const },
            ].map(lane => (
              <button
                key={lane.tab}
                onClick={() => setActiveIngestionTab(lane.tab)}
                className={`rounded-xl border-2 p-6 text-left transition-all hover:shadow-md ${activeIngestionTab === lane.tab ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card"}`}
              >
                <span className="text-3xl block mb-3">{lane.icon}</span>
                <p className="font-semibold text-foreground mb-1">{lane.title}</p>
                <p className="text-xs text-muted-foreground font-mono mb-2">{lane.sub}</p>
                <p className="text-sm text-muted-foreground">{lane.desc}</p>
              </button>
            ))}
          </div>

          {/* XDM + Profile pipeline below lanes */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>↓</span><span>↓</span><span>↓</span>
            </div>
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 w-full max-w-lg text-center">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold mb-2 text-lg">X</span>
              <p className="font-semibold text-foreground">XDM Schema</p>
              <p className="text-xs text-muted-foreground mt-1">Experience Data Model — standardizes all incoming data</p>
              <p className="text-xs text-muted-foreground mt-2">Every data source maps its fields to a standard XDM schema (e.g., XDM ExperienceEvent or XDM Individual Profile). This ensures all data speaks the same language before merging.</p>
            </div>
            <span className="text-muted-foreground">↓</span>
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 w-full max-w-lg text-center">
              <span className="text-2xl block mb-2">👤</span>
              <p className="font-semibold text-foreground">Real-Time Customer Profile</p>
              <p className="text-xs text-muted-foreground mt-1">Unified stitched view of a customer across all touchpoints</p>
            </div>
          </div>

          {/* Code sample for selected lane */}
          {activeIngestionTab === "websdk" && (
            <CodeBlock
              title="Web SDK · alloy.js — Product Add Event"
              language="javascript"
              code={`alloy("sendEvent", {
  xdm: {
    eventType: "commerce.productListAdds",
    productListItems: [{
      SKU: "BAG-501",
      name: "Premium Weekender Bag",
      priceTotal: 249.00,
      quantity: 1
    }],
    identityMap: {
      ECID: [{ id: "ecid-abc123", primary: true }]
    }
  }
})`}
            />
          )}
          {activeIngestionTab === "batch" && (
            <CodeBlock
              title="Batch Ingestion · Sample Payload"
              language="json"
              code={`// 1. Create Batch (Server-Side API)
// POST https://platform.adobe.io/data/foundation/import/batches
// Body: { "datasetId": "ds-loyalty-records" }

// 2. Upload File (Flat JSON/CSV mapping to XDM)
[
  {
    "identityMap": {
      "Email": [{ "id": "user@example.com" }]
    },
    "person": {
      "name": { "firstName": "Sarah" }
    },
    "loyaltyDetails": {
      "tier": "Gold",
      "points": 8420
    }
  }
]`}
            />
          )}
          {activeIngestionTab === "streaming" && (
            <CodeBlock
              title="Streaming API · HTTP Data Collection"
              language="json"
              code={`// POST https://dcs.adobedc.net/collection/{DATASTREAM_ID}
{
  "header": {
    "schemaRef": {
      "id": "https://ns.adobe.com/{TENANT}/schemas/order-events",
      "contentType": "application/vnd.adobe.xed-full+json;version=1.0"
    },
    "imsOrgId": "ABC123@AdobeOrg",
    "datasetId": "ds-order-events",
    "flowId": "streaming-flow-001"
  },
  "body": {
    "xdmMeta": { "schemaRef": { "id": "..." } },
    "xdmEntity": {
      "eventType": "commerce.purchases",
      "commerce": {
        "purchases": { "value": 1 },
        "order": { "purchaseID": "ORD-98765", "priceTotal": 349.99 }
      },
      "identityMap": {
        "Email": [{ "id": "user@example.com" }]
      }
    }
  }
}`}
            />
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 3: SEGMENTATION
          ════════════════════════════════════════════════ */}
      <section id="segmentation" className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">AEP · Step 2</span>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-3">Segment Building</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Combine profile attributes and behavioral events with AND/OR logic to define reusable audiences. AEP evaluates membership in real-time as profiles update.
          </p>

          {/* Segment tabs */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setActiveSegmentTab("ecommerce")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSegmentTab === "ecommerce" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              🛒 E-commerce
            </button>
            <button onClick={() => setActiveSegmentTab("travel")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSegmentTab === "travel" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              ✈️ Travel & Hospitality
            </button>
          </div>

          {/* Segment builder card */}
          <div className="rounded-xl border-2 border-border bg-card p-6 md:p-8 shadow-sm mb-12">
            {activeSegmentTab === "ecommerce" ? (
              <>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Segment Name</p>
                    <p className="text-lg font-bold text-foreground">Cart Abandoners — High Value</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Estimated Audience</p>
                    <p className="text-2xl font-bold text-primary">14,280</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Profile Attributes</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                        <code className="text-xs font-mono text-foreground">commerce.checkouts.value</code>
                        <span className="text-xs text-muted-foreground">=</span>
                        <span className="text-xs font-bold text-destructive">0</span>
                      </div>
                      <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                        <code className="text-xs font-mono text-foreground">productListItems.priceTotal</code>
                        <span className="text-xs text-muted-foreground">&gt;</span>
                        <span className="text-xs font-bold text-primary">100</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Behavioral Events</p>
                    <div className="space-y-2">
                      <div className="bg-muted/50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-foreground">eventType</code>
                          <span className="text-xs text-muted-foreground">=</span>
                          <span className="text-xs font-bold text-accent">commerce.productListAdds</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Window: last 48hrs</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-foreground">eventType</code>
                          <span className="text-xs text-muted-foreground">≠</span>
                          <span className="text-xs font-bold text-destructive">commerce.purchases</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Window: last 48hrs</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">AND</span>
                    <span className="text-xs text-muted-foreground">✅ Segment evaluated · Ready to activate in AJO</span>
                  </div>
                  <span className="text-xs font-semibold text-primary flex items-center gap-1">Send to AJO <ArrowRight size={12} /></span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Segment Name</p>
                    <p className="text-lg font-bold text-foreground">Loyalty Searchers — No Booking</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Estimated Audience</p>
                    <p className="text-2xl font-bold text-primary">8,640</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Profile Attributes</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                        <code className="text-xs font-mono text-foreground">loyalty.tier</code>
                        <span className="text-xs text-muted-foreground">=</span>
                        <span className="text-xs font-bold text-use-case-amber">Gold</span>
                      </div>
                      <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                        <code className="text-xs font-mono text-foreground">bookings.count</code>
                        <span className="text-xs text-muted-foreground">=</span>
                        <span className="text-xs font-bold text-destructive">0</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Behavioral Events</p>
                    <div className="space-y-2">
                      <div className="bg-muted/50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-foreground">eventType</code>
                          <span className="text-xs text-muted-foreground">=</span>
                          <span className="text-xs font-bold text-accent">web.flightSearch</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Window: last 7 days</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-foreground">eventType</code>
                          <span className="text-xs text-muted-foreground">≠</span>
                          <span className="text-xs font-bold text-destructive">commerce.purchases</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Window: last 7 days</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">AND</span>
                    <span className="text-xs text-muted-foreground">✅ Segment evaluated · Ready to activate in AJO</span>
                  </div>
                  <span className="text-xs font-semibold text-primary flex items-center gap-1">Send to AJO <ArrowRight size={12} /></span>
                </div>
              </>
            )}
          </div>

          {/* AEP → AJO Bridge: Segment Activation */}
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AEP → AJO Bridge</span>
          <h3 className="text-2xl font-bold text-foreground mt-2 mb-3">Segment Activation</h3>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            AEP segments don't stay in AEP — they're activated into AJO via two mechanisms. Choosing the right one is a key architectural decision.
          </p>

          {/* Bridge visual */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="rounded-full bg-primary/10 border border-primary/30 p-4">
              <span className="text-sm font-bold text-primary">🧠 AEP</span>
              <p className="text-[10px] text-muted-foreground">Segment Ready</p>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-0.5 bg-primary/30" />
              <ArrowRight size={16} className="text-primary/50 -ml-1" />
            </div>
            <div className="rounded-full bg-secondary/10 border border-secondary/30 p-4">
              <span className="text-sm font-bold text-secondary">🚀 AJO</span>
              <p className="text-[10px] text-muted-foreground">Journey Triggered</p>
            </div>
          </div>

          {/* Two mechanisms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border-2 border-border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Zap size={24} className="text-primary" />
                <div>
                  <p className="font-bold text-foreground">Audience Qualification</p>
                  <p className="text-xs text-muted-foreground">Real-time trigger</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                AJO listens for profile entry/exit events from AEP. The moment a profile qualifies for a segment (or exits), a journey is triggered instantly — ideal for cart abandonment or real-time alerts.
              </p>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">When to use</p>
                <p className="text-xs text-muted-foreground">Use when immediacy matters: cart abandonment, real-time fraud alerts, booking drop-offs.</p>
              </div>
            </div>
            <div className="rounded-xl border-2 border-border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Calendar size={24} className="text-primary" />
                <div>
                  <p className="font-bold text-foreground">Read Audience</p>
                  <p className="text-xs text-muted-foreground">Scheduled batch</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                AJO reads the full audience snapshot on a schedule (daily, hourly). All matching profiles are entered into the journey or campaign at once — ideal for newsletters, weekly digests, or loyalty campaigns.
              </p>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">When to use</p>
                <p className="text-xs text-muted-foreground">Use for scheduled comms: weekly deals, nightly loyalty emails, re-engagement campaigns.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 4: AJO JOURNEYS
          ════════════════════════════════════════════════ */}
      <section id="ajo-journeys" className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">AJO · Core Concept</span>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-3">Journeys vs. Campaigns</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            AJO has two distinct execution models. Knowing which to use is the first architectural decision every developer faces.
          </p>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border-2 border-primary/30 bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🔀</span>
                <div>
                  <p className="font-bold text-foreground text-lg">Journeys</p>
                  <p className="text-xs text-muted-foreground">Real-time orchestration</p>
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                {["Flow-based, multi-step sequences", "Triggered by a specific event or audience entry", "Execute actions in order with waits & conditions", "Highly personalized per individual profile"].map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Developer Example</p>
                <p className="text-xs text-muted-foreground font-mono">Cart abandoned → wait 1hr → email → if opened: push offer → else: 24hr SMS</p>
              </div>
            </div>
            <div className="rounded-xl border-2 border-secondary/30 bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📣</span>
                <div>
                  <p className="font-bold text-foreground text-lg">Campaigns</p>
                  <p className="text-xs text-muted-foreground">One-time or recurring delivery</p>
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                {["Deliver content to an entire audience at once", "Actions execute simultaneously for all profiles", "Simple ad-hoc or recurring batch sends", "Requires a schedule (not an event trigger)"].map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-secondary mt-0.5">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Developer Example</p>
                <p className="text-xs text-muted-foreground font-mono">Every Monday → send weekly flight deals email to 'Gold Members' segment</p>
              </div>
            </div>
          </div>

          {/* Quick decision guide */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-12 max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={16} className="text-primary" />
              <p className="font-semibold text-foreground text-sm">Quick Decision Guide</p>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Use a Journey when:</span> an event triggers the interaction (cart add, page view, booking drop-off)<br />
              <span className="font-semibold text-foreground">Use a Campaign when:</span> you need to reach all audience members at a specific time (weekly email, flash sale)
            </p>
          </div>

          {/* Journey Builder - Activity Types */}
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">AJO · Journey Builder</span>
          <h3 className="text-2xl font-bold text-foreground mt-2 mb-3">Activity Types</h3>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            Every journey is built from three categories of activities. Click any node to explore what it does and how to configure it.
          </p>

          {/* Activity category tabs */}
          <div className="flex gap-2 mb-6">
            {([
              { id: "events" as const, icon: "⚡", label: "Events" },
              { id: "orchestration" as const, icon: "🔀", label: "Orchestration" },
              { id: "actions" as const, icon: "🚀", label: "Actions" },
            ]).map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveActivityTab(cat.id); setActiveActivityDetail(cat.id === "events" ? "audience-qual" : cat.id === "orchestration" ? "condition" : "email"); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeActivityTab === cat.id ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Activity nodes */}
            <div className="space-y-2">
              {activeActivityTab === "events" && (
                <>
                  <p className="text-xs text-muted-foreground mb-2">Entry triggers for the journey. The journey starts when one of these fires.</p>
                  {[
                    { id: "reactions", label: "💬 Reactions" },
                    { id: "audience-qual", label: "🎯 Audience Qualification" },
                    { id: "generic-events", label: "📡 Generic Events" },
                  ].map(n => (
                    <button key={n.id} onClick={() => setActiveActivityDetail(n.id)} className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${activeActivityDetail === n.id ? "bg-secondary/10 border border-secondary/30 text-foreground font-semibold" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                      {n.label}
                    </button>
                  ))}
                </>
              )}
              {activeActivityTab === "orchestration" && (
                <>
                  <p className="text-xs text-muted-foreground mb-2">Control the flow — branching, waiting, and routing logic.</p>
                  {[
                    { id: "condition", label: "🔀 Condition" },
                    { id: "wait", label: "⏱️ Wait" },
                    { id: "jump", label: "↪️ Jump" },
                  ].map(n => (
                    <button key={n.id} onClick={() => setActiveActivityDetail(n.id)} className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${activeActivityDetail === n.id ? "bg-secondary/10 border border-secondary/30 text-foreground font-semibold" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                      {n.label}
                    </button>
                  ))}
                </>
              )}
              {activeActivityTab === "actions" && (
                <>
                  <p className="text-xs text-muted-foreground mb-2">What happens to the profile. Messages, API calls, profile updates.</p>
                  {[
                    { id: "email", label: "✉️ Email" },
                    { id: "push", label: "📱 Push" },
                    { id: "sms", label: "💬 SMS" },
                    { id: "custom-action", label: "🔗 Custom Action" },
                  ].map(n => (
                    <button key={n.id} onClick={() => setActiveActivityDetail(n.id)} className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${activeActivityDetail === n.id ? "bg-secondary/10 border border-secondary/30 text-foreground font-semibold" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                      {n.label}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Detail panel */}
            <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
              {activeActivityDetail === "audience-qual" && (
                <>
                  <h4 className="font-bold text-foreground mb-1">🎯 Audience Qualification</h4>
                  <p className="text-xs text-secondary mb-3">Events Activity</p>
                  <p className="text-sm text-muted-foreground mb-4">Triggers when a profile enters or exits an AEP segment in real-time. The most common event trigger for behavioral journeys.</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-muted-foreground">🧑‍💻 Developer Note</p>
                    <p className="text-xs text-muted-foreground mt-1">Powered by AEP Streaming Segmentation. Profile must be on Edge Network.</p>
                  </div>
                </>
              )}
              {activeActivityDetail === "reactions" && (
                <>
                  <h4 className="font-bold text-foreground mb-1">💬 Reactions</h4>
                  <p className="text-xs text-secondary mb-3">Events Activity</p>
                  <p className="text-sm text-muted-foreground mb-4">Tracks engagement with a sent message — opens, clicks, unsubscribes. Used to branch journeys based on whether a user engaged with a previous action.</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-muted-foreground">🧑‍💻 Developer Note</p>
                    <p className="text-xs text-muted-foreground mt-1">Reaction events arrive asynchronously. Typical latency: seconds for push, minutes for email opens.</p>
                  </div>
                </>
              )}
              {activeActivityDetail === "generic-events" && (
                <>
                  <h4 className="font-bold text-foreground mb-1">📡 Generic Events</h4>
                  <p className="text-xs text-secondary mb-3">Events Activity</p>
                  <p className="text-sm text-muted-foreground mb-4">Listen for any AEP ExperienceEvent by type. For example: "commerce.purchases" or a custom event. The journey starts when this specific event type fires for a profile.</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-muted-foreground">🧑‍💻 Developer Note</p>
                    <p className="text-xs text-muted-foreground mt-1">Requires the "Orchestration" field group on your XDM schema. Event must include an eventID.</p>
                  </div>
                </>
              )}
              {activeActivityDetail === "condition" && (
                <>
                  <h4 className="font-bold text-foreground mb-1">🔀 Condition</h4>
                  <p className="text-xs text-secondary mb-3">Orchestration Activity</p>
                  <p className="text-sm text-muted-foreground mb-4">Splits the journey into branches based on profile data, event context, or data source lookups. Supports if/then/else logic with multiple conditions.</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-muted-foreground">🧑‍💻 Developer Note</p>
                    <p className="text-xs text-muted-foreground mt-1">Conditions use the Advanced Expression Editor. Example: <code className="text-xs font-mono text-primary">{"#{ExperienceEvent.commerce.checkouts.value} > 0"}</code></p>
                  </div>
                </>
              )}
              {activeActivityDetail === "wait" && (
                <>
                  <h4 className="font-bold text-foreground mb-1">⏱️ Wait</h4>
                  <p className="text-xs text-secondary mb-3">Orchestration Activity</p>
                  <p className="text-sm text-muted-foreground mb-4">Pauses a profile's journey for a fixed duration (e.g., 1 hour, 7 days) or until a specific date/time. Essential for spacing out messages.</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-muted-foreground">🧑‍💻 Developer Note</p>
                    <p className="text-xs text-muted-foreground mt-1">Max wait duration: 30 days. For dynamic waits, use a profile attribute (e.g., subscription renewal date).</p>
                  </div>
                </>
              )}
              {activeActivityDetail === "jump" && (
                <>
                  <h4 className="font-bold text-foreground mb-1">↪️ Jump</h4>
                  <p className="text-xs text-secondary mb-3">Orchestration Activity</p>
                  <p className="text-sm text-muted-foreground mb-4">Moves a profile from one journey to another, enabling modular design. Useful for reusable sub-journeys (e.g., "welcome sequence" used by multiple entry journeys).</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-muted-foreground">🧑‍💻 Developer Note</p>
                    <p className="text-xs text-muted-foreground mt-1">Target journey must be in "Live" status and have a valid entry event. Profile context is carried across.</p>
                  </div>
                </>
              )}
              {activeActivityDetail === "email" && (
                <>
                  <h4 className="font-bold text-foreground mb-1">✉️ Email</h4>
                  <p className="text-xs text-secondary mb-3">Action Activity</p>
                  <p className="text-sm text-muted-foreground mb-4">Sends a personalized email using AJO's template editor. Supports Handlebars-style personalization with profile attributes, offers, and dynamic content blocks.</p>
                  <CodeBlock title="AJO Email Personalization" language="handlebars" code={`<h1>Hi {{profile.person.name.firstName}},</h1>
<p>You left some items in your cart!</p>
{{#each context.journey.events.cartAbandoned.productListItems}}
  <div class="product-card">
    <h3>{{this.name}}</h3>
    <p>Price: \${{this.priceTotal}}</p>
  </div>
{{/each}}
{{#if (equals profile.loyalty.tier "Gold")}}
  <p>As a Gold member, enjoy <strong>15% off</strong>!</p>
{{/if}}`} />
                </>
              )}
              {activeActivityDetail === "push" && (
                <>
                  <h4 className="font-bold text-foreground mb-1">📱 Push</h4>
                  <p className="text-xs text-secondary mb-3">Action Activity</p>
                  <p className="text-sm text-muted-foreground mb-4">Sends a mobile push notification via AJO messaging. Requires a configured push surface (iOS/Android) and the Adobe Experience SDK in the mobile app.</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-muted-foreground">🧑‍💻 Developer Note</p>
                    <p className="text-xs text-muted-foreground mt-1">Push tokens are managed via the Mobile SDK. Delivery depends on APNs (iOS) / FCM (Android) connectivity.</p>
                  </div>
                </>
              )}
              {activeActivityDetail === "sms" && (
                <>
                  <h4 className="font-bold text-foreground mb-1">💬 SMS</h4>
                  <p className="text-xs text-secondary mb-3">Action Activity</p>
                  <p className="text-sm text-muted-foreground mb-4">Sends an SMS text message via a configured SMS provider (e.g., Sinch, Twilio). Supports short codes, personalization, and opt-out link management.</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-muted-foreground">🧑‍💻 Developer Note</p>
                    <p className="text-xs text-muted-foreground mt-1">SMS character limit: 160 (GSM-7) or 70 (UCS-2 for unicode). Personalized messages may exceed one segment.</p>
                  </div>
                </>
              )}
              {activeActivityDetail === "custom-action" && (
                <>
                  <h4 className="font-bold text-foreground mb-1">🔗 Custom Action</h4>
                  <p className="text-xs text-secondary mb-3">Action Activity</p>
                  <p className="text-sm text-muted-foreground mb-4">Calls a third-party REST API endpoint from within a journey step. Used for Slack notifications, CRM updates, webhook triggers, payment processing, etc.</p>
                  <CodeBlock title="Custom Action Configuration" language="json" code={`{
  "name": "notify-slack-vip",
  "type": "customAction",
  "endpoint": "https://hooks.slack.com/services/T.../B.../xxx",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "bodyTemplate": {
    "text": "🎉 VIP Alert: {{profile.person.name.firstName}} just qualified for Gold tier!"
  },
  "authentication": "bearer",
  "timeout": "5s"
}`} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 5: USE CASES
          ════════════════════════════════════════════════ */}
      <section id="use-cases" className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* USE CASE 1: Cart Abandonment */}
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Use Case 1 · E-Commerce</span>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-3">🛒 Cart Abandonment Journey</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            A customer adds a high-value item to their cart and leaves. Follow the full data flow from Web SDK event to personalized recovery journey.
          </p>

          {/* 6-step flow */}
          <UseCaseFlow steps={[
            { num: 1, label: "Web SDK Fires Event", platform: "AEP", desc: "User adds item to cart, then navigates away. alloy.js fires a commerce.productListAdds event.", code: { title: "alloy.js — productListAdds", language: "javascript", code: `alloy("sendEvent", {
  xdm: {
    eventType: "commerce.productListAdds",
    productListItems: [{
      SKU: "BAG-501",
      name: "Premium Weekender Bag",
      priceTotal: 249.00,
      quantity: 1
    }],
    identityMap: {
      ECID: [{ id: "ecid-abc123", primary: true }]
    }
  }
})` } },
            { num: 2, label: "Profile Updated · Segment Qualified", platform: "AEP", desc: "AEP attaches the event to the unified profile. Streaming segmentation evaluates the 'Cart Abandoners — High Value' segment. Profile qualifies." },
            { num: 3, label: "Audience Qualification Triggers Journey", platform: "AJO", desc: "AJO receives the segment qualification event and enters the profile into the 'Cart Abandonment Recovery' journey." },
            { num: 4, label: "Wait 1 Hour", platform: "AJO", desc: "Journey pauses for 1 hour, giving the customer time to return and complete the purchase organically." },
            { num: 5, label: "Send Cart Recovery Email", platform: "AJO", desc: "If the customer hasn't purchased, AJO sends a personalized recovery email with the abandoned products and a CTA.", code: { title: "AJO Email Template (Handlebars)", language: "handlebars", code: `<h1>Hi {{profile.person.name.firstName}},</h1>
<p>You left something behind!</p>
{{#each context.journey.events.cartAbandoned.productListItems}}
  <div>
    <h3>{{this.name}}</h3>
    <p>\${{this.priceTotal}}</p>
  </div>
{{/each}}
{{#if (equals profile.loyalty.tier "Gold")}}
  <p>Gold member perk: <strong>15% off</strong> with code GOLD15</p>
{{/if}}
<a href="https://shop.example.com/cart">Complete Your Order →</a>` } },
            { num: 6, label: "Condition: Email Opened?", platform: "AJO", desc: "Journey branches based on email engagement.", branches: ["🔔 YES: Push — Exclusive Discount", "📱 NO: Wait 24hr → SMS Reminder"] },
          ]} />

          {/* USE CASE 2: Loyalty Re-engagement */}
          <div className="mt-20" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Use Case 2 · Travel & Hospitality</span>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-3">✈️ Loyalty Member Re-engagement</h2>
          <p className="text-muted-foreground mb-4 max-w-3xl">
            A Gold loyalty member searches for flights but doesn't book. See how AEP + AJO combine a Campaign and a Journey to drive conversion — and write results back to close the loop.
          </p>

          <UseCaseFlow steps={[
            { num: 1, label: "Behavioral Event: Flight Search", platform: "AEP", desc: "Gold-tier loyalty member visits the flight search page. The Web SDK fires a custom pageView event with flight search context.", code: { title: "alloy.js — Flight Search Event", language: "javascript", code: `alloy("sendEvent", {
  xdm: {
    eventType: "web.webpagedetails.flightSearch",
    web: {
      webPageDetails: { name: "Flight Search" }
    },
    _airline: {
      search: {
        origin: "SFO",
        destination: "NYC",
        departureDate: "2026-03-15",
        cabinClass: "Business"
      }
    },
    identityMap: {
      loyaltyId: [{ id: "GOLD-98124", primary: true }]
    }
  }
})` } },
            { num: 2, label: "Read Audience: Nightly Batch Job", platform: "AEP", desc: "Every night at 8pm, AJO reads the 'Loyalty Searchers — No Booking' segment from AEP. All Gold members who searched but didn't book are entered into a Campaign." },
            { num: 3, label: "AJO Campaign: Personalized Flight Deals", platform: "AJO", desc: "AJO sends a batch email campaign with personalized flight deals based on the member's search history (route, cabin class, dates)." },
            { num: 4, label: "Condition: Email Link Clicked?", platform: "AJO", desc: "AJO tracks email engagement. If the member clicks a deal link, they enter a follow-up Journey." },
            { num: 5, label: "Journey: Hotel Bundle Push + In-App", platform: "AJO", desc: "The follow-up Journey sends a push notification with a hotel bundle offer, then an in-app message when the member opens the airline app." },
            { num: 6, label: "Interaction Data Flows Back to AEP", platform: "AEP", desc: "All interaction events (email opens, clicks, push deliveries, purchases) are written back to the AEP profile, closing the loop and enriching the profile for future segmentation." },
          ]} />

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mt-8 max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={16} className="text-primary" />
              <p className="font-semibold text-foreground text-sm">Key Insight</p>
            </div>
            <p className="text-sm text-muted-foreground">
              This scenario uses both a <span className="font-semibold text-foreground">Campaign</span> (batch email) AND a <span className="font-semibold text-foreground">Journey</span> (event-driven upsell) — showing they work together.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 6: GLOSSARY
          ════════════════════════════════════════════════ */}
      <section id="glossary" className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Reference</span>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-3">Developer Glossary</h2>
          <p className="text-muted-foreground mb-8">Key terms color-coded by platform. Hover any term for a definition.</p>

          {/* AEP Terms */}
          <h3 className="text-lg font-bold text-primary mb-4">AEP Terms</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {([
              ["XDM", "Experience Data Model — the standard schema framework for all AEP data"],
              ["Schema", "The 'Blueprint'. Defines the structure, fields, and data types (e.g., Individual Profile or ExperienceEvent)."],
              ["Dataset", "The 'Storage Bin'. A container for the actual data records or files, tied to a specific Schema."],
              ["Datastream", "The 'Router'. Server-side config that tells the Edge Network which Schema and Dataset to use for Web SDK events."],
              ["Real-Time Profile", "A unified, stitched view of a customer across all channels and devices"],
              ["Segment / Audience", "A named group of profiles matching defined attribute + event rules"],
              ["Streaming Segmentation", "Real-time segment evaluation as profile events arrive (<1s latency)"],
              ["Batch Segmentation", "Scheduled segment evaluation run on a defined interval (hourly/daily)"],
              ["Streaming Ingestion", "Real-time data ingestion via HTTP API or alloy.js Web SDK"],
              ["Batch Ingestion", "Scheduled file-based import via SFTP, S3, Azure, or API"],
              ["Identity Graph", "Stitches multiple identifiers (ECID, email, loyaltyId) to one profile"],
              ["alloy.js", "Adobe's Web SDK for collecting events from browser/mobile apps"],
            ] as const).map(([term, def]) => (
              <GlossaryTerm key={term} term={term} definition={def} color="blue" />
            ))}
          </div>

          {/* AJO Terms */}
          <h3 className="text-lg font-bold text-secondary mb-4">AJO Terms</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {([
              ["Journey", "A real-time, event-driven multi-step orchestration flow for individual profiles"],
              ["Campaign", "A scheduled one-time or recurring message delivery to a full audience"],
              ["Audience Qualification", "Journey entry trigger fired when a profile enters/exits an AEP segment"],
              ["Read Audience", "Journey/Campaign entry that reads all profiles from a segment on a schedule"],
              ["Condition Activity", "Splits the journey into branches based on profile data or event context"],
              ["Wait Activity", "Pauses a profile's journey for a fixed or dynamic time period"],
              ["Reaction Event", "Tracks engagement with a sent message: opens, clicks, unsubscribes"],
              ["Jump Activity", "Moves a profile from one journey to another, enabling modular design"],
              ["Custom Action", "Calls a third-party REST API endpoint from within a journey step"],
              ["Update Profile", "Writes attribute values back to the AEP profile during a journey"],
              ["Surface", "A configured channel endpoint: email, push token, SMS number, or in-app"],
              ["Suppression List", "A blocklist of addresses/devices that should never receive messages"],
            ] as const).map(([term, def]) => (
              <GlossaryTerm key={term} term={term} definition={def} color="red" />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">AEP</div>
            <span className="text-muted-foreground">+</span>
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-xs">AJO</div>
          </div>
          <p className="text-xs text-muted-foreground">Developer Visual Guide</p>
          <p className="text-xs text-muted-foreground mt-1">Built to help developers understand the data flow between Adobe Experience Platform and Adobe Journey Optimizer with real-world use cases.</p>
        </div>
      </footer>
    </div>
  );
};

// ─── Use Case Flow Component ───
interface UseCaseStep {
  num: number;
  label: string;
  platform: "AEP" | "AJO";
  desc: string;
  code?: { title: string; language: string; code: string };
  branches?: string[];
}

const UseCaseFlow = ({ steps }: { steps: UseCaseStep[] }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div className="space-y-0 mb-8">
      {/* Step indicator bar */}
      <div className="hidden md:flex items-stretch gap-0 overflow-x-auto pb-6 mb-6">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center shrink-0">
            <button
              onClick={() => setExpandedStep(expandedStep === step.num ? null : step.num)}
              className={`flex flex-col items-center w-44 transition-all ${expandedStep === step.num ? "scale-105" : ""}`}
            >
              <div className={`w-full rounded-xl border-2 p-3 text-center transition-all hover:shadow-md ${step.platform === "AEP" ? "border-primary/30 bg-primary/5" : "border-secondary/30 bg-secondary/5"} ${expandedStep === step.num ? "shadow-md ring-2 ring-primary/20" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-1 ${step.platform === "AEP" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {step.num}
                </div>
                <p className="font-semibold text-foreground text-xs leading-tight">{step.label}</p>
                <span className={`text-[10px] font-bold uppercase mt-1 inline-block ${step.platform === "AEP" ? "text-primary" : "text-secondary"}`}>{step.platform}</span>
              </div>
            </button>
            {i < steps.length - 1 && (
              <div className="flex items-center px-1">
                <div className="w-4 h-0.5 bg-muted-foreground/20" />
                <ArrowRight size={12} className="text-muted-foreground/30 -ml-0.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical */}
      <div className="md:hidden space-y-0 mb-6">
        {steps.map((step, i) => (
          <button key={i} onClick={() => setExpandedStep(expandedStep === step.num ? null : step.num)} className="flex items-start gap-3 w-full text-left">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${step.platform === "AEP" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                {step.num}
              </div>
              {i < steps.length - 1 && <div className="w-0.5 h-8 bg-border" />}
            </div>
            <div className="pt-2 pb-4">
              <p className="font-semibold text-foreground text-sm">{step.label}</p>
              <span className={`text-[10px] font-bold uppercase ${step.platform === "AEP" ? "text-primary" : "text-secondary"}`}>{step.platform}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Expanded step detail */}
      {expandedStep && (() => {
        const step = steps.find(s => s.num === expandedStep);
        if (!step) return null;
        return (
          <div className={`rounded-xl border-2 p-6 transition-all animate-fade-in ${step.platform === "AEP" ? "border-primary/20 bg-primary/5" : "border-secondary/20 bg-secondary/5"}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-2xl ${step.platform === "AEP" ? "" : ""}`}>{step.platform === "AEP" ? "🌐" : step.num === 6 ? "🔀" : "🚀"}</span>
              <div>
                <p className="font-bold text-foreground">{step.label}</p>
                <span className={`text-xs font-bold uppercase ${step.platform === "AEP" ? "text-primary" : "text-secondary"}`}>{step.platform}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{step.desc}</p>
            {step.branches && (
              <div className="flex flex-wrap gap-3 mb-4">
                {step.branches.map((b, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-muted-foreground">{b}</div>
                ))}
              </div>
            )}
            {step.code && <CodeBlock title={step.code.title} language={step.code.language} code={step.code.code} />}
          </div>
        );
      })()}
    </div>
  );
};

export default AepAjoPage;
