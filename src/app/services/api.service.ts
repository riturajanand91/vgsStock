import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'https://www.optumflex.live';

  /** put whatever value you need here */
  private readonly xDomain = "https://vgstockresearch.com";   // e.g. "app.example.com"

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Domain': this.xDomain
    });
  }

  constructor(private http: HttpClient) {}

  getCompliance(): Observable<any> {
    const url = `${this.baseUrl}/fin/Get/Dealer/Escalation/Matrix/And/Scores`;
    return this.http.post<any>(url, {}, { headers: this.headers });
  }

  getPricing(): Observable<any> {
    const url = `${this.baseUrl}/fin/Get/Dealer/Escalation/Matrix/And/Scores`;
    return this.http.get<any>(url, { headers: this.headers });
  }
}
