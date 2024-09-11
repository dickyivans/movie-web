import { useState, useEffect } from "react";

export function UseDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // Clear timeout jika value berubah sebelum delay terpenuhi
    };
  }, [value, delay]);

  return debouncedValue;
}
