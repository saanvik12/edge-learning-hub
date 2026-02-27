export interface CodeExample {
  title: string;
  language: string;
  code: string;
}

export interface PipelineBlock {
  label: string;
  description: string;
  badge?: string;
  badgeColor?: "primary" | "secondary" | "accent" | "muted";
}

export interface ConceptItem {
  title: string;
  content: string;
  codeSnippet?: { language: string; code: string };
}

export interface VisualBlock {
  icon: string;
  label: string;
  description: string;
  items: string[];
}

export interface ComparisonItem {
  icon: string;
  label: string;
  description: string;
  points: string[];
}

export interface ComparisonGroup {
  title: string;
  description: string;
  items: ComparisonItem[];
  tip?: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface GlossaryGroup {
  title: string;
  color: "primary" | "secondary" | "accent";
  terms: GlossaryTerm[];
}

export interface RichPageData {
  id: string;
  hero: {
    badge1: { label: string; color: "primary" | "secondary" | "accent" };
    badge2?: { label: string; color: "primary" | "secondary" | "accent" };
    title: string;
    subtitle: string;
    description: string;
    highlights: { icon: string; label: string; detail: string }[];
    mentalModel?: string;
  };
  architecture: {
    sectionLabel: string;
    title: string;
    description: string;
    pipeline: PipelineBlock[];
  };
  concepts: ConceptItem[];
  visualBlocks?: VisualBlock[];
  comparisons?: ComparisonGroup[];
  codeExamples: CodeExample[];
  glossary: GlossaryGroup[];
  tips?: string[];
  whenToUse?: string[];
}
