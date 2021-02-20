// Original Invoice Layout By: Philipp Spless
// https://pspdfkit.com/blog/2019/generate-invoices-pdfkit-node/
// https://github.com/PSPDFKit-labs/pdfkit-invoice/blob/master/createInvoice.js

import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { PdfkitService } from '@modules/app-common/services/index';

@Injectable({ providedIn: 'root' })
export class CreateInvoiceService {

  constructor(
    private decimalPipe: DecimalPipe,
    private pdfkitService: PdfkitService,
  ) { }

  createInvoiceStream(invoice: any) {
    return this.pdfkitService.makePDF({ size: "Letter", margin: 0 }).
    then((doc) => {
      // doc.font('ClearfaceGothicLH-Roman');
      doc.font('Helvetica').fontSize(10);
    
      doc.moveTo(48, 185).lineTo(567, 185).lineTo(567, 762).lineTo(48, 762).lineTo(48, 185).stroke(). // Square Items
        moveTo(48, 200).lineTo(567, 200).stroke(). // Header Horizontal
        moveTo(48, 708).lineTo(567, 708).stroke(). // Totals Horizontal
        moveTo(447, 708).lineTo(447, 762).stroke(). // Total Vertical
        moveTo(96, 185).lineTo(96, 708).stroke(). // Qty |
        moveTo(417, 185).lineTo(417, 708).stroke(). // Item |
        moveTo(487, 185).lineTo(487, 708).stroke(). // Cost Per |
        font('Helvetica-Bold').
        text('Qty', 50, 188, { width: 44, align: 'center' }).
        text('Item', 102, 188, { width: 313, align: 'left' }).
        text('Cost Per', 419, 188, { width: 66, align: 'center' }).
        text('Total', 489, 188, { width: 76, align: 'center' });


      this.invoiceInfo(doc, invoice);
      this.companyInfo(doc, invoice);
      this.receiptInfo(doc, invoice);
      this.addEntries(doc, invoice);
      this.documentTotals(doc, invoice);

      return doc;
    });
  }
  
  invoiceInfo(doc: any, info: any) {
    doc.fontSize(10).font('Helvetica-Oblique').
      text('Date:', 325, 62, { width: 170, oblique: true }).
      text('Invoice #', 495, 62, { width: 67, align: 'right', oblique: true }).
      moveTo(320, 72).lineTo(567, 72).lineTo(567, 84).lineTo(320, 84).lineTo(320, 72).stroke().
      moveTo(491, 72).lineTo(491, 84).stroke().
      font('Helvetica').
      text(info.invoice_date, 325, 75, { width: 170 }).
      text(info.invoice_num, 496, 75, { width: 66, align: 'right' });
  }

  companyInfo(doc: any, info: any, pagey = 62) {
    doc.font('Helvetica').fontSize(10);
    [info.sender_one, info.sender_two, info.sender_three, info.sender_four, info.sender_five].forEach((line: string) => {
      if (line) {
        doc.text(line, 48, pagey, { width: 300, align: 'left' });
        pagey += 13;
      }
    });
  }

  receiptInfo(doc: any, info: any, pagey = 87) {
    doc.font('Helvetica-Oblique').fontSize(10).
      text('Bill To: ', 325, pagey, { oblique: 20 }).
      font('Helvetica').
      moveTo(320, pagey + 12).lineTo(567, pagey + 12).lineTo(567, pagey + 85).lineTo(320, pagey + 85).lineTo(320, pagey + 12).stroke();

    pagey += 17;
    [info.receiver_one, info.receiver_two, info.receiver_three, info.receiver_four, info.receiver_five].forEach((line: string) => {
      if (line) {
        doc.text(line, 325, pagey, { width: 230, align: 'left' });
        pagey += 13;
      }
    });
  }

  addEntries(doc: any, info: any) {
    if (!info || !info.items || !info.items.length) { return; }
    const iLen = info.items.length;
    doc.y = 204;
    for (let i = 0; i < iLen; i++) {
      const item = info.items[i];
      const pagey = doc.y;
      doc.font('Helvetica').fontSize(10).
        text(item.qty, 50, pagey, { width: 44, align: 'center' }).
        text('$' + this.decimalPipe.transform(item.cost_per, '1.2-2'), 419, pagey, { width: 65, align: 'right' }).
        text('$' + this.decimalPipe.transform(item.cost_total, '1.2-2'), 489, pagey, { width: 75, align: 'right' }).moveDown(0.5).
        text(item.item_title, 102, pagey, { width: 313, align: 'left' }).moveDown(0.25).text(item.item_desc, { indent: 5 }).moveDown(1);
    }
  }

  documentTotals(doc: any, info: any) {
    doc.font('Helvetica-BoldOblique').fontSize(12).
      // text('Subtotal', 295, 711, { width: 145, align: 'right' }).
      // text('Sales Tax', 295, 728, { width: 145, align: 'right' }).
      // font('Helvetica').
      // text('$' + this.decimalPipe.transform(info.invoice_total, '1.2-2'), 475, 711, { width: 87, align: 'right' }).
      // text('', 475, 728, { width: 87, align: 'right' }).
      font('Helvetica-BoldOblique').fontSize(14).
      text('Total', 295, 747, { width: 145, align: 'right' }).
      font('Helvetica-Bold').
      text('$' + this.decimalPipe.transform(info.invoice_total, '1.2-2'), 475, 747, { width: 87, align: 'right' });
      

      /*array($this->documentdate,115,17,175,13.5),
      array($this->documentid,175,17,195,13.5,1,'R'),
      array($this->subtotal,161,252.5,195,248,1,'R'),
      array($this->totaltax,161,257.5,195,253,1,'R'),
      array($this->total,161,263,195,257.5,1,'R'),
      array($this->net,59,53,99,50,1,'C'),
      array($this->documentduedate,104,53,149,50,1,'C')
      //array($this->paperwork_billingpaid,134,30.5,196,23),
      //array($this->paperwork_billingaddedby,134,30.5,196,23),
      //array($this->paperwork_billingupdated,134,30.5,196,23),
      //array($this->paperwork_billingdatestamp,134,30.5,196,23)
    );
    $masterclass->allclasses['paperpdf']->fill_page($arrlines);*/
  }


  formatCurrency(cents: number) {
    return "$" + (cents / 100).toFixed(2);
  }

  formatDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
  }
}
