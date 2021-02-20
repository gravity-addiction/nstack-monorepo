import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password-component',
  templateUrl: './forgot-password.component.html'
})

export class ForgotPasswordComponent implements OnInit {
  model: any = {};
  loading = false;


  constructor() { }

  ngOnInit() {
  }

  retrievePassword() {
    this.loading = true;

  }
}
