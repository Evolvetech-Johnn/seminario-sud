export type StudentSession = {
  id: string;
  name: string;
  login?: string;
  email?: string | null;
  ala: string; // "ala1", "ala2", "ala3"
  turma: string; // "A", "B", etc.
  createdAt: string;
};

