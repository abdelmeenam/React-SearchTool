import { openDB } from 'idb';

const DB_NAME = 'PharmacyDB';
const STORE_NAME = 'drugData';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const saveToIndexedDB = async (key: string, data: any) => {
  const db = await initDB();
  return db.put(STORE_NAME, data, key);
};

export const getFromIndexedDB = async (key: string) => {
  const db = await initDB();
  return db.get(STORE_NAME, key);
};

export const clearIndexedDB = async () => {
  const db = await initDB();
  return db.clear(STORE_NAME);
};
