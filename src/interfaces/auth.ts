export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegister {
  username: string;
  email: string;
  password: string;
  type: string;
}

export interface IForgotPassword {
  type: 'user' | 'model' | 'studio';
  email: string;
}
export interface IUpdatePasswordFormData {
  password: string;
  prePassword: string;
}
