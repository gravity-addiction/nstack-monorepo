import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IPdfWysiwygItem } from '../../models/i-pdf-wysiwyg-item';
import { PdfWysiwygService } from '../../services';

@Component({
  selector: 'app-pdf-wysiwyg-toolbox-details',
  templateUrl: './pdf-wysiwyg-toolbox-details.html',
  styleUrls: ['./pdf-wysiwyg-toolbox-details.css'],
})
export class PdfWysiwygToolboxDetailsComponent implements OnInit {
  @Output() runDraw = new EventEmitter();
  @Output() stopArrows = new EventEmitter();
  @Input() pdfService!: any;

  service!: PdfWysiwygService;
  draggablePosition = 'fixed';
  settingItem: IPdfWysiwygItem | null = null;

  showDisplays = true;
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

  constructor(private globalPdfService: PdfWysiwygService) {}

  ngOnInit() {
    this.service = this.pdfService || this.globalPdfService;

    this.service.itemChanged.subscribe((item: any) => {
      this.settingItem = item;
      if (!this.settingItem) {
 return;
}
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

}
