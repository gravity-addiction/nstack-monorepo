import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-month-year-select',
  templateUrl: './month-year-select.component.html'
})
export class MonthYearSelectComponent implements OnInit {
  @Input() qMonth!: number;
  @Input() qYear!: number;
  @Input() noGo = false;
  @Output() go = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() changed = new EventEmitter();

  startYear = 2018;
  yearRange = [];
  monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(
  ) {
    const endYear = new Date().getFullYear();
    for (let y = this.startYear; y <= endYear; y++) {
      this.yearRange.push(y);
    }
  }

  ngOnInit() {

  }

  clickGo() {
    const params = { month: this.qMonth, year: this.qYear };
    this.go.emit(params);
  }

  clickCancel() {
    this.cancel.emit();
  }
  valueChanged() {
    const params = { month: this.qMonth, year: this.qYear };
    this.changed.emit(params);
  }
}
