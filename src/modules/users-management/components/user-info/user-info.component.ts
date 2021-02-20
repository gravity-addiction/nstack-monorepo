import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html'
})
export class UserInfoComponent implements OnInit {
  @Input() userInfo: any;
  @Input() usernameInvalid = false;
  @Output() userEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  updateUser() {
    this.userEvent.emit(this.userInfo);
  }
}
