import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from '@modules/events/services/registration.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events-form-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form.component.html',
  styleUrls: ['form.component.scss'],
})
export class EventsFormComponent implements OnInit, OnDestroy {
  @ViewChild('teamNameElem', { static: true }) teamNameElem: any;
  @Input() eventSlug!: string;
  @Input() event!: any;
  @Input() regCode!: string;

  // @ViewChild('reCaptcha', { static: true }) reCaptcha;
  @Output() isRegistering = new EventEmitter<boolean>();
  @Output() isRegistered = new EventEmitter<any>();
  @Output() changedHeight = new EventEmitter<boolean>();

  subscriptions: Subscription = new Subscription();
  form: any = {
    contact: '',
    remote: '',
    dropzone: '',
    people: 5,
    total: 0,
    perPerson: '',
    cf2waySeqProAm: '',
    cf2waySeqOpen: '',
    cf4waySeqOpen: '',
    cf4wayRotsOpen: '',
    cf8waySpeed: '',
  };

  eventsInfo: any = {
    perPerson: {
      shown: true,
      entries: [],
      costPer: 65,
      costTotal: 0,
    }, /*,
    cf2waySeqProAm: {
      shown: true,
      entries: [],
      costPer: 45,
      costTotal: 0,
    },
    cf2waySeqOpen: {
      shown: true,
      entries: [],
      costPer: 45,
      costTotal: 0,
    },
    cf4waySeqOpen: {
      shown: true,
      entries: [],
      costPer: 45,
      costTotal: 0,
    },
    cf4wayRotsOpen: {
      shown: true,
      entries: [],
      costPer: 45,
      costTotal: 0,
    },
    cf8waySpeed: {
      shown: true,
      entries: [],
      costPer: 45,
      costTotal: 0,
    },*/
  };

  routeParams$!: Subscription;
  saveUser$!: Subscription;

  // gotCaptcha = true;
  sending = false;
  sendAttempt = false;

  saving = false;
  serviceUnavailable = false;
  submitRegistration$: any;

