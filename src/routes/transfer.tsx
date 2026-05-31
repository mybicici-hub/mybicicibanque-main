import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Send, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useAuth } from "@/lib/auth";
import { addTransaction } from "@/lib/transactions-store";

emailjs.init("TRoI0XQgQNyJc3Qgi");

export const Route = createFileRoute("/transfer")({
  head: () => ({ meta: [{ title: "Virement — BICICI BANQUE" }] }),
  component: TransferPage,
});

function TransferPage() {
  const { user, updateBalance } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const amountNumber = parseFloat(amount);

      if (user && amountNumber > user.balance) {
        setError("Solde insuffisant pour effectuer ce virement.");
        setLoading(false);
        return;
      }

      const templateParams = {
        to_email: recipientEmail,
        to_name: recipientName,
        recipient_name: recipientName,
        recipient_account: recipientAccount,
        amount: amountNumber.toLocaleString("fr-FR"),
        reference: reference || "Sans référence",
        sender_name: user?.fullName || "Utilisateur BICICI",
        sender_account: user?.accountNumber || "N/A",
        transaction_date: new Date().toLocaleDateString("fr-FR", {
          year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
        }),
      };

      const response = await emailjs.send("service_f3yl9nc", "template_1iq0gr7", templateParams, "TRoI0XQgQNyJc3Qgi");

      if (response.status === 200) {
        if (user) {
          updateBalance(user.balance - amountNumber);
          addTransaction({
            label: `Virement envoyé — ${recipientName}`,
            date: "Aujourd'hui, " + new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            amount: amountNumber,
            type: "out",
          });
        }
        setSuccess(true);
        setRecipientEmail(""); setRecipientName(""); setRecipientAccount(""); setAmount(""); setReference("");
        setTimeout(() => navigate({ to: "/dashboard" }), 2500);
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi. Vérifiez vos données et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center bg-card rounded-2xl p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Virement réussi !</h2>
          <p className="text-muted-foreground mb-4">Un email de confirmation a été envoyé à :</p>
          <p className="font-semibold text-foreground mb-6 break-all">{recipientEmail}</p>
          <p className="text-sm text-muted-foreground">Redirection vers le tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="text-primary-foreground p-6 pb-8" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate({ to: "/dashboard" })} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold">Effectuer un virement</h1>
        </div>
      </header>

      <div className="px-6 py-6 max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nom du bénéficiaire *</label>
              <input type="text" placeholder="Nom complet" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground" required disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Adresse Gmail 📧 *</label>
              <input type="email" placeholder="exemple@gmail.com" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground" required disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Numéro de compte *</label>
              <input type="text" placeholder="CI001 00000 12345678901 22" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground" required disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Montant (FCFA) *</label>
              <input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground" required disabled={loading} min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Référence (optionnel)</label>
              <input type="text" placeholder="Motif du virement" value={reference} onChange={(e) => setReference(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground" disabled={loading} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-6">
              <Send className="w-4 h-4" />
              {loading ? "Envoi en cours..." : "Confirmer et envoyer"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}