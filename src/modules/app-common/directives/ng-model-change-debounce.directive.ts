import { Directive, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';

@Directive({
  selector: '[ngModelChangeDebounced]',
})
export class NgModelChangeDebouncedDirective implements OnDestroy {
  @Output()
  ngModelChangeDebounced = new EventEmitter<any>();
  @Input()
  ngModelChangeDebounceTime = 500; // optional, 500 default

  private subscriptions: Subscription = new Subscription();

  constructor(private ngModel: NgModel) {
    this.subscriptions.add(
      this.ngModel.control.valueChanges.pipe(
        skip(1), // skip initial value
        distinctUntilChanged(),
        debounceTime(this.ngModelChangeDebounceTime)
      ).subscribe((value) => this.ngModelChangeDebounced.emit(value))
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
