export type Overview = { totalLessons: number; totalStudents: number; averageProgress: number };

export type AttendanceSessionListItem = {
  id: string;
  dateIso: string;
  lessonSlug: string | null;
  createdAt: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
};

export type LessonResponseDoc = {
  lessonSlug?: string;
  studentId?: string;
  studentName?: string;
  completed?: boolean;
  answers?: {
    discussionNotes?: string;
  };
  updatedAt?: string | Date;
};

export type StudentDoc = { id: string; name: string; email: string | null; login: string | null };
