import { useQuery } from "@tanstack/react-query";
import {
  getNetworkMetrics,
  getValidators,
  getStakingEvents,
  getUserPositions,
  getValidatorRisk,
  getYieldProvenance,
  MOCK_NETWORK_METRICS,
  MOCK_VALIDATORS,
  MOCK_STAKING_EVENTS,
  MOCK_POSITIONS,
  MOCK_RISK_ASSESSMENTS,
  MOCK_YIELD_PROVENANCE,
  type RiskAssessment,
} from "@/lib/liquify";

// Each hook performs a live read through the resilient liquify service layer
// (10s timeout + retry/backoff via safeFetch) and falls back to the bundled
// mock data when the Indexer is unreachable, so the demo UI never goes blank.

export function useLiquifyMetrics() {
  return useQuery({
    queryKey: ["liquify-metrics"],
    queryFn: async () => {
      try {
        return await getNetworkMetrics();
      } catch {
        return MOCK_NETWORK_METRICS;
      }
    },
    refetchInterval: 12000,
    retry: 2,
    staleTime: 10000,
  });
}

export function useLiquifyValidators() {
  return useQuery({
    queryKey: ["liquify-validators"],
    queryFn: async () => {
      try {
        return await getValidators();
      } catch {
        return MOCK_VALIDATORS;
      }
    },
    initialData: MOCK_VALIDATORS,
    refetchInterval: 30000,
    retry: 2,
    staleTime: 15000,
  });
}

export function useLiquifyEvents(limit = 50) {
  return useQuery({
    queryKey: ["liquify-events", limit],
    queryFn: async () => {
      try {
        return await getStakingEvents(limit);
      } catch {
        return MOCK_STAKING_EVENTS;
      }
    },
    initialData: MOCK_STAKING_EVENTS,
    refetchInterval: 15000,
    retry: 2,
    staleTime: 10000,
  });
}

export function useLiquifyPositions(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ["liquify-positions", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return MOCK_POSITIONS;
      try {
        return await getUserPositions(walletAddress);
      } catch {
        return MOCK_POSITIONS;
      }
    },
    initialData: MOCK_POSITIONS,
    retry: 2,
    staleTime: 15000,
  });
}

export function useLiquifyRiskAssessments() {
  return useQuery<RiskAssessment[]>({
    queryKey: ["liquify-risk"],
    queryFn: async () => {
      try {
        // The Indexer exposes per-validator risk; aggregate across validators,
        // falling back to the bundled assessments on any failure.
        const results = await Promise.all(
          MOCK_VALIDATORS.map((v) => getValidatorRisk(v.id)),
        );
        return results;
      } catch {
        return MOCK_RISK_ASSESSMENTS;
      }
    },
    initialData: MOCK_RISK_ASSESSMENTS,
    refetchInterval: 30000,
    retry: 2,
    staleTime: 15000,
  });
}

export function useLiquifyYieldProvenance(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ["liquify-provenance", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return MOCK_YIELD_PROVENANCE;
      try {
        return await getYieldProvenance(walletAddress);
      } catch {
        return MOCK_YIELD_PROVENANCE;
      }
    },
    initialData: MOCK_YIELD_PROVENANCE,
    retry: 2,
    staleTime: 15000,
  });
}
