import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ConfigService } from '@modules/app-config/config.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  runningLogin = false;
  auth2: any;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  addRegistration(id: string, info: any): Observable<any> {
    return this.http.post<any>(this.configService.config.apiPath + '/events/' + encodeURIComponent(id) + '/registration', info);
  }

  getRegistration(id: string): Observable<any> {
    return this.http.get<any>(this.configService.config.apiPath + '/events/' + encodeURIComponent(id) + '/registration.json');
  }

  getRegistrationCount(id: string): Observable<any> {
    return this.http.get<any>(this.configService.config.apiPath + '/events/' + encodeURIComponent(id) + '/registration/counts.json');
  }

  runPayment(id: string, nonce: string, shortid: string, amount: string): Observable<any> {
    return this.http.post<any>(
        this.configService.config.apiPath + '/events/' + encodeURIComponent(id) + '/registration/payment.json',
        { nonce, shortid, amount }
      );
  }
}
