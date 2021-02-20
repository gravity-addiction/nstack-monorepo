import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@modules/users-shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-user',
  templateUrl: './show-user.component.html'
})
export class ShowUserComponent implements OnInit, OnDestroy {
  loading = true;
  saving = false;

  getUser!: Subscription;
  saveUser!: Subscription;
  routeParams!: Subscription;
  user: any;

  constructor(private location: Location,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeParams = this.route.params.subscribe(params => {
      const id = params['id'] || 0;
      this.getUser = this.userService.getById(id).subscribe((resp: any) => {
        this.user = resp;
        this.loading = false;
      }, err => {
        this.loading = false;
      });
    });

  }

  ngOnDestroy() {
    try {
      this.getUser.unsubscribe();
    } catch (err) { }
    try {
      this.routeParams.unsubscribe();
    } catch (err) { }
  }

  updateUserInfo() {
    this.saving = true;
    this.saveUser = this.userService.update(this.user).subscribe((resp: any) => {
      this.saving = false;
      this.user = resp;
      this.router.navigate(['../'], { relativeTo: this.route });
    }, err => {
      this.saving = false;
    });
  }

  goBack() {
    this.location.back();
  }

}
