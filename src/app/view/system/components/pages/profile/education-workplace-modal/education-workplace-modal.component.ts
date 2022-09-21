import { Component } from '@angular/core';

@Component({
  selector: 'app-education-workplace-modal',
  templateUrl: './education-workplace-modal.component.html',
  styleUrls: ['./education-workplace-modal.component.scss'],
})
export class EducationWorkplaceModalComponent {
  switched = 1;
  dropDownOpen!: number;
  secondClick = 0;

  switcher(num: number): void {
    this.switched = num;
  }

  openDropDown(num: number): void {
    this.dropDownOpen = num;
    ++this.secondClick;
    if (this.secondClick > 1 && this.dropDownOpen === num) {
      this.dropDownOpen = 0;
      this.secondClick = 0;
    }
  }
}
