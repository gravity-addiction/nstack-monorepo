import { Injectable } from '@angular/core';
import { HelperScripts, HelperScriptsMap, IHelperScriptsData } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  public scripts: HelperScriptsMap<IHelperScriptsData> = {
    alasql: {
      loaded: false,
      script: '', // 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.12.12/xlsx.core.min.js'
    },
    pdfkit: {
      loaded: false,
      script: 'assets/library/pdfkit.js',
    },
    blobstream: {
      loaded: false,
      script: 'assets/library/blob-stream-v0.1.2.js',
    },
    svgtopdf: {
      loaded: false,
      script: 'assets/library/svgtopdf.js',
    },
    pdfjs: {
      loaded: false,
      script: 'assets/library/pdfjs/pdf.js',
    },
    hlsjs: {
      loaded: false,
      script: 'assets/library/hls.js',
    },
    shortid: {
      loaded: false,
      script: 'assets/library/shortid.js',
    },
    powerrange: {
      loaded: false,
      script: 'assets/library/powerrange.js',
    },
    recaptcha: {
      loaded: false,
      script: 'https://www.google.com/recaptcha/api.js?onload=onloadCallback&',
    },
    facebook: {
      loaded: false,
      script: 'https://connect.facebook.net/us_EN/sdk.js',
    },
    google: {
      loaded: false,
      script: 'https://apis.google.com/js/platform.js?onload=googleScriptCallback',
      defer: true,
      async: true,
    },
    mediainfo: {
      loaded: false,
      script: 'assets/mediainfo.js/mediainfo.js',
    },
    squareup: {
      loaded: false,
      script: 'https://js.squareup.com/v2/paymentform',
    },
    highlight: {
      loaded: false,
      script: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.14.2/highlight.min.js',
    },
  };


  public defaultChoices = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '1', '2', '4', '5', '6', '7', '8', '9', '0',
  ];

  public defaultExtChoices = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '1', '2', '4', '5', '6', '7', '8', '9', '0', '-', '.', '_',
    '~',
  ];

  public defaultLowerAlphaNumeric = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '4', '5', '6', '7',
    '8', '9', '0',
  ];

  public defaultUpperAlphaNumeric = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '4', '5', '6', '7',
    '8', '9', '0',
  ];

  public defaultNumeric = [
    '1', '2', '4', '5', '6', '7', '8', '9', '0',
  ];

  public defaultNumericExt = [
    '1', '2', '4', '5', '6', '7', '8', '9', '0', '-', '.', '_', '~',
  ];

  constructor() { }

  public loadExternalScript(scriptUrl: string, async = false, defer = false): Promise<any> {
    return new Promise((resolve) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      scriptElement.onload = resolve;
      if (async) {
 scriptElement.async = true;
} else if (defer) {
 scriptElement.defer = true;
}

      document.body.appendChild(scriptElement);
    });
  }

  public isElementInView(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  public onVisibilityChange(el: HTMLElement, callback: () => void) {
    let oldVisible: boolean;
    return () => {
      const visible = this.isElementInView(el);
      if (visible !== oldVisible) {
        oldVisible = visible;
        if (typeof callback === 'function') {
 callback();
}
      }
    };
  }

  public checkScript(script: HelperScripts): boolean {
    if (this.scripts.hasOwnProperty(script) && this.scripts[script].loaded) {
 return true;
} else {
 return false;
}
  }

  public loadScript(script: HelperScripts, queryArgs = ''): Promise<any> {
    if (!this.scripts.hasOwnProperty(script)) {
 return Promise.reject('No script named ' + script + ' in helper.service');
}

    if (this.checkScript(script)) {
 return Promise.resolve(true);
}

    const scriptUrl = (this as any).scripts[script].script + (queryArgs ? queryArgs : '');

    return this.loadExternalScript(scriptUrl).then((_scriptTar) => {
      // console.log('ScriptLoaded', scriptTar);
        (this as any).scripts[script].loaded = true;
      return Promise.resolve(true);
    });
  }


  fisherYatesShuffle(a: string[]) {
    let j; let x; let i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
  }

  generateRandomString(len: number, choices: string[] = this.defaultChoices) {
    let ret = '';
    for (let i = 0; i < len; i++) {
      const fullSet = [...choices];
      this.fisherYatesShuffle(fullSet);
      ret = ret + fullSet.pop();
    }
    return ret;
  }


}
