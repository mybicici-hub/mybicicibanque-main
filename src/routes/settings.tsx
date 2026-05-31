import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, User, Lock, Bell, CreditCard, Globe, HelpCircle, Shield, LogOut, ChevronRight, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Paramètres — BICICI BANQUE" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMessage, setPwdMessage] = useState("");

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      setPwdMessage("Les mots de passe ne correspondent pas.");
      return;
    }
    if (newPwd.length < 6) {
      setPwdMessage("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }
    setPwdMessage("✓ Mot de passe modifié avec succès.");
    setOldPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setTimeout(() => {
      setShowPassword(false);
      setPwdMessage("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="text-primary-foreground p-6 pb-8" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate({ to: "/dashboard" })} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold">Paramètres</h1>
        </div>
      </header>

      <div className="px-6 py-6 max-w-2xl mx-auto space-y-6">
        <div className="bg-card rounded-2xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xl font-bold">
              {user?.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="font-bold text-foreground text-lg">{user?.fullName}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-border">
            <InfoRow label="Numéro de compte" value={user?.accountNumber || "—"} />
            <InfoRow label="Solde" value={(user?.balance || 0).toLocaleString("fr-FR") + " FCFA"} />
            <InfoRow label="Banque" value="BICICI BANQUE" />
          </div>
        </div>

        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="px-6 pt-5 pb-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">Sécurité</p>
          <MenuItem icon={<Lock className="w-5 h-5" />} label="Changer le mot de passe" onClick={() => setShowPassword(true)} />
          <MenuItem icon={<Shield className="w-5 h-5" />} label="Authentification à deux facteurs" />
          <MenuItem icon={<CreditCard className="w-5 h-5" />} label="Gérer mes cartes" onClick={() => navigate({ to: "/cards" })} />
        </div>

        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="px-6 pt-5 pb-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">Préférences</p>
          <ToggleItem icon={<Bell className="w-5 h-5" />} label="Notifications par email" defaultOn />
          <ToggleItem icon={<Bell className="w-5 h-5" />} label="Alertes de transactions" defaultOn />
          <MenuItem icon={<Globe className="w-5 h-5" />} label="Langue : Français" />
        </div>

        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="px-6 pt-5 pb-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">Assistance</p>
          <MenuItem icon={<HelpCircle className="w-5 h-5" />} label="Centre d'aide" onClick={() => navigate({ to: "/support" })} />
          <MenuItem icon={<User className="w-5 h-5" />} label="Contacter le service client" />
        </div>

        <button
          onClick={() => { logout(); navigate({ to: "/" }); }}
          className="w-full px-4 py-3 rounded-xl bg-red-500/15 text-red-600 font-semibold flex items-center justify-center gap-2 hover:bg-red-500/25 transition"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>

        <p className="text-center text-xs text-muted-foreground pt-2">©️ 2026 BICICI BANQUE — v1.0.0</p>
      </div>

      {showPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowPassword(false)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground text-lg">Changer le mot de passe</h3>
              <button onClick={() => setShowPassword(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <input type="password" placeholder="Mot de passe actuel" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground" required />
              <input type="password" placeholder="Nouveau mot de passe" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground" required />
              <input type="password" placeholder="Confirmer le nouveau mot de passe" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground" required />
              {pwdMessage && <p className={`text-sm font-medium ${pwdMessage.startsWith("✓") ? "text-green-600" : "text-red-600"}`}>{pwdMessage}</p>}
              <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full px-6 py-4 flex items-center gap-4 hover:bg-secondary transition border-t border-border text-left">
      <span className="text-primary">{icon}</span>
      <span className="flex-1 text-foreground font-medium">{label}</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}

function ToggleItem({ icon, label, defaultOn }: { icon: React.ReactNode; label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="w-full px-6 py-4 flex items-center gap-4 border-t border-border">
      <span className="text-primary">{icon}</span>
      <span className="flex-1 text-foreground font-medium">{label}</span>
      <button onClick={() => setOn(!on)} className={`w-12 h-6 rounded-full transition relative ${on ? "bg-primary" : "bg-muted"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${on ? "left-6" : "left-0.5"}`} />
      </button>
    </div>
  );
}