import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroment/enviroment';

@Injectable({ providedIn: 'root' })
export class HttpService {
  private base = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}
  get<T>(url: string, options?: any) {
    return this.http.get<T>(this.base + url, options);
  }
  post<T>(url: string, body: any, options?: any) {
    return this.http.post<T>(this.base + url, body, options);
  }
  patch<T>(url: string, body: any, options?: any) {
    return this.http.patch<T>(this.base + url, body, options);
  }
  delete<T>(url: string, options?: any) {
    return this.http.delete<T>(this.base + url, options);
  }
}
