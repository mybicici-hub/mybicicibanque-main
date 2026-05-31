import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bell, Send, CreditCard, CheckCircle, Info } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — BICICI BANQUE" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const navigate = useNavigate();

  const notifications = [
    { id: 1, icon: <Send className="w-5 h-5" />, title: "Virement effectué", message: "Votre virement a été envoyé avec succès et un email de confirmation a été transmis au bénéficiaire.", time: "Il y a 5 minutes", unread: true },
    { id: 2, icon: <CheckCircle className="w-5 h-5" />, title: "Connexion réussie", message: "Connexion à votre compte depuis un nouvel appareil.", time: "Aujourd'hui, 12h30", unread: true },
    { id: 3, icon: <CreditCard className="w-5 h-5" />, title: "Carte active", message: "Votre carte VISA est active et prête à être utilisée.", time: "Hier, 18h02", unread: false },
    { id: 4, icon: <Info className="w-5 h-5" />, title: "Bienvenue sur MyBICICI", message: "Merci d'avoir choisi BICICI BANQUE pour votre banque numérique.", time: "1 mai 2026", unread: false },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="text-primary-foreground p-6 pb-8" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate({ to: "/dashboard" })} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
      </header>

      <div className="px-6 py-6 max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          {notifications.map((n) => (
            <div key={n.id} className={`p-4 border-b border-border last:border-b-0 flex items-start gap-3 ${n.unread ? "bg-primary/5" : ""}`}>
              <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                {n.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground">{n.title}</p>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-2">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}