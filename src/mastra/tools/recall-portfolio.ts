import { createTool } from "@mastra/core/tools";
import { getRecallClient } from "../../utils/recallClient";
import axios from "axios";

export const getPortfolio = createTool({
  id: "get-portfolio",
  description: "Fetch agent balances from Recall Competitions API",
  async execute() {
    const client = getRecallClient();
    const { data } = await client.get("/agent/balances"); // endpoint benar
    return data;
  },
});
