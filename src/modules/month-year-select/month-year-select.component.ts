import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-month-year-select',
  templateUrl: './month-year-select.component.html'
})
export class MonthYearSelectComponent implements OnInit {
  @Input() qMonth: number;
  @Input() qYear: number;
  @Input() noGo: boolean;
  @Output() go = new EventEmitter();
  @Output() changed = new EventEmitter();

  startYear = 2019;
  yearRange = [];

  constructor() {
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
    // this.router.navigate([], { relativeTo: this.route, queryParams: params });
  }

  valueChanged() {
    const params = { month: this.qMonth, year: this.qYear };
    this.changed.emit(params);
  }
}
