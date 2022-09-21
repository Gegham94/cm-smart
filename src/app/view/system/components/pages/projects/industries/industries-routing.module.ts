import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndustriesComponent } from './industries.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { RequirementsComponent } from './requirements/requirements.component';

const routes: Routes = [
  {
    path: '',
    component: IndustriesComponent,
    children: [
      { path: '', component: ProjectDetailsComponent },
      { path: 'requirements', component: RequirementsComponent },
      { path: 'project-details', component: ProjectDetailsComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndustriesRoutingModule {}
