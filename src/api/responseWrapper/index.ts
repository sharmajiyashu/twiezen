export class ResponseWrapper<T> {
  success: boolean;
  data?: T;
  error?: string;

  constructor() {
    this.success = false;
  }

  setData(data: T) {
    this.data = data;
    this.success = true;
  }

  setError(error: Error) {
    this.error = error?.message || error?.toString() || 'Unknown error';
    this.success = false;
  }
}
