import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/recharge")({
  component: RechargePage,
});

function RechargePage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && amount) {
      alert("Recharge de " + amount + " FCFA pour " + phone);
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="text-primary-foreground p-6 pb-8" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate({ to: "/dashboard" })} className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold">Recharge</h1>
        </div>
      </header>

      <div className="px-6 py-6 max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <form onSubmit={handleRecharge} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+225 XX XX XX XX" className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Montant</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {["1000", "5000", "10000"].map((val) => (
                  <button key={val} type="button" onClick={() => setAmount(val)} className={`px-3 py-2 rounded-lg border font-semibold ${amount === val ? "bg-primary text-primary-foreground" : "border-input"}`}>
                    {val}
                  </button>
                ))}
              </div>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Montant" className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground" required />
            </div>

            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold">Recharger</button>
          </form>
        </div>
      </div>
    </div>
  );
}