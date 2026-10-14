import {useEffect, useState} from 'react';

/**
 * True only once `active` has stayed true for `delayMs` — lets pending UI
 * (spinners, dimming) appear for genuinely slow requests without flashing
 * for operations that finish almost instantly.
 * @param {boolean} active
 * @param {number} delayMs
 */
export function useDelayedFlag(active, delayMs) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return undefined;
    }
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [active, delayMs]);

  return visible;
}
