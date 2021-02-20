import { Injectable, NgZone } from '@angular/core';

declare const grecaptcha: any;

@Injectable()
export class RecaptchaV2Service {
  timeout: any;
  loaded = false;
  recaptcha: any = {};

  constructor(
    private zone: NgZone
  ) { }

  hasid(_id: string): boolean {
    if (this.recaptcha.hasOwnProperty(_id)) {
      return true;
    } else {
      return false;
    }
  }

  deleteid(_id: string): void {
    delete this.recaptcha[_id];
  }

  init(_id: string, _cb: any): string {
    this.loaded = true;
    if (!grecaptcha || this.hasid(_id)) {
      return;
    }
    const captcha = grecaptcha.render('login-form', {
      sitekey: '6Le-XFcUAAAAAPDY8vc6LaVP4l01Dt_T1Q3R7j-I',
      callback: _cb,
      size: 'invisible'
    });
    this.recaptcha[_id] = captcha;
    return captcha;
  }

  reset(_id: string): void {
    // this.zone.run(() => {
    if (this.recaptcha.hasOwnProperty(_id)) {
      // console.log('Reseting', _id);
      grecaptcha.reset();
      // delete this.recaptcha[_id]; // = captcha;
    }
    // });
  }

  execute(_id: string): boolean {
    if (this.recaptcha.hasOwnProperty(_id)) {
      return grecaptcha.execute(this.recaptcha[_id]);
    } else {
      return false;
    }
  }

  resp(_id: string): any {
    if (this.recaptcha.hasOwnProperty(_id)) {
      const resp = grecaptcha.getResponse(this.recaptcha[_id]);
      return resp;
    }
    return null;
  }
}


