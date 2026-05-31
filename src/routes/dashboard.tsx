import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Send, CreditCard, Smartphone, Receipt, LogOut, Bell, Settings, TrendingUp, Bot } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { getTransactions, type Transaction } from "@/lib/transactions-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — BICICI BANQUE" }] }),
  component: Dashboard,
});

function fmt(n: number) {
  return Math.abs(n).toLocaleString("fr-FR") + " FCFA";
}

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="text-primary-foreground p-6 pb-12 rounded-b-3xl" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-70">BICICI BANQUE</p>
          <p className="text-[10px] opacity-70">MyBICICI</p>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {user.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="text-xs opacity-80">Bonjour,</p>
              <p className="font-semibold text-sm">{user.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition">
              <Bell className="w-4 h-4" />
            </Link>
            <button onClick={() => { logout(); navigate({ to: "/" }); }} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        <Link to="/cards" className="block relative rounded-2xl p-5 text-primary-foreground overflow-hidden hover:shadow-lg transition" style={{ background: "linear-gradient(135deg, oklch(0.32 0.09 155), oklch(0.18 0.05 155))", boxShadow: "var(--shadow-elegant)" }}>
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-xs opacity-70">Solde disponible — BICICI BANQUE</p>
              <p className="text-3xl font-bold mt-1">{fmt(user.balance)}</p>
            </div>
            <span className="italic font-bold">VISA</span>
          </div>
          <div className="mt-6 flex items-end justify-between relative">
            <div>
              <p className="text-[9px] opacity-70 uppercase">Titulaire</p>
              <p className="text-xs font-semibold uppercase tracking-wide">{user.fullName}</p>
            </div>
            <p className="text-xs opacity-80 font-mono">{user.accountNumber}</p>
          </div>
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 -mt-6 relative z-10">
        <div className="bg-card rounded-2xl p-3 grid grid-cols-5 gap-1" style={{ boxShadow: "var(--shadow-card)" }}>
          <QA to="/transfer" icon={<Send className="w-4 h-4" />} label="Virement" />
          <QA to="/recharge" icon={<Smartphone className="w-4 h-4" />} label="Recharge" />
          <QA to="/bills" icon={<Receipt className="w-4 h-4" />} label="Factures" />
          <QA to="/cards" icon={<CreditCard className="w-4 h-4" />} label="Cartes" />
          <QA to="/investments" icon={<TrendingUp className="w-4 h-4" />} label="Invest." />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Virements récents</h2>
        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          {transactions.length === 0 ? (
            <p className="p-4 text-center text-muted-foreground text-sm">Aucun virement pour le moment</p>
          ) : (
            transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="p-4 border-b border-border last:border-b-0 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">{tx.label}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <p className={`font-bold text-sm ${tx.type === "out" ? "text-red-500" : "text-green-500"}`}>
                  {tx.type === "out" ? "-" : "+"} {fmt(tx.amount)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 flex justify-around md:max-w-md md:mx-auto md:rounded-t-2xl z-30">
        <NL to="/dashboard" icon={<CreditCard className="w-5 h-5" />} label="Comptes" />
        <NL to="/investments" icon={<TrendingUp className="w-5 h-5" />} label="Invest." />
        <NL to="/support" icon={<Bot className="w-5 h-5" />} label="Assistant" />
        <NL to="/notifications" icon={<Bell className="w-5 h-5" />} label="Alertes" />
        <NL to="/settings" icon={<Settings className="w-5 h-5" />} label="Réglages" />
      </nav>
    </div>
  );
}

function QA({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-secondary transition-colors">
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
      <span className="text-[11px] font-medium text-foreground">{label}</span>
    </Link>
  );
}

function NL({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors [&.active]:text-primary" activeProps={{ className: "active" }}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}