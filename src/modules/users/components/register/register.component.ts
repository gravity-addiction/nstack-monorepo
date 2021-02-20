import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '@modules/users-shared/services/user.service';

@Component({
  selector: 'app-register-component',
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnDestroy {
  model: any = {};
  loading = false;
  createSubscription!: Subscription;

  constructor(
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnDestroy() {
    try {
      this.createSubscription.unsubscribe();
    } catch (err) { }
  }

  register() {
    this.loading = true;
    this.createSubscription = this.userService.create(this.model)
      .subscribe(
        data => {
          this.router.navigate(['/registered']);
        },
        error => {
          this.loading = false;
        }
      );
  }
}
