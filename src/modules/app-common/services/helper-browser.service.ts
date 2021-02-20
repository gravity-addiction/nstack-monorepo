import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class HelperBrowserService {
  constructor(
    private http: HttpClient
  ) { }

  registerFont(doc: any, name: string, url: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get(url, { responseType: 'arraybuffer'}).subscribe(buf => {
        doc.registerFont(name, buf);
        resolve(true);
      }, err => {
        reject(err);
      });
    });
  }

  bookmarkSite(title: string, url: string) {
    if (!url || url == null) {
      url = window.location.href;
    }
    if (window.sidebar && window.sidebar.addPanel) {
      // Firefox <=22
      window.sidebar.addPanel(title, url, '');
    } else if (window.external && ('AddFavorite' in window.external)) {
      // IE Favorites
      window.external.AddFavorite(url, title);
    } else {
      // Other browsers (mainly WebKit & Blink - Safari, Chrome, Opera 15+)
      alert('Press ' + (/Mac/i.test(navigator.platform) ? 'Cmd' : 'Ctrl') + '+D to bookmark this page.');
    }
  }


  canvasToFile(canvas: HTMLCanvasElement, fileName: string): Promise<File> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((fBlob: Blob | null) => {
        if (fBlob === null) {
          reject('Unable to make blob');
        } else {
          resolve(this.blobToFile(fBlob, fileName));
        }
      }, 'image/png');
    });
  }

  blobToFile(theBlob: Blob, fileName: string): File {
    const b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return theBlob as File;
  }
}
