import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type StudentDto = {
  id: string;
  name: string;
  email?: string | null;
  login?: string | null;
  ala: string;
  turma: string;
  createdAt: string;
  updatedAt?: string;
};

export type TeacherDto = {
  id?: string | null;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

async function adminFetch<T>(path: string, init?: RequestInit) {
  const res = await fetch(path, { ...init, cache: "no-store" });
  const json = (await res.json().catch(() => null)) as any;
  if (!res.ok) throw new Error(json?.error ?? `HTTP_${res.status}`);
  return json as T;
}

export function useStudents() {
  return useQuery({
    queryKey: ["admin", "students"],
    queryFn: async () =>
      adminFetch<{ ok: true; data: StudentDto[] }>("/api/admin/students"),
  });
}

export function useTeachers() {
  return useQuery({
    queryKey: ["admin", "teachers"],
    queryFn: async () => adminFetch<{ ok: true; data: TeacherDto[] }>("/api/admin/teachers"),
  });
}

export function useUpdateTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { currentEmail: string; name?: string; email?: string }) =>
      adminFetch<{ ok: true; data: TeacherDto }>(`/api/admin/teachers/${encodeURIComponent(input.currentEmail)}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: input.name, email: input.email }),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "teachers"] });
    },
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: string;
      name?: string;
      email?: string;
      login?: string;
    }) =>
      adminFetch<{ ok: true; data: StudentDto }>(`/api/admin/students/${encodeURIComponent(input.id)}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: input.name, email: input.email, login: input.login }),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "students"] });
    },
  });
}
