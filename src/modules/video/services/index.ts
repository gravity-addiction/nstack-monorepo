import { VideoCanvasService } from './video-canvas.service';
import { VideoFolderService } from './video-folder.service';
import { VideoMediainfoService } from './video-mediainfo.service';
import { VideoPlayerService } from './video-player.service';
import { VideoQueueService } from './video-queue.service';
import { VideoUrlService } from './video-url.service';
import { VideoService } from './video.service';

export const services = [VideoCanvasService, VideoFolderService, VideoMediainfoService,
                         VideoPlayerService, VideoQueueService, VideoUrlService, VideoService];

export * from './video-canvas.service';
export * from './video-folder.service';
export * from './video-mediainfo.service';
export * from './video-player.service';
export * from './video-queue.service';
export * from './video-url.service';
export * from './video.service';
