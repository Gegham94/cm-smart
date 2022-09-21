import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { EmployeeData } from '@models/employee-data';
import { EventData } from '@models/event-data';
import { ClipboardService } from 'ngx-clipboard';
import { EventModalComponent } from '../create-event-modal/event-modal.component';

@Component({
  selector: 'app-event-detail-modal',
  templateUrl: './event-detail-modal.component.html',
  styleUrls: ['./event-detail-modal.component.scss'],
})
export class EventDetailModalComponent implements OnInit {
  isCopied = false;
  eventData!: EventData;
  participiants: EmployeeData[] = [];
  currentUser: any;
  constructor(
    private clipboardApi: ClipboardService,
    @Inject(MAT_DIALOG_DATA) public data: EventData,
    public dialogRef: MatDialogRef<any>,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.eventData = this.data;
  }

  copyText(event: any): void {
    this.isCopied = true;
    this.clipboardApi.copyFromContent(event.innerText);
    setTimeout(() => {
      this.isCopied = false;
    }, 500);
  }

  editEvent() {
    // this.dialogRef.close();

    const config: MatDialogConfig = {
      data: this.data,
      autoFocus: false,
      panelClass: 'event-create-modal',
      disableClose: true,
      hasBackdrop: true,
    };
    const dialogRef = this.dialog.open(EventModalComponent, config);

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.dialogRef.close(true);
      }
    });
  }
}
