import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "../api/http";
import type { LessonDto, LessonListItemDto } from "./lessons.types";

export function useAdminLessons(accessToken: string | null) {
  return useQuery({
    queryKey: ["admin", "lessons"],
    enabled: Boolean(accessToken),
    queryFn: async () =>
      apiFetch<{ lessons: LessonListItemDto[] }>("/lessons?published=false", { accessToken }),
  });
}

export function useAdminLesson(accessToken: string | null, id: string) {
  return useQuery({
    queryKey: ["admin", "lesson", id],
    enabled: Boolean(accessToken) && Boolean(id),
    queryFn: async () => apiFetch<{ lesson: LessonDto }>(`/lessons/${id}`, { accessToken }),
  });
}

export function useCreateLesson(accessToken: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      lessonNumber: number;
      slug: string;
      title: string;
      subtitle: string;
      date?: string | null;
      reference?: string | null;
      content: unknown;
      published?: boolean;
    }) =>
      apiFetch<{ lesson: LessonDto }>("/lessons", {
        method: "POST",
        accessToken,
        body: {
          lessonNumber: input.lessonNumber,
          slug: input.slug,
          title: input.title,
          subtitle: input.subtitle,
          date: input.date ?? undefined,
          reference: input.reference ?? undefined,
          content: input.content,
          published: input.published ?? false,
        },
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "lessons"] });
    },
  });
}

export function useUpdateLesson(accessToken: string | null, id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<LessonDto>) =>
      apiFetch<{ lesson: LessonDto }>(`/lessons/${id}`, {
        method: "PUT",
        accessToken,
        body: {
          lessonNumber: input.lessonNumber,
          slug: input.slug,
          title: input.title,
          subtitle: input.subtitle,
          date: input.date,
          reference: input.reference,
          content: input.content,
          published: input.published,
        },
      }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["admin", "lessons"] }),
        qc.invalidateQueries({ queryKey: ["admin", "lesson", id] }),
      ]);
    },
  });
}

export function useDeleteLesson(accessToken: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      apiFetch<void>(`/lessons/${id}`, { method: "DELETE", accessToken }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "lessons"] });
    },
  });
}

