import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";
import { recallTrade } from "../tools/recall-trade";
import { getPortfolio } from "../tools/recall-portfolio";

export const recallAgent = new Agent({
  name: "Recall Agent (Gemini)",
  instructions: `
You are a Recall competition trading agent.
- Submit exactly one trade when invoked based on the user's request.
- Use the recall-trade tool with correct token addresses:

Token Reference (examples):
- USDC:  0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 (Ethereum)
- WETH:  0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 (Ethereum)
- WBTC:  0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599 (Ethereum)
- SOL:   Sol11111111111111111111111111111111111111112 (Solana)

For recall-trade:
- fromToken: address you SELL
- toToken:   address you BUY
- amount:    human-readable (e.g., "10" for 10 USDC)
- reason:    short justification
`,
  // Pilih model Gemini (kualitas tinggi). Bisa ganti 'gemini-2.5-flash' untuk speed.
  model: google("gemini-2.5-pro"),
  tools: { recallTrade, getPortfolio },
});
