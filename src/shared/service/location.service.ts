import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageCacheService } from '../cache/local-storage-cache.service';
import { CacheEntryKey, EXPIRY_DAY_IN_MS } from '../cache/cache-entry.model';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly _locations: string[] = [];
  private readonly locationsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(
      private readonly localStorageCacheService: LocalStorageCacheService<string[]>
  ) {
    // Retrieve from localStorage
    const locString: string[] = this.localStorageCacheService.get(CacheEntryKey.LOCATIONS);
    if (locString) {
      this._locations = locString;
      this.locationsSubject.next(this._locations);
    }
  }

  /**
   * Get locations as an observable
   */
  get locations(): Observable<string[]> {
    return this.locationsSubject.asObservable();
  }

  /**
   * Add a new location
   * @param zipcode
   */
  addLocation(zipcode: string): void {
    if (!this._locations.includes(zipcode)) {
      this._locations.push(zipcode);
      this.locationsSubject.next(this._locations);
      this.localStorageCacheService.set(CacheEntryKey.LOCATIONS, this._locations, EXPIRY_DAY_IN_MS);
    }
  }

  /**
   * Remove a location if exists
   * @param zipcode
   */
  removeLocation(zipcode: string): void {
    const index = this._locations.indexOf(zipcode);
    if (index !== -1) {
      this._locations.splice(index, 1);
      this.locationsSubject.next(this._locations);
      this.localStorageCacheService.set(CacheEntryKey.LOCATIONS, this._locations, EXPIRY_DAY_IN_MS);
    }
  }
}
