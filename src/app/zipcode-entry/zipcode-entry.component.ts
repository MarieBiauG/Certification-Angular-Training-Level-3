import { Component } from '@angular/core';
import { LocationService } from '../../shared/service/location.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-zipcode-entry',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  constructor(private readonly service: LocationService) { }

  addLocation(zipcode: string): void {
    this.service.addLocation(zipcode);
  }

}
