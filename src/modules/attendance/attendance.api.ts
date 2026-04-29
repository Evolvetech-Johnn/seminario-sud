import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type AttendanceSessionListItem = {
  id: string;
  dateIso: string;
  createdAt: string;
  lessonSlug: string | null;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
};

export type AttendanceSessionDetails = {
  session: {
    id: string;
    dateIso: string;
    lessonSlug: string | null;
    createdAt: string;
  };
  records: Array<{
    id: string;
    studentId: string;
    code: string;
    present: boolean;
    confirmedAt: string | null;
    studentName: string;
    studentEmail?: string | null;
  }>;
};

async function adminFetch<T>(path: string, init?: RequestInit) {
  const res = await fetch(path, { ...init, cache: "no-store" });
  const json = (await res.json().catch(() => null)) as any;
  if (!res.ok) throw new Error(json?.error ?? `HTTP_${res.status}`);
  return json as T;
}

export function useAttendanceSessions(dateIso?: string) {
  return useQuery({
    queryKey: ["attendance", "sessions", dateIso ?? null],
    queryFn: async () =>
      adminFetch<{ ok: true; data: AttendanceSessionListItem[] }>(
        `/api/admin/attendance/sessions${dateIso ? `?date=${encodeURIComponent(dateIso)}` : ""}`,
      ),
  });
}

export function useAttendanceSession(sessionId: string | null) {
  return useQuery({
    queryKey: ["attendance", "session", sessionId],
    enabled: Boolean(sessionId),
    queryFn: async () =>
      adminFetch<{ ok: true; data: AttendanceSessionDetails }>(
        `/api/admin/attendance/sessions/${encodeURIComponent(sessionId ?? "")}`,
      ),
  });
}

export function useCreateAttendanceSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { dateIso: string; lessonSlug?: string | null }) =>
      adminFetch<{ ok: true; data: { session: AttendanceSessionDetails["session"]; records: AttendanceSessionDetails["records"] } }>(
        "/api/admin/attendance/sessions",
        { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) },
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["attendance", "sessions"] });
    },
  });
}

export function useConfirmAttendance() {
  return useMutation({
    mutationFn: async (input: { code: string; dateIso?: string }) =>
      adminFetch<{ ok: true; data: { studentName: string | null; alreadyConfirmed: boolean } } | { ok: false; error: string }>(
        "/api/attendance/confirm",
        { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) },
      ),
  });
}
