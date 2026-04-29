import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/modules/api/http";

export type AttendanceSessionListItem = {
  id: string;
  date: string;
  createdAt: string;
  lessonId: string | null;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
};

export type AttendanceSessionDetails = {
  id: string;
  date: string;
  createdAt: string;
  lessonId: string | null;
  lesson?: { id: string; lessonNumber: number; title: string; date: string | null } | null;
  records: Array<{
    id: string;
    studentId: string;
    code: string;
    present: boolean;
    confirmedAt: string | null;
    student: { name: string; email: string };
  }>;
};

export function useAttendanceSessions(accessToken: string | null, date?: string) {
  return useQuery({
    queryKey: ["attendance", "sessions", date ?? null],
    enabled: Boolean(accessToken),
    queryFn: async () =>
      apiFetch<{ sessions: AttendanceSessionListItem[] }>(
        `/attendance/sessions${date ? `?date=${encodeURIComponent(date)}` : ""}`,
        { accessToken },
      ),
  });
}

export function useAttendanceSession(accessToken: string | null, sessionId: string | null) {
  return useQuery({
    queryKey: ["attendance", "session", sessionId],
    enabled: Boolean(accessToken) && Boolean(sessionId),
    queryFn: async () =>
      apiFetch<{ session: AttendanceSessionDetails }>(`/attendance/sessions/${sessionId}`, {
        accessToken,
      }),
  });
}

export function useCreateAttendanceSession(accessToken: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { date: string; lessonId?: string | null }) =>
      apiFetch<{ session: AttendanceSessionDetails; records: AttendanceSessionDetails["records"] }>(
        "/attendance/sessions",
        { method: "POST", accessToken, body: input },
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["attendance", "sessions"] });
    },
  });
}

export function useConfirmAttendance(accessToken: string | null) {
  return useMutation({
    mutationFn: async (input: { sessionId: string; code: string }) =>
      apiFetch<{ ok: true; alreadyConfirmed?: boolean } | { ok: false; error: string }>(
        "/attendance/confirm",
        { method: "POST", accessToken, body: input },
      ),
  });
}

