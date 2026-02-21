export type TileCategory = "adobe" | "akamai" | "use-cases";

export interface Tile {
  id: string;
  title: string;
  subtitle: string;
  category: TileCategory;
  icon: string; // lucide icon name
}

export const adobeTiles: Tile[] = [
  { id: "aep-rtcdp", title: "AEP → RTCDP", subtitle: "Profile activation & audience distribution", category: "adobe", icon: "Users" },
  { id: "aep-ajo", title: "AEP → AJO", subtitle: "Real-time events triggering journeys", category: "adobe", icon: "Send" },
  { id: "aep-cja", title: "AEP → CJA", subtitle: "Dataset connections for cross-channel analytics", category: "adobe", icon: "BarChart3" },
  { id: "rtcdp-destinations", title: "RTCDP → Destinations", subtitle: "Segment activation to ad platforms & more", category: "adobe", icon: "Share2" },
  { id: "cja-rtcdp", title: "CJA → RTCDP", subtitle: "Publishing computed audiences back for activation", category: "adobe", icon: "RefreshCw" },
  { id: "ajo-cja", title: "AJO → CJA", subtitle: "Journey event analysis & reporting", category: "adobe", icon: "LineChart" },
  { id: "launch-aep", title: "Launch/Tags → AEP", subtitle: "Web SDK event collection into AEP", category: "adobe", icon: "Tag" },
  { id: "launch-target", title: "Launch → Target", subtitle: "Delivering personalization experiences", category: "adobe", icon: "Target" },
  { id: "launch-analytics", title: "Launch → Analytics", subtitle: "Sending analytics hits via Web SDK", category: "adobe", icon: "Activity" },
  { id: "target-aep-cja", title: "Target → AEP / CJA", subtitle: "Decision data feeding back for reporting", category: "adobe", icon: "ArrowLeftRight" },
  { id: "genstudio-ajo", title: "GenStudio → AJO", subtitle: "AI content assets used in campaigns", category: "adobe", icon: "Sparkles" },
  { id: "eds-aep", title: "EDS → AEP", subtitle: "Page interaction events via Web SDK", category: "adobe", icon: "FileText" },
  { id: "source-connectors-aep", title: "Source Connectors → AEP", subtitle: "CRM & cloud batch ingestion", category: "adobe", icon: "Database" },
  { id: "streaming-api-aep", title: "Streaming API → AEP", subtitle: "Server-side HTTP ingestion", category: "adobe", icon: "Radio" },
  { id: "mobile-sdk-aep", title: "Mobile SDK → AEP", subtitle: "iOS/Android events via Edge Network", category: "adobe", icon: "Smartphone" },
];

export const akamaiTiles: Tile[] = [
  { id: "akamai-dns", title: "DNS & Edge DNS", subtitle: "Record types, TTLs, authoritative DNS", category: "akamai", icon: "Globe" },
  { id: "akamai-tls", title: "HTTPS / TLS & Certificates", subtitle: "Handshake, cert types, chain of trust", category: "akamai", icon: "Lock" },
  { id: "akamai-waf", title: "WAF & DDoS Protection", subtitle: "Rules, tuning, rate control", category: "akamai", icon: "Shield" },
  { id: "akamai-edgeworkers", title: "EdgeWorkers", subtitle: "JavaScript at the edge", category: "akamai", icon: "Zap" },
  { id: "akamai-bot-manager", title: "Bot Manager", subtitle: "Bot classification & mitigation", category: "akamai", icon: "Bot" },
  { id: "akamai-terraform-jenkins", title: "Terraform & Jenkins", subtitle: "Infrastructure as Code & CI/CD for Akamai", category: "akamai", icon: "Wrench" },
  { id: "akamai-product-map", title: "Akamai Product Map", subtitle: "Delivery, Security, Compute pillars", category: "akamai", icon: "Map" },
];

export const useCasesTile: Tile = {
  id: "use-cases",
  title: "Adobe Use Cases",
  subtitle: "End-to-end scenarios combining multiple Adobe products",
  category: "use-cases",
  icon: "BookOpen",
};

export const allTiles: Tile[] = [...adobeTiles, ...akamaiTiles, useCasesTile];
