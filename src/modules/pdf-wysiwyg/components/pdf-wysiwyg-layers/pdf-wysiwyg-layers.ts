import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { PdfWysiwygService } from '../../services';

@Component({
  selector: 'app-pdf-wysiwyg-layers',
  templateUrl: './pdf-wysiwyg-layers.html',
  styleUrls: ['./pdf-wysiwyg-layers.scss'],
})
export class PdfWysiwygLayersComponent implements OnInit {

  @ViewChild('layersPanel', {static: true}) layersPanel!: ElementRef;
  @Input() pdfService!: PdfWysiwygService;

  // test data for layers
  // data: any[] = [{'t': 'textbox', 'id': 'uJrMw'}, {'t': 'textbox', 'id': 'iDLid'}, {'t': 'textbox', 'id': 'PlskI'}];

  draggablePosition = 'fixed';
  showLayers = true;

  constructor() {}

  ngOnInit() {
  }

  setDraggablePosition() {
    const el = this.layersPanel.nativeElement;
    if (this.draggablePosition === 'fixed') {
      this.draggablePosition = 'absolute';
      el.style.top = `${el.offsetTop + document.body.scrollTop}px`;
    } else {
      this.draggablePosition = 'fixed';
      el.style.top = `${el.offsetTop - document.body.scrollTop}px`;
    }
  }

  layerDown(pos: number, evt: any) {
    evt.stopPropagation();
    if (pos > this.pdfService.allItems.length) {
 return;
}
    this.pdfService.allItems.splice(pos + 1, 0, this.pdfService.allItems.splice(pos, 1)[0]);
    this.pdfService.drawObs.next(true);
    this.pdfService.saveObs.next(true);
  }

  layerUp(pos: number, evt: any) {
    evt.stopPropagation();
    if (pos < 1) {
 return;
}
    this.pdfService.allItems.splice(pos - 1, 0, this.pdfService.allItems.splice(pos, 1)[0]);
    this.pdfService.drawObs.next(true);
    this.pdfService.saveObs.next(true);
  }

  selectItem(layer: any) {
    this.pdfService.changeItem(layer);
    this.pdfService.drawObs.next(true);
  }
}
