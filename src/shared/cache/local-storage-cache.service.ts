import { Injectable } from '@angular/core';
import { CacheEntry, DEFAULT_EXPIRY } from './cache-entry.model';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageCacheService<T> {
    /**
     * Add an entry in the caching system
     * @param key
     * @param value
     * @param expiryDelay
     */
    set<T>(key: string, value: T, expiryDelay: number = DEFAULT_EXPIRY): void {
        const expiry = Date.now() + expiryDelay;
        const entry: CacheEntry<T> = { value, expiry };
        localStorage.setItem(key, JSON.stringify(entry));
    }

    /**
     * Retrieve an entry in the caching system from its key
     * @param key
     */
    get<T>(key: string): T | null {
        const item = localStorage.getItem(key);

        if (!item) {
            return null;
        }

        try {
            const entry: CacheEntry<T> = JSON.parse(item);
            if (Date.now() > entry.expiry) {
                localStorage.removeItem(key);
                return null;
            } else {
                return entry.value;
            }
        } catch (e) {
            console.warn(`Cache error while parsing key ${key}`, e);
            localStorage.removeItem(key);
            return null;
        }
    }
}
