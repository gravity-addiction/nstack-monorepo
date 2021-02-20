import { Injectable } from '@angular/core';
// import { HelperBrowserService } from './helper-browser.service';
import { HelperService } from './helper-scripts.service';

declare const blobStream: any;
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const PDFDocument: any;
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const SVGtoPDF: any;

@Injectable()
export class PdfkitService {
  constructor(
    // private helperBrowserService: HelperBrowserService,
    private helperService: HelperService
  ) {
    /* Singleton
    // For use without root level helper service
    this.addPdfKit();
    this.addBlobStream();
    this.addSvgToPdf();
    */
  }
/* Singleton
  addPdfKit() {
    const script = document.createElement('script');
    script.src = 'assets/library/pdfkit.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
  addBlobStream() {
    const script = document.createElement('script');
    script.src = 'assets/library/blob-stream-v0.1.2.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
  addSvgToPdf() {
    const script = document.createElement('script');
    script.src = 'assets/library/svgtopdf.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
  */
  loadPDF(): Promise<boolean> {
    return this.helperService.loadScript('pdfkit').
            then(() => this.helperService.loadScript('blobstream')).
            then(() => this.helperService.loadScript('svgtopdf'));
  }

  addPage(doc: typeof PDFDocument) {
    doc.addPage({
      margins: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      },
      layout: 'portrait',
      size: [612, 792]
    });
  }

  makePDF(pdfOptions: any) {
    if (pdfOptions) {
 pdfOptions = { size: 'Letter', margin: 0 };
}

    // const logo = this.helperService.getLogo();
    return this.loadPDF().then(() => { // Singleton
      const doc = new PDFDocument(pdfOptions);
      return Promise.resolve(doc);
    }); // .then((doc) => {
    //  return this.helperService.registerFont(doc, 'ClearfaceGothicLH-Roman', 'assets/fonts/clearface_gothic/ClearfaceGothicLH-Roman.ttf').
    //           then(() => Promise.resolve(doc)).catch(e => Promise.reject(e));
    // });
  }

  openBlobStream(stream: any, filename = '', download = false) {
    const url = stream.toBlobURL('application/pdf');
    if (!download) {
      window.open(url, '_blank');
      return;
    }

    try {
      const pdfLink = document.createElement('a');
      pdfLink.href = url;
      pdfLink.download = filename || this.helperService.generateRandomString(8, this.helperService.defaultLowerAlphaNumeric) + '.pdf';
      pdfLink.target = '_blank';
      pdfLink.click();
    } catch(e) {
      window.open(url, '_blank');
    }
  }

  finishPDF(doc: any) {
    return new Promise((resolve, reject) => {
      const stream = doc.pipe(blobStream());
      doc.save();

      stream.on('error', () => {
        reject(false);
      });
      stream.on('finish', () => resolve(stream));

      doc.end();
    });
  };
/*
  finishPDF(doc: any, filename = 'myfile') {
    const stream = doc.pipe(blobStream());
    doc.save();

    stream.on('finish', () => {
      if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(stream.toBlob('application/pdf'),
          filename
      );
      } else {
        const url = stream.toBlobURL('application/pdf');
        window.location.assign(url);
      }
    });

    doc.end();
  }
*/
}
