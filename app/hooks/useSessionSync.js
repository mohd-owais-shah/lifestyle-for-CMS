import {useEffect, useRef} from 'react';
import {useFetchers, useNavigation, useRevalidator} from 'react-router';

const CHANNEL_NAME = 'lifestyle-session';
const STORAGE_SIGNAL_KEY = 'lifestyle-session-signal';
const SAFETY_NET_INTERVAL_MS = 3000;
const RETRY_AFTER_MS = 10000;

/** @param {string} name */
function readCookie(name) {
  for (const part of document.cookie.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

/**
 * Keeps every open tab of the same browser in step with the shared session.
 *
 * Source of truth: server.js keeps two non-secret cookies up to date —
 * `lf_auth` (1/0, derived from the server session incl. token expiry) and
 * `lf_cart_v` (bumped on basket changes). A tab whose rendered state no
 * longer matches them re-runs its loaders (server revalidation), so the
 * header, basket badge and protected pages update, and account/order pages
 * redirect away after a logout.
 *
 * Signals: when this tab's own action changes the session (login, logout,
 * basket), it posts a payload-free "changed" signal on a BroadcastChannel
 * (fallback: a timestamp in localStorage → `storage` event). A signal only
 * prompts other tabs to re-check the cookies — it is never trusted as proof
 * of authentication and carries no token, cookie or customer data.
 *
 * Also checked when a tab becomes visible/focused, plus a slow local safety
 * net (cookie read only, no network). Tabs never re-broadcast a change they
 * learned from someone else, so signals can't loop. Revalidation keeps
 * component state, so unsaved form input survives unless the page itself
 * becomes inaccessible (e.g. an account page after logout).
 *
 * @param {{isLoggedIn: boolean, cartVersion: string | null, enabled?: boolean}} rendered
 */
export function useSessionSync({isLoggedIn, cartVersion, enabled = true}) {
  const revalidator = useRevalidator();
  const navigation = useNavigation();
  const fetchers = useFetchers();

  // This tab's own submissions already revalidate; don't double-refresh
  const busy =
    revalidator.state !== 'idle' ||
    navigation.state !== 'idle' ||
    fetchers.some((fetcher) => fetcher.state !== 'idle');

  const stateRef = useRef({isLoggedIn, cartVersion, busy, revalidator, enabled});
  stateRef.current = {isLoggedIn, cartVersion, busy, revalidator, enabled};

  // True while a refresh triggered by *another* tab's change is in flight
  const syncingFromOtherTabRef = useRef(false);
  const notifyRef = useRef(() => {});
  const checkRef = useRef(() => {});

  useEffect(() => {
    if (!enabled) return undefined;

    const lastAttempt = {key: '', at: 0};

    // `fromSignal`: another tab announced a change (or the network came back)
    // — refresh even if this tab is in the background, so it's already
    // correct when the shopper returns. The periodic safety net only runs
    // for the visible tab.
    const check = (fromSignal = false) => {
      if (!fromSignal && document.visibilityState !== 'visible') return;
      // Offline: a refresh would fail and replace the page with the error
      // screen. Wait for the `online` event, which re-runs this check.
      if (navigator.onLine === false) return;
      const current = stateRef.current;
      if (!current.enabled || current.busy) return;

      const authCookie = readCookie('lf_auth');
      const cartCookie = readCookie('lf_cart_v');
      const authChanged =
        authCookie !== null && (authCookie === '1') !== current.isLoggedIn;
      const cartChanged =
        cartCookie !== null && cartCookie !== current.cartVersion;
      if (!authChanged && !cartChanged) return;

      // One refresh per observed change; if it doesn't settle (offline,
      // server error), retry at most every 10s instead of on every signal.
      const key = `${authCookie}|${cartCookie}`;
      const now = Date.now();
      if (lastAttempt.key === key && now - lastAttempt.at < RETRY_AFTER_MS) return;
      lastAttempt.key = key;
      lastAttempt.at = now;
      syncingFromOtherTabRef.current = true;
      current.revalidator.revalidate();
    };
    checkRef.current = check;

    let channel = null;
    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel(CHANNEL_NAME);
        channel.onmessage = (event) => {
          if (event.data?.type === 'session-changed') check(true);
        };
      }
    } catch {
      channel = null;
    }

    const onStorage = (event) => {
      if (event.key === STORAGE_SIGNAL_KEY) check(true);
    };
    const onLocalCheck = () => check(false);
    // Missed a change while offline? Re-check when the connection returns.
    const onOnline = () => check(true);
    if (!channel) window.addEventListener('storage', onStorage);

    notifyRef.current = () => {
      try {
        if (channel) channel.postMessage({type: 'session-changed'});
        else localStorage.setItem(STORAGE_SIGNAL_KEY, String(Date.now()));
      } catch {
        // Storage/channel unavailable: other tabs fall back to focus checks
      }
    };

    const interval = window.setInterval(onLocalCheck, SAFETY_NET_INTERVAL_MS);
    window.addEventListener('focus', onLocalCheck);
    window.addEventListener('online', onOnline);
    document.addEventListener('visibilitychange', onLocalCheck);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', onLocalCheck);
      window.removeEventListener('online', onOnline);
      document.removeEventListener('visibilitychange', onLocalCheck);
      window.removeEventListener('storage', onStorage);
      channel?.close();
      notifyRef.current = () => {};
    };
  }, [enabled]);

  // Announce changes made by this tab (not ones synced from another tab)
  const previousRef = useRef({isLoggedIn, cartVersion});
  useEffect(() => {
    const previous = previousRef.current;
    previousRef.current = {isLoggedIn, cartVersion};
    if (!enabled) return;
    const changed =
      previous.isLoggedIn !== isLoggedIn || previous.cartVersion !== cartVersion;
    if (!changed) return;
    if (syncingFromOtherTabRef.current) {
      syncingFromOtherTabRef.current = false;
      return;
    }
    notifyRef.current();
  }, [isLoggedIn, cartVersion, enabled]);

  // A finished sync that changed nothing (already up to date) clears the flag
  useEffect(() => {
    if (revalidator.state === 'idle' && syncingFromOtherTabRef.current) {
      const current = stateRef.current;
      const authCookie = readCookie('lf_auth');
      const settled =
        (authCookie === null || (authCookie === '1') === current.isLoggedIn) &&
        (readCookie('lf_cart_v') ?? current.cartVersion) === current.cartVersion;
      if (settled) syncingFromOtherTabRef.current = false;
    }
  }, [revalidator.state]);
}
