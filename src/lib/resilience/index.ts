// Vendored from cubiczan-resilience/typescript/src (no npm registry available).
// Provides safeFetch (per-attempt timeout via AbortController + exponential
// backoff retry on 429/5xx/network errors) and its supporting primitives.
export { safeFetch } from "./safeFetch";
export type { SafeFetchOptions, AllowlistHook } from "./safeFetch";
export { retry, computeBackoff } from "./retry";
export type { RetryOptions } from "./retry";
export { ResilienceError, isResilienceError } from "./errors";
export type { ResilienceErrorKind, ResilienceErrorOptions } from "./errors";
