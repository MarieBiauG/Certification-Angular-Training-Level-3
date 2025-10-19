import { Injectable, Signal, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from '../model/current-conditions.type';
import { ConditionsAndZip } from '../dto/conditions-and-zip.type';
import { Forecast } from '../../app/forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { LocalStorageCacheService } from '../cache/local-storage-cache.service';
import { catchError, tap } from 'rxjs/operators';
import { CacheEntryKey } from '../cache/cache-entry.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {

  static readonly URL = 'https://api.openweathermap.org/data/2.5';
  static readonly APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static readonly ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

  private readonly _currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(private readonly http: HttpClient,
              private readonly locationService: LocationService,
              private readonly localStorageCacheService: LocalStorageCacheService<CurrentConditions | Forecast>) {
    // When locations change, checks what was added and what was removed
    this.locationService.locations.subscribe((locations: string[]) => {
      const currentConditionsList = this._currentConditions();
      const added: string[] = locations.filter(location => !currentConditionsList.map(item => item.zip).includes(location));
      const removed: string[] = currentConditionsList.filter(currentCondition => !locations.includes(currentCondition.zip))
          .map(currentCondition => currentCondition.zip);
      added.forEach(zipAdded => this.addCurrentConditions(zipAdded));
      removed.forEach(zipRemoved => this.removeCurrentConditions(zipRemoved));
    });
  }

  /**
   * Get current conditions as a readonly signal
   */
  get currentConditions(): Signal<ConditionsAndZip[]> {
    return this._currentConditions.asReadonly();
  }

  /**
   * Add a condition to the current conditions signal
   * Checks if the condition is in the cache, otherwise gets the current conditions data from the API
   * @param zipcode
   */
  addCurrentConditions(zipcode: string): void {
    const currentConditionsCacheKey: string = CacheEntryKey.CURRENT_CONDITIONS + zipcode;
    const currentConditionsFromCache: CurrentConditions = this.localStorageCacheService.get(currentConditionsCacheKey);
    // Data is present in the cache
    if (currentConditionsFromCache) {
      this._currentConditions.update(conditions => {
        return [...conditions, {zip: zipcode, data: currentConditionsFromCache}];
      });
    } else {
      // Retrieve data from API
      this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
          .pipe(
              tap(data => this.localStorageCacheService.set(currentConditionsCacheKey, data)),
              // If the weather for the location doesn't exist, remove it from the location service
              catchError((error) => {
                this.locationService.removeLocation(zipcode);
                return throwError(() => error);
              })
          )
          .subscribe(data => {
            this._currentConditions.update(conditions => {
              return [...conditions, {zip: zipcode, data}];
            });
          });
    }
  }

  /**
   * Remove a condition from the current conditions signal
   * @param zipcode
   */
  removeCurrentConditions(zipcode: string) {
    this._currentConditions.update(conditions => {
      for (const i in conditions) {
        if (conditions[i].zip === zipcode) {
          conditions.splice(+i, 1);
        }
      }
      return [...conditions];
    })
  }

  /**
   * Get the 5-day forecast for a zipcode
   * Checks if the forecast data is in the cache, otherwise gets the forecast data from the API
   * @param zipcode
   */
  getForecast(zipcode: string): Observable<Forecast> {
    const forecastCacheKey: string = CacheEntryKey.FIVE_DAY_FORECAST + zipcode;
    const forecastFromCache: Forecast = this.localStorageCacheService.get(forecastCacheKey);
    if (forecastFromCache) {
      return of(forecastFromCache);
    } else {
      return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`)
          .pipe(
              tap(data => this.localStorageCacheService.set(forecastCacheKey, data))
          );
    }
  }

  /**
   * Returns the image associated to the id of the weather (ex: sun, clouds, rain etc)
   * @param id
   */
  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232) {
      return WeatherService.ICON_URL + 'art_storm.png';
    } else if (id >= 501 && id <= 511) {
      return WeatherService.ICON_URL + 'art_rain.png';
    } else if (id === 500 || (id >= 520 && id <= 531)) {
      return WeatherService.ICON_URL + 'art_light_rain.png';
    } else if (id >= 600 && id <= 622) {
      return WeatherService.ICON_URL + 'art_snow.png';
    } else if (id >= 801 && id <= 804) {
      return WeatherService.ICON_URL + 'art_clouds.png';
    } else if (id === 741 || id === 761) {
      return WeatherService.ICON_URL + 'art_fog.png';
    } else {
      return WeatherService.ICON_URL + 'art_clear.png';
    }
  }

}
