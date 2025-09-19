import { createStep, createWorkflow } from "@mastra/core/workflows";

const getPortfolioStep = createStep({
  id: "get-portfolio-step",
  description: "Return Recall agent portfolio/balances",
  async execute() {
    const base =
      process.env.RECALL_API_URL ||
      "https://api.sandbox.competitions.recall.network/api";
    const { RECALL_API_KEY } = process.env;
    const axios = (await import("axios")).default;

    const { data } = await axios.get(`${base}/agent/portfolio`, {
      headers: { Authorization: `Bearer ${RECALL_API_KEY}` },
      timeout: 30_000,
    });

    // Ringkas hasil agar enak dibaca di UI
    const lines = [
      `Total Value: ${data.totalValue}`,
      ...data.tokens.map(
        (t: any) =>
          `${t.symbol || t.token}: ${t.amount} (≈ ${t.value}) [${t.chain}]`
      ),
    ];
    return { result: lines.join("\n") };
  },
});

export const portfolioWorkflow = createWorkflow({
  id: "portfolio-workflow",
}).then(getPortfolioStep);

portfolioWorkflow.commit();
