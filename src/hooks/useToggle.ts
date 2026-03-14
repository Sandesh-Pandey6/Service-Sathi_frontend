import { useState, useCallback } from 'react';

/**
 * Toggle a boolean state. Useful for modals, dropdowns, accordions, etc.
 * @param initialValue - Initial state (default: false)
 */
export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}
