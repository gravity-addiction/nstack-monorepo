import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
  @Input() showSpinner = true;
  @Input() textSpinner = '';

  constructor(
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    if (this.showSpinner) {
      this.spinner.show();
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
  ],
  declarations: [
    SpinnerComponent,
  ],
  exports: [
    SpinnerComponent,
  ],
})
export class SpinnerComponentModule { }
