import { useState } from "react";
import { ArrowRight, ArrowLeft, Lock, CheckCircle, ShieldCheck } from "lucide-react";

interface Step {
  id: number;
  from: "browser" | "server";
  label: string;
  sublabel?: string;
  details: string[];
  color: "muted" | "accent";
}

const steps: Step[] = [
  {
    id: 0,
    from: "browser",
    label: "TCP SYN → SYN-ACK → ACK",
    sublabel: "Layer 4 — Not TLS yet",
    details: [
      "Browser opens a plain TCP connection to the edge IP (from DNS)",
      "3-way handshake: SYN → SYN-ACK → ACK",
      "Takes ~1 round-trip (RTT) of latency",
      "This is the raw \"pipe\" — no encryption yet",
    ],
    color: "muted",
  },
  {
    id: 1,
    from: "browser",
    label: "Client Hello",
    sublabel: "\"Here's what I support\"",
    details: [
      "Supported TLS versions (1.2, 1.3)",
      "Cipher suites (AES-256-GCM, ChaCha20-Poly1305)",
      "Random number (for key uniqueness)",
      "SNI: \"www.example.com\" (unencrypted — ISP can see this!)",
      "Key share: Browser's ECDHE public key (X25519)",
      "TLS 1.3 sends key share upfront → saves a round trip vs 1.2",
    ],
    color: "accent",
  },
  {
    id: 2,
    from: "server",
    label: "Server Hello + Certificate",
    sublabel: "\"Here's my proof + my key\"",
    details: [
      "Chosen cipher suite (e.g. TLS_AES_256_GCM_SHA384)",
      "Server's random number",
      "Server's ECDHE public key share",
      "Server certificate (\"I am www.example.com\")",
      "Certificate chain → Intermediate CA → Root CA",
      "All bundled in ONE message — that's why 1.3 is faster",
      "Parts already encrypted with temporary keys from key shares",
    ],
    color: "accent",
  },
  {
    id: 3,
    from: "browser",
    label: "Certificate Validation",
    sublabel: "\"Can I trust this server?\"",
    details: [
      "Domain match? (CN or SAN = www.example.com)",
      "Not expired? Issued by a trusted CA?",
      "Chain intact? (leaf → intermediate → root in browser's trust store)",
      "Not revoked? (OCSP stapling from server, or CRL)",
      "If ANY check fails → scary \"Connection not private\" warning",
      "Browser has ~150 pre-installed root CAs (Mozilla, Apple, etc.)",
    ],
    color: "muted",
  },
  {
    id: 4,
    from: "browser",
    label: "Key Derivation",
    sublabel: "\"Agreeing on a secret without saying it\"",
    details: [
      "Both sides compute shared secret from ECDHE key exchange",
      "Browser's private key + Server's public key = same result",
      "Server's private key + Browser's public key = same result",
      "Neither side ever sends the secret over the wire",
      "Derive symmetric encryption keys (AES) from shared secret",
      "Separate keys: one for browser→server, one for server→browser",
    ],
    color: "muted",
  },
  {
    id: 5,
    from: "browser",
    label: "Finished ↔ Finished",
    sublabel: "\"Handshake confirmed\"",
    details: [
      "Both sides send encrypted \"Finished\" messages",
      "Includes hash of entire handshake transcript",
      "Proves nothing was tampered with during setup",
      "If hashes match → TLS connection is established",
      "Total from Client Hello → Finished: just 1 RTT!",
    ],
    color: "accent",
  },
  {
    id: 6,
    from: "browser",
    label: "GET /index.html (Encrypted)",
    sublabel: "Application data flows",
    details: [
      "Browser sends HTTP request — fully encrypted",
      "Server decrypts, processes (cache or origin fetch), responds encrypted",
      "All future data on this connection stays encrypted",
      "Total handshake time: ~50ms for fresh connections",
    ],
    color: "accent",
  },
  {
    id: 7,
    from: "browser",
    label: "0-RTT Session Resumption",
    sublabel: "Returning visitors only",
    details: [
      "Server gave browser a \"session ticket\" (encrypted blob)",
      "Next visit: Client Hello + ticket + early data (GET request) in one message",
      "Server resumes instantly — 0 round trips for handshake!",
      "Caveat: 0-RTT data can be replayed → only for safe/idempotent requests (GET, not POST)",
    ],
    color: "muted",
  },
];

