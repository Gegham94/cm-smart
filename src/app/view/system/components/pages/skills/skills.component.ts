import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeaderService } from '@services/header.service';
import { SkillsService } from '@services/skills.service';
import { AddNewSkillComponent } from '../add-new-skill/add-new-skill.component';
import { PassTestComponent } from '../pass-test/pass-test.component';
import { UpdateSkillComponent } from '../update-skill/update-skill.component';
import { chartData, colorScheme, dataRangeOptions } from './skills-chart-data';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
  view: any;
  chartData = chartData;
  colorScheme = colorScheme;
  dataRangeOptions = dataRangeOptions;
  displayDefaultRange: any;
  isOpenDataList = false;

  skillsData: any;

  constructor(
    public dialog: MatDialog,
    public skillsService: SkillsService,
    private headerService: HeaderService,
  ) {}

  ngOnInit(): void {
    this.headerService.setHeaderValue('Skills');
    this.skillsData = this.skillsService.skills;
    if (window.screen.width > 1800) {
      this.view = [window.screen.width - 750, 300];
    } else if (window.screen.width > 1700) {
      this.view = [window.screen.width - 730, 300];
    } else if (window.screen.width > 1600) {
      this.view = [window.screen.width - 700, 300];
    } else if (window.screen.width > 1400) {
      this.view = [window.screen.width - 650, 300];
    } else if (window.screen.width > 1309) {
      this.view = [window.screen.width - 630, 300];
    } else if (window.screen.width > 1200) {
      this.view = [window.screen.width - 400, 300];
    } else if (window.screen.width > 1100) {
      this.view = [window.screen.width - 350, 300];
    } else if (window.screen.width > 900) {
      this.view = [window.screen.width - 320, 300];
    } else if (window.screen.width > 830) {
      this.view = [window.screen.width - 300, 300];
    } else if (window.screen.width > 600) {
      this.view = [window.screen.width, 300];
    }
  }

  onResize(event: any): void {
    if (event.target.innerWidth > 1800) {
      this.view = [event.target.innerWidth - 750, 300];
    } else if (event.target.innerWidth > 1700) {
      this.view = [event.target.innerWidth - 730, 300];
    } else if (event.target.innerWidth > 1600) {
      this.view = [event.target.innerWidth - 700, 300];
    } else if (event.target.innerWidth > 1400) {
      this.view = [event.target.innerWidth - 650, 300];
    } else if (event.target.innerWidth > 1309) {
      this.view = [event.target.innerWidth - 630, 300];
    } else if (event.target.innerWidth > 1200) {
      this.view = [event.target.innerWidth - 400, 300];
    } else if (event.target.innerWidth > 1100) {
      this.view = [event.target.innerWidth - 350, 300];
    } else if (event.target.innerWidth > 900) {
      this.view = [event.target.innerWidth - 320, 300];
    } else if (event.target.innerWidth > 830) {
      this.view = [event.target.innerWidth - 300, 300];
    } else if (event.target.innerWidth > 600) {
      this.view = [event.target.innerWidth, 300];
    }
  }

  openDataRangeSelection(event?: boolean): void {
    if (event) {
      this.isOpenDataList = false;
    } else {
      this.isOpenDataList = !this.isOpenDataList;
    }
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  passTest(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'custom-MatDialog';

    dialogConfig.width = '450px';

    this.dialog.open(PassTestComponent, dialogConfig);
  }

  addNewSkill(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'custom-MatDialog';

    dialogConfig.width = '540px';

    this.dialog.open(AddNewSkillComponent, dialogConfig);
  }

  updateSkill(skill: any): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'custom-MatDialog';

    dialogConfig.width = '456px';
    dialogConfig.data = { skill };

    this.dialog.open(UpdateSkillComponent, dialogConfig);
  }
}
