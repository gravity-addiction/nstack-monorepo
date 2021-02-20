import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/config.service';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResultsRecordUSPA } from '@typings/records';

@Injectable({
  providedIn: 'root',
})
export class RecordsAdminService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  checkRecordsList$(records: any[]) {
    return this.http.get<ResultsRecordUSPA[]>(
      this.configService.config.apiPath + '/records/recordno?' +
      records.map((r: any) => 'rno=' + encodeURIComponent(r.recordno)).join('&')
    ).pipe(
      map(respRecords =>
        (respRecords as ResultsRecordUSPA[]).map(record => record)
      )
    );
  }

  updateRecord(record: any) {
    if (!record.recordno) {
      return of({});
    }

    const recordUpdate: any = {};
    record.dirtynotes.forEach((k: any) => {
      recordUpdate[k.key] = k.new;
    });

    return this.http.put<any>(
      this.configService.config.apiPath + '/records/admin/' + encodeURIComponent(record.recordno.toString()),
      recordUpdate
    );
  }
}
