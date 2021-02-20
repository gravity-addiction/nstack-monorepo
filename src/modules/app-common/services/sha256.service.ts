import { Injectable } from '@angular/core';

declare const window: any;

@Injectable({
  providedIn: 'root',
})
export class Sha256Service {

  constructor() { }

  bytesToHexString(bytes: any) {
    if (!bytes) {
      return null;
    }
    bytes = new Uint8Array(bytes);
    const hexBytes = [];
    for (let i = 0; i < bytes.length; ++i) {
      let byteString = bytes[i].toString(16);
      if (byteString.length < 2) {
        byteString = '0' + byteString;
      }
      hexBytes.push(byteString);
    }
    return hexBytes.join('');
  }

  getHash(f: File): Promise<any> {
    if (!window.crypto || !window.crypto.subtle || !window.crypto.subtle.digest) {
      return Promise.resolve({});
    }
    return new Promise(res => {
      const reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = ((theFile: any) => async (e: any) => {
        const hashType = 'SHA-256';
        const hash = await window.crypto.subtle.digest({ name: hashType }, e.target.result);

        const fileInformations: any = {
          name: theFile.name,
          lastModified: theFile.lastModified,
          lastModifiedDate: theFile.lastModifiedDate,
          size: theFile.size,
          fileType: theFile.type,
          hashType,
          hashValue: this.bytesToHexString(hash),
        };
        res(fileInformations);
      })(f);

      // Read in the image file as a data URL.
      reader.readAsArrayBuffer(f);
    });
  }
}
