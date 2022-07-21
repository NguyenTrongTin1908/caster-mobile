export interface IApiResponse {
  data: any;
  status?: string;
  code?: number;
  error?: boolean;
  message?: string;
}

export interface IReduxAction {
  payload: any;
  type: string;
}
