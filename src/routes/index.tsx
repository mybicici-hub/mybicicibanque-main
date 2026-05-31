import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Accueil — MyBICICI" }] }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="text-primary-foreground p-6" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
              <span className="text-xl font-bold">M</span>
            </div>
            <h1 className="text-2xl font-bold">MyBICICI</h1>
          </div>
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-lg bg-white text-primary font-semibold hover:bg-white/90 transition"
          >
            Se connecter
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="text-primary-foreground py-20 px-6" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Votre banque, dans votre poche.
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            MyBICICI vous accompagne au quotidien : comptes, virements, paiements et épargne — tout depuis une seule application sécurisée.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white text-primary font-semibold hover:bg-white/90 transition text-lg"
          >
            Commencer maintenant
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">
            Pourquoi choisir MyBICICI ?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              title="💰 Virements rapides"
              description="Envoyez de l'argent en quelques secondes avec confirmation par email."
            />
            <Feature
              title="🔒 Sécurité maximale"
              description="Vos données sont protégées avec les derniers standards de sécurité."
            />
            <Feature
              title="📱 Disponible 24h/24"
              description="Gérez votre compte quand vous voulez, où vous voulez."
            />
            <Feature
              title="💳 Gestion simplifiée"
              description="Consultez votre solde et vos transactions en temps réel."
            />
            <Feature
              title="🌍 International"
              description="Envoyez et recevez de l'argent partout dans le monde."
            />
            <Feature
              title="⚡ Instantané"
              description="Pas de délai d'attente, tout est immédiat."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: "var(--gradient-primary)" }}>
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <h3 className="text-3xl font-bold mb-6">
            Prêt à commencer ?
          </h3>
          <p className="text-lg opacity-90 mb-8">
            Rejoignez des milliers de clients BICICI qui font confiance à MyBICICI.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white text-primary font-semibold hover:bg-white/90 transition text-lg"
          >
            Se connecter maintenant
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border p-6">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>©️ 2026 BICICI BANQUE. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-card rounded-2xl p-6 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
      <h4 className="text-xl font-semibold text-foreground mb-3">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}