  constructor(
    private service: RegistrationService,
    private router: Router
  ) {
    // window['registrationRef'] = { component: this, zone: _ngZone };
    // window['recaptchaResolved'] = this.recaptchaResolved.bind(this);
    // window['recaptchaExpired'] = this.recaptchaExpired.bind(this);

    // _platform.onPopState(() => { location.reload(); });

  }
  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    // window['registrationRef'] = null;
    // window['recaptchaResolved'] = null;
    // window['recaptchaExpired'] = null;
  }
  /*
    recaptchaOnload() {
      const params = {
        // 'sitekey': '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
        sitekey: '6LfS7xMUAAAAAGw1-DWeiqeVPAp6S0MAgrwLZo5r',
        callback: this.recaptchaResolved,
        'expired-callback': this.recaptchaExpired,
      };
      grecaptcha.render('g-recaptcha', params);
    }

    recaptchaResolved(evt) {
      const t = window['registrationRef'].component;
      t.form.recaptcha = evt;
      t.gotCaptcha = true;
      t.change.detectChanges();
    }

    recaptchaExpired() {
      const t = window['registrationRef'].component;
      t.form.recaptcha = '';
      t.gotCaptcha = false;
      t.change.detectChanges();
    }
  */


  toggleEvent(eventDisc: string) {
    if (this.eventsInfo.hasOwnProperty(eventDisc)) {
      if (this.eventsInfo[eventDisc].shown) {
        this.eventsInfo[eventDisc].shown = false;
      } else {
        this.eventsInfo[eventDisc].shown = true;
      }
    }
    setTimeout(() => {
      this.changedHeight.emit(true);
    }, 100);
  }

  calcTotals() {
    let nTotal = 0;
    const eIKeys = Object.keys(this.eventsInfo);
    const eILen = eIKeys.length;
    for (let eI = 0; eI < eILen; eI++) {
      const comp = this.eventsInfo[eIKeys[eI]];
      comp.costTotal = ((comp.entries || []).length || 0) * (comp.costPer || 0);
      nTotal += comp.costTotal;
    }

    this.form.total = nTotal;
  }

  addEntry(eventDisc: string, teamname: string) {
    if (teamname === '' || teamname === undefined || teamname === null) {
      return;
    }
    if (this.eventsInfo.hasOwnProperty(eventDisc)) {
      this.eventsInfo[eventDisc].entries.push(teamname);
      this.form[eventDisc] = '';
    }
    this.calcTotals();
    setTimeout(() => {
      this.changedHeight.emit(true);
    }, 100);
  }

  addPerson(name: string, email: string) {
    if (name === '' || name === undefined || name === null) {
      return;
    }
    if (this.eventsInfo.hasOwnProperty('perPerson')) {
      this.eventsInfo.perPerson.entries.push({ name, email });
      this.form.perPerson = '';
      this.form.perPersonEmail = '';
    }
    this.calcTotals();
    setTimeout(() => {
      this.changedHeight.emit(true);
    }, 100);
  }

  promptRemoveEntry(eventDisc: string, eventI: number) {
    if (
      this.eventsInfo.hasOwnProperty(eventDisc) &&
      confirm('Remove ' + this.eventsInfo[eventDisc].entries[eventI].name + ' From Registration?')
    ) {
      this.eventsInfo[eventDisc].entries.splice(eventI, 1);
      this.calcTotals();
    }
  }

  submitRegistration(clickEvent: any) {
    // if (!this.gotCaptcha) { return; }
    // this.gotCaptcha = false;
    this.sendAttempt = true;

    // Check Remote to Local
    if (this.form.remote === '') {
      setTimeout(() => {
        this.changedHeight.emit(true);
      }, 100);
      return;
    }

    if (this.form.remote === 'Remote' && this.form.dropzone === '') {
      setTimeout(() => {
        this.changedHeight.emit(true);
      }, 100);
      return;
    }

    // Left one in the form
    if (this.form.perPerson !== '' && !this.eventsInfo.perPerson.entries.length) {
      this.addPerson(this.form.perPerson, this.form.perPersonEmail);
    } else if (this.form.perPerson !== '' && confirm('Is ' + this.form.perPerson + ' included in your registration?')) {
      this.addPerson(this.form.perPerson, this.form.perPersonEmail);
    }

    if (!this.eventsInfo.perPerson.entries.length) {
      setTimeout(() => {
        this.changedHeight.emit(true);
      }, 100);
      return;
    }

    this.sending = true;

    this.calcTotals();
    const postInfo = Object.assign({}, this.eventsInfo);
    postInfo.onsite = (this.form.remote === 'OnSite') ? true : false;
    if (!postInfo.onsite) {
      postInfo.dropzone = this.form.dropzone;
    }
    this.isRegistering.emit(true);
    setTimeout(() => {
      this.changedHeight.emit(true);
    }, 100);

    this.service.addRegistration(this.eventSlug, postInfo).subscribe((result: any) => {
      const data = result[0] || null;
      if (!data) {
        throw new Error('no response from server');
      }

      this.isRegistered.emit(result);
      setTimeout(() => {
        this.changedHeight.emit(true);
      }, 100);
      // this.router.navigate(['/e', this.eventSlug, data.short_id]);
    }, (err: any) => {
      // this.gotCaptcha = false;
      this.sending = false;
      // grecaptcha.reset();
      if (!err.status) {
        alert('Sorry, The server is currently not accepting entries.\n\nPlease double check this event is still active and try again.');
      } else if (err.message) {
        alert(`Sorry, There was a server error submitting your entry.\n\n${err.message}`);
      } else {
        alert('Sorry, The server responded with an unknown error.\n\nPlease double check this event is still active and try again later.');
      }
      setTimeout(() => {
        this.changedHeight.emit(true);
      }, 100);
    });
  }
}
