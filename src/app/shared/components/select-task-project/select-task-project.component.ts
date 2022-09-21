import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ProjectsListData } from '../../../core/models';
import { ToDoService } from '../../../core/services';
import { organizationalProcessList } from '../../constants/organizational-process-list';

@Component({
  selector: 'app-select-task-project',
  templateUrl: './select-task-project.component.html',
  styleUrls: ['./select-task-project.component.scss'],
})
export class SelectTaskProjectComponent implements OnInit, OnChanges {
  @Input()
  public projectFormGroup!: FormGroup;

  @Input()
  public hasDefaultTitle!: boolean;

  @Input()
  public infoFormGroup!: FormGroup;

  public selectedTabIndex = 0;
  public projectList: ProjectsListData[] = [];
  public loading = true;
  public isOtherOrganization = false;
  public readonly organizationalProcessList = organizationalProcessList;

  constructor(private toDo: ToDoService) {}

  public ngOnInit(): void {
    this.initializeListeners();
  }

  public ngOnChanges(): void {
    if (this.projectFormGroup.get('project')?.value) {
      this.selectedTabIndex = 0;
    } else if (this.projectFormGroup.get('organizationalProcess')?.value) {
      this.selectedTabIndex = 1;
    }
  }

  private initializeListeners(): void {
    this.toDo.getProjects().subscribe((projects) => {
      this.projectList = projects.data;
      this.loading = false;
    });
  }

  public setProject(projectId: number): void {
    this.projectFormGroup.get('project')?.setValue(projectId);
    this.projectFormGroup.get('organizationalProcess')?.setValue(null);
    this.setIsOtherOrganizationState(false);
    if (!this.hasDefaultTitle) {
      this.titleFormControl.setValue(null);
    }
  }

  public setOrganizationalProcess(
    organizationalProcessId: number,
    organizationalProcessTitle: string,
  ): void {
    this.projectFormGroup.get('project')?.setValue(null);
    this.projectFormGroup.get('organizationalProcess')?.setValue(organizationalProcessId);
    this.setIsOtherOrganizationState(false);
    if (!this.hasDefaultTitle) {
      this.titleFormControl.setValue(organizationalProcessTitle);
    }
  }

  public setIsOtherOrganizationState(newState: boolean): void {
    if (!this.hasDefaultTitle) {
      this.titleFormControl.setValue('');
    }
    if (newState) {
      this.projectFormGroup.get('organizationalProcess')?.setValue(null);
      this.setOtherOrganizationalProcess();
    }
    this.isOtherOrganization = newState;
  }

  public setOtherOrganizationalProcess(): void {
    this.projectFormGroup.get('project')?.setValue(null);
    this.projectFormGroup.get('organizationalProcess')?.setValue(null);
    if (!this.hasDefaultTitle) {
      this.titleFormControl.setValue('');
    }
  }

  public tabChange(event: MatTabChangeEvent): void {
    console.log('tabChange');
    if (event.index === 0) {
      this.projectFormGroup.get('project')?.setValidators([Validators.required]);
      this.projectFormGroup.get('organizationalProcess')?.clearValidators();
      this.titleFormControl.setValue('');
    } else if (event.index === 1) {
      this.projectFormGroup.get('organizationalProcess')?.setValidators([Validators.required]);
      this.projectFormGroup.get('project')?.clearValidators();
    }
    this.projectFormGroup.updateValueAndValidity();
  }

  public get titleFormControl(): FormControl {
    return this.infoFormGroup.get('title') as FormControl;
  }
}
