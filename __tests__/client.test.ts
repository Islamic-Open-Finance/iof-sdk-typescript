import { describe, it, expect } from "vitest";

describe("IOF SDK", () => {
  it("should export IOFClient", async () => {
    const sdk = await import("../src/index");
    expect(sdk.IOFClient).toBeDefined();
  });

  it("should export createIOFClient factory", async () => {
    const sdk = await import("../src/index");
    expect(sdk.createIOFClient).toBeDefined();
  });

  it("should export ContractService", async () => {
    const sdk = await import("../src/index");
    expect(sdk.ContractService).toBeDefined();
  });

  it("should export RailService", async () => {
    const sdk = await import("../src/index");
    expect(sdk.RailService).toBeDefined();
  });
});
