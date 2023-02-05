import { get as getItem, set as setItem, del as removeItem } from 'idb-keyval';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';

export const idbPersister = createAsyncStoragePersister({
  storage: {
    getItem: async (key) => getItem(key) as Promise<string | null>,
    setItem,
    removeItem,
  },
  key: 'urlslab-storage',
  throttleTime: 2000,
});
