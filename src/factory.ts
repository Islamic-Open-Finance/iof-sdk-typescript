/**
 * SDK Factory Functions
 */

import { IOFClient, type ClientConfig } from "./client.js";

/**
 * Create a new IOF Client instance
 */
export function createIOFClient(config: ClientConfig): IOFClient {
  return new IOFClient(config);
}

/**
 * Create a client with environment defaults
 */
export function createIOFClientFromEnv(): IOFClient {
  const baseUrl = process.env.IOF_API_URL || "http://localhost:3000";
  const apiKey = process.env.IOF_API_KEY;
  const accessToken = process.env.IOF_ACCESS_TOKEN;
  const tenantId = process.env.IOF_TENANT_ID;

  if (!apiKey && !accessToken) {
    throw new Error("Either IOF_API_KEY or IOF_ACCESS_TOKEN must be set");
  }

  return new IOFClient({
    baseUrl,
    apiKey,
    accessToken,
    tenantId,
  });
}
