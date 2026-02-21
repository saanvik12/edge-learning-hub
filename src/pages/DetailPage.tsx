import { useParams, Link } from "react-router-dom";
import { detailContent } from "@/data/detail-content";
import { richPages } from "@/data/rich-pages";
import RichTopicPage from "@/components/rich-detail/RichTopicPage";
import { ArrowLeft, ChevronRight, ArrowRight, Copy, Check, Lightbulb } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
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

const FlowDiagram = ({ flow }: { flow: { label: string; description: string }[] }) => (
  <div className="space-y-1">
    {/* Desktop: horizontal flow */}
    <div className="hidden lg:flex items-stretch gap-0 overflow-x-auto pb-4">
      {flow.map((step, i) => (
        <div key={i} className="flex items-center shrink-0">
          <div className="flex flex-col items-center w-48">
            <div className="w-full rounded-xl border-2 border-primary/20 bg-primary/5 p-4 text-center hover:border-primary/40 hover:bg-primary/10 transition-all duration-200">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mx-auto mb-2">
                {i + 1}
              </div>
              <p className="font-semibold text-foreground text-sm">{step.label}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
            </div>
          </div>
          {i < flow.length - 1 && (
            <div className="flex items-center px-1">
              <div className="w-6 h-0.5 bg-primary/30" />
              <ArrowRight size={16} className="text-primary/50 -ml-1" />
            </div>
          )}
        </div>
      ))}
    </div>
    {/* Mobile: vertical flow */}
    <div className="lg:hidden space-y-0">
      {flow.map((step, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
              {i + 1}
            </div>
            {i < flow.length - 1 && (
              <div className="w-0.5 h-10 bg-gradient-to-b from-primary/40 to-primary/10" />
            )}
          </div>
          <div className="pt-1.5 pb-4">
            <p className="font-semibold text-foreground text-sm">{step.label}</p>
            <p className="text-muted-foreground text-sm mt-0.5">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const content = detailContent[id || ""];

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Topic Not Found</h1>
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const hasComparisons = content.comparisons && content.comparisons.length > 0;
  const hasAdditionalExamples = content.additionalExamples && content.additionalExamples.length > 0;
  const hasTips = content.tips && content.tips.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-1">{content.title}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-muted/50 p-1 mb-8">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="flow" className="text-xs sm:text-sm">How It Works</TabsTrigger>
            <TabsTrigger value="concepts" className="text-xs sm:text-sm">Key Concepts</TabsTrigger>
            <TabsTrigger value="examples" className="text-xs sm:text-sm">Examples</TabsTrigger>
            <TabsTrigger value="usage" className="text-xs sm:text-sm">When to Use</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8 animate-fade-in">
            <section className="space-y-4">
              {content.overview.map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed text-base">{p}</p>
              ))}
            </section>

            {hasTips && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={18} className="text-primary" />
                  <h3 className="font-semibold text-foreground text-sm">Key Takeaways</h3>
                </div>
                <ul className="space-y-2">
                  {content.tips!.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight size={14} className="text-primary shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          {/* How It Works Tab */}
          <TabsContent value="flow" className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-6">Data Flow Pipeline</h2>
              <FlowDiagram flow={content.flow} />
            </div>

            {hasComparisons && content.comparisons!.map((comp, ci) => (
              <div key={ci}>
                <h2 className="text-lg font-semibold text-foreground mb-4">{comp.title}</h2>
                <div className={`grid gap-4 ${comp.items.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
                  {comp.items.map((item, ii) => (
                    <div key={ii} className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{item.icon}</span>
                        <h3 className="font-semibold text-foreground">{item.label}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      <ul className="space-y-1.5">
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
              </div>
            ))}
          </TabsContent>

          {/* Key Concepts Tab */}
          <TabsContent value="concepts" className="space-y-4 animate-fade-in">
            {content.concepts.map((c, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-foreground">{c.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.content}</p>
              </div>
            ))}
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6 animate-fade-in">
            <CodeBlock title={content.example.title} language={content.example.language} code={content.example.code} />
            
            {hasAdditionalExamples && content.additionalExamples!.map((ex, i) => (
              <CodeBlock key={i} title={ex.title} language={ex.language} code={ex.code} />
            ))}
          </TabsContent>

          {/* When to Use Tab */}
          <TabsContent value="usage" className="animate-fade-in">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">When to Use This Integration</h2>
              <ul className="space-y-3">
                {content.whenToUse.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight size={14} className="text-accent" />
                    </div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DetailPage;
