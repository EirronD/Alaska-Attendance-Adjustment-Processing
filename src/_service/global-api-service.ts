import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../_config/app-config';
import { Observable } from 'rxjs';

import {JsonAppConfigService} from 'src/_service/json-app-config-service';

@Injectable({
  providedIn: 'root'
})
export class GlobalApiService {
private config: AppConfig | undefined;


  constructor(private http: HttpClient,
    private jsonAppConfigService: JsonAppConfigService) { 

        this.config = this.jsonAppConfigService.getConfig();
        console.log('API Base URL:', this.config?.APIBaseUrl);
    }


  private getOptions(): any {
    // let user = JSON.parse(localStorage.getItem('userData'));
    return {
      headers: new HttpHeaders({
        // Accept: 'text/plain',
          Authorization: 'token f8e979d1d038d81:ec45b06832a49ca'
      })
    }
  }


  
  private getOptionsSetup(): any {
    // let user = JSON.parse(localStorage.getItem('userData'));
    return {
      headers: new HttpHeaders({
          Accept: 'text/plain'
      })
    }
  }


  private reportSite() {
    // return Constants.API_ENDPOINT + "api/" + module;
    // return this.appConfig.ReportBaseUrl + "Reporting/";
  }

  private apiSite() {
    // return Constants.API_ENDPOINT + "api/" + module;
    return this.config?.APIBaseUrl + "api/";
  }

  getUrl() {
    return this.config?.ReportBaseUrl
  }


  view(module: string, modparam: string = "") {
        // const url = `https://localhost:44382/Reporting/PaymentSlip?crdocnum="${ this.docnum }"`;
    let site = this.reportSite();
    let url = `${site}${module}?${modparam}`;
    return url
  }

  async getPNLogin(): Promise<any> { // Replace `any` with the appropriate type if possible

    
    this.config = this.jsonAppConfigService.getConfig();
    // console.log('API Base URL:', this.config?.APIBaseUrl);

    const url = `${this.config?.PNBaseUrl}/api/method/login`;
  
    const body = {
      usr: "administrator",
      pwd: "n@Ve3Admin"
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    try {
      const response = await this.http.post(url, body, {headers}).toPromise(); // Corrected to use `post` instead of `get` since you are sending a payload
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getPNData(doctype: string): Promise<any> { // Replace `any` with the appropriate type if possible

    
    
    this.config = this.jsonAppConfigService.getConfig();
    // console.log('API Base URL:', this.config?.APIBaseUrl);

    const url = `${this.config?.PNBaseUrl}/api/resource/${doctype}`;
    const options = this.getOptions();
    
    try {
      const response = await this.http.get(url, options).toPromise(); // Use .toPromise() if using Angular's HttpClient
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getPNIntegData(doctype: string): Promise<any> {

    this.config = this.jsonAppConfigService.getConfig();
    console.log('API Base URL:', this.config?.APIBaseUrl);

    const url = `${this.config?.APIBaseUrl}/api-pn/timekeeping/AdjustmentProcessing/${doctype}`; // Ensure you are using the correct path
    console.log(url)
    try {
      const response = await this.http.get(url).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching integration data:', error);
      throw error;
    }
  }

  async getIntegData(payroll_period: string): Promise<any> {

    this.config = this.jsonAppConfigService.getConfig();
    // console.log('API Base URL:', this.config?.APIBaseUrl);

    const url = `${this.config?.APIBaseUrl}/api-pn/timekeeping/AdjustmentProcessing/getLateApprovals/${payroll_period}`; // Ensure you are using the correct path
    console.log(url)
    try {
      const response = await this.http.get(url).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching integration data:', error);
      throw error;
    }
  }

  get(module: string, modfunction: string = "", modparam: string = "") {
    let site = this.apiSite();

    if (modfunction !== "") {
      modfunction = '/' + `${modfunction}`;
    }
    if (modparam !== "") {
      modparam = '/' + `${modparam}`;
    }

    let url = `${site}${module}${modfunction}${modparam}`;
    let options = this.getOptions();
    return this.http.get(url, options);
  }


  async postData(body: any, module: string) {
    const site = `${this.config?.APIBaseUrl}/api-pn/timekeeping/AdjustmentProcessing/`;
    const url = `${site}${module}`;
    console.log('url', url)
    console.log(body)
    const options = this.getOptions();
  

    try {
      const response = await this.http.post(url, body, options).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching integration data:', error);
      throw error;
    }
  }

  async getDataAsync(module: string, modfunction: string = "", modparam: string = ""): Promise<any> {
    try {
      const response = await this.get(module, modfunction, modparam).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }



  getData(module: string, modfunction: string = "", modparam: string = "") {
    return this.get(module, modfunction, modparam);
  }

}
