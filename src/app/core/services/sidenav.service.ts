import { Injectable } from '@angular/core';

import { SidenavElem } from '../models/sidenav';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  constructor() {}

  private sidenavData: SidenavElem[] = [
    {
      name: 'Dashboard',
      route: ['/system/dashboard'],
      possition: 'top',
      index: 1,
      isOpen: false,
      iconPath: '/assets/icons/sidebar-icons/dashboard.svg',
    },
    // {
    //   name: 'Activities',
    //   route: ['/system/activities'],
    //   possition: 'top',
    //   index: 2,
    //   isOpen: false,
    //   iconPath: '/assets/icons/sidebar-icons/activities.svg',
    // },
    {
      name: 'Calendar',
      route: ['/system/calendar'],
      possition: 'top',
      index: 3,
      isOpen: false,
      iconPath: '/assets/icons/sidebar-icons/new-calendar.svg',
    },
    {
      name: 'Events',
      route: ['/system/events'],
      possition: 'top',
      index: 4,
      isOpen: false,
      iconPath: '/assets/icons/sidebar-icons/new-star-ev.svg',
    },
    // {
    //   name: 'Skills',
    //   route: ['/system/skills'],
    //   possition: 'top',
    //   index: 6,
    //   isOpen: false,
    //   iconPath: '/assets/icons/sidebar-icons/skills.svg',
    // },
    {
      name: 'Day offs and vacations',
      route: ['/system/day-offs-and-vacation'],
      possition: 'top',
      index: 7,
      isOpen: false,
      iconPath: '/assets/icons/sidebar-icons/day-off-and-vac.svg',
    },
    {
      name: 'About company',
      route: ['/system/about'],
      possition: 'top',
      index: 8,
      isOpen: false,
      iconPath: '/assets/icons/sidebar-icons/about-company.svg',
    },
  ];

  get sidenav(): SidenavElem[] {
    return this.sidenavData;
  }

  toggle(event: SidenavElem): void {
    this.sidenavData.forEach((el) => {
      if (el.index === event.index) {
        el.isOpen = true;
      } else {
        el.isOpen = false;
      }
    });
  }
}
