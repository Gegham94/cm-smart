export interface TaskForm {
  dayForm: {
    day: string;
  };
  projectForm: {
    project?: number;
    organizationalProcess?: number;
  };
  infoForm: {
    title: string;
    description?: string;
  };
  durationForm: {
    duration: number;
  };
}
