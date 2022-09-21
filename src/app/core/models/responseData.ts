export interface ResponseI<DataType> {
  data: DataType;
  message: string;
  success: boolean;
  errors: string[];
}
