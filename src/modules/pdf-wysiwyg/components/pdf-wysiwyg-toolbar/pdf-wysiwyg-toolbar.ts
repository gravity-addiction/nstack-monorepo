import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { PdfWysiwygService } from '../../services';
import { TPdfWysiwygToolTypes } from '../../typings';

@Component({
  selector: 'app-pdf-wysiwyg-toolbar',
  templateUrl: './pdf-wysiwyg-toolbar.html',
  styleUrls: ['./pdf-wysiwyg-toolbar.css'],
})
export class PdfWysiwygToolbarComponent implements OnInit {
  @ViewChild('toolbar', {static: true}) toolbar!: ElementRef;
  @Input() pdfService: any;
  @Output() runDraw = new EventEmitter();

  globalPdfService: PdfWysiwygService;
  service!: PdfWysiwygService;
  draggablePosition = 'fixed';
  boxStyle = {
    position: 'fixed',
    top: '5px',
    left: '20px',
    height: '100px',
    width: '30px',
  };

  constructor(_globalPdfService: PdfWysiwygService) {
    this.globalPdfService = _globalPdfService;
  }

  ngOnInit() {
    this.service = this.pdfService || this.globalPdfService;
  }

  setTool(t: TPdfWysiwygToolTypes) {
    if (this.service.toolType === t) {
      this.service.changeItem(null);
    } else {
      this.service.toolType = t;
      // this.toolChanged(t);
    }
    this.runDraw.emit();
  }

  setDraggablePosition() {
    const el = this.toolbar.nativeElement;
    if (this.draggablePosition === 'fixed') {
      this.draggablePosition = 'absolute';
      el.style.top = `${el.offsetTop + document.body.scrollTop}px`;
    } else {
      this.draggablePosition = 'fixed';
      el.style.top = `${el.offsetTop - document.body.scrollTop}px`;
    }
  }
}
