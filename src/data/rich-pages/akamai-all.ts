import type { RichPageData } from "@/components/rich-detail/types";

export const akamaiPages: Record<string, RichPageData> = {
  "akamai-dns": {
    id: "akamai-dns",
    hero: {
      badge1: { label: "DNS", color: "accent" },
      title: "DNS & Edge DNS",
      subtitle: "Record Types, TTLs, Authoritative DNS",
      description: "DNS translates human-readable domain names into IP addresses. Akamai Edge DNS provides an authoritative DNS solution with global anycast distribution, DDoS protection, and sub-second propagation — critical for high-availability applications.",
      highlights: [
        { icon: "🌍", label: "Global Anycast", detail: "DNS queries answered from the nearest Akamai PoP" },
        { icon: "🛡️", label: "DDoS-Resilient", detail: "Distributed infrastructure absorbs volumetric attacks" },
        { icon: "⚡", label: "Sub-second Propagation", detail: "Zone changes visible globally in <1 second" },
        { icon: "🔒", label: "DNSSEC Built-in", detail: "Automated key rotation, cryptographic integrity" },
      ],
      mentalModel: "DNS is the internet's phone book — but understanding the full resolution path is what separates a developer from a sysadmin. When you type www.example.com, your browser doesn't magically know the IP. It asks a recursive resolver (your ISP's DNS server, or 8.8.8.8 / 1.1.1.1) to do the heavy lifting. That resolver systematically walks a hierarchy: root servers → TLD servers → authoritative nameservers, caching each answer along the way. With Akamai Edge DNS, the authoritative nameservers are distributed across 1000+ PoPs globally, answering queries from the nearest anycast location. The IP returned may point directly to an Akamai CDN edge server — meaning the user's browser connects to a nearby cache, not your distant origin.",
    },
    architecture: {
      sectionLabel: "DNS Resolution",
      title: "How a DNS Query Resolves — The Complete Flow",
      description: "Here's the real, complete flow — step by step — including where caching happens to make it fast in real life. This is what actually happens when you type www.example.com and press Enter.",
      pipeline: [
        { label: "1. Browser / OS Stub Resolver", description: "You type www.example.com → the OS stub resolver needs an IP. It sends a DNS query: 'What's the A/AAAA record for www.example.com?'", badgeColor: "muted" },
        { label: "2. Recursive Resolver (the key middleman)", description: "This is NOT your router. It's your ISP's DNS server (assigned via DHCP) or a public resolver you configured (8.8.8.8, 1.1.1.1). It does all the chasing for you.", badgeColor: "muted" },
        { label: "3. Cache Check", description: "The recursive resolver first checks its own cache. If it recently resolved www.example.com for anyone, it returns the IP immediately (<10ms). If not cached → it starts the full lookup.", badgeColor: "muted" },
        { label: "4. Root Nameserver", description: "~13 root server clusters worldwide (Verisign, NASA, universities, etc.). The resolver asks: 'Who handles .com?' Root answers: 'Here are the .com TLD nameserver IPs (a.gtld-servers.net, etc.)'", badgeColor: "muted" },
        { label: "5. TLD Nameserver (.com)", description: "The resolver asks a .com TLD server: 'Who is authoritative for example.com?' TLD answers: 'The authoritative nameservers are ns1.example.com (often Akamai, Cloudflare, Route 53, etc.)'", badgeColor: "muted" },
        { label: "6. Authoritative Nameserver", description: "The resolver contacts the domain's own nameserver (e.g., Akamai Edge DNS): 'What's the A/AAAA for www.example.com?' It replies with the actual IP(s), or a CNAME alias → requiring another lookup.", badge: "Akamai", badgeColor: "accent" },
        { label: "7. IP Returned + Cached", description: "The recursive resolver sends the IP back to your browser/OS. It also caches the result based on TTL (Time to Live) set by the domain owner — minutes to hours.", badgeColor: "muted" },
        { label: "8. Browser Connects", description: "Now the browser makes a real TCP connection (HTTPS) to the resolved IP — which could be your origin server directly, or a CDN edge server (Akamai, Cloudflare, Fastly) that proxies to your origin.", badgeColor: "accent" },
      ],
    },
    concepts: [
      { title: "The Recursive Resolver — The Unsung Hero", content: "The recursive resolver is the most important piece most developers overlook. It's the 'middleman' that does all the hard work. When your browser asks 'what's the IP for www.example.com?', it sends that question to the recursive resolver — which then walks the entire DNS hierarchy (root → TLD → authoritative) on your behalf. Crucially, it caches every answer it gets, so the next person asking for the same domain gets an instant response. This is why DNS feels 'instant' in practice: someone else already resolved it recently. Common recursive resolvers: your ISP's default (auto-configured via DHCP), Google Public DNS (8.8.8.8 / 8.8.4.4), Cloudflare (1.1.1.1), Quad9 (9.9.9.9)." },
      { title: "Caching — Why DNS Is Actually Fast", content: "In the real world, the full 8-step resolution almost never happens. Here's why: (1) Browser cache: Chrome/Firefox cache DNS for 60 seconds independently. (2) OS cache: your OS has its own DNS cache (check with ipconfig /displaydns on Windows). (3) Recursive resolver cache: your ISP's resolver serves millions of users — odds are someone already resolved google.com recently. (4) Each DNS response includes a TTL (Time to Live) that tells caches how long to keep the answer. Short TTL (60-300s): fast failover, but more queries and slower for cold users. Long TTL (3600-86400s): faster resolution for everyone, but slow propagation when you change records. Best practice: long TTLs for stable records, temporarily lower TTLs before planned changes, restore after." },
      { title: "CNAME Chasing — When One Lookup Becomes Two", content: "Sometimes the authoritative nameserver doesn't return an IP directly. Instead it returns a CNAME (alias): www.example.com → edge-lb-123.akamaiedge.net. The recursive resolver now has to do ANOTHER full lookup for that new hostname. This is called 'CNAME chasing.' It adds latency (another round of root → TLD → auth), which is why you should avoid long CNAME chains. In CDN setups, CNAMEs are standard: your www points to a CDN hostname, which resolves to the nearest edge IP. Akamai's CNAME typically looks like: www.example.com → www.example.com.edgekey.net → e12345.dscx.akamaiedge.net → final edge IP." },
      { title: "Record Types — The Full Picture", content: "A records map domains to IPv4 addresses. AAAA records map to IPv6. CNAME records alias one domain to another (www → example.com.edgekey.net). MX records direct email to mail servers (with priority numbers). TXT records hold metadata — SPF (email sender verification), DKIM (email signatures), domain verification tokens. NS records delegate authority for a zone to specific nameservers. SOA records define zone parameters (serial number, refresh intervals, TTLs, admin email). SRV records specify service locations (used by protocols like SIP, LDAP). HTTPS/SVCB records (modern) advertise that a domain supports HTTP/2 or HTTP/3 and provide connection parameters upfront, reducing round trips." },
      { title: "Authoritative vs. Recursive DNS — Know the Difference", content: "This is the #1 confusion in DNS. Authoritative DNS servers are the 'source of truth' for a zone — they hold and serve the actual records. You (or your DNS provider like Akamai Edge DNS) configure records on authoritative servers. Recursive resolvers (like 8.8.8.8 or your ISP's server) query authoritative servers on behalf of clients and cache the results. They don't store records — they discover and cache them. Analogy: Authoritative DNS = the library that owns the books. Recursive resolver = the librarian who finds and fetches books for you (and remembers where they are for next time)." },
      { title: "DNSSEC — Cryptographic Trust Chain", content: "DNS Security Extensions (DNSSEC) adds cryptographic signatures to DNS records, preventing spoofing and cache poisoning. Without DNSSEC, a malicious resolver could return fake IPs (DNS hijacking). The chain of trust mirrors the DNS hierarchy: root zone signs → .com TLD signs → your zone signs. Each level validates the next level's keys using DS (Delegation Signer) records. Akamai Edge DNS supports DNSSEC with automated key rotation — you enable it, and Akamai handles the DNSKEY, RRSIG, and DS record management." },
      { title: "Zone Apex (Naked Domain) Problem", content: "The zone apex (example.com without 'www') cannot use a CNAME per RFC 1034 — because a CNAME means 'this name is an alias, ignore all other records for it', which conflicts with the SOA and NS records that MUST exist at the apex. This is a real problem for CDN setups where you want example.com → akamai-edge.net. Solutions: (1) Use an A record pointing directly to Akamai IPs (but IPs can change). (2) Akamai's ALIAS/ANAME record — a non-standard extension that resolves a CNAME at query time and returns an A record to the client. (3) Cloudflare calls this 'CNAME flattening.' All solve the same problem differently." },
      { title: "Anycast — Same IP, Multiple Locations", content: "Anycast is the networking technique that makes global DNS fast. The same IP address is announced (via BGP) from hundreds of locations worldwide. When you send a DNS query to an anycast IP, BGP routing delivers it to the nearest announcing location automatically. This is how root servers work (13 'logical' servers, but ~1500 actual instances globally), and it's how Akamai Edge DNS achieves global coverage from 1000+ PoPs. Anycast also provides natural DDoS resilience — attack traffic is distributed across all announcing locations instead of hitting a single server." },
    ],
    comparisons: [
      {
        title: "Standard DNS vs. Edge DNS",
        description: "Why organizations move from traditional DNS to Akamai's Edge DNS.",
        items: [
          { icon: "🏢", label: "Standard DNS (Registrar)", description: "Basic DNS hosting from your domain registrar.", points: ["2-4 nameservers in limited locations", "No DDoS protection", "TTL propagation: minutes to hours", "Manual record management", "No SLA guarantee typically"] },
          { icon: "🚀", label: "Akamai Edge DNS", description: "Enterprise authoritative DNS on Akamai's global network.", points: ["1000+ PoPs with anycast", "Built-in DDoS absorption (volumetric, protocol)", "Sub-second propagation across the network", "API-driven record management", "100% uptime SLA"] },
        ],
      },
    ],
    codeExamples: [
      { title: "dig Command — Query DNS Records", language: "bash", code: `# Query A record
$ dig www.example.com A +short
203.0.113.50

# Query with full details
$ dig www.example.com A
;; ANSWER SECTION:
www.example.com.  300  IN  A  203.0.113.50

;; AUTHORITY SECTION:
example.com.  86400  IN  NS  a1-123.akam.net.
example.com.  86400  IN  NS  a2-456.akam.net.

# Query CNAME
$ dig shop.example.com CNAME +short
shop.example.com.edgekey.net.

# Trace full resolution path
$ dig www.example.com +trace
;; Received from root → .com TLD → akam.net → final answer

# Query MX records
$ dig example.com MX +short
10 mail1.example.com.
20 mail2.example.com.` },
      { title: "Edge DNS Zone File (Conceptual)", language: "text", code: `; Zone: example.com
; Hosted on Akamai Edge DNS
$TTL 3600

; SOA Record
@  IN  SOA  a1-123.akam.net. admin.example.com. (
    2024011501  ; Serial
    3600        ; Refresh
    900         ; Retry
    604800      ; Expire
    300         ; Minimum TTL
)

; Nameserver Records
@  IN  NS  a1-123.akam.net.
@  IN  NS  a2-456.akam.net.

; A Records
@      IN  A     203.0.113.50      ; Zone apex
www    IN  CNAME example.com.edgekey.net.  ; CDN
api    IN  A     203.0.113.51      ; API server

; MX Records
@      IN  MX  10  mail1.example.com.
@      IN  MX  20  mail2.example.com.

; TXT Records (SPF, DKIM)
@      IN  TXT  "v=spf1 include:_spf.google.com ~all"
dkim   IN  TXT  "v=DKIM1; k=rsa; p=MIGfMA0..."` },
    ],
    glossary: [
      { title: "DNS Terms", color: "accent", terms: [
        { term: "A Record", definition: "Maps domain to IPv4 address" },
        { term: "AAAA Record", definition: "Maps domain to IPv6 address" },
        { term: "CNAME", definition: "Canonical Name — aliases one domain to another" },
        { term: "MX Record", definition: "Mail Exchange — directs email to mail servers" },
        { term: "TXT Record", definition: "Text record for metadata (SPF, DKIM, verification)" },
        { term: "NS Record", definition: "Nameserver — delegates authority for a zone" },
        { term: "SOA", definition: "Start of Authority — defines zone parameters" },
        { term: "TTL", definition: "Time to Live — cache duration in seconds" },
        { term: "Anycast", definition: "Same IP announced from multiple locations; nearest responds" },
        { term: "DNSSEC", definition: "Cryptographic signatures preventing DNS spoofing" },
        { term: "Zone Apex", definition: "The naked domain (example.com) without any subdomain" },
        { term: "Recursive Resolver", definition: "DNS server that queries on behalf of clients (e.g., 8.8.8.8)" },
      ]},
    ],
    tips: [
      "Use short TTLs (60-300s) before planned DNS changes, then restore long TTLs after propagation",
      "Always set up both A and AAAA records for IPv6 support — it's increasingly important",
      "Use dig +trace to debug DNS resolution issues — it shows the complete resolution path",
      "Enable DNSSEC on Edge DNS to prevent cache poisoning and man-in-the-middle attacks",
    ],
    whenToUse: [
      "You need authoritative DNS with 100% uptime SLA and DDoS protection",
      "Global users require fast DNS resolution from nearby anycast PoPs",
      "DNS-based traffic management (failover, geo-routing) is needed",
      "DNSSEC is required for security compliance",
    ],
  },

  "akamai-tls": {
    id: "akamai-tls",
    hero: {
      badge1: { label: "TLS", color: "accent" },
      title: "HTTPS / TLS & Certificates",
      subtitle: "Handshake, Cert Types, Chain of Trust",
      description: "TLS (Transport Layer Security) encrypts data between browser and server. Understanding the TLS handshake, certificate types, and chain of trust is essential for configuring HTTPS on Akamai's CDN — where TLS termination happens at the edge.",
      highlights: [
        { icon: "🔒", label: "Edge TLS", detail: "TLS terminated at Akamai edge, not your origin" },
        { icon: "📜", label: "Certificate Management", detail: "DV, OV, EV certs with auto-renewal" },
      ],
      mentalModel: "When a user connects to your HTTPS site on Akamai, the TLS handshake happens at the nearest edge server — not at your origin. This means: faster handshakes (closer server), Akamai manages the certificate lifecycle, and your origin can optionally use a simpler cert or even HTTP for the Akamai→origin connection.",
    },
    architecture: {
      sectionLabel: "TLS Handshake",
      title: "How HTTPS Connection Establishes",
      description: "The TLS 1.3 handshake completes in a single round trip (1-RTT), down from 2-RTT in TLS 1.2.",
      pipeline: [
        { label: "Client Hello", description: "Browser sends supported ciphers, TLS version, random", badgeColor: "muted" },
        { label: "Server Hello", description: "Edge server picks cipher, sends cert + key share", badge: "Edge", badgeColor: "accent" },
        { label: "Verify Cert", description: "Browser validates cert chain up to trusted root CA", badgeColor: "muted" },
        { label: "Key Exchange", description: "Both sides compute shared secret (ECDHE)", badgeColor: "muted" },
        { label: "Encrypted Data", description: "Application data flows over encrypted channel", badgeColor: "accent" },
      ],
    },
    concepts: [
      { title: "Certificate Types", content: "DV (Domain Validation): proves domain ownership via DNS/HTTP challenge — fastest, cheapest, shows padlock. OV (Organization Validation): verifies the organization exists — takes 1-3 days, shows org name in cert details. EV (Extended Validation): rigorous business verification — shows org name, highest trust level. For CDN use, DV is standard; EV is for high-trust pages (banking, government)." },
      { title: "Chain of Trust", content: "A certificate chain goes: your cert (leaf) → intermediate CA → root CA. Browsers trust root CAs pre-installed in their trust store. The intermediate cert bridges the gap between your leaf cert and the root. Missing intermediates cause 'untrusted certificate' errors. Akamai manages the full chain when you use their managed certificates." },
      { title: "TLS 1.2 vs. TLS 1.3", content: "TLS 1.3 (2018) improved on 1.2: 1-RTT handshake (vs. 2-RTT), removed insecure ciphers (RC4, 3DES, SHA-1), mandatory forward secrecy (ECDHE), and simpler cipher suite negotiation. TLS 1.3 also supports 0-RTT resumption for returning visitors, though with replay attack considerations. Akamai supports both but recommends TLS 1.3 minimum." },
      { title: "SNI (Server Name Indication)", content: "SNI is a TLS extension that sends the requested hostname in the Client Hello (unencrypted). This allows a single IP address to serve multiple HTTPS sites with different certificates. Without SNI, each domain needed a dedicated IP. All modern browsers support SNI. ECH (Encrypted Client Hello) is the emerging replacement that encrypts the hostname." },
      { title: "Certificate Pinning", content: "Certificate pinning tells the browser to only accept specific certificates for your domain — preventing MITM attacks even if a CA is compromised. However, pinning is risky: if you rotate certs without updating pins, your site breaks. HPKP (HTTP Public Key Pinning) is deprecated. Modern alternative: Certificate Transparency (CT) logs." },
    ],
    comparisons: [
      {
        title: "TLS 1.2 vs. TLS 1.3",
        description: "Key differences between the two current TLS versions.",
        items: [
          { icon: "📦", label: "TLS 1.2 (2008)", description: "Widely supported, more cipher flexibility.", points: ["2-RTT handshake (slower)", "Supports legacy ciphers (some insecure)", "Forward secrecy optional (ECDHE or RSA)", "Server certificate sent in cleartext", "Still required for some legacy clients"] },
          { icon: "⚡", label: "TLS 1.3 (2018)", description: "Faster, simpler, more secure by default.", points: ["1-RTT handshake (50% faster)", "Only secure ciphers (AEAD: AES-GCM, ChaCha20)", "Forward secrecy mandatory (ECDHE only)", "Server certificate encrypted", "0-RTT resumption for returning visitors"] },
        ],
        tip: "Configure Akamai to prefer TLS 1.3 but allow TLS 1.2 fallback for older clients. Disable TLS 1.0 and 1.1 entirely.",
      },
    ],
    codeExamples: [
      { title: "openssl — Inspect TLS Certificate", language: "bash", code: `# Check certificate details
$ openssl s_client -connect www.example.com:443 -servername www.example.com

# Output (abbreviated):
Certificate chain
 0 s:CN = www.example.com
   i:C = US, O = DigiCert Inc, CN = DigiCert SHA2 Extended Validation Server CA
 1 s:C = US, O = DigiCert Inc, CN = DigiCert SHA2 Extended Validation Server CA
   i:C = US, O = DigiCert Inc, OU = www.digicert.com, CN = DigiCert Global Root CA

Server certificate:
  subject: CN = www.example.com
  issuer:  DigiCert SHA2 EV Server CA
  serial:  0A:12:34:56:78:9A:BC:DE
  notBefore: Jan  1 00:00:00 2024 GMT
  notAfter:  Dec 31 23:59:59 2024 GMT

SSL-Session:
  Protocol  : TLSv1.3
  Cipher    : TLS_AES_256_GCM_SHA384

# Test specific TLS version
$ openssl s_client -connect www.example.com:443 -tls1_3
$ openssl s_client -connect www.example.com:443 -tls1_2` },
      { title: "Akamai Property — TLS Configuration", language: "json", code: `{
  "property": "www.example.com",
  "tlsSettings": {
    "minimumVersion": "TLSv1.2",
    "preferredVersion": "TLSv1.3",
    "cipherSuites": [
      "TLS_AES_256_GCM_SHA384",
      "TLS_CHACHA20_POLY1305_SHA256",
      "TLS_AES_128_GCM_SHA256",
      "ECDHE-RSA-AES256-GCM-SHA384"
    ],
    "ocspStapling": true,
    "hsts": {
      "enabled": true,
      "maxAge": 31536000,
      "includeSubdomains": true,
      "preload": true
    }
  },
  "certificate": {
    "type": "managed-dv",
    "autoRenewal": true,
    "enrollment": "cps-enrollment-12345"
  }
}` },
    ],
    glossary: [
      { title: "TLS & Certificate Terms", color: "accent", terms: [
        { term: "TLS", definition: "Transport Layer Security — protocol for encrypting data in transit" },
        { term: "Certificate (Cert)", definition: "Digital document proving a server's identity, signed by a CA" },
        { term: "CA", definition: "Certificate Authority — trusted entity that issues certificates" },
        { term: "DV / OV / EV", definition: "Domain, Organization, Extended Validation — cert trust levels" },
        { term: "Chain of Trust", definition: "Leaf cert → intermediate CA → root CA verification path" },
        { term: "SNI", definition: "Server Name Indication — hostname sent in TLS Client Hello" },
        { term: "ECDHE", definition: "Elliptic Curve Diffie-Hellman Ephemeral — key exchange algorithm" },
        { term: "Forward Secrecy", definition: "Past sessions can't be decrypted even if long-term key is compromised" },
        { term: "HSTS", definition: "HTTP Strict Transport Security — forces HTTPS connections" },
        { term: "OCSP Stapling", definition: "Server provides cert revocation status, reducing client lookups" },
        { term: "0-RTT", definition: "Zero round-trip resumption for returning TLS 1.3 visitors" },
      ]},
    ],
    tips: [
      "Enable HSTS with preload to force HTTPS and get added to browser preload lists",
      "Use OCSP stapling to speed up certificate validation and reduce CA server load",
      "Akamai manages cert renewal automatically for DV certs — set it and forget it",
      "Test cipher suite configuration with SSL Labs (ssllabs.com/ssltest) to verify A+ rating",
    ],
    whenToUse: [
      "You need to configure HTTPS for a site served through Akamai CDN",
      "Understanding TLS handshake mechanics for debugging connection issues",
      "Choosing between DV, OV, and EV certificates for different site sections",
      "Optimizing TLS performance (TLS 1.3, 0-RTT, OCSP stapling) for faster page loads",
    ],
  },

  "akamai-waf": {
    id: "akamai-waf",
    hero: {
      badge1: { label: "WAF", color: "accent" },
      title: "WAF & DDoS Protection",
      subtitle: "Rules, Tuning, Rate Control",
      description: "Akamai's Web Application Firewall (Kona Site Defender / App & API Protector) inspects HTTP/HTTPS traffic at the edge, blocking attacks like SQL injection, XSS, and DDoS before they reach your origin — all while minimizing false positives through adaptive tuning.",
      highlights: [
        { icon: "🛡️", label: "Edge Protection", detail: "Attacks blocked at the CDN layer, not your origin" },
        { icon: "🤖", label: "Adaptive Rules", detail: "ML-assisted rule tuning reduces false positives" },
      ],
      mentalModel: "Think of the WAF as a security guard at the front door (Akamai edge). Every HTTP request is inspected against rule sets before being forwarded to your origin. Rules detect attack patterns (SQLi, XSS, LFI, RFI, command injection), rate controls limit request frequency, and IP reputation blocks known bad actors. The key challenge is tuning: blocking attacks without blocking legitimate users.",
    },
    architecture: {
      sectionLabel: "Protection Pipeline",
      title: "How WAF Processes a Request",
      description: "Each request passes through multiple security layers before reaching your origin.",
      pipeline: [
        { label: "Client Request", description: "HTTP/HTTPS request arrives at Akamai edge", badgeColor: "muted" },
        { label: "IP Reputation", description: "Check client IP against threat intelligence", badge: "WAF", badgeColor: "accent" },
        { label: "Rate Control", description: "Verify request rate within configured limits", badge: "WAF", badgeColor: "accent" },
        { label: "WAF Rules", description: "Inspect payload against attack rule sets", badge: "WAF", badgeColor: "accent" },
        { label: "Origin Forward", description: "Clean request forwarded to your server", badgeColor: "muted" },
      ],
    },
    concepts: [
      { title: "Attack Groups (Rule Sets)", content: "WAF rules are organized into attack groups: SQL Injection (SQLi) — detects ' OR 1=1, UNION SELECT, etc. Cross-Site Scripting (XSS) — detects <script>, onerror=, javascript: URIs. Local File Inclusion (LFI) — detects ../../../etc/passwd. Remote File Inclusion (RFI) — detects http:// in parameters. Command Injection — detects ; ls, | cat, backtick commands." },
      { title: "Rule Actions & Modes", content: "Each rule can be set to: Alert (log but allow — for monitoring), Deny (block with 403), or Custom (redirect, serve custom error page). During initial deployment, run rules in Alert mode to identify false positives before switching to Deny. This 'tuning period' is critical — blocking legitimate traffic loses revenue." },
      { title: "Rate Controls", content: "Rate controls limit request frequency per client IP, session, or custom key. Example: 100 requests/second per IP to the login page. Exceeding the limit triggers an action (alert, deny, slow down). Rate controls are the first defense against application-layer DDoS (Layer 7) and credential stuffing attacks." },
      { title: "Custom Rules", content: "Beyond pre-built attack groups, you can create custom rules matching specific request patterns: geographic restrictions (block countries), URI path protection (admin pages), header validation (required API keys), request body size limits, and custom regex patterns. Custom rules run before or after the standard WAF rule sets." },
      { title: "Adaptive Security Engine", content: "Akamai's Adaptive Security Engine (ASE) uses ML to analyze your traffic patterns and suggest rule tuning. It identifies which rules generate false positives for your specific application, recommends exception rules, and can auto-tune sensitivity levels. This reduces the operational burden of WAF management." },
    ],
    comparisons: [
      {
        title: "WAF Layers of Protection",
        description: "Multiple security controls work together — each catches different attack types.",
        items: [
          { icon: "🌐", label: "Network DDoS Protection", description: "Absorbs volumetric attacks at the network layer.", points: ["Protects against SYN floods, UDP reflection, amplification", "Akamai's 1.3+ Tbps capacity absorbs largest attacks", "Automatic detection — no configuration needed", "Layer 3/4 protection"] },
          { icon: "🛡️", label: "Application WAF", description: "Inspects HTTP payloads for application-level attacks.", points: ["SQLi, XSS, LFI, RFI, command injection", "Request header, URI, body, cookie inspection", "Configurable rule sensitivity and exceptions", "Layer 7 protection"] },
          { icon: "⏱️", label: "Rate Controls", description: "Limits request frequency to prevent abuse.", points: ["Per-IP, per-session, or custom key limiting", "Protects login pages, APIs, checkout flows", "Configurable thresholds and time windows", "Application-layer DDoS defense"] },
        ],
      },
    ],
    codeExamples: [
      { title: "WAF Rule Configuration (Conceptual)", language: "json", code: `{
  "securityPolicy": "www.example.com-policy",
  "wafMode": "KRS",
  "attackGroups": {
    "SQL_INJECTION": { "action": "deny", "sensitivity": "high" },
    "CROSS_SITE_SCRIPTING": { "action": "deny", "sensitivity": "medium" },
    "LOCAL_FILE_INCLUSION": { "action": "deny", "sensitivity": "high" },
    "REMOTE_FILE_INCLUSION": { "action": "deny", "sensitivity": "high" },
    "COMMAND_INJECTION": { "action": "deny", "sensitivity": "high" },
    "PROTOCOL_ATTACK": { "action": "alert", "sensitivity": "low" }
  },
  "rateControls": [
    {
      "name": "Login Rate Limit",
      "path": "/api/login",
      "limit": 10,
      "period": 60,
      "clientIdentifier": "ip",
      "action": "deny"
    },
    {
      "name": "API Global Limit",
      "path": "/api/*",
      "limit": 100,
      "period": 10,
      "clientIdentifier": "ip+cookie",
      "action": "slow"
    }
  ],
  "customRules": [
    {
      "name": "Block Admin from External",
      "condition": "path MATCHES '/admin/*' AND NOT geo.country IN ['US', 'GB']",
      "action": "deny"
    }
  ]
}` },
      { title: "WAF Alert Log Entry", language: "json", code: `{
  "timestamp": "2024-01-15T14:30:22Z",
  "clientIp": "198.51.100.42",
  "requestUrl": "/search?q=' OR 1=1 --",
  "method": "GET",
  "rule": {
    "id": "950001",
    "group": "SQL_INJECTION",
    "message": "SQL Injection Attack Detected",
    "action": "DENY",
    "data": "Matched pattern: ' OR 1=1"
  },
  "response": {
    "status": 403,
    "customPage": "waf-block-page.html"
  },
  "geo": { "country": "RU", "city": "Moscow" },
  "reputation": { "score": 8, "category": "scanner" }
}` },
    ],
    glossary: [
      { title: "WAF & Security Terms", color: "accent", terms: [
        { term: "WAF", definition: "Web Application Firewall — inspects HTTP traffic for attacks" },
        { term: "SQLi", definition: "SQL Injection — injecting SQL commands through user input" },
        { term: "XSS", definition: "Cross-Site Scripting — injecting JavaScript into web pages" },
        { term: "LFI / RFI", definition: "Local/Remote File Inclusion — unauthorized file access" },
        { term: "DDoS", definition: "Distributed Denial of Service — overwhelming a target with traffic" },
        { term: "Rate Control", definition: "Limiting request frequency per client to prevent abuse" },
        { term: "False Positive", definition: "A legitimate request incorrectly blocked by a WAF rule" },
        { term: "KRS", definition: "Kona Rule Set — Akamai's managed WAF rule set" },
        { term: "ASE", definition: "Adaptive Security Engine — ML-assisted WAF tuning" },
        { term: "IP Reputation", definition: "Threat score assigned to an IP based on known behavior" },
      ]},
    ],
    tips: [
      "Always deploy WAF rules in Alert mode first — monitor for 1-2 weeks before switching to Deny",
      "Use rate controls on login, registration, and API endpoints to prevent credential stuffing",
      "Review WAF logs regularly for false positives — add exception rules for legitimate patterns",
      "Akamai's Adaptive Security Engine can auto-suggest tuning — leverage it to reduce operational burden",
    ],
    whenToUse: [
      "Your web application needs protection against OWASP Top 10 attacks",
      "DDoS protection is required at both network and application layers",
      "Rate limiting is needed for APIs, login pages, or checkout flows",
      "Security compliance (PCI DSS, SOC 2) requires a WAF in front of your application",
    ],
  },

  "akamai-edgeworkers": {
    id: "akamai-edgeworkers",
    hero: {
      badge1: { label: "EW", color: "accent" },
      title: "EdgeWorkers",
      subtitle: "JavaScript at the Edge",
      description: "Akamai EdgeWorkers lets you run custom JavaScript at the CDN edge — intercepting requests and responses to implement logic like A/B testing, header manipulation, geo-routing, API orchestration, and personalization without touching your origin server.",
      highlights: [
        { icon: "⚡", label: "Sub-10ms Execution", detail: "JavaScript runs at the nearest Akamai PoP" },
        { icon: "🔧", label: "Full Control", detail: "Modify requests, responses, headers, and bodies" },
      ],
      mentalModel: "EdgeWorkers are serverless functions deployed to Akamai's 4,000+ edge servers. They hook into the request/response lifecycle at four stages: onClientRequest (before origin), onOriginRequest (to origin), onOriginResponse (from origin), onClientResponse (to client). You write standard JavaScript, Akamai handles deployment, scaling, and execution at the edge.",
    },
    architecture: {
      sectionLabel: "Execution Pipeline",
      title: "EdgeWorker Lifecycle Hooks",
      description: "EdgeWorkers intercept the request/response flow at four stages.",
      pipeline: [
        { label: "Client Request", description: "onClientRequest — modify/redirect before origin", badge: "EW", badgeColor: "accent" },
        { label: "Origin Request", description: "onOriginRequest — modify request going to origin", badge: "EW", badgeColor: "accent" },
        { label: "Origin Response", description: "onOriginResponse — modify origin's response", badge: "EW", badgeColor: "accent" },
        { label: "Client Response", description: "onClientResponse — final modifications to client", badge: "EW", badgeColor: "accent" },
      ],
    },
    concepts: [
      { title: "Event Handlers", content: "onClientRequest: runs when request arrives at edge — best for redirects, A/B routing, auth checks. onOriginRequest: runs before forwarding to origin — modify headers, change origin path. onOriginResponse: runs when origin responds — modify response headers, transform body. onClientResponse: runs before sending to client — add security headers, cache controls." },
      { title: "EdgeKV", content: "EdgeKV is a distributed key-value store available to EdgeWorkers. It provides low-latency reads (<10ms) from the edge, with eventual consistency across regions. Use cases: feature flags, A/B test configurations, geo-specific content, user session data, and blocklists. Data is organized in namespaces and groups." },
      { title: "Sub-Requests", content: "EdgeWorkers can make HTTP sub-requests to external APIs from the edge using httpRequest(). This enables API orchestration: fetch data from multiple backends, combine results, and return a single response — all at the edge without the client making multiple round trips." },
      { title: "Resource Limits", content: "EdgeWorkers have execution limits: max wall time (varies by tier: 50ms-4s), max memory (varies by tier), max sub-requests per invocation, and max response body size for stream transformations. Design EdgeWorker logic to be fast and lean — heavy computation belongs at the origin." },
    ],
    codeExamples: [
      { title: "EdgeWorker — A/B Test Router", language: "javascript", code: `import { Cookies } from 'cookies';

export function onClientRequest(request) {
  const cookies = new Cookies(request.getHeader('Cookie'));
  let variant = cookies.get('ab_variant');
  
  if (!variant) {
    // Assign new visitors to a variant (50/50 split)
    variant = Math.random() < 0.5 ? 'control' : 'experiment';
    request.setVariable('PMUSER_SET_COOKIE', 
      \`ab_variant=\${variant}; Path=/; Max-Age=2592000\`);
  }
  
  // Route to different origins based on variant
  if (variant === 'experiment') {
    request.route({ origin: 'experiment-origin' });
  }
  
  // Pass variant as header for downstream use
  request.setHeader('X-AB-Variant', variant);
}

export function onClientResponse(request, response) {
  const cookie = request.getVariable('PMUSER_SET_COOKIE');
  if (cookie) {
    response.addHeader('Set-Cookie', cookie);
  }
}` },
      { title: "EdgeWorker — Geo-Based API Response", language: "javascript", code: `import { httpRequest } from 'http-request';
import { createResponse } from 'create-response';

export async function onClientRequest(request) {
  const country = request.userLocation.country;
  const city = request.userLocation.city;
  
  // Fetch localized content from API
  const apiResponse = await httpRequest(
    \`https://api.example.com/content?country=\${country}&city=\${city}\`
  );
  
  if (apiResponse.ok) {
    const content = await apiResponse.json();
    request.respondWith(
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({
        region: country,
        offers: content.localOffers,
        currency: content.currency,
        servedFrom: 'edge'
      })
    );
  }
}` },
      { title: "EdgeWorker — Security Headers", language: "javascript", code: `export function onClientResponse(request, response) {
  // Add security headers
  response.setHeader('Strict-Transport-Security', 
    'max-age=31536000; includeSubDomains; preload');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' cdn.example.com");
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Remove server identification headers
  response.removeHeader('X-Powered-By');
  response.removeHeader('Server');
}` },
    ],
    glossary: [
      { title: "EdgeWorker Terms", color: "accent", terms: [
        { term: "EdgeWorker", definition: "Custom JavaScript function running on Akamai edge servers" },
        { term: "Event Handler", definition: "Lifecycle hook (onClientRequest, onOriginRequest, etc.)" },
        { term: "EdgeKV", definition: "Distributed key-value store accessible from EdgeWorkers" },
        { term: "Sub-Request", definition: "HTTP request made from EdgeWorker to an external API" },
        { term: "Bundle", definition: "The packaged EdgeWorker code uploaded to Akamai" },
        { term: "Activation", definition: "Deploying an EdgeWorker version to staging or production" },
        { term: "Resource Tier", definition: "Execution limits (time, memory) based on subscription tier" },
      ]},
    ],
    tips: [
      "Keep EdgeWorker logic fast — heavy computation should happen at the origin, not the edge",
      "Use EdgeKV for configuration data (feature flags, A/B configs) that EdgeWorkers can read in <10ms",
      "Test EdgeWorkers in staging before production — use Akamai Sandbox for local development",
      "Monitor EdgeWorker execution metrics (duration, memory, errors) in Akamai Control Center",
    ],
    whenToUse: [
      "You need custom logic at the CDN edge (A/B routing, geo-personalization, header manipulation)",
      "API orchestration at the edge can reduce client round trips",
      "Security headers or response modifications need to happen before the client sees the response",
      "Feature flags or configuration should be applied at the edge without origin involvement",
    ],
  },

  "akamai-bot-manager": {
    id: "akamai-bot-manager",
    hero: {
      badge1: { label: "Bot", color: "accent" },
      title: "Bot Manager",
      subtitle: "Bot Classification & Mitigation",
      description: "Akamai Bot Manager detects, classifies, and mitigates automated bot traffic at the edge. It distinguishes good bots (Googlebot, monitoring) from bad bots (scrapers, credential stuffers, inventory hoarders) using behavioral analysis, device fingerprinting, and challenge mechanisms.",
      highlights: [
        { icon: "🤖", label: "1,700+ Bot Signatures", detail: "Known bot classification from Akamai's threat intel" },
        { icon: "🧩", label: "Behavioral Analysis", detail: "ML detects sophisticated bots mimicking humans" },
      ],
      mentalModel: "Not all bots are bad. Googlebot indexes your site; monitoring bots check uptime. Bot Manager's job is classification: identify each bot, categorize it (known good, known bad, unknown), and apply the right action (allow, block, challenge, rate limit, serve alternate content). The challenge is sophisticated bots that mimic human behavior.",
    },
    architecture: {
      sectionLabel: "Detection Pipeline",
      title: "How Bot Manager Classifies Traffic",
      description: "Each request passes through multiple detection layers before classification.",
      pipeline: [
        { label: "Request Arrives", description: "HTTP request hits Akamai edge", badgeColor: "muted" },
        { label: "Signature Match", description: "Compare against 1,700+ known bot signatures", badge: "Bot", badgeColor: "accent" },
        { label: "Behavioral Analysis", description: "ML model evaluates request patterns", badge: "Bot", badgeColor: "accent" },
        { label: "Classification", description: "Good bot / Bad bot / Unknown / Human", badge: "Bot", badgeColor: "accent" },
        { label: "Action Applied", description: "Allow, block, challenge, rate limit, or tarpit", badgeColor: "muted" },
      ],
    },
    concepts: [
      { title: "Bot Categories", content: "Known Good Bots: search engines (Google, Bing), social crawlers (Facebook, Twitter), monitoring (Pingdom, Datadog). Known Bad Bots: scrapers, spam bots, credential stuffers, vulnerability scanners. Unknown Bots: unclassified automated traffic requiring further analysis or challenges." },
      { title: "Challenge Actions", content: "Crypto Challenge: requires the client to solve a computational puzzle (proof of work) — blocks simple bots. JavaScript Challenge: requires JavaScript execution — blocks headless scrapers without JS engines. CAPTCHA: visual challenge for suspicious but potentially human traffic. Managed Challenge: Akamai auto-selects the appropriate challenge type." },
      { title: "Bot Score", content: "Bot Manager assigns a score (0-100) to each request: 0 = definitely human, 100 = definitely bot. You set thresholds: score > 80 → block, 50-80 → challenge, < 50 → allow. Scores combine multiple signals: request rate, mouse movement patterns, cookie behavior, TLS fingerprint, and IP reputation." },
      { title: "Transactional Endpoint Protection", content: "Critical endpoints (login, checkout, account creation) get extra protection. Bot Manager monitors these for credential stuffing (testing stolen username/password combos), account takeover, and inventory hoarding (bots buying limited items). Custom response actions can serve fake success responses to waste attacker time." },
    ],
    codeExamples: [
      { title: "Bot Manager Configuration", language: "json", code: `{
  "botManagerPolicy": "www.example.com",
  "detectionSettings": {
    "knownBots": {
      "googlebot": { "action": "allow", "verify": "reverse_dns" },
      "bingbot": { "action": "allow", "verify": "reverse_dns" },
      "scraper-xyz": { "action": "deny" }
    },
    "unknownBots": {
      "defaultAction": "managed_challenge",
      "scoring": {
        "blockThreshold": 80,
        "challengeThreshold": 50
      }
    },
    "transactionalEndpoints": [
      {
        "path": "/api/login",
        "protection": "aggressive",
        "rateLimitPerIp": 5,
        "actions": {
          "credentialStuffing": "tarpit",
          "bruteForce": "deny_with_captcha"
        }
      },
      {
        "path": "/checkout",
        "protection": "standard",
        "actions": {
          "inventoryHoarding": "deny"
        }
      }
    ]
  }
}` },
    ],
    glossary: [
      { title: "Bot Manager Terms", color: "accent", terms: [
        { term: "Bot Score", definition: "0-100 score indicating likelihood of automated traffic" },
        { term: "Bot Signature", definition: "Known pattern identifying a specific bot (User-Agent, behavior)" },
        { term: "Crypto Challenge", definition: "Computational puzzle that bots must solve to proceed" },
        { term: "Credential Stuffing", definition: "Automated testing of stolen username/password combinations" },
        { term: "Tarpit", definition: "Deliberately slowing responses to waste attacker resources" },
        { term: "Device Fingerprint", definition: "Unique identifier based on browser/device characteristics" },
        { term: "Reverse DNS Verification", definition: "Confirming a bot's identity by checking its IP's PTR record" },
      ]},
    ],
    tips: [
      "Always verify 'Googlebot' claims with reverse DNS — attackers spoof the User-Agent string",
      "Deploy in monitor mode first to understand your bot traffic composition before blocking",
      "Use transactional endpoint protection for login and checkout — these are the highest-value targets",
      "Review bot analytics weekly — new bot patterns emerge constantly",
    ],
    whenToUse: [
      "Your site experiences credential stuffing attacks on login/registration pages",
      "Web scraping is stealing your content, pricing, or inventory data",
      "Bot traffic is inflating analytics numbers and wasting server resources",
      "Inventory hoarding bots are buying limited products before real customers",
    ],
  },

  "akamai-terraform-jenkins": {
    id: "akamai-terraform-jenkins",
    hero: {
      badge1: { label: "IaC", color: "accent" },
      title: "Terraform & Jenkins",
      subtitle: "Infrastructure as Code & CI/CD for Akamai",
      description: "Manage Akamai configurations as code using Terraform's Akamai Provider and automate deployments with Jenkins CI/CD pipelines. This enables version-controlled, peer-reviewed, automated infrastructure changes — replacing manual clicks in Akamai Control Center.",
      highlights: [
        { icon: "📝", label: "Config as Code", detail: "Akamai properties, DNS, WAF rules in HCL files" },
        { icon: "🔄", label: "CI/CD Pipeline", detail: "Automated test → stage → production deployment" },
      ],
      mentalModel: "Instead of clicking through Akamai Control Center to change a property rule, you write Terraform HCL that describes the desired state. Terraform compares your code to the current Akamai configuration, generates a plan of changes, and applies them via Akamai APIs. Jenkins orchestrates this: code pushed to Git → Jenkins runs terraform plan → peer review → Jenkins runs terraform apply → deployed to staging → promoted to production.",
    },
    architecture: {
      sectionLabel: "CI/CD Pipeline",
      title: "From Code to Production",
      description: "The complete automated deployment pipeline for Akamai configuration changes.",
      pipeline: [
        { label: "Git Push", description: "Developer commits Terraform HCL changes", badgeColor: "muted" },
        { label: "Jenkins Build", description: "CI triggers terraform plan, runs validation", badge: "CI/CD", badgeColor: "accent" },
        { label: "Plan Review", description: "Team reviews proposed changes in PR", badgeColor: "muted" },
        { label: "Apply to Staging", description: "terraform apply deploys to Akamai staging network", badge: "IaC", badgeColor: "accent" },
        { label: "Promote to Prod", description: "Activate property version on production network", badge: "Akamai", badgeColor: "accent" },
      ],
    },
    concepts: [
      { title: "Akamai Terraform Provider", content: "The Akamai Terraform Provider wraps Akamai's OPEN APIs. It manages: Property configurations (CDN rules, origins, caching), DNS zones and records (Edge DNS), Security configurations (WAF, Bot Manager, DDoS), CP Codes, Edge Hostnames, and Certificate enrollments. All resources support create, read, update, and delete operations." },
      { title: "Property as Code", content: "An Akamai property (CDN configuration) is defined in HCL. The property resource includes: hostnames, origin settings, caching rules, performance optimizations, and security settings. Each terraform apply creates a new property version and can optionally activate it on staging or production network." },
      { title: "State Management", content: "Terraform state tracks what Akamai resources exist and their current configuration. Use remote state backends (S3, Terraform Cloud) for team collaboration. State locking prevents concurrent modifications. For importing existing Akamai configurations, use terraform import or the Akamai CLI's export-to-terraform feature." },
      { title: "Jenkins Pipeline Stages", content: "A typical Jenkins pipeline: 1) Checkout code, 2) terraform init (install providers), 3) terraform validate (syntax check), 4) terraform plan (generate change plan), 5) Pause for approval, 6) terraform apply (deploy to staging), 7) Run smoke tests against staging, 8) terraform apply -var 'network=production' (promote to prod)." },
    ],
    codeExamples: [
      { title: "Terraform — Akamai Property Configuration", language: "hcl", code: `# Provider configuration
terraform {
  required_providers {
    akamai = {
      source  = "akamai/akamai"
      version = "~> 5.0"
    }
  }
}

provider "akamai" {
  edgerc = "~/.edgerc"
  config_section = "default"
}

# Property resource
resource "akamai_property" "www" {
  name        = "www.example.com"
  product_id  = "prd_Fresca"
  contract_id = "ctr-12345"
  group_id    = "grp-67890"

  hostnames {
    cname_from = "www.example.com"
    cname_to   = "www.example.com.edgekey.net"
    cert_provisioning_type = "DEFAULT"
  }

  rule_format = "v2024-01-09"
  rules       = data.akamai_property_rules_builder.rules.json
}

# Activate on staging
resource "akamai_property_activation" "staging" {
  property_id = akamai_property.www.id
  version     = akamai_property.www.latest_version
  network     = "STAGING"
  contact     = ["admin@example.com"]
}` },
      { title: "Jenkinsfile — Akamai CI/CD Pipeline", language: "groovy", code: `pipeline {
  agent any
  
  environment {
    EDGERC = credentials('akamai-edgerc')
  }
  
  stages {
    stage('Init') {
      steps {
        sh 'terraform init -backend-config="key=akamai/www.tfstate"'
      }
    }
    
    stage('Plan') {
      steps {
        sh 'terraform plan -out=tfplan -var="network=STAGING"'
        archiveArtifacts artifacts: 'tfplan'
      }
    }
    
    stage('Approve') {
      steps {
        input message: 'Review the plan. Deploy to staging?'
      }
    }
    
    stage('Deploy Staging') {
      steps {
        sh 'terraform apply -auto-approve tfplan'
      }
    }
    
    stage('Smoke Test') {
      steps {
        sh './scripts/smoke-test.sh staging'
      }
    }
    
    stage('Promote to Production') {
      steps {
        input message: 'Staging verified. Promote to production?'
        sh 'terraform apply -auto-approve -var="network=PRODUCTION"'
      }
    }
  }
}` },
    ],
    glossary: [
      { title: "IaC & CI/CD Terms", color: "accent", terms: [
        { term: "Terraform", definition: "Infrastructure as Code tool for declarative resource management" },
        { term: "HCL", definition: "HashiCorp Configuration Language — Terraform's syntax" },
        { term: "Provider", definition: "A Terraform plugin for interacting with a specific platform (Akamai)" },
        { term: "State", definition: "Terraform's record of managed infrastructure and its configuration" },
        { term: "Plan", definition: "Preview of changes Terraform will make before applying" },
        { term: "Apply", definition: "Execute the planned changes against the target platform" },
        { term: "edgerc", definition: "Akamai API credential file with client token and secret" },
        { term: "Jenkins", definition: "CI/CD automation server for building and deploying code" },
        { term: "Pipeline", definition: "A series of automated stages (build, test, deploy)" },
      ]},
    ],
    tips: [
      "Always run terraform plan and review before terraform apply — never apply blindly",
      "Use remote state (S3, Terraform Cloud) with locking to prevent concurrent modifications",
      "Import existing Akamai configurations before managing them with Terraform to avoid drift",
      "Set up separate staging and production pipelines with manual approval gates between them",
    ],
    whenToUse: [
      "You need version-controlled, peer-reviewed Akamai configuration changes",
      "Multiple teams modify Akamai properties and need coordination",
      "Automated CI/CD deployment of CDN, DNS, and security configurations",
      "Disaster recovery requires reproducible infrastructure from code",
    ],
  },

  "akamai-product-map": {
    id: "akamai-product-map",
    hero: {
      badge1: { label: "Akamai", color: "accent" },
      title: "Akamai Product Map",
      subtitle: "Delivery, Security, Compute Pillars",
      description: "Akamai's product portfolio spans three pillars: Delivery (CDN, media streaming, API acceleration), Security (WAF, DDoS, bot management, Zero Trust), and Compute (cloud computing, edge functions, storage). Understanding the product map helps you choose the right solutions.",
      highlights: [
        { icon: "🚀", label: "Delivery", detail: "Content delivery, media, API acceleration" },
        { icon: "🛡️", label: "Security", detail: "WAF, DDoS, bot, identity, Zero Trust" },
        { icon: "☁️", label: "Compute", detail: "Cloud VMs, edge functions, storage" },
      ],
      mentalModel: "Think of Akamai in three layers: Delivery gets your content to users fast (CDN, streaming, API optimization). Security protects your applications and users (WAF, DDoS, bots, access control). Compute provides infrastructure for running your applications (cloud VMs, edge serverless, object storage). Most customers start with Delivery, add Security, then expand to Compute.",
    },
    architecture: {
      sectionLabel: "Platform Overview",
      title: "Three Pillars of the Akamai Platform",
      description: "Each pillar addresses different infrastructure needs, all running on Akamai's global edge network.",
      pipeline: [
        { label: "Delivery", description: "CDN, Ion, DSA, Adaptive Media, API Gateway", badge: "CDN", badgeColor: "accent" },
        { label: "Security", description: "App & API Protector, DDoS, Bot Manager, Guardicore", badge: "SEC", badgeColor: "accent" },
        { label: "Compute", description: "Linode VMs, EdgeWorkers, Object Storage", badge: "CMP", badgeColor: "accent" },
      ],
    },
    concepts: [
      { title: "Delivery Products", content: "Ion: full-site CDN with adaptive acceleration, image optimization, and prefetching. Dynamic Site Accelerator (DSA): optimizes dynamic (non-cacheable) content delivery via route optimization. Adaptive Media Delivery: video streaming with ABR, low-latency live, and DRM. API Acceleration: optimizes API response times with edge caching and compression." },
      { title: "Security Products", content: "App & API Protector: combined WAF + Bot Manager + DDoS for web apps and APIs. Kona Site Defender: legacy WAF product (being migrated to App & API Protector). Prolexic: network-layer DDoS protection (3-7 Tbps capacity). Guardicore Segmentation: micro-segmentation for east-west traffic in data centers. Enterprise Application Access: Zero Trust network access." },
      { title: "Compute Products", content: "Linode (Akamai Cloud Computing): VMs, Kubernetes, managed databases, block/object storage — Akamai's IaaS platform. EdgeWorkers: serverless JavaScript at the CDN edge. EdgeKV: distributed key-value store. Image & Video Manager: real-time image/video transformation at the edge." },
      { title: "Product Selection Guide", content: "For a typical web application: start with Ion (CDN) + App & API Protector (security). Add Bot Manager for e-commerce. Add EdgeWorkers for custom edge logic. For streaming video: Adaptive Media Delivery + Prolexic. For internal applications: Enterprise Application Access (Zero Trust) + Guardicore (segmentation). For cloud infrastructure: Linode VMs + Object Storage." },
    ],
    comparisons: [
      {
        title: "Akamai Product Categories",
        description: "Key products in each pillar and their primary use cases.",
        items: [
          { icon: "🚀", label: "Delivery", description: "Getting content to users fast and reliably.", points: ["Ion: full-site acceleration with image optimization", "DSA: dynamic content route optimization", "Adaptive Media Delivery: video streaming", "API Gateway: API management and acceleration", "Download Delivery: large file distribution"] },
          { icon: "🛡️", label: "Security", description: "Protecting applications, APIs, and users.", points: ["App & API Protector: WAF + Bot + DDoS", "Prolexic: network-layer DDoS scrubbing", "Bot Manager: bot detection and mitigation", "Guardicore: micro-segmentation", "Enterprise Application Access: Zero Trust"] },
          { icon: "☁️", label: "Compute", description: "Infrastructure for running applications.", points: ["Linode: VMs, Kubernetes, managed databases", "EdgeWorkers: serverless edge functions", "EdgeKV: distributed key-value store", "Object Storage: S3-compatible storage", "Image & Video Manager: real-time transformation"] },
        ],
      },
    ],
    codeExamples: [
      { title: "Akamai Property Manager Rule Tree (Simplified)", language: "json", code: `{
  "rules": {
    "name": "default",
    "behaviors": [
      { "name": "origin", "options": { "hostname": "origin.example.com", "httpPort": 80 } },
      { "name": "cpCode", "options": { "value": { "id": 12345 } } },
      { "name": "caching", "options": { "behavior": "MAX_AGE", "ttl": "1d" } }
    ],
    "children": [
      {
        "name": "Static Content",
        "criteria": [{ "name": "fileExtension", "options": { "values": ["css", "js", "jpg", "png", "webp"] } }],
        "behaviors": [
          { "name": "caching", "options": { "behavior": "MAX_AGE", "ttl": "30d" } },
          { "name": "prefetch", "options": { "enabled": true } }
        ]
      },
      {
        "name": "API Endpoints",
        "criteria": [{ "name": "path", "options": { "values": ["/api/*"] } }],
        "behaviors": [
          { "name": "caching", "options": { "behavior": "NO_STORE" } },
          { "name": "sureRoute", "options": { "enabled": true, "testObjectPath": "/api/health" } }
        ]
      }
    ]
  }
}` },
    ],
    glossary: [
      { title: "Akamai Platform Terms", color: "accent", terms: [
        { term: "Ion", definition: "Full-site CDN product with adaptive acceleration and image optimization" },
        { term: "DSA", definition: "Dynamic Site Accelerator — optimizes non-cacheable content delivery" },
        { term: "App & API Protector", definition: "Combined WAF, bot, and DDoS protection" },
        { term: "Prolexic", definition: "Network-layer DDoS scrubbing service (multi-Tbps capacity)" },
        { term: "Guardicore", definition: "Micro-segmentation for data center east-west traffic" },
        { term: "Linode", definition: "Akamai's cloud computing platform (VMs, Kubernetes, storage)" },
        { term: "CP Code", definition: "Content Provider Code — used for billing and reporting" },
        { term: "Property", definition: "An Akamai CDN configuration for a set of hostnames" },
        { term: "SureRoute", definition: "Dynamic route optimization for non-cacheable content" },
        { term: "PoP", definition: "Point of Presence — a physical Akamai edge server location" },
      ]},
    ],
    tips: [
      "Start with Ion (CDN) + App & API Protector — they cover 80% of web application needs",
      "Use CP Codes to separate billing and reporting by site section, team, or project",
      "Akamai's 4,000+ PoPs provide edge computing capability everywhere — leverage EdgeWorkers before building server-side solutions",
      "For cloud infrastructure (VMs, databases), Linode provides competitive pricing with Akamai's network backbone",
    ],
    whenToUse: [
      "You're evaluating which Akamai products to license for your application stack",
      "You need to understand the relationship between Akamai's delivery, security, and compute offerings",
      "Architecture decisions require choosing between edge-based and origin-based solutions",
      "You're planning a migration from another CDN/cloud provider to Akamai",
    ],
  },
};
