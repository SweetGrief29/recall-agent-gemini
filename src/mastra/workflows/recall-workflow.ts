import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

const tradeStep = createStep({
  id: "run-recall-agent",
  description: "Invoke the Recall agent to place one sandbox trade",
  inputSchema: z.object({
    userPrompt: z.string().default("Buy $10 worth of Ether"),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async ({ mastra, context }) => {
    const agent = mastra?.getAgent("recallAgent");
    if (!agent) throw new Error("recallAgent not found");

    const { userPrompt } = context;
    const response = await agent.generate([{ role: "user", content: userPrompt }]);
    return { result: response.text };
  },
});

const recallWorkflow = createWorkflow({
  id: "recall-workflow",
  inputSchema: z.object({ userPrompt: z.string().optional() }).optional(),
  outputSchema: z.object({ result: z.string() }),
}).then(tradeStep);

recallWorkflow.commit();

export { recallWorkflow };
