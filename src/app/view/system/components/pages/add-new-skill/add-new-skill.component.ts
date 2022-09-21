import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { SkillsService } from '@services/skills.service';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-add-new-skill',
  templateUrl: './add-new-skill.component.html',
  styleUrls: ['./add-new-skill.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class AddNewSkillComponent {
  @ViewChild('arrowTrigger', { read: MatAutocompleteTrigger })
  arrowTrigger!: MatAutocompleteTrigger;

  @Input() public rating = 3;
  @Input() public starCount = 5;
  @Output() public ratingUpdated = new EventEmitter();

  public ratingArr = [];
  currentSkillRate = 0;

  control = new FormControl();
  filteredSkills!: any;

  private _filter(value: string): any {
    return this.skillsService.skills.filter(
      (skill) => skill.name.toLowerCase().indexOf(value.toLowerCase()) === 0,
    );
  }

  constructor(
    public skillsService: SkillsService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public userBookedDaysData: any,
  ) {
    this.filteredSkills = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? this._filter(value) : this.skillsService.skills.slice())),
    );
  }

  getSelectedOption(_: MatOption): void {}

  closeAddNewSkill(): void {
    this.dialogRef.close();
  }
}