const TlsSequenceDiagram = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="rounded-xl border-2 border-accent/20 bg-card p-6 mb-10">
      <div className="flex items-center gap-2 mb-6">
        <Lock size={20} className="text-accent" />
        <h3 className="text-xl font-bold text-foreground">TLS 1.3 Handshake — Sequence Diagram</h3>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-0 mb-2">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border">
            <span className="text-lg">🖥️</span>
            <div>
              <p className="font-bold text-foreground text-sm">Browser</p>
              <p className="text-[10px] text-muted-foreground">Client</p>
            </div>
          </div>
        </div>
        <div className="w-16" />
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20">
            <span className="text-lg">🌐</span>
            <div>
              <p className="font-bold text-foreground text-sm">Akamai Edge</p>
              <p className="text-[10px] text-muted-foreground">Server</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lifelines + messages */}
      <div className="relative">
        {/* Vertical lifelines */}
        <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-border z-0" style={{ transform: "translateX(-50%)" }} />
        <div className="absolute right-1/4 top-0 bottom-0 w-0.5 bg-border z-0" style={{ transform: "translateX(50%)" }} />

        {steps.map((step, i) => {
          const isActive = activeStep === i;
          const isFromBrowser = step.from === "browser";

          return (
            <div key={step.id} className="relative z-10">
              {/* Message arrow row */}
              <button
                onClick={() => setActiveStep(isActive ? null : i)}
                className={`w-full grid grid-cols-[1fr_auto_1fr] gap-0 items-center py-3 px-2 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "bg-accent/10 border border-accent/20"
                    : "hover:bg-muted/50"
                }`}
              >
                {/* Left side */}
                <div className={`text-right pr-3 ${!isFromBrowser ? "opacity-0" : ""}`}>
                  <p className={`text-xs font-bold ${step.color === "accent" ? "text-accent" : "text-muted-foreground"}`}>
                    {step.label}
                  </p>
                  {step.sublabel && (
                    <p className="text-[10px] text-muted-foreground">{step.sublabel}</p>
                  )}
                </div>

                {/* Arrow */}
                <div className="w-16 flex items-center justify-center">
                  <div className="flex items-center gap-0 w-full">
                    {isFromBrowser ? (
                      <>
                        <div className={`flex-1 h-0.5 ${step.color === "accent" ? "bg-accent" : "bg-muted-foreground/40"}`} />
                        <ArrowRight size={14} className={`-ml-1 ${step.color === "accent" ? "text-accent" : "text-muted-foreground/40"}`} />
                      </>
                    ) : (
                      <>
                        <ArrowLeft size={14} className={`-mr-1 ${step.color === "accent" ? "text-accent" : "text-muted-foreground/40"}`} />
                        <div className={`flex-1 h-0.5 ${step.color === "accent" ? "bg-accent" : "bg-muted-foreground/40"}`} />
                      </>
                    )}
                  </div>
                </div>

                {/* Right side */}
                <div className={`text-left pl-3 ${isFromBrowser ? "opacity-0" : ""}`}>
                  <p className={`text-xs font-bold ${step.color === "accent" ? "text-accent" : "text-muted-foreground"}`}>
                    {step.label}
                  </p>
                  {step.sublabel && (
                    <p className="text-[10px] text-muted-foreground">{step.sublabel}</p>
                  )}
                </div>
              </button>

              {/* Expanded detail panel */}
              {isActive && (
                <div className="mx-8 mb-3 p-4 rounded-lg border border-accent/20 bg-accent/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold">
                      {i + 1}
                    </div>
                    <p className="font-bold text-foreground text-sm">{step.label}</p>
                  </div>
                  <ul className="space-y-1.5 ml-8">
                    {step.details.map((d, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle size={10} className="text-accent shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Step divider label */}
              {i === 0 && (
                <div className="flex items-center justify-center my-1">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                    <ShieldCheck size={12} className="text-accent" />
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider">TLS 1.3 Handshake Begins (1-RTT)</span>
                  </div>
                </div>
              )}
              {i === 5 && (
                <div className="flex items-center justify-center my-1">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                    <Lock size={12} className="text-accent" />
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider">🔒 Encrypted Tunnel Established</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer legend */}
      <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-accent" />
          <span>TLS protocol message</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-muted-foreground/40" />
          <span>Local / non-TLS step</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Click any step</span>
          <span>for details</span>
        </div>
      </div>
    </div>
  );
};

export default TlsSequenceDiagram;
