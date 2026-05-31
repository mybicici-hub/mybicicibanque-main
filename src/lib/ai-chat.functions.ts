import { createServerFn } from "@tanstack/react-start";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export const chatWithAI = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: ChatMessage[] }) => {
    if (!input || !Array.isArray(input.messages)) throw new Error("Invalid messages");
    if (input.messages.length === 0 || input.messages.length > 50) throw new Error("Invalid history length");
    for (const m of input.messages) {
      if (!["user", "assistant", "system"].includes(m.role)) throw new Error("Invalid role");
      if (typeof m.content !== "string" || m.content.length === 0 || m.content.length > 4000) throw new Error("Invalid content");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY non configuré");

    const systemPrompt = `Tu es l'assistant virtuel officiel de BICICI BANQUE (MyBICICI), une banque numérique en Côte d'Ivoire. Tu réponds en français de manière professionnelle, chaleureuse et concise. Tu aides le client Gramboute Idriss Francis sur : virements, recharges mobiles, paiement de factures, gestion de carte VISA, investissements, sécurité du compte, et toute question bancaire. Ne révèle jamais de mots de passe ou identifiants. Si une question dépasse tes compétences, oriente vers le service client BICICI au +225 27 20 20 16 00.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...data.messages],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) throw new Error("Trop de requêtes, veuillez patienter.");
      if (response.status === 402) throw new Error("Crédits IA épuisés. Contactez l'administrateur.");
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("Erreur du service IA.");
    }

    const json = await response.json();
    const reply = json.choices?.[0]?.message?.content ?? "Désolé, aucune réponse.";
    return { reply };
  });
