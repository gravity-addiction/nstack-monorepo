import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { IPdfWysiwygItem } from '../../models/i-pdf-wysiwyg-item';
import { PdfWysiwygService, ToolUtils } from '../../services';
import { TPdfWysiwygToolTypes } from '../../typings';

@Component({
  selector: 'app-pdf-wysiwyg-toolbox',
  templateUrl: './pdf-wysiwyg-toolbox.html',
  styleUrls: ['./pdf-wysiwyg-toolbox.scss'],
})
export class PdfWysiwygToolboxComponent implements OnInit {
  @ViewChild('toolPanel', {static: true}) toolPanel!: ElementRef;
  @ViewChild('transferPanel', {static: true}) transferPanel!: ElementRef;
  @Output() runDraw = new EventEmitter();
  @Output() runClearCanvas = new EventEmitter();
  @Output() runMakePDF = new EventEmitter();
  @Output() stopArrows = new EventEmitter();
  @Input() pdfService!: PdfWysiwygService;

  draggablePosition = 'fixed';
  settingItem: IPdfWysiwygItem | null = null;
  boxStyle = {
    position: 'fixed',
    top: '90px',
    left: '50px',
  };
  pageNum = 1;

  showTools = true;
  showDisplays = true;
  showSize = true;
  showPlacement = true;
  showPadding = true;
  showDetails = true;

  showRequired = true;
  showSampleText = false;
  showFont = false;
  showAlignment = false;
  showStroke = false;
  showSelected = false;
  showSpacing = false;
  showMaxlength = false;
  showTextTransform = false;
  showBorder = false;
  showBoxShadow = false;
  showTransform = false;

  constructor() {}

  ngOnInit() {
/*
    if (this.service.toolType) {
      this.settingItem = new IPdfWysiwygItem({
        t: this.service.toolType,
        obj: this.service.toolboxDefaults[this.service.toolType]
      });
    }
*/
    this.pdfService.itemChanged.subscribe((item: any) => {
  //    if (item) {
        this.settingItem = item;
        if (!this.settingItem) {
 return;
}
  //    } else {
  //      this.settingItem = new IPdfWysiwygItem({
  //        t: this.service.toolType,
  //        obj: this.service.toolboxDefaults[this.service.toolType]
  //      });
  //    }

      this.toolChanged(this.settingItem.t);
    });
  }

  toolChanged(tool: string) {
    this.clearAddons();
    if (tool === 'textbox') {
      this.showRequired = true;
      this.showSampleText = true;
      this.showFont = true;
      this.showAlignment = true;
      this.showSpacing = true;
      this.showMaxlength = true;
      this.showTextTransform = true;
      this.showBorder = true;
      this.showBoxShadow = true;
      this.showTransform = true;

    } else if (tool === 'cross') {
      this.showStroke = true;
      this.showSelected = true;

    } else if (tool === 'line') {
      this.showStroke = true;

    } else if (tool === 'ellipse') {
      this.showStroke = true;
    }
  }

  clearAddons() {
    this.showRequired = false;
    this.showSampleText = false;
    this.showFont = false;
    this.showAlignment = false;
    this.showStroke = false;
    this.showSelected = false;
    this.showSpacing = false;
    this.showMaxlength = false;
    this.showTextTransform = false;
    this.showBorder = false;
    this.showBoxShadow = false;
    this.showTransform = false;
  }

  draw() {
    this.runDraw.emit();
  }

  copyItem(item: IPdfWysiwygItem) {
    if (this.pdfService.displayMode !== 'edit') {
 return;
}

    this.pdfService.copyItem(item);
    this.draw();
  }
  removeItem(item: IPdfWysiwygItem) {
    if (this.pdfService.displayMode !== 'edit') {
 return;
}

    this.pdfService.removeItem(item);
    this.draw();
  }

  setTool(t: TPdfWysiwygToolTypes) {
    if (this.pdfService.toolType === t) {
      this.pdfService.changeItem(null);
    } else {
      this.pdfService.toolType = t;
      this.toolChanged(t);
    }
    this.draw();
  }
  setDisplay(t: string) {
    this.pdfService.showInfo = t;
    this.draw();
  }
  setEditMode() {
    this.pdfService.displayMode = 'edit';
    this.draw();
  }
  setInputMode() {
    this.runClearCanvas.emit();
    this.pdfService.displayMode = 'input';
  }

  confirmClear() {
    if (this.pdfService.displayMode !== 'edit') {
 return;
}

    this.pdfService.clearItems();
    this.runClearCanvas.emit();
  }
  makePDF() {
    this.runMakePDF.emit();
  }
  printPDF() {
    ToolUtils.getNativeWindow().print();
  }

  setDraggablePosition() {
    const el = this.toolPanel.nativeElement;
    if (this.draggablePosition === 'fixed') {
      this.draggablePosition = 'absolute';
      el.style.top = `${el.offsetTop + document.body.scrollTop}px`;
    } else {
      this.draggablePosition = 'fixed';
      el.style.top = `${el.offsetTop - document.body.scrollTop}px`;
    }
  }

  txtChange() {
    this.pdfService.drawObs.next(true);
  }

  fontSizeChange(fC: number) {
    if (this.pdfService && this.pdfService.activeItem) {
      this.pdfService.activeItem.obj.fontSize += fC;
      this.pdfService.drawObs.next(true);
    }
  }
}
