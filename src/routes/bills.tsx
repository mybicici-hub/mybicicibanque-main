import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/bills")({
  component: BillsPage,
});

function BillsPage() {
  const navigate = useNavigate();

  const bills = [
    { id: 1, name: "Orange CI", amount: 12500, date: "31 mai" },
    { id: 2, name: "MTN CI", amount: 15000, date: "28 mai" },
    { id: 3, name: "Electricité", amount: 45000, date: "25 mai" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="text-primary-foreground p-6 pb-8" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate({ to: "/dashboard" })} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold">Factures</h1>
        </div>
      </header>

      <div className="px-6 py-6 max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          {bills.map((bill) => (
            <div key={bill.id} className="p-4 border-b border-border last:border-b-0 flex justify-between">
              <div>
                <p className="font-semibold text-foreground">{bill.name}</p>
                <p className="text-xs text-muted-foreground">{bill.date}</p>
              </div>
              <p className="font-bold text-foreground">{bill.amount.toLocaleString("fr-FR")} FCFA</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}