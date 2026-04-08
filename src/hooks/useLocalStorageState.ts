"use client";

import { useEffect, useMemo, useState } from "react";

type Serialize<T> = (value: T) => string;
type Deserialize<T> = (raw: string) => T;

function defaultSerialize<T>(value: T): string {
  return JSON.stringify(value);
}

function defaultDeserialize<T>(raw: string): T {
  return JSON.parse(raw) as T;
}

export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: Serialize<T>;
    deserialize?: Deserialize<T>;
  },
) {
  const serialize = useMemo(
    () => options?.serialize ?? defaultSerialize<T>,
    [options?.serialize],
  );
  const deserialize = useMemo(
    () => options?.deserialize ?? defaultDeserialize<T>,
    [options?.deserialize],
  );

  const [state, setState] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) {
        setIsHydrated(true);
        return;
      }
      setState(deserialize(raw));
      setIsHydrated(true);
    } catch {
      setIsHydrated(true);
    }
  }, [deserialize, key]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(key, serialize(state));
    } catch {
      return;
    }
  }, [isHydrated, key, serialize, state]);

  return { state, setState, isHydrated } as const;
}

