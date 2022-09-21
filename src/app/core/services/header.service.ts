import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  headerSubject = new BehaviorSubject('');
  constructor() {}

  setHeaderValue(element: string): void {
    this.headerSubject.next(element);
  }
}
