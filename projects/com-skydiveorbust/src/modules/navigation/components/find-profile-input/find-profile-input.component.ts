import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProfileService } from '@modules/profiles/services/index';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-find-profile-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './find-profile-input.component.html',
  styleUrls: ['find-profile-input.component.scss'],
})
export class FindProfileInputComponent implements OnInit, OnDestroy {
  queryField: FormControl = new FormControl();

  constructor(public profileService: ProfileService) {}
  ngOnInit() {
    this.profileService.profileSearch$ = this.queryField.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(q => this.profileService.searchProfile$(q))
    );
  }

  ngOnDestroy() {

  }
}
