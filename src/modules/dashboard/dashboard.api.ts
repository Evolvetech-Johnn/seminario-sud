import { useQuery } from "@tanstack/react-query";

export type DashboardOverview = {
  totalLessons: number;
  totalStudents: number;
  averageProgress: number;
};

async function adminFetch<T>(path: string, init?: RequestInit) {
  const res = await fetch(path, { ...init, cache: "no-store" });
  const json = (await res.json().catch(() => null)) as any;
  if (!res.ok) throw new Error(json?.error ?? `HTTP_${res.status}`);
  return json as T;
}

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: async () =>
      adminFetch<{ ok: true; data: DashboardOverview }>("/api/admin/dashboard/overview"),
  });
}
