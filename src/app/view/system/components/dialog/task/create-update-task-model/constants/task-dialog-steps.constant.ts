import { TaskDialogStep } from '@models/task-dialog-step.interface';
import { TaskCreateStep } from '../../../../../../../shared/enums/task-create-step.enum';

export const TaskDialogSteps: TaskDialogStep[] = [
  {
    step: TaskCreateStep.SelectDay,
    title: 'Select Day',
    isActive: true,
  },
  {
    step: TaskCreateStep.ProjectsOrOrganization,
    title: 'Projects or Organization',
    isActive: false,
  },
  {
    step: TaskCreateStep.TitleAndDescription,
    title: 'Title and Description',
    isActive: false,
  },
  {
    step: TaskCreateStep.SelectDuration,
    title: 'Select Duration',
    isActive: false,
  },
];
