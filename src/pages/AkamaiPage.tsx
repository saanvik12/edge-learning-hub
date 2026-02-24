import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Copy, Check, Lightbulb, ChevronRight, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { akamaiPages } from "@/data/rich-pages/akamai-all";
import type { RichPageData, CodeExample, ComparisonGroup } from "@/components/rich-detail/types";

// ─── Shared Components ───
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-10">
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

const CodeBlock = ({ title, language, code }: CodeExample) => (
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

const GlossaryChip = ({ term, definition }: { term: string; definition: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <button onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        className="px-3 py-1.5 rounded-full text-xs font-medium border bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors">
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

// ─── Topic order ───
const topicOrder = [
  "akamai-product-map",
  "akamai-networking",
  "akamai-dns",
  "akamai-tls",
  "akamai-waf",
  "akamai-bot-manager",
  "akamai-edgeworkers",
  "akamai-terraform-jenkins",
] as const;

const topics: RichPageData[] = topicOrder.map(id => akamaiPages[id]);

// ─── Section Nav ───
const navItems = [
  { id: "overview", label: "Overview" },
  ...topics.map(t => ({ id: t.id, label: t.hero.badge1.label === "Akamai" ? "Product Map" : t.hero.badge1.label })),
  { id: "glossary", label: "Glossary" },
];

const SectionNav = ({ activeSection }: { activeSection: string }) => (
  <nav className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-1 overflow-x-auto py-1">
        <Link to="/" className="shrink-0 mr-4 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft size={14} /> Home
        </Link>
        {navItems.map(s => (
          <button key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className={`shrink-0 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeSection === s.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  </nav>
);

// ─── Topic Section ───
const TopicSection = ({ data, index }: { data: RichPageData; index: number }) => {
  const { hero, architecture, concepts, comparisons, codeExamples, tips, whenToUse } = data;

  return (
    <section id={data.id} className="py-16 border-t border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Topic Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm shadow-lg">
            {hero.badge1.label}
          </div>
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Topic {index + 1}</span>
            <h2 className="text-3xl font-bold text-foreground">{hero.title}</h2>
          </div>
        </div>

        <p className="text-xl text-muted-foreground mb-2">{hero.subtitle}</p>
        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed mb-6">{hero.description}</p>

        {/* Highlights */}
        {hero.highlights.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8">
            {hero.highlights.map((h, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-start gap-3 max-w-xs">
                <span className="text-2xl">{h.icon}</span>
                <div>
                  <p className="font-semibold text-foreground text-sm">{h.label}</p>
                  <p className="text-xs text-muted-foreground">{h.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mental Model */}
        {hero.mentalModel && (
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 max-w-4xl mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={18} className="text-accent" />
              <h4 className="font-semibold text-foreground text-sm">Developer Mental Model</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{hero.mentalModel}</p>
          </div>
        )}

        {/* Architecture Pipeline */}
        <div className="mb-10">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">{architecture.sectionLabel}</span>
          <h3 className="text-2xl font-bold text-foreground mt-1 mb-3">{architecture.title}</h3>
          <p className="text-muted-foreground mb-6 max-w-3xl">{architecture.description}</p>

          {/* Use vertical layout for detailed pipelines (6+ steps), horizontal for shorter ones */}
          {architecture.pipeline.length >= 6 ? (
            <div className="space-y-0 mb-4 max-w-4xl">
              {architecture.pipeline.map((block, i) => (
                <div key={i} className="flex items-start gap-5">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${block.badgeColor === "accent" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </div>
                    {i < architecture.pipeline.length - 1 && (
                      <div className="w-0.5 min-h-[2rem] flex-1 bg-gradient-to-b from-accent/30 to-accent/10" />
                    )}
                  </div>
                  <div className={`pt-2 pb-6 flex-1 ${i < architecture.pipeline.length - 1 ? '' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-foreground">{block.label}</p>
                      {block.badge && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-accent text-accent-foreground">{block.badge}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{block.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Desktop horizontal pipeline for shorter flows */}
              <div className="hidden md:flex items-stretch gap-0 overflow-x-auto pb-4 mb-4">
                {architecture.pipeline.map((block, i) => (
                  <div key={i} className="flex items-center shrink-0">
                    <div className={`flex flex-col items-center w-48 rounded-xl border-2 p-5 text-center hover:shadow-md transition-shadow ${block.badgeColor === "accent" ? "border-accent/20 bg-accent/5" : "border-border bg-card"}`}>
                      {block.badge && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 bg-accent text-accent-foreground">{block.badge}</span>
                      )}
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent mb-2">{i + 1}</div>
                      <p className="font-semibold text-foreground text-sm">{block.label}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{block.description}</p>
                    </div>
                    {i < architecture.pipeline.length - 1 && (
                      <div className="flex items-center px-1">
                        <div className="w-6 h-0.5 bg-accent/30" />
                        <ArrowRight size={16} className="text-accent/50 -ml-1" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Mobile vertical pipeline */}
              <div className="md:hidden space-y-0 mb-4">
                {architecture.pipeline.map((block, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
                      {i < architecture.pipeline.length - 1 && <div className="w-0.5 h-10 bg-gradient-to-b from-accent/40 to-accent/10" />}
                    </div>
                    <div className="pt-1.5 pb-4">
                      <p className="font-semibold text-foreground text-sm">{block.label}</p>
                      <p className="text-muted-foreground text-sm mt-0.5">{block.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Key Concepts */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-foreground mb-4">Key Concepts</h3>
          <div className="space-y-4">
            {concepts.map((c, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-sm font-bold text-accent">{i + 1}</div>
                  <h4 className="font-semibold text-foreground">{c.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparisons */}
        {comparisons && comparisons.map((comp, ci) => (
          <div key={ci} className="mb-10">
            <h3 className="text-xl font-bold text-foreground mb-2">{comp.title}</h3>
            <p className="text-muted-foreground mb-6">{comp.description}</p>
            <div className={`grid gap-6 ${comp.items.length === 2 ? 'grid-cols-1 md:grid-cols-2' : comp.items.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
              {comp.items.map((item, ii) => (
                <div key={ii} className="rounded-xl border-2 border-border bg-card p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="font-bold text-foreground">{item.label}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.points.map((pt, pi) => (
                      <li key={pi} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <ChevronRight size={12} className="text-accent shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {comp.tip && (
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 mt-4 max-w-3xl">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb size={14} className="text-accent" />
                  <p className="font-semibold text-foreground text-sm">Quick Tip</p>
                </div>
                <p className="text-sm text-muted-foreground">{comp.tip}</p>
              </div>
            )}
          </div>
        ))}

        {/* Code Examples */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-foreground mb-4">Code Examples</h3>
          <div className="space-y-6">
            {codeExamples.map((ex, i) => (
              <CodeBlock key={i} {...ex} />
            ))}
          </div>
        </div>

        {/* Tips */}
        {tips && tips.length > 0 && (
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 mb-10 max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={18} className="text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Key Takeaways</h3>
            </div>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* When to Use */}
        {whenToUse && whenToUse.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">When to Use</h3>
            <ul className="space-y-3">
              {whenToUse.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <ChevronRight size={14} className="text-accent" />
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

// ─── Main Page ───
const AkamaiPage = () => {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { for (const entry of entries) { if (entry.isIntersecting) setActiveSection(entry.target.id); } },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    navItems.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  // Collect all glossary terms from all topics
  const allGlossaryGroups = topics.flatMap(t => t.glossary);

  return (
    <div className="min-h-screen bg-background">
      <SectionNav activeSection={activeSection} />

      {/* ═══ HERO / OVERVIEW ═══ */}
      <section id="overview" className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg shadow-lg">Ak</div>
            <span className="text-lg font-semibold text-muted-foreground">Developer Guide</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2">Akamai Developer Guide</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6">CDN, Security, Edge Compute & Infrastructure as Code</p>
          <p className="text-base text-muted-foreground max-w-3xl leading-relaxed mb-8">
            A comprehensive deep dive into Akamai's platform — from DNS and TLS fundamentals, through WAF and bot protection, to EdgeWorkers serverless compute and Terraform-based infrastructure automation. Everything a developer needs to understand the edge.
          </p>

          {/* Pillar badges */}
          <div className="flex flex-wrap gap-4 mb-12">
            {[
              { icon: "🚀", label: "Delivery", detail: "DNS, TLS, CDN acceleration" },
              { icon: "🛡️", label: "Security", detail: "WAF, DDoS, Bot Manager" },
              { icon: "⚡", label: "Edge Compute", detail: "EdgeWorkers, EdgeKV" },
              { icon: "📝", label: "IaC & CI/CD", detail: "Terraform, Jenkins pipelines" },
            ].map((p, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-start gap-3 max-w-xs">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <p className="font-semibold text-foreground text-sm">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mental model */}
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 max-w-4xl mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={18} className="text-accent" />
              <h4 className="font-semibold text-foreground text-sm">Developer Mental Model</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Akamai's platform operates in three layers. <strong>Delivery</strong> gets your content to users fast — DNS resolves the domain, TLS secures the connection, and the CDN caches and accelerates content at 4,000+ edge PoPs globally. <strong>Security</strong> protects at the edge — WAF inspects every HTTP request for attacks, Bot Manager classifies automated traffic, and DDoS protection absorbs volumetric floods. <strong>Compute</strong> lets you run logic at the edge — EdgeWorkers execute JavaScript in sub-10ms, EdgeKV stores configuration data, and Linode provides full cloud infrastructure. <strong>Terraform + Jenkins</strong> tie it all together with infrastructure as code and automated CI/CD pipelines.
            </p>
          </div>

          {/* Topic quick links */}
          <h3 className="text-lg font-semibold text-foreground mb-4">Topics Covered</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topics.map((t, i) => (
              <button key={t.id}
                onClick={() => document.getElementById(t.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">{i + 1}</div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.hero.title}</p>
                    <p className="text-xs text-muted-foreground">{t.hero.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ALL TOPICS ═══ */}
      {topics.map((t, i) => (
        <TopicSection key={t.id} data={t} index={i} />
      ))}

      {/* ═══ COMBINED GLOSSARY ═══ */}
      <section id="glossary" className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Reference</span>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-3">Developer Glossary</h2>
          <p className="text-muted-foreground mb-8">All Akamai terms across every topic. Hover any term for a definition.</p>

          {allGlossaryGroups.map((group, gi) => (
            <div key={gi} className="mb-8">
              <h3 className="text-lg font-bold text-accent mb-4">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.terms.map((t, ti) => (
                  <GlossaryChip key={ti} term={t.term} definition={t.definition} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold text-xs">Ak</div>
          </div>
          <p className="text-xs text-muted-foreground">Akamai Developer Visual Guide</p>
        </div>
      </footer>
    </div>
  );
};

export default AkamaiPage;
