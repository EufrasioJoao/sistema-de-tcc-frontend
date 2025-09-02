export const storage = {
  get: <T>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return fallback;
      try {
        return JSON.parse(item);
      } catch {
        return item as T;
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return fallback;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return;
    try {
      const item = typeof value === "string" ? value : JSON.stringify(value);
      window.localStorage.setItem(key, item);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },
};
