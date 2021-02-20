import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IPdfWysiwygLine } from '../../models/i-pdf-wysiwyg-line';

@Component({
  selector: 'app-pdf-wysiwyg-line',
  templateUrl: './pdf-wysiwyg-line.html',
  styleUrls: ['./pdf-wysiwyg-line.css'],
})
export class PdfWysiwygLineComponent {
  @Input() obj!: IPdfWysiwygLine;
  @Output() itemClicked = new EventEmitter();

  constructor() {}

}
