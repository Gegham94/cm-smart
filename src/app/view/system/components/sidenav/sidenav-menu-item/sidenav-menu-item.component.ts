import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavElem } from '@models/sidenav';

import { SidenavService } from 'src/app/core/services/sidenav.service';
@Component({
  selector: 'app-sidenav-menu-item',
  templateUrl: './sidenav-menu-item.component.html',
  styleUrls: ['./sidenav-menu-item.component.scss'],
})
export class SidenavMenuItemComponent implements OnInit {
  @Input() hideItem!: boolean;
  @Input() item!: SidenavElem;
  @Output() toggle: EventEmitter<any> = new EventEmitter();
  constructor(public sidenavService: SidenavService, private router: Router) {}

  openChild(): void {
    this.toggle.emit(this.item);
  }

  ngOnInit(): void {
    this.router.events.subscribe((_) => {
      this.setActiveItem();
    });
    this.setActiveItem();
  }

  setActiveItem() {
    for (let item of this.item.route) {
      this.item.isOpen = this.router.routerState.snapshot.url === item;
    }
  }
}
