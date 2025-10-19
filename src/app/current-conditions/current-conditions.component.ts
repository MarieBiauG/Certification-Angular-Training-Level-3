import { Component, inject, Signal, ViewChild } from '@angular/core';
import { WeatherService } from '../../shared/service/weather.service';
import { LocationService } from '../../shared/service/location.service';
import { Router } from '@angular/router';
import { ConditionsAndZip } from '../../shared/dto/conditions-and-zip.type';
import { TabsComponent } from '../tabs/tabs.component';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-current-conditions',
  standalone: true,
  imports: [SharedModule, TabsComponent],
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {
  @ViewChild(TabsComponent)
  tabsComponent: TabsComponent<ConditionsAndZip>;

  protected readonly weatherService = inject(WeatherService);
  private readonly router = inject(Router);
  private readonly locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.currentConditions;
  protected trackByZip = (item: ConditionsAndZip) => item.zip;

  /**
   * Removes a location when clicking on the "X" icon of the button tab
   * @param location
   */
  removeLocation(location: ConditionsAndZip): void {
    this.locationService.removeLocation(location.zip);
  }

  /**
   * Button to redirect to the 5-day forecast for a zipcode
   * @param zipcode
   */
  showForecast(zipcode: string): void {
    this.router.navigate(['/forecast', zipcode])
  }
}
