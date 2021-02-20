import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrls: ['header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('mastHeading', { static: true }) mastHeading!: ElementRef;
  @Input() backgroundImage!: string;
  @Input() heading!: string;
  @Input() subHeading!: string;
  @Input() meta!: string;
  @Input() siteHeading = false;
  @Input() profileSearching = false;

  queryField: FormControl = new FormControl();

  safeBackgroudImage!: SafeStyle;

  errorMsg!: string;

  constructor(private domSanitizer: DomSanitizer) {}
  ngOnInit() {
    this.safeBackgroudImage = this.domSanitizer.bypassSecurityTrustStyle(this.backgroundImage);
  }
}
