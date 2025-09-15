import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = environment.apiBase;
  constructor(private http: HttpClient) {}

  // auth
  register(data: any) { return this.http.post(`${this.base}/auth/register`, data); }
  login(data: any)    { return this.http.post(`${this.base}/auth/login`, data); }

  // docs
  uploadDoc(formData: FormData) {
    return this.http.post(`${this.base}/docs/upload`, formData);
  }

  // chat
  chatQuery(payload: any) {
    return this.http.post(`${this.base}/chat/query`, payload);
  }

  // analytics
  analytics() { return this.http.get(`${this.base}/analytics`); }
}
