import { describe, it, expect, vi, afterEach } from "vitest";
import {
  getNetworkMetrics,
  getValidators,
  MOCK_NETWORK_METRICS,
} from "@/lib/liquify";

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("liquify Indexer service layer (live reads via safeFetch)", () => {
  it("getNetworkMetrics hits the Indexer and returns parsed JSON", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse(MOCK_NETWORK_METRICS));

    const metrics = await getNetworkMetrics();
    expect(metrics).toEqual(MOCK_NETWORK_METRICS);

    const calledUrl = String(fetchSpy.mock.calls[0]?.[0]);
    expect(calledUrl).toContain("indexer.liquify.io/api/v1/network/metrics");
  });

  it("attaches an AbortSignal to every outbound call (timeout wiring)", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse([]));

    await getValidators();
    const init = fetchSpy.mock.calls[0]?.[1] as RequestInit | undefined;
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it("rejects when the Indexer never responds, once the 10s timeout fires", async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, "fetch").mockImplementation(
      (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          (init?.signal as AbortSignal | undefined)?.addEventListener(
            "abort",
            () => reject(new Error("aborted")),
          );
        }),
    );

    // maxAttempts default is 3; with the abort firing each attempt this still
    // surfaces as a thrown error rather than hanging forever.
    const promise = getNetworkMetrics().catch((e) => e);
    await vi.advanceTimersByTimeAsync(60_000);
    const result = await promise;
    expect(result).toBeInstanceOf(Error);
  });
});
