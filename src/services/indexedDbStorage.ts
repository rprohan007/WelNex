/**
 * IndexedDB storage engine for large binary document attachments (PDFs, Presentation Slides).
 * Completely bypasses browser localStorage 5MB quota restrictions (QUOTA_EXCEEDED_ERR).
 */

const DB_NAME = 'welnex_academy_docs_db';
const STORE_NAME = 'documents';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB is not available in this environment.'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  return dbPromise;
}

/**
 * Save binary Data URI to IndexedDB
 */
export async function saveDocumentToIndexedDB(id: string, dataUrl: string): Promise<boolean> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const putRequest = store.put({ id, dataUrl, updatedAt: Date.now() });

      putRequest.onsuccess = () => resolve(true);
      putRequest.onerror = (e) => {
        console.error('[IndexedDB] Failed to store document binary:', e);
        resolve(false);
      };
    });
  } catch (err) {
    console.error('[IndexedDB] DB connection error saving document:', err);
    return false;
  }
}

/**
 * Retrieve binary Data URI from IndexedDB by ID
 */
export async function getDocumentFromIndexedDB(id: string): Promise<string | null> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const result = getRequest.result;
        resolve(result?.dataUrl || null);
      };
      getRequest.onerror = () => {
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

/**
 * Delete a document from IndexedDB
 */
export async function deleteDocumentFromIndexedDB(id: string): Promise<void> {
  try {
    const db = await getDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
  } catch {
    // ignore
  }
}

