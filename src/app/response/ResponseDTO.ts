export interface ResponseDTO<T> {
  message: string;
  success: boolean;
  data: T | null;
}
