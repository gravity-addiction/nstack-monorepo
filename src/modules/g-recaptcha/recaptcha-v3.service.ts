import { Injectable } from '@angular/core';

declare const grecaptcha: any;

@Injectable()
export class RecaptchaV3Service {
  constructor() { }

  execute(action: string): void {
    grecaptcha.execute('6LdmwMMZAAAAACHo313MiP4FClZRFhO60yIpwdtc', { action });
  }

  executeReturn(action: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      grecaptcha.ready(function() {
        grecaptcha.execute('6LdmwMMZAAAAACHo313MiP4FClZRFhO60yIpwdtc', { action }).
          then(token => {
            resolve(token);
          });
      });
    });
  }
}
