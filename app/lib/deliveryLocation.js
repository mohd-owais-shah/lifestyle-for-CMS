import {useCallback, useEffect, useState} from 'react';

/**
 * One delivery pincode for the whole storefront. Whatever page the buyer
 * sets it on (home location bar, PDP checker, cart), every other page picks
 * it up — including other open tabs via the `storage` event.
 */
const STORAGE_KEY = 'lifestyle_delivery_pincode';
const CHANGE_EVENT = 'lifestyle:delivery-location';

/**
 * @typedef {{
 *   pincode: string;
 *   city?: string;
 *   state?: string;
 *   deliveryText?: string;
 *   deliveryDays?: string;
 * }} DeliveryLocation
 */

/** @return {DeliveryLocation | null} */
export function readDeliveryLocation() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return value?.pincode ? value : null;
  } catch {
    return null;
  }
}

/** @param {DeliveryLocation} location */
export function saveDeliveryLocation(location) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch {
    // Storage unavailable (private mode) — still notify this page
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearDeliveryLocation() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Current delivery location, kept in sync across components and tabs.
 * Returns null during SSR and until the first client effect runs.
 */
export function useDeliveryLocation() {
  const [location, setLocation] = useState(
    /** @type {DeliveryLocation | null} */ (null),
  );

  useEffect(() => {
    const sync = () => setLocation(readDeliveryLocation());
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) sync();
    };
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const save = useCallback((value) => saveDeliveryLocation(value), []);
  const clear = useCallback(() => clearDeliveryLocation(), []);

  return {location, save, clear};
}

const OPEN_PICKER_EVENT = 'lifestyle:open-delivery-picker';
const CLOSE_PICKER_EVENT = 'lifestyle:close-delivery-picker';

/**
 * Open the delivery location picker dialog (desktop modal or mobile bottom sheet)
 * @param {'choose' | 'pincode' | 'addresses'} [step='choose']
 */
export function openDeliveryLocationPicker(step = 'choose') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(OPEN_PICKER_EVENT, {detail: {step}}),
    );
  }
}

/**
 * Close the delivery location picker dialog
 */
export function closeDeliveryLocationPicker() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CLOSE_PICKER_EVENT));
  }
}

/**
 * Subscribe to open delivery location events
 * @param {(step: 'choose' | 'pincode' | 'addresses') => void} callback
 */
export function subscribeToDeliveryPickerOpen(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e) => callback(e?.detail?.step || 'choose');
  window.addEventListener(OPEN_PICKER_EVENT, handler);
  return () => window.removeEventListener(OPEN_PICKER_EVENT, handler);
}

/**
 * Subscribe to close delivery location events
 * @param {() => void} callback
 */
export function subscribeToDeliveryPickerClose(callback) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CLOSE_PICKER_EVENT, callback);
  return () => window.removeEventListener(CLOSE_PICKER_EVENT, callback);
}

