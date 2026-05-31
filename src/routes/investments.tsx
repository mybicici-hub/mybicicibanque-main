import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, PlusCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";

export const Route = createFileRoute("/investments")({
  head: () => ({ meta: [{ title: "Investissements — BICICI BANQUE" }] }),
  component: InvestPage,
});

const history = [
  { mois: "Jan", valeur: 4200000 },
  { mois: "Fév", valeur: 4380000 },
  { mois: "Mar", valeur: 4520000 },
  { mois: "Avr", valeur: 4710000 },
  { mois: "Mai", valeur: 5050000 },
  { mois: "Juin", valeur: 5320000 },
];

const portfolio = [
  { name: "Actions BRVM", value: 2_450_000, perf: 8.2, up: true },
  { name: "Obligations d'État CI", value: 1_800_000, perf: 4.5, up: true },
  { name: "Fonds Monétaire BICICI", value: 720_000, perf: 2.1, up: true },
  { name: "Or — Lingot 100g", value: 350_000, perf: -1.4, up: false },
];

function fmt(n: number) { return n.toLocaleString("fr-FR") + " FCFA"; }

function InvestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!user) navigate({ to: "/login" }); }, [user, navigate]);
  if (!user) return null;

  const total = portfolio.reduce((s, p) => s + p.value, 0);

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="text-primary-foreground p-6 pb-12 rounded-b-3xl" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard" className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"><ArrowLeft className="w-4 h-4" /></Link>
          <h1 className="text-xl font-bold">Mes investissements</h1>
        </div>
        <p className="text-xs opacity-80">Portefeuille total</p>
        <p className="text-3xl font-bold mt-1">{fmt(total)}</p>
        <p className="text-xs mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +5,4% ce mois — BICICI BANQUE</p>
      </header>

      <div className="max-w-3xl mx-auto px-6 -mt-6 space-y-5">
        <div className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-bold text-foreground mb-3">Évolution du portefeuille</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ left: -20, right: 0, top: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.13 155)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.55 0.13 155)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.9 0 0)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mois" tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 10 }} tickFormatter={(v) => (v / 1_000_000).toFixed(1) + "M"} />
                <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="valeur" stroke="oklch(0.55 0.13 155)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-bold text-foreground mb-3">Performance par actif</h2>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ left: -20, right: 0, top: 5, bottom: 0 }}>
                <CartesianGrid stroke="oklch(0.9 0 0)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mois" tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
                <YAxis hide />
                <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="valeur" stroke="oklch(0.45 0.15 155)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-foreground">Mes actifs</h2>
            <button className="text-xs text-primary flex items-center gap-1 hover:underline"><PlusCircle className="w-3 h-3" /> Nouvel investissement</button>
          </div>
          <div className="bg-card rounded-2xl divide-y divide-border" style={{ boxShadow: "var(--shadow-card)" }}>
            {portfolio.map(p => (
              <div key={p.name} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{fmt(p.value)}</p>
                </div>
                <span className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full ${p.up ? "text-primary bg-primary/10" : "text-destructive bg-destructive/10"}`}>
                  {p.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {p.up ? "+" : ""}{p.perf}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
