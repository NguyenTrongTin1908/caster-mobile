export interface IApiResponse {
  data: any;
  status?: string;
  code?: number;
  error?: boolean;
  message?: string;
}

export interface IReduxAction<T> {
  payload: any;
  type: string;
}
