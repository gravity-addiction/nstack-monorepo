import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class EventVideoTimesheetService {

  public markDelayCompensation = 0; // .175;
  public markList: any[] = [];
  public marks = new BehaviorSubject<Array<any>>(this.markList);
  public marks$ = this.marks.asObservable();
  public markSelected = -1;

  public isFreezing = true;

  public totalDuration = 0;

  public prestartTimeStart = -1;
  public prestartTimeEnd = -1;
  public prestartTimeStartPercent = 0;
  public prestartTimePercent = 0;

  public workingTimeStart = -1;
  public workingTimeEnd = -1;
  public workingTimeStartPercent = 0;
  public workingTimePercent = 0;

  public prePoints = 2;
  public videoSettings: any = {
    prestartTime: 0,
  };

  constructor() { }

  getSaveObject() {
    return {
      prestartTime: {
        start: this.prestartTimeStart,
        end: this.prestartTimeEnd,
      },
      workingTime: {
        start: this.workingTimeStart,
        end: this.workingTimeEnd,
      },
      marks: this.markList,
    };
  }

  newMark(mTime: number, mClass: string, other: any = {}) {
    let otherObj = {};
    try {
      otherObj = Object.assign({}, other);
    } catch (e) { }
    const base: any = Object.assign(otherObj, {
      class: mClass,
      time: mTime,
    });

    // Required
    if (!base.hasOwnProperty('reason')) {
 base.reason = '';
}
    return base;
  }

  insertMark(mTime: number, mClass: string) {
    // Find marks with prior timestamp
    const mLen = this.markList.length;
    let foundMark = -1; // found mark with prior time
    let markReplace = 0; // 0 no replacement, 1 for replacement, replaces # marks in array
    for (let mL = 0; mL < mLen; mL++) {
      const mLTime = (this.markList[mL] || {}).time || -1;
      if (mLTime === mTime && mTime !== this.workingTimeEnd) {
        foundMark = mL;
        markReplace = 1;
        break;

      } else if (mLTime >= 0 && mLTime > mTime) {
        foundMark = mL;
        break;
      }
    }

    if (foundMark < 0) {
      this.markList.push(this.newMark(mTime, mClass));
    } else {
      this.markList.splice(foundMark, markReplace, this.newMark(mTime, mClass));
    }
    this.marks.next(this.markList);

  }

  addMark(mTime: number, mClass: string) {
    // Edit Marked Point
    if (this.markSelected > -1) {
      this.editMarkClass(this.markSelected, mClass);
      this.markSelected = -1;
      return;
    }

    // First point past end of prestartTime
    // if (this.prestartTimeStart > -1 && this.workingTimeStart === -1 && mTime >= this.prestartTimeEnd) {
    //   this.insertMark(this.prestartTimeEnd, 'bust');
    //   this.updateWorkingTime();
    // }

    //// No multiple points on last point
    // if (this.markList.length && (this.markList[this.markList.length - 1] || {}).time === mTime) {
    //   return;
    // }

    //// Not Before Working Time
    // if (this.prestartTimeStart > -1 && mTime < this.prestartTimeStart) { return;
    // } else if (this.workingTimeStart > -1 && mTime < this.workingTimeStart) { return; }

    // Not After End of Working Time
    if (this.workingTimeEnd > -1 && mTime > (this.workingTimeEnd + .02)) {
      // console.log('Not After Working Time');
      return;
    }

    // blank for Toss Out Count + First Point (exit)
    if (this.markList.length < this.videoSettings.tossStartCount + 1) {
      mClass = 'blank';
    }

    // Insert mark
    this.insertMark(mTime, mClass);
    this.updateWorkingTime();
  }

  editMarkClass(i: number, newClass: string) {
    if (this.markList.length > i) {
      this.markList[i].class = newClass;
      this.marks.next(this.markList);
    }
  }

  editMarkReason(i: number, reason: string) {
    if (this.markList.length > i) {
      this.markList[i].reason = reason;
      this.marks.next(this.markList);
    }
  }

  editMarkExplaination(i: number, reason: string) {
    if (this.markList.length > i) {
      this.markList[i].explain = reason;
      this.marks.next(this.markList);
    }
  }

  removeMark(i: number) {
    if (this.markList.length > i) {
      this.markList.splice(i, 1);
      this.updateWorkingTime();
      this.marks.next(this.markList);
    }
  }

  clearMarks() {
    this.markList = [];
    this.marks.next(this.markList);
  }

  clearWorkingTime() {
    this.prestartTimeStart = -1;
    this.prestartTimeEnd = -1;
    this.prestartTimeStartPercent = 0;
    this.prestartTimePercent = 0;

    this.workingTimeStart = -1;
    this.workingTimeEnd = -1;
    this.workingTimeStartPercent = 0;
    this.workingTimePercent = 0;
/*
    if (this.markList.length < ((this.videoSettings.prestartTime) ? 3 : 2)) {
      this.markList = [];
    } else if (this.videoSettings.prestartTime && this.markList.length > 1) {
      this.markList[0] = {class: '', time: -1};
      this.markList[1] = {class: '', time: -1};
    } else if (this.markList.length > 0) {
      this.markList[0] = {class: '', time: -1};
    }
*/
  }

  prestartSet(mTime: number) {
    this.prestartTimeStart = mTime;
    if (mTime === -1) {
      this.prestartTimeEnd = -1;
    } else {
      this.prestartTimeEnd = (this.prestartTimeStart + this.videoSettings.prestartTime);
    }
  }
  workingtimeSet(mTime: number) {
    this.workingTimeStart = mTime;
    if (mTime === -1) {
      this.workingTimeEnd = -1;
    } else {
      this.workingTimeEnd = (this.workingTimeStart + this.videoSettings.workingTime);
    }
  }

  updateWorkingTime() {
    // Set Working time as first point
    this.workingtimeSet((this.markList[0] || {}).time || -1);

    // Prestart Time
    if (this.videoSettings.prestartTime > 0) {
      // set prestart time from first point
      this.prestartSet((this.markList[0] || {}).time || -1);

      // Check for a working time
      const nextTime = (this.markList[1] || {}).time || -1;
      // Has Point after latest start of working time
      if (nextTime > this.prestartTimeEnd && this.workingTimeStart !== this.prestartTimeEnd) {
        this.workingtimeSet(this.prestartTimeEnd);

      // Has Point within prestart time
      } else if (nextTime > -1) {
        this.workingtimeSet(nextTime);

      // Has No Second point, Set workingtimeEnd for freeze frame
      } else {
        this.workingtimeSet(this.prestartTimeEnd);
        this.workingTimeStart = -1;
      }
    }

    this.updateWorkingPercentages();
  }


  updateWorkingPercentages() {
    // Update Working timebar percentages
    if (this.workingTimeStart > -1) {
      this.workingTimeStartPercent = (this.workingTimeStart / this.totalDuration) * 100;
      if (this.workingTimeEnd > this.totalDuration) {
        this.workingTimeEnd = -1; // this.totalDuration;
        this.workingTimePercent = ((this.totalDuration - this.workingTimeStart) / this.totalDuration) * 100;
      } else {
        this.workingTimePercent = (this.videoSettings.workingTime / this.totalDuration) * 100;
      }
    } else {
      this.workingTimeStartPercent = 0;
      this.workingTimePercent = 0;
    }

    // Update Prestart time percentages
    if (this.prestartTimeStart > -1) {
      this.prestartTimeStartPercent = (this.prestartTimeStart / this.totalDuration) * 100;
      this.prestartTimePercent = (this.videoSettings.prestartTime / this.totalDuration) * 100;
      if ((this.prestartTimeStart + this.videoSettings.prestartTime) > this.totalDuration) {
        this.prestartTimePercent = ((this.totalDuration - this.prestartTimeStart) / this.totalDuration) * 100;
      }
    } else {
      this.prestartTimeStartPercent = 0;
      this.prestartTimePercent = 0;
    }
  }
}
