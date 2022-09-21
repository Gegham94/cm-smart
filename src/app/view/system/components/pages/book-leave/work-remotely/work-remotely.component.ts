import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-work-remotely',
  templateUrl: './work-remotely.component.html',
  styleUrls: ['./work-remotely.component.scss'],
})
export class WorkRemotelyComponent {
  @Input() displaySelectedWorkRemotelyDate: any;
}
