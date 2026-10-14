const WISHLIST_KEY = 'landmark-account-wishlist-v1';
const COLLECTION_STORES_KEY = 'landmark-collection-stores-v1';
const ACCOUNT_STORAGE_EVENT = 'landmark-account-storage';
let isStorageListenerAttached = false;
let accountStorageSubscriberCount = 0;

function dispatchAccountStorageChange() {
  window.dispatchEvent(new Event(ACCOUNT_STORAGE_EVENT));
}

function handleExternalStorageChange(event) {
  if (
    event.key !== WISHLIST_KEY &&
    event.key !== COLLECTION_STORES_KEY &&
    event.key !== null
  ) {
    return;
  }
  dispatchAccountStorageChange();
}

function parseStorageValue(key, fallback) {
  try {
    let value = window.localStorage.getItem(key);
    if (!value && key === WISHLIST_KEY) {
      value = window.localStorage.getItem('wishlist');
    }
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Unable to read saved account preference "${key}".`, error);
    return fallback;
  }
}

export function getWishlist() {
  if (typeof window === 'undefined') return [];
  const items = parseStorageValue(WISHLIST_KEY, []);
  return Array.isArray(items)
    ? items.filter(
        (item) =>
          item &&
          typeof item.id === 'string' &&
          typeof item.handle === 'string',
      )
    : [];
}

export function saveWishlist(items) {
  if (typeof window === 'undefined') return;
  try {
    const raw = JSON.stringify(items);
    window.localStorage.setItem(WISHLIST_KEY, raw);
    window.localStorage.setItem('wishlist', raw);
  } catch (error) {
    console.error('Unable to save wishlist in localStorage:', error);
  }
  dispatchAccountStorageChange();
}

export function getCollectionStores() {
  if (typeof window === 'undefined') return {};
  const stores = parseStorageValue(COLLECTION_STORES_KEY, {});
  return stores && typeof stores === 'object' && !Array.isArray(stores)
    ? stores
    : {};
}

export function saveCollectionStore(brand, store) {
  const stores = getCollectionStores();
  if (store) {
    stores[brand] = store;
  } else {
    delete stores[brand];
  }
  window.localStorage.setItem(COLLECTION_STORES_KEY, JSON.stringify(stores));
  dispatchAccountStorageChange();
}

export function subscribeAccountStorage(callback) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(ACCOUNT_STORAGE_EVENT, callback);
  accountStorageSubscriberCount++;
  if (!isStorageListenerAttached) {
    window.addEventListener('storage', handleExternalStorageChange);
    isStorageListenerAttached = true;
  }
  let isSubscribed = true;
  return () => {
    if (!isSubscribed) return;
    isSubscribed = false;
    window.removeEventListener(ACCOUNT_STORAGE_EVENT, callback);
    accountStorageSubscriberCount--;
    if (accountStorageSubscriberCount === 0 && isStorageListenerAttached) {
      window.removeEventListener('storage', handleExternalStorageChange);
      isStorageListenerAttached = false;
    }
  };
}

export function getAccountStorageSnapshot() {
  if (typeof window === 'undefined') return '[]';
  try {
    return (
      window.localStorage.getItem(WISHLIST_KEY) ||
      window.localStorage.getItem('wishlist') ||
      '[]'
    );
  } catch (error) {
    console.error('Unable to access saved account preferences.', error);
    return '[]';
  }
}
