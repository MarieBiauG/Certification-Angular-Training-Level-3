export interface CacheEntry<T> {
    value: T;
    expiry: number; // in milliseconds
}

// Enum for the keys of the entries in the cache
export enum CacheEntryKey {
    FIVE_DAY_FORECAST = 'FIVE_DAY_FORECAST',
    CURRENT_CONDITIONS = 'CURRENT_CONDITIONS',
    LOCATIONS = 'LOCATIONS'
}

// Durations for the caching system
export const DEFAULT_EXPIRY = 7200000; // 2 hours
export const EXPIRY_DAY_IN_MS = 86400000; // 24h
