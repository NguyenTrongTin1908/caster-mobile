import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIRequest } from './api-request';
import {
  IApiResponse,
  IUserLogin,
  IUserRegister,
  IUserUpdate,
  IForgotPassword,
  IUpdatePasswordFormData,
  IVerifyEmail
} from 'src/interfaces';

export class AuthService extends APIRequest {
  static accessToken;

  me(): Promise<IApiResponse> {
    return this.get('/users/me');
  }

  userLogin(data: IUserLogin): Promise<IApiResponse> {
    return this.post('/auth/login', data);
  }

  userRegister(data: IUserRegister): Promise<IApiResponse> {
    return this.post('/auth/users/register', data);
  }

  updateProfile(data: IUserUpdate): Promise<IApiResponse> {
    return this.put('/users', data);
  }

  forgotPassword(data: IForgotPassword): Promise<IApiResponse> {
    return this.post('/auth/users/forgot', data);
  }

  updatePassword(body: IUpdatePasswordFormData) {
    return this.put('/auth/users/me/password', body);
  }

  async setAccessToken(token: string): Promise<void> {
    AuthService.accessToken = token;
    await AsyncStorage.setItem('accessToken', token);
  }

  async getAccessToken(): Promise<string | null> {
    return AuthService.accessToken || AsyncStorage.getItem('accessToken');
  }

  async removeAccessToken(): Promise<void> {
    await AsyncStorage.removeItem('accessToken');
  }

  async loginGoogle(data: any) {
    return this.post('/auth/google/login', data);
  }

  public async verifyEmail(data: IVerifyEmail) {
    return this.post('/auth/email-verification', data);
  }

  public async updateFcm(data: any) {
    return this.post('/auth/email-verification', data);
  }


}

export const authService = new AuthService();
