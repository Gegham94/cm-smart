import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from '@services/notifications.service';

@Component({
  selector: 'app-pass-test',
  templateUrl: './pass-test.component.html',
  styleUrls: ['./pass-test.component.scss'],
})
export class PassTestComponent {
  isSelected!: boolean;

  constructor(private notifyService: NotificationsService, public dialogRef: MatDialogRef<any>) {}

  selectItem(targer: any): void {
    const languages: any = document.getElementById('language_selections');
    const inputs: any = languages.getElementsByTagName('INPUT');
    for (const item of inputs) {
      item.checked = false;
    }
    const clickedtItem: any = document.getElementById(targer.id);
    clickedtItem.checked = true;
    this.isSelected = true;
  }

  chooseLanguage(): void {
    if (!this.isSelected) {
      this.notifyService.showWarning(
        'Choose one of the languages to pass the test.',
        "Language isn't Selected !",
      );
    }
  }

  closePassTest(): void {
    this.dialogRef.close();
  }
}
