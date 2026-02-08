import { useEffect, useState, useCallback } from "react";
import type { TicketDTO, PagedTickets } from "../types/jira";
import jiraApi from "../api/jiraApi";

export function useTickets(
  releaseId?: string,
  initial?: PagedTickets | null,
  pageSize = 30,
) {
  const [tickets, setTickets] = useState<TicketDTO[]>(initial?.tickets ?? []);
  const [nextPageToken, setNextPageToken] = useState<string | null>(
    initial?.nextPageToken ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(!!initial?.nextPageToken);

  const mergeAndDedupe = useCallback(
    (prev: TicketDTO[], incoming: TicketDTO[]) => {
      const map = new Map<string, TicketDTO>();
      prev.forEach((t) => map.set(t.key, t));
      incoming.forEach((t) => map.set(t.key, t));
      return Array.from(map.values());
    },
    [],
  );

  const loadInitial = useCallback(async () => {
    if (!releaseId) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await jiraApi.fetchTicketsPage(releaseId, { pageSize });
      setTickets(resp.tickets ?? []);
      setNextPageToken(resp.nextPageToken ?? null);
      setHasMore(!!resp.nextPageToken);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, [releaseId, pageSize]);

  const loadMore = useCallback(async () => {
    if (!releaseId || !hasMore || loadingMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      const resp = await jiraApi.fetchTicketsPage(releaseId, {
        nextPageToken: nextPageToken ?? undefined,
        pageSize,
      });
      setTickets((prev) => mergeAndDedupe(prev, resp.tickets ?? []));
      setNextPageToken(resp.nextPageToken ?? null);
      setHasMore(!!resp.nextPageToken);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load more tickets");
    } finally {
      setLoadingMore(false);
    }
  }, [
    releaseId,
    hasMore,
    loadingMore,
    nextPageToken,
    pageSize,
    mergeAndDedupe,
  ]);

  useEffect(() => {
    setTickets(initial?.tickets ?? []);
    setNextPageToken(initial?.nextPageToken ?? null);
    setHasMore(!!initial?.nextPageToken);
    loadInitial();
  }, [releaseId, initial, loadInitial]);

  return {
    tickets,
    loading,
    loadingMore,
    error,
    hasMore,
    nextPageToken,
    loadMore,
    reload: loadInitial,
    setTickets,
  };
}
