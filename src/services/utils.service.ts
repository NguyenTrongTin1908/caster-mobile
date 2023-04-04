import { ICountry, ILangguges, IPhoneCodes } from "src/interfaces";
import { APIRequest } from "./api-request";

export class UtilsService extends APIRequest {
  private _countries = [] as any;

  async countriesList(): Promise<any> {
    if (this._countries.length) {
      return this._countries;
    }
    const resp = await this.get("/countries/list");
    this._countries = resp;
    return resp;
  }

  languagesList(): Promise<any> {
    return this.get("/languages/list");
  }

  phoneCodesList(): Promise<any> {
    return this.get("/phone-codes/list");
  }

  bodyInfo() {
    return this.get("/user-additional");
  }

  verifyRecaptcha(token: string) {
    return this.post("/re-captcha/verify", { token });
  }

  statesList(countryCode: string) {
    return this.get(`/states/${countryCode}`);
  }

  citiesList(countryCode: string, state: string) {
    return this.get(`/cities/${countryCode}/${state}`);
  }
}

export const utilsService = new UtilsService();
