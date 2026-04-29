import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "../api/http";

export type DashboardOverview = {
  totalLessons: number;
  totalStudents: number;
  averageProgress: number;
};

export function useDashboardOverview(accessToken: string | null) {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    enabled: Boolean(accessToken),
    queryFn: async () =>
      apiFetch<DashboardOverview>("/dashboard/overview", {
        accessToken,
      }),
  });
}

