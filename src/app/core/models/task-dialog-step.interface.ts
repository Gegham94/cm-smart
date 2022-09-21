import { TaskCreateStep } from '../../shared/enums/task-create-step.enum';

export interface TaskDialogStep {
  step: TaskCreateStep;
  title: string;
  isActive: boolean;
}
