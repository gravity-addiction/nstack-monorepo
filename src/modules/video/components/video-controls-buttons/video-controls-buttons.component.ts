import { Type } from '@angular/core';

import { VideoPlayerService } from '../../services/index';

export class VideoControlsButtonsItem {
  constructor(
    public component: Type<any>,
    public videoPlayer: VideoPlayerService,
    public videoPlayerData: any
  ) { }
}

export interface VideoControlsButtonsComponent {
  [name: string]: any;
  videoPlayer: VideoPlayerService;
  videoPlayerData: any;
}
