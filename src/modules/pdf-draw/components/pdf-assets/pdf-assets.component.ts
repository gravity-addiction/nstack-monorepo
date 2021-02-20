import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdf-assets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pdf-assets.component.html',
  styleUrls: ['pdf-assets.component.scss'],
})
export class PdfAssetsComponent implements OnInit {
  constructor() { }
  ngOnInit() { }
}
