import { IVideoPlayerInfoUrl, IVideoPlayerInfoAws } from '@typings/video';

export const instanceOfVideoPlayerInfoUrl = (object: any): object is IVideoPlayerInfoUrl => 'url' in object;
export const instanceOfVideoPlayerInfoAws = (object: any): object is IVideoPlayerInfoAws => 'Key' && 'bucket' in object;
