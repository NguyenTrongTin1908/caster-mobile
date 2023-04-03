export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegister {
  email: string;
  password: string;
  gender: string;
}

export interface IForgotPassword {
  type: "user" | "model" | "studio";
  email: string;
}
export interface IUpdatePasswordFormData {
  password: string;
  prePassword: string;
}

export interface IVerifyEmail {
  source: any;
  sourceType: string;
}
