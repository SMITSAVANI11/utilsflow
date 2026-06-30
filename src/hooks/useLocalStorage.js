// useLocalStorage.js — Persistent state hook synced with localStorage
import { useState, useEffect, useCallback, useRef } from "react";

export function useLocalStorage(key, initialValue) {
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

  const readValue = useCallback(() => {
    if (typeof window === "undefined") {
      return initialValueRef.current;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValueRef.current;
    } catch (error) {
      console.warn(`useLocalStorage: Error reading localStorage key "${key}":`, error);
      return initialValueRef.current;
    }
  }, [key]);

  const [storedValue, setStoredValue] = useState(readValue);

  // Keep a ref of the current storedValue so setValue does not need storedValue in its dependency array.
  // This prevents infinite render loops when used in dependency arrays of parent components' useEffects.
  const storedValueRef = useRef(storedValue);
  useEffect(() => {
    storedValueRef.current = storedValue;
  }, [storedValue]);

  // Sync state when key changes
  useEffect(() => {
    setStoredValue(readValue());
  }, [key, readValue]);

  const setValue = useCallback(
    (value) => {
      try {
        const currentValue = storedValueRef.current;
        const valueToStore = value instanceof Function ? value(currentValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          window.dispatchEvent(new CustomEvent(`local-storage-sync-${key}`));
        }
      } catch (err) {
        console.warn(`useLocalStorage: Failed to save key "${key}":`, err);
      }
    },
    [key]
  );

  useEffect(() => {
    const handleSync = (event) => {
      if (event.type === "storage" && event.key !== key) {
        return;
      }
      setStoredValue(readValue());
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener(`local-storage-sync-${key}`, handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener(`local-storage-sync-${key}`, handleSync);
    };
  }, [key, readValue]);

  return [storedValue, setValue];
}
