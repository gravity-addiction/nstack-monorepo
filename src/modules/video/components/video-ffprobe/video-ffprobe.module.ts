import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { VideoFfprobeComponent } from './video-ffprobe.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    VideoFfprobeComponent,
  ],
  exports: [
    VideoFfprobeComponent,
  ],
})
export class VideoFfprobeModule { }
