import {useEffect, useMemo, useState} from 'react';
import {AccountSection} from '~/components/Account/AccountSection';
import rawStores from '~/data/lifestyle-stores.json';
import {normalizeStores} from '~/lib/normalizeStores';
import {
  getCollectionStores,
  saveCollectionStore,
  subscribeAccountStorage,
} from '~/lib/accountPreferences.client';

const collectionStores = normalizeStores(rawStores).filter(
  (store) => store.clickCollect,
);

export const meta = () => [{title: 'Click & Collect'}];

export default function AccountClickCollect() {
  const [preferredStore, setPreferredStore] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const syncPreferredStore = () => {
      const stores = getCollectionStores();
      const store = stores.lifestyle || null;
      setPreferredStore(store);
      setSelectedStoreId(store?.id || '');
    };
    syncPreferredStore();
    return subscribeAccountStorage(syncPreferredStore);
  }, []);

  const visibleStores = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return collectionStores;
    return collectionStores.filter((store) =>
      [store.title, store.city, store.state, store.pincode]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    );
  }, [search]);

  const selectedStore = collectionStores.find(
    (store) => store.id === selectedStoreId,
  );
  const storeOptions =
    selectedStore &&
    !visibleStores.some((store) => store.id === selectedStore.id)
      ? [selectedStore, ...visibleStores]
      : visibleStores;

  const handleSave = () => {
    setMessage('');
    setError('');
    try {
      if (selectedStore) {
        saveCollectionStore('lifestyle', {
          id: selectedStore.id,
          title: selectedStore.title,
          city: selectedStore.city,
          state: selectedStore.state,
          address: [
            selectedStore.line2,
            selectedStore.city,
            selectedStore.state,
          ]
            .filter(Boolean)
            .join(', '),
          phone: selectedStore.phone,
        });
        setMessage('Your preferred store has been saved on this device.');
      } else {
        saveCollectionStore('lifestyle', null);
        setMessage('Your preferred store has been removed.');
      }
    } catch (storageError) {
      console.error(
        'Unable to save your preferred collection store.',
        storageError,
      );
      setError('Your preferred store could not be saved on this device.');
    }
  };

  return (
    <AccountSection
      title="Click & Collect"
      description="Choose a Lifestyle store for quick access to collection details."
      icon="store"
    >
      <p className="account-feature-note">
        Your preference is saved in this browser only. Store selection here does
        not reserve an order or change an existing order&apos;s fulfilment.
      </p>
      {preferredStore && (
        <div className="account-feature-summary">
          <strong>Preferred store</strong>
          <p>
            {preferredStore.title}, {preferredStore.city}
          </p>
          {preferredStore.address && <p>{preferredStore.address}</p>}
          {preferredStore.phone && (
            <a href={`tel:${preferredStore.phone.replace(/[^\d+]/g, '')}`}>
              {preferredStore.phone}
            </a>
          )}
        </div>
      )}
      <div className="account-store-picker">
        <label>
          <span>Find a Click &amp; Collect store</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by city, state or PIN code"
          />
        </label>
        <label>
          <span>Available Lifestyle stores ({visibleStores.length})</span>
          <select
            value={selectedStoreId}
            onChange={(event) => {
              setSelectedStoreId(event.target.value);
              setMessage('');
            }}
          >
            <option value="">No preferred store</option>
            {storeOptions.map((store) => (
              <option key={store.id} value={store.id}>
                {store.title} — {store.city}, {store.state}
              </option>
            ))}
          </select>
        </label>
        <button
          className="account-feature-primary-button"
          type="button"
          onClick={handleSave}
        >
          Save preferred store
        </button>
      </div>
      {message && (
        <p className="account-feature-message" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="account-feature-message" role="alert">
          {error}
        </p>
      )}
    </AccountSection>
  );
}
