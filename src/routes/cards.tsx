import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Wifi, RotateCw } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useState } from "react";

export const Route = createFileRoute("/cards")({
  head: () => ({ meta: [{ title: "Ma carte — BICICI BANQUE" }] }),
  component: CardsPage,
});

function CardsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showBack, setShowBack] = useState(false);

  const fmt = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="text-primary-foreground p-6 pb-8" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate({ to: "/dashboard" })} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold">Ma carte</h1>
        </div>
      </header>

      <div className="px-6 py-6 max-w-md mx-auto">
        {/* RECTO */}
        {!showBack && (
          <div
            className="w-full p-6 text-white flex flex-col justify-between rounded-2xl"
            style={{
              height: "220px",
              background: "linear-gradient(135deg, oklch(0.40 0.10 155), oklch(0.16 0.05 155))",
              boxShadow: "var(--shadow-elegant)",
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-70">BICICI BANQUE</p>
                <p className="text-xs opacity-80 mt-1">Carte de débit</p>
              </div>
              <Wifi className="w-6 h-6 opacity-80 rotate-90" />
            </div>

            <div className="w-12 h-9 rounded-md" style={{ background: "linear-gradient(135deg, #d4af37, #f5e7a0)" }} />

            <p className="font-mono text-lg tracking-[0.15em]">{user?.accountNumber || "CI001 0000 1234 5678"}</p>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] uppercase opacity-60">Titulaire</p>
                <p className="text-sm font-semibold uppercase tracking-wide">{user?.fullName || "—"}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] uppercase opacity-60">Expire</p>
                <p className="text-sm font-mono">12/27</p>
              </div>
              <span className="italic font-bold text-xl">VISA</span>
            </div>
          </div>
        )}

        {/* VERSO */}
        {showBack && (
          <div
            className="w-full text-white flex flex-col rounded-2xl overflow-hidden"
            style={{
              height: "220px",
              background: "linear-gradient(135deg, oklch(0.30 0.08 155), oklch(0.12 0.04 155))",
              boxShadow: "var(--shadow-elegant)",
            }}
          >
            <div className="w-full h-10 bg-black mt-5" />
            <div className="px-6 mt-4">
              <div className="bg-white/90 h-8 rounded flex items-center justify-end px-3">
                <span className="text-black font-mono text-sm tracking-widest">123</span>
              </div>
              <p className="text-[8px] opacity-60 mt-1 text-right">Cryptogramme visuel (CVV)</p>
            </div>
            <div className="px-6 mt-auto mb-5">
              <p className="text-[9px] opacity-70 leading-relaxed">
                Propriété de BICICI BANQUE. En cas de perte, contactez le service client.
              </p>
              <p className="text-[10px] opacity-80 mt-2 font-semibold">Service client : +225 27 20 30 40 50</p>
            </div>
          </div>
        )}

        {/* Bouton retourner */}
        <button
          onClick={() => setShowBack(!showBack)}
          className="w-full mt-4 px-4 py-2.5 rounded-lg border border-input text-foreground hover:bg-secondary transition flex items-center justify-center gap-2 font-semibold"
        >
          <RotateCw className="w-4 h-4" />
          {showBack ? "Voir le recto" : "Voir le verso"}
        </button>

        {/* Infos détaillées */}
        <div className="bg-card rounded-2xl p-6 mt-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="font-semibold text-foreground mb-4">Détails de la carte</h3>
          <div className="space-y-3">
            <Row label="Titulaire" value={user?.fullName || "—"} />
            <Row label="Numéro de compte" value={user?.accountNumber || "—"} mono />
            <Row label="Type" value="VISA — Débit" />
            <Row label="Solde disponible" value={fmt(user?.balance || 0)} />
            <Row label="Statut" value="✓ Active" green />
            <Row label="Banque" value="BICICI BANQUE" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono, green }: { label: string; value: string; mono?: boolean; green?: boolean }) {
  return (
    <div className="flex justify-between items-center pb-3 border-b border-border last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold ${green ? "text-green-500" : "text-foreground"} ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}