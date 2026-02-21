import { useParams, Link } from "react-router-dom";
import { detailContent } from "@/data/detail-content";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-foreground mt-1">{content.title}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-10">
        {/* Overview */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Overview</h2>
          <div className="space-y-3">
            {content.overview.map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>
            ))}
          </div>
        </section>

        {/* How It Works - Flow */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">How It Works</h2>
          <div className="space-y-0">
            {content.flow.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                    {i + 1}
                  </div>
                  {i < content.flow.length - 1 && <div className="w-0.5 h-8 bg-border" />}
                </div>
                <div className="pt-1.5 pb-4">
                  <p className="font-medium text-foreground text-sm">{step.label}</p>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Concepts */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Key Concepts</h2>
          <Accordion type="multiple" className="w-full">
            {content.concepts.map((c, i) => (
              <AccordionItem key={i} value={`concept-${i}`}>
                <AccordionTrigger className="text-sm">{c.title}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed text-sm">{c.content}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Example */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Example</h2>
          <div className="rounded-lg border border-border bg-muted/50 overflow-hidden">
            <div className="px-4 py-2 border-b border-border bg-muted">
              <p className="text-xs font-medium text-muted-foreground">{content.example.title}</p>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="font-mono text-foreground whitespace-pre">{content.example.code}</code>
            </pre>
          </div>
        </section>

        {/* When to Use */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">When to Use</h2>
          <ul className="space-y-2">
            {content.whenToUse.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ChevronRight size={16} className="text-primary shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DetailPage;
