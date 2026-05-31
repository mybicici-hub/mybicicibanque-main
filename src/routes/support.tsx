import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bot, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Assistant IA — BICICI BANQUE" }] }),
  component: SupportPage,
});

interface Message {
  from: "bot" | "user";
  text: string;
}

function getBotReply(question: string, balance: number): string {
  const q = question.toLowerCase();

  if (q.includes("solde") || q.includes("argent") || q.includes("compte")) {
    return `Votre solde disponible est de ${balance.toLocaleString("fr-FR")} FCFA. Vous pouvez le consulter à tout moment depuis votre tableau de bord.`;
  }
  if (q.includes("virement") || q.includes("envoyer") || q.includes("transfert") || q.includes("transférer")) {
    return "Pour effectuer un virement : allez sur le tableau de bord, cliquez sur « Virement », entrez le nom du bénéficiaire, son email, son numéro de compte et le montant. Un email de confirmation lui sera envoyé automatiquement.";
  }
  if (q.includes("carte") || q.includes("visa")) {
    return "Votre carte VISA est active. Vous pouvez voir le recto et le verso (avec le cryptogramme) depuis la rubrique « Cartes ». En cas de perte, contactez le service client au +225 27 20 30 40 50.";
  }
  if (q.includes("mot de passe") || q.includes("password") || q.includes("sécurité")) {
    return "Pour changer votre mot de passe, allez dans Paramètres → Sécurité → Changer le mot de passe. Ne communiquez jamais vos identifiants à un tiers.";
  }
  if (q.includes("recharge") || q.includes("crédit") || q.includes("téléphone")) {
    return "Pour recharger un téléphone : tableau de bord → « Recharge », entrez le numéro et le montant, puis validez.";
  }
  if (q.includes("facture")) {
    return "Vous pouvez consulter et régler vos factures depuis la rubrique « Factures » du tableau de bord.";
  }
  if (q.includes("horaire") || q.includes("ouvert") || q.includes("heure")) {
    return "L'application MyBICICI est disponible 24h/24 et 7j/7. Le service client téléphonique est joignable de 8h à 18h du lundi au samedi.";
  }
  if (q.includes("bonjour") || q.includes("salut") || q.includes("bonsoir") || q.includes("coucou")) {
    return "Bonjour ! Je suis l'assistant virtuel de BICICI BANQUE. Comment puis-je vous aider aujourd'hui ?";
  }
  if (q.includes("merci")) {
    return "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. 😊";
  }
  return "Je suis l'assistant BICICI. Je peux vous renseigner sur votre solde, les virements, votre carte, les recharges, les factures, ou la sécurité de votre compte. Posez-moi votre question !";
}

function SupportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Bonjour ! Je suis l'assistant virtuel de BICICI BANQUE. Comment puis-je vous aider ?" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      const reply = getBotReply(userMsg, user?.balance || 0);
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 600);
  };

  const suggestions = ["Quel est mon solde ?", "Comment faire un virement ?", "Ma carte", "Changer mot de passe"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="text-primary-foreground p-6 pb-6" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate({ to: "/dashboard" })} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Assistant IA BICICI</h1>
              <p className="text-xs opacity-80">En ligne • Répond instantanément</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full space-y-3" style={{ paddingBottom: "180px" }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                m.from === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-card text-foreground rounded-bl-sm"
              }`}
              style={m.from === "bot" ? { boxShadow: "var(--shadow-card)" } : {}}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); }}
                className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full border border-input text-foreground hover:bg-secondary transition flex-shrink-0"
              >
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 px-4 py-2.5 rounded-full border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}