import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Copy, Check, Lightbulb, ChevronRight, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import type { RichPageData, CodeExample, ComparisonGroup, ConceptItem, GlossaryGroup } from "./types";

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

const GlossaryTermChip = ({ term, definition, color }: { term: string; definition: string; color: "primary" | "secondary" | "accent" }) => {
  const [show, setShow] = useState(false);
  const colorMap = {
    primary: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20",
    accent: "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20",
  };
  return (
    <div className="relative inline-block">
      <button onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${colorMap[color]}`}>
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

// ─── Section Nav ───
const navItems = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "concepts", label: "Key Concepts" },
  { id: "deep-dive", label: "Deep Dive" },
  { id: "examples", label: "Examples" },
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
            className={`shrink-0 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === s.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  </nav>
);

// ─── Main Component ───
const RichTopicPage = ({ data }: { data: RichPageData }) => {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { for (const entry of entries) { if (entry.isIntersecting) setActiveSection(entry.target.id); } },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    navItems.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const { hero, architecture, concepts, comparisons, codeExamples, glossary, tips, whenToUse } = data;
  const badgeColorMap: Record<string, string> = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
  };
  const badgeBorderMap: Record<string, string> = {
    primary: "border-primary/20 bg-primary/5",
    secondary: "border-secondary/20 bg-secondary/5",
    accent: "border-accent/20 bg-accent/5",
  };

  return (
    <div className="min-h-screen bg-background">
      <SectionNav activeSection={activeSection} />

      {/* ═══ HERO / OVERVIEW ═══ */}
      <section id="overview" className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg ${badgeColorMap[hero.badge1.color]}`}>{hero.badge1.label}</div>
            {hero.badge2 && (
              <>
                <span className="text-2xl text-muted-foreground font-light">→</span>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg ${badgeColorMap[hero.badge2.color]}`}>{hero.badge2.label}</div>
              </>
            )}
            <span className="ml-2 text-lg font-semibold text-muted-foreground">Developer Guide</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2">{hero.title}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6">{hero.subtitle}</p>
          <p className="text-base text-muted-foreground max-w-3xl leading-relaxed mb-8">{hero.description}</p>

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

          {hero.mentalModel && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 max-w-4xl">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={18} className="text-primary" />
                <h4 className="font-semibold text-foreground text-sm">Developer Mental Model</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{hero.mentalModel}</p>
            </div>
          )}

          {tips && tips.length > 0 && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mt-8 max-w-4xl">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={18} className="text-primary" />
                <h3 className="font-semibold text-foreground text-sm">Key Takeaways</h3>
              </div>
              <ul className="space-y-2">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ChevronRight size={14} className="text-primary shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ═══ ARCHITECTURE ═══ */}
      <section id="architecture" className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">{architecture.sectionLabel}</span>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-3">{architecture.title}</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">{architecture.description}</p>

          {/* Pipeline */}
          <div className="hidden md:flex items-stretch gap-0 overflow-x-auto pb-4 mb-8">
            {architecture.pipeline.map((block, i) => (
              <div key={i} className="flex items-center shrink-0">
                <div className={`flex flex-col items-center w-48 rounded-xl border-2 p-5 text-center hover:shadow-md transition-shadow ${block.badgeColor ? badgeBorderMap[block.badgeColor] || "border-border bg-card" : "border-border bg-card"}`}>
                  {block.badge && (
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 ${block.badgeColor ? badgeColorMap[block.badgeColor] : "bg-muted text-muted-foreground"}`}>{block.badge}</span>
                  )}
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary mb-2">{i + 1}</div>
                  <p className="font-semibold text-foreground text-sm">{block.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{block.description}</p>
                </div>
                {i < architecture.pipeline.length - 1 && (
                  <div className="flex items-center px-1">
                    <div className="w-6 h-0.5 bg-primary/30" />
                    <ArrowRight size={16} className="text-primary/50 -ml-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Mobile pipeline */}
          <div className="md:hidden space-y-0 mb-8">
            {architecture.pipeline.map((block, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
                  {i < architecture.pipeline.length - 1 && <div className="w-0.5 h-10 bg-gradient-to-b from-primary/40 to-primary/10" />}
                </div>
                <div className="pt-1.5 pb-4">
                  <p className="font-semibold text-foreground text-sm">{block.label}</p>
                  <p className="text-muted-foreground text-sm mt-0.5">{block.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ KEY CONCEPTS ═══ */}
      <section id="concepts" className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Core Knowledge</span>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-3">Key Concepts</h2>
          <p className="text-muted-foreground mb-8">Essential concepts every developer should understand for this integration.</p>

          <div className="space-y-4">
            {concepts.map((c, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{i + 1}</div>
                  <h3 className="font-semibold text-foreground">{c.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DEEP DIVE (Comparisons + When to Use) ═══ */}
      <section id="deep-dive" className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Deep Dive</span>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-8">Architectural Decisions</h2>

          {comparisons && comparisons.map((comp, ci) => (
            <div key={ci} className="mb-12">
              <h3 className="text-xl font-bold text-foreground mb-2">{comp.title}</h3>
              <p className="text-muted-foreground mb-6">{comp.description}</p>
              <div className={`grid gap-6 ${comp.items.length === 2 ? 'grid-cols-1 md:grid-cols-2' : comp.items.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                {comp.items.map((item, ii) => (
                  <div key={ii} className="rounded-xl border-2 border-border bg-card p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-bold text-foreground">{item.label}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <ul className="space-y-2">
                      {item.points.map((pt, pi) => (
                        <li key={pi} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <ChevronRight size={12} className="text-primary shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {comp.tip && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mt-4 max-w-3xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb size={14} className="text-primary" />
                    <p className="font-semibold text-foreground text-sm">Quick Tip</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{comp.tip}</p>
                </div>
              )}
            </div>
          ))}

          {whenToUse && whenToUse.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">When to Use This Integration</h3>
              <ul className="space-y-3">
                {whenToUse.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight size={14} className="text-primary" />
                    </div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ═══ CODE EXAMPLES ═══ */}
      <section id="examples" className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Hands-On</span>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-3">Code Examples</h2>
          <p className="text-muted-foreground mb-8">Real-world code snippets and configuration samples.</p>

          <div className="space-y-6">
            {codeExamples.map((ex, i) => (
              <CodeBlock key={i} {...ex} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GLOSSARY ═══ */}
      <section id="glossary" className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Reference</span>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-3">Developer Glossary</h2>
          <p className="text-muted-foreground mb-8">Hover any term for a definition.</p>

          {glossary.map((group, gi) => (
            <div key={gi} className="mb-8">
              <h3 className={`text-lg font-bold mb-4 ${group.color === "primary" ? "text-primary" : group.color === "secondary" ? "text-secondary" : "text-accent"}`}>{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.terms.map((t, ti) => (
                  <GlossaryTermChip key={ti} term={t.term} definition={t.definition} color={group.color} />
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
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${badgeColorMap[hero.badge1.color]}`}>{hero.badge1.label}</div>
            {hero.badge2 && (
              <>
                <span className="text-muted-foreground">→</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${badgeColorMap[hero.badge2.color]}`}>{hero.badge2.label}</div>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Developer Visual Guide</p>
        </div>
      </footer>
    </div>
  );
};

export default RichTopicPage;
