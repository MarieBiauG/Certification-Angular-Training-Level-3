import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ZipcodeEntryComponent } from '../zipcode-entry/zipcode-entry.component';
import { CurrentConditionsComponent } from '../current-conditions/current-conditions.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [SharedModule, ZipcodeEntryComponent, CurrentConditionsComponent],
  templateUrl: './main-page.component.html'
})
export class MainPageComponent {

}
