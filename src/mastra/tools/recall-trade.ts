import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getRecallClient } from "../../utils/recallClient";

export const recallTrade = createTool({
  id: "recall-trade",
  description: "Execute a spot trade on Recall (sandbox/prod)",
  inputSchema: z.object({
    fromToken: z.string(),
    toToken: z.string(),
    amount: z.string(), // human-readable amount
    fromChain: z.string().optional().nullable(),
    toChain: z.string().optional().nullable(),
    reason: z.string().optional(),
  }),
  async execute({ context }) {
    const client = getRecallClient();
    const { data } = await client.post("/trade/execute", context);
    return data;
  },
});
