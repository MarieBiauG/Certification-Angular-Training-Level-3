import { Component, effect, EventEmitter, Input, Output, Signal, TemplateRef } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent<T> {
  @Input() signalData: Signal<T[]>;
  @Input() trackBy: (item: T) => unknown;
  @Input() buttonNameTemplate!: TemplateRef<any>;
  @Input() tabContentTemplate!: TemplateRef<any>;
  @Output() remove = new EventEmitter<T>();

  protected selectedItem: T;

  constructor() {
    // When the signal containing the data changes, update the selected item if needed
    effect(() => {
      const data: T[] = this.signalData();
      if (data.length === 0) {
        this.selectedItem = null;
      } else if (!this.selectedItem || !data.some(item => this.trackBy(item) === this.trackBy(this.selectedItem))) {
        this.selectedItem = data[0];
      }
    });
  }

  /**
   * Changes the currently selected item
   * @param selection
   */
  changeCurrentSelection(selection: T): void {
    this.selectedItem = selection;
  }
}
