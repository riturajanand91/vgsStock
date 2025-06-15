import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUrl = 'https://www.optumflex.live';

  constructor(private http: HttpClient) {}

  getCompliance(): Observable<any> {
    const url = `${this.baseUrl}/fin/Get/Dealer/Escalation/Matrix/And/Scores`;
    return this.http.post<any>(url, {});
  }
  getPricing(): Observable<any> {
    const url = `${this.baseUrl}/fin/Get/Dealer/Escalation/Matrix/And/Scores`;
    return this.http.get<any>(url);
  }
}
