// eslint-disable-next-line max-len
import { AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActionCtrlService } from '@modules/app-common/services/action-ctrl.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RecordsAdminService } from '../../services/records-admin.service';

@Component({
  selector: 'app-records-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin.component.html',
  styleUrls: ['admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy, AfterViewInit {
  public inputxt = '';

  public inGroup = 0;
  public allRecords: any[] = [];
  public records: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public groupInfo: any = {};

  private subscriptions: Subscription = new Subscription();

  constructor(
    public actionCtrl: ActionCtrlService,
    private changeDetectionRef: ChangeDetectorRef,
    private recordsAdmin: RecordsAdminService,
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.actionCtrl.navLoading = false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.records.complete();
  }

  resetGroup() {
    this.allRecords = [];
  }

  resetGrouping() {
    this.groupInfo = {
      performance: '',
      recordno: '',
      uspaclass: '',
      uspadate: '',
      location: '',
      holders: '',
      judges: '',
      notes: '',
      status: ''
    };
  }

  addToGroup(str: string) {
    // Zone
    if (!this.groupInfo.hasOwnProperty('zone')) {
      this.groupInfo.zone = str.trim();
      return;
    }

    // State
    if (!this.groupInfo.hasOwnProperty('state')) {
      if (str.trim().substr(0, 3) === '(G-') {
        this.groupInfo.state = '';
      } else {
        this.groupInfo.state = str.trim();
        return;
      }
    }

    // Performance
    if (!this.groupInfo.hasOwnProperty('subclass')) {
      this.groupInfo.subclass = str.trim();
      return;
    }

    // Category
    if (!this.groupInfo.hasOwnProperty('category')) {
      this.groupInfo.category = str.trim();
      return;
    }

    // Record
    if (!this.groupInfo.hasOwnProperty('record')) {
      this.groupInfo.record = str.trim();
      return;
    }

    if (str.substr(0, 12) === 'Performance:') {
      this.groupInfo.performance = str.substr(12).trim();
      return;
    }
    if (str.substr(0, 10) === 'Record No:') {
      this.groupInfo.recordno = str.substr(10).trim();
      return;
    }
    if (str.substr(0, 6) === 'Class:') {
      this.groupInfo.uspaclass = str.substr(6).trim();
      return;
    }
    if (str.substr(0, 5) === 'Date:') {
      this.groupInfo.uspadate = str.substr(5).trim();
      return;
    }
    if (str.substr(0, 9) === 'Location:') {
      this.groupInfo.location = str.substr(9).trim();
      return;
    }
    if (str.substr(0, 15) === 'Record Holders:') {
      this.groupInfo.holders = str.substr(15).trim();
      return;
    }
    if (str.substr(0, 10) === 'Judged by:') {
      this.groupInfo.judges = str.substr(10).trim();
      return;
    }
    if (str.substr(0, 6) === 'Notes:') {
      this.groupInfo.notes = str.substr(6).trim();
      return;
    }

    if (str === 'Current' || str === 'Eclipsed' || str === 'Retired') {
      this.groupInfo.status = str;
      return;
    }

    console.log(str);
  }



  finishGroup() {
    if (this.groupInfo.uspaclass && this.groupInfo.subclass) {
      this.groupInfo.subclass = this.groupInfo.uspaclass + ' ' + this.groupInfo.subclass.substr(this.groupInfo.uspaclass.length);
    }

    this.allRecords.push(Object.assign({}, this.groupInfo, { dirty: false, found: null, dirtynotes: [] }));
  }


  splitJudges(str: string) {
    const arr: any[] = [];

    return arr;
  }

  async processLineByLine() {
    this.resetGroup();
    this.resetGrouping();
    /*
    const fileStream = fs.createReadStream('USPA_Records-2.txt');
    const rl = readline.createInterface({
      input: fileStream,
      // output: process.stdout,
      console: false,
      crlfDelay: Infinity
    });
    */
    const rl = this.inputxt.split('\n');
    const cnt = 0;
    for await (const line of rl) {
      const strTrim = line.trim();
      if (strTrim === 'State' || strTrim === 'US National' || strTrim === 'USPA Open National') {
        if (this.inGroup === 1) {
          this.finishGroup();
        }
        this.resetGrouping();
        this.inGroup = 1;
      }

      if (strTrim === '') {
        continue;
      }
      this.addToGroup(strTrim);
    }
    if (this.inGroup === 1) {
      this.finishGroup();
    }

    // knex('record_uspa').insert(allRecords).then(res => { console.log('Res:', res); }).catch(err => { console.log('Err:', err); });
    this.records.next(this.allRecords);

    // Send data to api service for additional information
    this.recordsAdmin.checkRecordsList$(this.allRecords).subscribe((resp: any[]) => {

      if (!Array.isArray(resp)) {
        return;
      }
      const rLen = resp.length || 0;
      const aLen = this.allRecords.length || 0;
      for (let r = 0; r < rLen; r++) {
        for (let a = 0; a < aLen; a++) {
          // Compare
          const rObj = resp[r]; // Server Dataset
          const aObj = this.allRecords[a]; // Client Dataset
          if (rObj.recordno !== aObj.recordno) {
            continue;
          }
          aObj.found = true;

          const aObjKeys = Object.keys(aObj); // Client Data Keys
          const aObjKeyLen = aObjKeys.length || 0; // Client Data Keys Length
          for (let aO = 0; aO < aObjKeyLen; aO++) { // Loop keys and check for mismatches
            const key = aObjKeys[aO];
            if (!rObj.hasOwnProperty(key)) {
              continue;
            }
            if ((rObj[key] || '').trim() !== (aObj[key] || '').trim()) {
              aObj.dirty = true;
              if (!Array.isArray(aObj.dirtynotes)) {
                aObj.dirtynotes = [];
              }
              aObj.dirtynotes.push({ key, old: rObj[key], new: aObj[key] });
            }
          }
        }
      }
      this.changeDetectionRef.detectChanges();
    });

  }

  updateRecord(record: any) {
    record.saving = true;
    this.recordsAdmin.updateRecord(record).
      pipe(
        tap(() => {
          record.saving = false;
        })
      ).subscribe();
  }
}
