import axios from 'axios';
import { config } from 'config';
import { isUrl, getContentType, getExt } from 'lib/string';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IApiResponse } from 'src/interfaces';
export abstract class APIRequest {
  static accessToken: string = '';
  setAuthHeaderToken(token: string): void {
    APIRequest.accessToken = token;
  }
  /**
   * Parses the JSON returned by a network request
   *
   * @param  {object} response A response from a network request
   *
   * @return {object}          The parsed JSON from the request
   */
  private parseJSON(response: Response): any {
    if (response.status === 204 || response.status === 205) return null;
    return response.json();
  }
  /**
   * Checks if a network request came back fine, and throws an error if not
   *
   * @param  {object} response   A response from a network request
   *
   * @return {object|undefined} Returns either the response, or throws an error
   */
  private checkStatus(response: Response): any {
    if (response.status >= 200 && response.status < 300) return response;
    if (response.status === 401) {
      throw new Error('Forbidden in the action!');
    }
    throw response.clone().json();
  }
  request(
    url: string,
    method?: string,
    body?: any,
    headers?: { [key: string]: string }
  ): Promise<IApiResponse> {
    const verb = (method || 'get').toUpperCase();
    const updatedHeader = {
      'Content-Type': 'application/json',
      // TODO - check me
      Authorization: APIRequest.accessToken || '',
      ...(headers || {})
    };
    return fetch(
      isUrl(url) ? url : `${config.extra.apiEndpoint}${url}`,
      {
        method: verb,
        headers: updatedHeader,
        body: body ? JSON.stringify(body) : null
      }
    )
      .then(this.checkStatus)
      .then(this.parseJSON);
  }
  buildUrl(baseUrl: string, params?: { [key: string]: any }): string {
    if (!params) return baseUrl;
    const queryString = Object.keys(params)
      .map((k) => {
        if (Array.isArray(params[k]))
          return params[k]
            .map(
              (param) => `${encodeURIComponent(k)}=${encodeURIComponent(param)}`
            )
            .join('&');
        return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
      })
      .join('&');
    return `${baseUrl}?${queryString}`;
  }
  get(url: string, headers?: { [key: string]: string }): Promise<IApiResponse> {
    return this.request(url, 'get', null, headers);
  }
  post(
    url: string,
    data?: any,
    headers?: { [key: string]: string }
  ): Promise<IApiResponse> {
    return this.request(url, 'post', data, headers);
  }
  put(
    url: string,
    data?: any,
    headers?: { [key: string]: string }
  ): Promise<IApiResponse> {
    return this.request(url, 'put', data, headers);
  }
  del(
    url: string,
    data?: any,
    headers?: { [key: string]: string }
  ): Promise<IApiResponse> {
    return this.request(url, 'delete', data, headers);
  }
  //todo check upload
  async axiosUpload(options: {
    url: string;
    file: any;
    fileName?: string;
    fileFieldName?: string;
    optionalData?: any;
    onUploadProgress?: Function;
    method?: string;
  }): Promise<IApiResponse> {
    const token = await AsyncStorage.getItem('accessToken');
   const file= {
      uri: options.file.uri,
      type: `video/mp4`,
      name: options.fileName
 }
 const data = [{
  fieldname: 'file',
          file
 }]
// const data =new FormData();
//     const name = options.fileName || options.file.uri.replace(/^.*[\\\/]/, '');
//     const type ='video'
//     const uri =
//       Platform.OS === 'android'
//         ? options.file.uri
//         : options.file.uri.replace('file://', '');
//     data.append(options.fileFieldName || 'file', {
//       name,
//       uri,
//       type
//     } as any);
//     options.optionalData &&
//       Object.keys(options.optionalData).forEach((field: string) =>
//         data.append(field, options.optionalData[field])
//       );

    return axios({
      url: options.url,
      method: options.method || 'post',
      headers: {
        Accept: 'application/json',
        Authorization: `${token}`,
        'Content-Type': 'multipart/form-data'
      },
      data
    });
  }
}
