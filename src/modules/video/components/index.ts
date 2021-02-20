// eslint-disable-next-line max-len
import { VideoControlsButtonsEndClippingComponent } from './video-controls-buttons/video-controls-buttons-end-clipping/video-controls-buttons-end-clipping.component';
// eslint-disable-next-line max-len
import { VideoControlsButtonsStartComponent } from './video-controls-buttons/video-controls-buttons-start/video-controls-buttons-start.component';
import { VideoControlsTimelineComponent } from './video-controls-timeline/video-controls-timeline.component';
import { VideoControlsComponent } from './video-controls/video-controls.component';
import { VideoFfprobeModule } from './video-ffprobe/video-ffprobe.module';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { VideoQueueListComponent } from './video-queue-list/video-queue-list.component';
import { VideoStatsComponent } from './video-stats/video-stats.component';


export const components = [VideoControlsComponent, VideoPlayerComponent, VideoStatsComponent, VideoControlsTimelineComponent,
  VideoControlsButtonsStartComponent, VideoControlsButtonsEndClippingComponent, VideoQueueListComponent];
export const modules = [VideoFfprobeModule];
export const entryComponents = [VideoControlsTimelineComponent, VideoControlsButtonsStartComponent,
  VideoControlsButtonsEndClippingComponent];

export * from './video-controls/video-controls.component';
export * from './video-ffprobe/video-ffprobe.module';
export * from './video-player/video-player.component';
export * from './video-queue-list/video-queue-list.component';
export * from './video-stats/video-stats.component';
export * from './video-controls-timeline/video-controls-timeline.component';
export * from './video-controls-buttons/video-controls-buttons.component';
export * from './video-controls-buttons/video-controls-buttons-start/video-controls-buttons-start.component';
export * from './video-controls-buttons/video-controls-buttons-end-clipping/video-controls-buttons-end-clipping.component';
