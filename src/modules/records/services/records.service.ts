import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/config.service';
import { recordsUSPASubclassList } from '@classes/records';
import { stateAbbrList } from '@classes/state-abbr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResultsRecordGrouped, ResultsRecordUSPA } from '@typings/records';

@Injectable({
  providedIn: 'root',
})
export class RecordsService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  compareRecordSubclass(a: ResultsRecordGrouped, b: ResultsRecordGrouped) {
    // Use toUpperCase() to ignore character casing
    const bandA = (a.subclass || '').toUpperCase();
    const bandB = (b.subclass || '').toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  groupRecords(records: ResultsRecordUSPA[]): Array<ResultsRecordGrouped> {
    const ret: Array<ResultsRecordGrouped> = [];

    const rLen = records.length;

    if (rLen === 0) {
      return [{
        subclass: 'No Records To Display',
        records: [],
      }];
    }

    // Loop all raw records
    for (let r = 0; r < rLen; r++) {
      let rSubclass = records[r].subclass;
      const rSC = recordsUSPASubclassList.find(
        s => s.uspaSubclass === records[r].subclass
      );

      if (rSC) {
        rSubclass = rSC.abbr;
      }

      // Find Subclass matching
      const rSI = ret.findIndex(rec => rec.subclass === rSubclass);
      // Has Subclass Match
      if (rSI > -1) {
        // Find Record Match Within Subclass Group
        const rI = ret[rSI].records.findIndex(rec => rec.record === records[r].record);
        // Has Match
        if (rI > -1) {
          ret[rSI].records[rI].records.push(records[r]);
          // No Record Match, Create Subclass Group
        } else {
          ret[rSI].records.push({
            record: records[r].record || '',
            records: [records[r]],
          });
        }
        // No Subclass Match, Create Entire Group Record
      } else {
        ret.push({
          subclass: rSubclass,
          records: [{
            record: records[r].record || '',
            records: [records[r]],
          }],
        });
      }
    }
    return ret.sort(this.compareRecordSubclass);
  }

  getRecords$(): Observable<ResultsRecordUSPA[]> {
    return this.http.get<ResultsRecordUSPA[]>(
      this.configService.config.apiPath + '/records/state/national'
    ).pipe(
      map(records =>
        (records as ResultsRecordUSPA[]).map(record => record)
      )
    );
  }

  getRecordsByState$(abbr: string): Observable<ResultsRecordUSPA[]> {
    let fullState = 'national';
    const sLen = stateAbbrList.length;
    for (let i = 0; i < sLen; i++) {
      if (stateAbbrList[i].abbr.toLocaleLowerCase() === abbr.toLocaleLowerCase()) {
        fullState = stateAbbrList[i].name;
      }
    }

    return this.http.get<ResultsRecordUSPA[]>(
      this.configService.config.apiPath + '/records/state/' + encodeURIComponent(fullState)
    ).pipe(
      map(records =>
        (records as ResultsRecordUSPA[]).map(record => record)
      )
    );
  }

  getRecordsByPerson$(profileId: string): Observable<ResultsRecordUSPA[]> {
    return this.http.get<ResultsRecordUSPA[]>(
      this.configService.config.apiPath + '/records/person/' + encodeURIComponent(profileId)
    ).pipe(
      map(records =>
        (records as ResultsRecordUSPA[]).map(record => record)
      )
    );
  }
}
