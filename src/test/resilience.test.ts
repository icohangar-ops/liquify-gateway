import { describe, it, expect, vi } from "vitest";
import { safeFetch, ResilienceError } from "@/lib/resilience";

const HOST = "indexer.liquify.io";
const URL_OK = `https://${HOST}/api/v1/network/metrics`;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("safeFetch (vendored resilience primitive)", () => {
  it("passes a per-attempt AbortSignal to fetch and returns the response", async () => {
    let seenSignal: AbortSignal | undefined;
    const fetchImpl = vi.fn(async (_url: URL | string, init?: RequestInit) => {
      seenSignal = init?.signal ?? undefined;
      return jsonResponse({ ok: true });
    }) as unknown as typeof fetch;

    const res = await safeFetch(URL_OK, { fetchImpl, allowlist: [HOST] });
    expect(res.ok).toBe(true);
    expect(seenSignal).toBeInstanceOf(AbortSignal);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("aborts the request after the configured timeout", async () => {
    vi.useFakeTimers();
    // fetch that never resolves until its signal aborts.
    const fetchImpl = vi.fn(
      (_url: URL | string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () =>
            reject((init.signal as AbortSignal).reason),
          );
        }),
    ) as unknown as typeof fetch;

    const promise = safeFetch(URL_OK, {
      fetchImpl,
      allowlist: [HOST],
      timeoutMs: 10_000,
      maxAttempts: 1,
    });
    const assertion = expect(promise).rejects.toMatchObject({ kind: "timeout" });
    await vi.advanceTimersByTimeAsync(10_001);
    await assertion;
    vi.useRealTimers();
  });

  it("retries on a retryable 5xx then succeeds", async () => {
    vi.useFakeTimers();
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ err: true }, 503))
      .mockResolvedValueOnce(jsonResponse({ ok: true }, 200)) as unknown as typeof fetch;

    const promise = safeFetch(URL_OK, {
      fetchImpl,
      allowlist: [HOST],
      maxAttempts: 3,
      baseDelayMs: 1,
    });
    await vi.runAllTimersAsync();
    const res = await promise;
    expect(res.status).toBe(200);
    expect((fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(2);
    vi.useRealTimers();
  });

  it("fails closed on a host outside the SSRF allowlist (no network I/O)", async () => {
    const fetchImpl = vi.fn() as unknown as typeof fetch;
    await expect(
      safeFetch("https://evil.example.com/api", { fetchImpl, allowlist: [HOST] }),
    ).rejects.toBeInstanceOf(ResilienceError);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
