import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustriesRoutingModule } from './industries-routing.module';
import { IndustriesComponent } from './industries.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

@NgModule({
  declarations: [IndustriesComponent, RequirementsComponent, ProjectDetailsComponent],
  imports: [CommonModule, IndustriesRoutingModule],
})
export class IndustriesModule {}
