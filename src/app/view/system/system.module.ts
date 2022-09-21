import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SidenavItemPossitionPipe } from '@pipes/sidenavItemPossition';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ClipboardModule } from 'ngx-clipboard';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatMenuModule } from '@angular/material/menu';

import { SystemComponent } from './system.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SystemRoutingModule } from './system-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { SidenavMenuItemComponent } from './components/sidenav/sidenav-menu-item/sidenav-menu-item.component';
import { ProjectsComponent } from './components/pages/projects/projects/projects.component';
import { EventsComponent } from './components/pages/events/events.component';
import { EventModalComponent } from './components/pages/events/create-event-modal/event-modal.component';
import { EventDetailModalComponent } from './components/pages/events/event-detail-modal/event-detail-modal.component';
import { AboutComponent } from './components/pages/about/about.component';
import { SkillsComponent } from './components/pages/skills/skills.component';
import { AddNewSkillComponent } from './components/pages/add-new-skill/add-new-skill.component';
import { PassTestComponent } from './components/pages/pass-test/pass-test.component';
import { UpdateSkillComponent } from './components/pages/update-skill/update-skill.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { EducationWorkplaceModalComponent } from './components/pages/profile/education-workplace-modal/education-workplace-modal.component';
import { TaskModalComponent } from './components/pages/profile/task-modal/task-modal.component';
import { SpentTimeTaskModelComponent } from './components/dialog/task/spent-time-task-model/spent-time-task-model.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { NotificationComponent } from './components/header/notification/notification.component';
import { SettingsModalComponent } from './components/dialog/settings-modal/settings-modal.component';
import { ActivityComponent } from './components/pages/activity/activity.component';
import { DayEventsDetailsModalComponent } from './components/dialog/day-events-details-modal/day-events-details-modal.component';
import { HeaderDashboardComponent } from './components/header/header-dashboard/header-dashboard.component';
import { CalendarHeaderModule } from '../../shared/components/calendar-header/calendar-header.module';
import { CustomDateAdapter } from '../../core/helpers/custom-date-adapter';
import { MomentPipe } from '../../shared/pipes/moment.pipe';
import { TaskViewComponent } from './components/dialog/task-view/task-view.component';
import { CreateUpdateTaskModule } from './components/dialog/task/create-update-task-model/create-update-task.module';
import { NgxMaskModule } from 'ngx-mask';
import { OngoingProjectsComponent } from './components/ongoing-projects/ongoing-projects.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ProjectsService } from '../../core/services/projects.service';
import { ProjectsTabComponent } from './components/pages/profile/projects-tab/projects-tab.component';

@NgModule({
  declarations: [
    SystemComponent,
    SidenavComponent,
    HeaderComponent,
    SidenavMenuItemComponent,
    SidenavItemPossitionPipe,
    MomentPipe,
    ProjectsComponent,
    EventsComponent,
    EventModalComponent,
    AboutComponent,
    EventDetailModalComponent,
    SkillsComponent,
    AddNewSkillComponent,
    PassTestComponent,
    UpdateSkillComponent,
    ProfileComponent,
    EducationWorkplaceModalComponent,
    TaskModalComponent,
    DashboardComponent,
    NotificationComponent,
    SpentTimeTaskModelComponent,
    SettingsModalComponent,
    ActivityComponent,
    DayEventsDetailsModalComponent,
    HeaderDashboardComponent,
    TaskViewComponent,
    OngoingProjectsComponent,
    ProjectsTabComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    MatSnackBarModule,
    SystemRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatNativeDateModule,
    NgxChartsModule,
    ClipboardModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    CalendarHeaderModule,
    DragDropModule,
    CreateUpdateTaskModule,
    NgxDaterangepickerMd.forRoot(),
    NgxMaskModule,
    MatTooltipModule,
    MatTableModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: false,
      },
    },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
    },
    ProjectsService,
  ],
  exports: [MomentPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SystemModule {}
