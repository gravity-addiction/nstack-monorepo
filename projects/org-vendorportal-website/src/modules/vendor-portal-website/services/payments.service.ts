import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';

import { PdfkitService } from '@modules/app-common/services/index';
import { ConfigService } from '@modules/app-config/config.service';

@Injectable({ providedIn: 'root' })
export class PaymentsService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private pdfkitService: PdfkitService,
  ) { }

  fetchInvoice(payid: string): Observable<any> {
    return this.http.get<any>(this.configService.config.apiPath + '/invoice/' + encodeURIComponent(payid));
  }

  runPayment(nonce: string, payid: string, amount: number): Observable<any> {
    if (!payid) { return of(null); }
    const params = { nonce, payid, amount };
    return this.http.post<any>(this.configService.config.apiPath + '/invoice/' + encodeURIComponent(payid) + '/pay', params);
  }
}


