import { Component, OnInit } from '@angular/core';

import { PdfWysiwygService } from '../../services';

@Component({
  selector: 'app-pdf-wysiwyg-forms',
  templateUrl: './pdf-wysiwyg-forms.html',
})
export class PdfWysiwygFormsComponent implements OnInit {
  service: PdfWysiwygService;
  forms: any = [];

  constructor(_service: PdfWysiwygService) {
    this.service = _service;
  }

  ngOnInit() {
    this.service.getForms().subscribe((data: any) => this.forms = data);
  }
}
