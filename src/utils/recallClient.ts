// src/utils/recallClient.ts
import axios from "axios";

/**
 * Recall API axios client
 * - Memastikan baseURL selalu .../api (tanpa double /api)
 * - Menyematkan Authorization header dari RECALL_API_KEY
 */
export function getRecallClient() {
  const raw =
    process.env.RECALL_API_URL ||
    "https://api.sandbox.competitions.recall.network";
  const baseURL = raw.replace(/\/+$/, "") + "/api"; // tambahkan /api sekali
  const key = process.env.RECALL_API_KEY;

  if (!key) throw new Error("Missing RECALL_API_KEY in environment");

  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    timeout: 30_000,
  });

  // Debug optional: uncomment saat butuh
  // console.log("[Recall] baseURL:", client.defaults.baseURL);

  return client;
}
