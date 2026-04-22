"use client";

import { useCallback } from "react";

import {
  createStudentSession,
  normalizeStudentCode,
  normalizeStudentName,
} from "@/features/auth/studentSession";
import type { StudentSession } from "@/features/auth/types";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

const SESSION_KEY = "seminario:studentSession:v2";

export function useStudentSession() {
  const storage = useLocalStorageState<StudentSession | null>(
    SESSION_KEY,
    null,
    {},
  );

  const login = useCallback(
    (rawName: string, rawCode?: string) => {
      const name = normalizeStudentName(rawName);
      if (name.length < 2) return { ok: false as const, error: "Nome muito curto" };
      const code = normalizeStudentCode(rawCode ?? "");
      if (code.length < 4) return { ok: false as const, error: "Senha muito curta" };
      const session = createStudentSession(name, { code });
      storage.setState(session);
      return { ok: true as const, session };
    },
    [storage],
  );

  const logout = useCallback(() => {
    storage.setState(null);
  }, [storage]);

  return {
    session: storage.state,
    isHydrated: storage.isHydrated,
    login,
    logout,
  } as const;
}
