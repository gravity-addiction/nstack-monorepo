import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout-sdob',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './layout-sdob.component.html',
  styleUrls: ['layout-sdob.component.scss'],
})
export class LayoutSdobComponent implements OnInit {
  constructor() { }
  ngOnInit() { }
}
