import { Component, Input, OnInit } from '@angular/core';

import { PdfWysiwygService } from '../../services';

@Component({
  selector: 'app-pdf-wysiwyg-save',
  templateUrl: './pdf-wysiwyg-save.html',
  styleUrls: ['./pdf-wysiwyg-save.css'],
})
export class PdfWysiwygSaveComponent implements OnInit {
  @Input() pdfService: any;

  service!: PdfWysiwygService;
  saveDisabled!: boolean;
  showSaved!: boolean;

  constructor(private globalPdfService: PdfWysiwygService) { }

  ngOnInit() {
    this.service = this.pdfService || this.globalPdfService;
  }

  saveInput() {
    this.pdfService.runHooks('preSave').then((canSave1: boolean) => {
      if (canSave1) {
        this.pdfService.runHooks('save').then((canSave2: boolean) => {
          if (canSave2 && this.service.ver && this.service.save) {
            this.service.custLock = true;
            const newData = this.service.allItems.map(i => ({ id: i.id, val: i.obj.val }));
            const allData = { data: newData, dataId: '' };
            if (this.service.dataId) {
              allData.dataId = this.service.dataId;
            }
            this.sendInput(allData);
          } else if (!this.service.save) {
            this.showSaved = true;
            setTimeout(() => this.showSaved = false, 5000);
          } else if (!canSave2) {
            alert('Error prevented saving data. Please try again, if problem persists talk to an administrator.');
          } else {
            alert('There is no version attached to this form.  Save/create a version in the editor'
              + ' or go back and select a desired version before you can save data.');
          }
        });
      } else {
        // Didn't pass requirements to save
        alert('Did not pass requirements to save');
      }

    }).catch((err: any) => alert(err));
  }

  sendInput(allData: any) {
    this.service.sendAction(this.service.ident, this.service.ver, 'saveInput', allData).subscribe(data => {
      this.showSaved = true;
      if (data) {
        if (!this.service.dataId) {
          this.service.dataId = data[0];
        } else if (this.service.dataId !== data[0]) {
          this.service.newDataId = data[0];
        }
        this.pdfService.runHooks('postSave').then((saved: boolean) => {
          if (saved) {
            setTimeout(() => this.showSaved = false, 5000);
          } else {
            alert('Data was saved but post save operations failed.');
          }
        });
      }
    }, err => console.log(err));
  }

  autoFillForm() {
    // disable Save button
    this.saveDisabled = true;
    this.pdfService.runHooks('autopopulate').then((_bool: boolean) => {
      this.saveDisabled = !_bool;
    });
  }

}
