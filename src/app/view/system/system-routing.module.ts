import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SystemComponent } from './system.component';
import { ProjectsComponent } from './components/pages/projects/projects/projects.component';
import { EventsComponent } from './components/pages/events/events.component';
import { FullCalendarComponent } from './components/pages/full-calendar/full-calendar.component';
import { AboutComponent } from './components/pages/about/about.component';
import { SkillsComponent } from './components/pages/skills/skills.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { ActivityComponent } from './components/pages/activity/activity.component';

const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
    children: [
      { path: '', redirectTo: 'dashboard' },
      { path: 'projects/projects', component: ProjectsComponent },

      {
        path: 'projects/industries',
        loadChildren: () =>
          import('./components/pages/projects/industries/industries.module').then(
            (m) => m.IndustriesModule,
          ),
      },
      {
        path: 'day-offs-and-vacation',
        loadChildren: () =>
          import('./components/pages/day-offs/day-offs.module').then((m) => m.DayOffsModule),
      },
      { path: 'events', component: EventsComponent },
      { path: 'events/:id', component: EventsComponent },
      { path: 'calendar', component: FullCalendarComponent },
      { path: 'about', component: AboutComponent },
      { path: 'skills', component: SkillsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'activities', component: ActivityComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}
