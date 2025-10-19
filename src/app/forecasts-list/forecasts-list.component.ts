import { Component } from '@angular/core';
import { WeatherService } from '../../shared/service/weather.service';
import { ActivatedRoute } from '@angular/router';
import { Forecast } from './forecast.type';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-forecasts-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent {

  zipcode: string;
  forecast: Forecast;

  constructor(protected weatherService: WeatherService, route: ActivatedRoute) {
    route.params.subscribe(params => {
      this.zipcode = params['zipcode'];
      weatherService.getForecast(this.zipcode)
        .subscribe(data => this.forecast = data);
    });
  }
}
