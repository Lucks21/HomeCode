class LocalStorageService {
  get<T = string>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    } catch {
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage unavailable (SSR, private mode, quota exceeded)
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage unavailable
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch {
      // Storage unavailable
    }
  }
}

export const localStorageService = new LocalStorageService();
