import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';

import { Subscription } from 'rxjs';
import { UserService } from '@modules/users-shared/services/user.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html'
})
export class ListUsersComponent implements OnInit, OnDestroy {
  loading = true;

  getAllUsers!: Subscription;
  userList: any[] = [];

  columnMode = ColumnMode;
  sortType = SortType;

  columns = [{prop: 'name'},{prop: 'username'},{prop: 'role'}];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getAllUsers = this.userService.getAll().subscribe((resp: any) => {
      this.userList = resp;
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.getAllUsers.unsubscribe();
  }

}
