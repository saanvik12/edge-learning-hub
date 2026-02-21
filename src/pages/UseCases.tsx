import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useCases } from "@/data/use-cases";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const UseCases = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="text-2xl font-bold text-foreground mt-1">Adobe Use Cases</h1>
        <p className="text-muted-foreground text-sm mt-1">End-to-end scenarios combining multiple Adobe Experience Cloud products</p>
      </div>
    </header>

    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Accordion type="single" collapsible className="space-y-4">
        {useCases.map((uc) => (
          <AccordionItem key={uc.id} value={uc.id} className="border rounded-xl px-5 bg-card">
            <AccordionTrigger className="hover:no-underline py-5">
              <div className="text-left">
                <h3 className="font-semibold text-foreground text-base">{uc.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 font-normal">{uc.summary}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 space-y-8">
              {/* Products involved */}
              <div className="flex flex-wrap gap-2">
                {uc.products.map(p => (
                  <span key={p} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{p}</span>
                ))}
              </div>

              {/* Narrative */}
              <div className="space-y-3">
                {uc.narrative.map((p, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
                ))}
              </div>

              {/* Flow */}
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-3">Product Flow</h4>
                <div className="space-y-0">
                  {uc.flow.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                          {i + 1}
                        </div>
                        {i < uc.flow.length - 1 && <div className="w-0.5 h-6 bg-border" />}
                      </div>
                      <div className="pt-1 pb-3">
                        <p className="text-sm font-medium text-foreground">{step.label} <span className="text-xs text-muted-foreground">({step.product})</span></p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Takeaways */}
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-2">Key Takeaways</h4>
                <ul className="space-y-2">
                  {uc.keyTakeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight size={14} className="text-use-case shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  </div>
);

export default UseCases;
