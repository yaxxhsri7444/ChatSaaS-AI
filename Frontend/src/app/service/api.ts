import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = environment.apiBase;
  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.base}/auth/register`, data);
  }
  login(data: any) {
    return this.http.post(`${this.base}/auth/login`, data);
    console.log(data);
  }


  uploadDoc(formData: FormData) {
    return this.http.post(`${this.base}/docs/upload`, formData);
  }

  chatQuery(payload: any) {
    return this.http.post(`${this.base}/chat/query`, payload);
  }

  analytics(businessId: string) {
    return this.http.get(`${this.base}/analytics/${businessId}`);
  }
}
