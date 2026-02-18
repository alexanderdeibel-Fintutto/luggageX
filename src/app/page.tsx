import {
  Building2,
  Users,
  Wrench,
  Gauge,
  FileCheck,
  Luggage,
  LayoutDashboard,
  Lock,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";

type AppCard = {
  name: string;
  description: string;
  url: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  tag?: string;
};

const immobilienApps: AppCard[] = [
  {
    name: "Vermietify",
    description: "Vermietermanagement – Objekte, Mieter, Verträge und Nebenkostenabrechnungen zentral verwalten.",
    url: "https://vermietify.fintutto.cloud",
    icon: Building2,
    color: "text-primary",
    glow: "bg-primary-glow",
    tag: "Vermieter",
  },
  {
    name: "Portal",
    description: "Das Mieter- & Vermieterportal – Kommunikation, Dokumente und Vorgänge an einem Ort.",
    url: "https://portal.fintutto.cloud",
    icon: LayoutDashboard,
    color: "text-indigo",
    glow: "bg-indigo-glow",
    tag: "Mieter & Vermieter",
  },
  {
    name: "Mieter-App",
    description: "Das Mieterportal – Mietvertrag, Nebenkostenabrechnung, Schadensmeldungen und Kontakt zum Vermieter.",
    url: "https://mieter.fintutto.de",
    icon: Users,
    color: "text-cyan",
    glow: "bg-cyan-glow",
    tag: "Mieter",
  },
  {
    name: "HausmeisterPro",
    description: "Facility Management für Hausmeister – Aufträge, Rundgänge, Protokolle und Objektbetreuung.",
    url: "https://hausmeisterpro.fintutto.cloud",
    icon: Wrench,
    color: "text-orange",
    glow: "bg-orange-glow",
    tag: "Hausmeister",
  },
  {
    name: "Zähler",
    description: "Zählerablesung digital – Wasser, Strom, Gas und Heizung erfassen und auswerten.",
    url: "https://zaehler.fintutto.cloud",
    icon: Gauge,
    color: "text-green",
    glow: "bg-green-glow",
    tag: "Zähler",
  },
];

const weitereApps: AppCard[] = [
  {
    name: "FinnTutto App",
    description: "Die zentrale FinnTutto-Anwendung – Einstiegspunkt ins gesamte Ökosystem.",
    url: "https://app.fintutto.cloud",
    icon: LayoutDashboard,
    color: "text-purple",
    glow: "bg-purple-glow",
  },
  {
    name: "BescheidBoxer",
    description: "Steuerbescheide und Behördenpost prüfen, verstehen und bei Fehlern anfechten.",
    url: "https://app.bescheidboxer.de",
    icon: FileCheck,
    color: "text-rose",
    glow: "bg-rose-glow",
    tag: "Bescheide",
  },
  {
    name: "LuggageX",
    description: "Der Gepäck-Marktplatz – ungenutztes Fluggepäck teilen und günstig versenden.",
    url: "https://luggagex.fintutto.cloud",
    icon: Luggage,
    color: "text-amber",
    glow: "bg-amber-glow",
    tag: "Gepäck",
  },
];

function AppCardComponent({ app, index }: { app: AppCard; index: number }) {
  const Icon = app.icon;
  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border-hover hover:bg-card-hover hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${app.glow}`}>
          <Icon className={`h-6 w-6 ${app.color}`} />
        </div>
        <ExternalLink className="h-4 w-4 text-text-subtle opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold text-text">{app.name}</h3>
        {app.tag && (
          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${app.glow} ${app.color}`}>
            {app.tag}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-text-muted">{app.description}</p>
      <div className="mt-4 flex items-center gap-1 text-xs text-text-subtle group-hover:text-text-muted transition-colors">
        <span className="truncate">{app.url.replace("https://", "")}</span>
        <ArrowUpRight className="h-3 w-3 shrink-0" />
      </div>
    </a>
  );
}

export default function PortalPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-bg-subtle/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-glow">
              <span className="text-lg font-bold text-primary">F</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">FinnTutto</span>
          </div>
          <a
            href="https://admin.fintutto.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-text-subtle hover:text-text-muted hover:bg-card transition-colors"
          >
            <Lock className="h-3 w-3" />
            Admin
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Alle Apps.{" "}
            <span className="text-text-muted">Ein Ökosystem.</span>
          </h1>
          <p className="text-lg text-text-muted leading-relaxed">
            Von Immobilienverwaltung bis Gepäck-Marktplatz – hier findest du alle FinnTutto-Anwendungen auf einen Blick.
          </p>
        </div>
      </section>

      {/* Immobilien & Verwaltung */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-sm font-medium uppercase tracking-widest text-text-subtle">
            Immobilien & Verwaltung
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {immobilienApps.map((app, i) => (
            <AppCardComponent key={app.name} app={app} index={i} />
          ))}
        </div>
      </section>

      {/* Weitere Apps */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-sm font-medium uppercase tracking-widest text-text-subtle">
            Weitere Apps
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {weitereApps.map((app, i) => (
            <AppCardComponent key={app.name} app={app} index={i} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-subtle">
            &copy; {new Date().getFullYear()} FinnTutto UG (haftungsbeschränkt)
          </p>
          <div className="flex items-center gap-6 text-sm text-text-subtle">
            <a href="https://portal.fintutto.cloud" className="hover:text-text-muted transition-colors">
              Portal
            </a>
            <a href="https://app.fintutto.cloud" className="hover:text-text-muted transition-colors">
              App
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
