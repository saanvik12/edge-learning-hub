import { Link } from "react-router-dom";
import { adobeTiles, akamaiTiles, useCasesTile, Tile } from "@/data/tiles";
import { icons } from "lucide-react";

const DynamicIcon = ({ name, ...props }: { name: string; size?: number; className?: string }) => {
  const Icon = icons[name as keyof typeof icons];
  return Icon ? <Icon {...props} /> : null;
};

const TileCard = ({ tile, accent }: { tile: Tile; accent: string }) => (
  <Link
    to={`/${tile.id}`}
    className={`group relative block rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-${accent}`}
  >
    <div className={`mb-3 inline-flex rounded-lg p-2.5 bg-${accent}/10`}>
      <DynamicIcon name={tile.icon} size={22} className={`text-${accent}`} />
    </div>
    <h3 className="mb-1 font-semibold text-card-foreground text-base">{tile.title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{tile.subtitle}</p>
  </Link>
);

const Index = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-5">
        <h1 className="text-2xl font-bold text-foreground">Experience Cloud & Akamai Learning Hub</h1>
        <p className="text-muted-foreground mt-1">Click any tile to dive deep into the topic</p>
      </div>
    </header>

    <main className="container mx-auto px-4 py-8 space-y-12">
      {/* Adobe Integrations */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <div className="h-1 w-8 rounded-full bg-adobe" />
          <h2 className="text-lg font-semibold text-foreground">Adobe Integrations</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adobeTiles.map(t => <TileCard key={t.id} tile={t} accent="adobe" />)}
        </div>
      </section>

      {/* Akamai */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <div className="h-1 w-8 rounded-full bg-akamai" />
          <h2 className="text-lg font-semibold text-foreground">Akamai</h2>
        </div>
        <Link
          to="/akamai"
          className="group block rounded-xl border-2 border-akamai/40 bg-gradient-to-r from-akamai/5 to-akamai/10 p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex rounded-lg p-3 bg-akamai/15">
              <DynamicIcon name="Globe" size={28} className="text-akamai" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Akamai Developer Guide</h3>
              <p className="text-sm text-muted-foreground">CDN, Security, Edge Compute & IaC — all topics in one comprehensive guide</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {akamaiTiles.map(t => (
              <span key={t.id} className="text-xs px-2.5 py-1 rounded-full bg-akamai/10 text-akamai border border-akamai/20">{t.title}</span>
            ))}
          </div>
        </Link>
      </section>

      {/* Use Cases */}
      <section>
        <Link
          to={`/${useCasesTile.id}`}
          className="group block rounded-xl border-2 border-use-case/40 bg-gradient-to-r from-use-case/5 to-use-case/10 p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="flex items-center gap-4">
            <div className="inline-flex rounded-lg p-3 bg-use-case/15">
              <DynamicIcon name={useCasesTile.icon} size={28} className="text-use-case" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">{useCasesTile.title}</h3>
              <p className="text-sm text-muted-foreground">{useCasesTile.subtitle}</p>
            </div>
          </div>
        </Link>
      </section>
    </main>
  </div>
);

export default Index;
