import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.scss'],
})
export class TaskInfoComponent {
  @Input()
  public infoFormGroup!: FormGroup;
}
