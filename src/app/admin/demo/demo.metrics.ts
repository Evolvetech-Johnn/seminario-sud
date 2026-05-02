import type { AttendanceSessionListItem, LessonResponseDoc, StudentDoc } from "./demo.types";

function safeStr(v: unknown) {
  if (typeof v === "string") return v;
  if (!v) return "";
  return String(v);
}

function clamp01(v: number) {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

export function computeAttendanceSeries(sessions: AttendanceSessionListItem[]) {
  const sorted = [...sessions].sort((a, b) => a.dateIso.localeCompare(b.dateIso));
  return sorted.map((s) => {
    const denom = Math.max(1, Number(s.totalStudents ?? 0));
    const rate = clamp01(Number(s.presentCount ?? 0) / denom);
    return { dateIso: s.dateIso, rate, present: Number(s.presentCount ?? 0), total: denom };
  });
}

export function computeOverallAttendanceRate(sessions: AttendanceSessionListItem[]) {
  let present = 0;
  let total = 0;
  for (const s of sessions) {
    present += Number(s.presentCount ?? 0);
    total += Number(s.totalStudents ?? 0);
  }
  if (total <= 0) return 0;
  return clamp01(present / total);
}

export function computeCompletionRate(responses: LessonResponseDoc[]) {
  const total = responses.length;
  const completed = responses.filter((r) => Boolean(r.completed)).length;
  return { completed, total, rate: total > 0 ? clamp01(completed / total) : 0 };
}

export function computeReflectionRate(responses: LessonResponseDoc[]) {
  const total = responses.length;
  const withReflection = responses.filter((r) => {
    const text = safeStr(r.answers?.discussionNotes).trim();
    return text.length >= 40;
  }).length;
  return { withReflection, total, rate: total > 0 ? clamp01(withReflection / total) : 0 };
}

export function computeResponsesByLesson(responses: LessonResponseDoc[], limit: number) {
  const map = new Map<string, { completed: number; total: number }>();
  for (const r of responses) {
    const slug = safeStr(r.lessonSlug).trim();
    if (!slug) continue;
    const prev = map.get(slug) ?? { completed: 0, total: 0 };
    prev.total += 1;
    if (r.completed) prev.completed += 1;
    map.set(slug, prev);
  }

  const items = [...map.entries()]
    .map(([lessonSlug, v]) => ({ lessonSlug, completed: v.completed, total: v.total }))
    .sort((a, b) => {
      if (b.completed !== a.completed) return b.completed - a.completed;
      return b.total - a.total;
    })
    .slice(0, Math.max(1, limit));

  return items;
}

export function computeEngagementByStudent(students: StudentDoc[], responses: LessonResponseDoc[]) {
  const map = new Map<string, { name: string; total: number; completed: number; withReflection: number }>();
  for (const s of students) {
    map.set(s.id, {
      name: s.name,
      total: 0,
      completed: 0,
      withReflection: 0,
    });
  }

  for (const r of responses) {
    const id = safeStr(r.studentId).trim();
    if (!id) continue;
    const rec = map.get(id) ?? { name: safeStr(r.studentName) || id, total: 0, completed: 0, withReflection: 0 };
    rec.total += 1;
    if (r.completed) rec.completed += 1;
    if (safeStr(r.answers?.discussionNotes).trim().length >= 40) rec.withReflection += 1;
    map.set(id, rec);
  }

  return [...map.entries()]
    .map(([studentId, v]) => ({ studentId, ...v }))
    .sort((a, b) => {
      if (b.completed !== a.completed) return b.completed - a.completed;
      if (b.total !== a.total) return b.total - a.total;
      return a.name.localeCompare(b.name);
    });
}

