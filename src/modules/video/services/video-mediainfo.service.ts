import { Injectable } from '@angular/core';
import { HelperService } from '@modules/app-common/services/helper-scripts.service';
import { BehaviorSubject, Observable, Observer, of } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const MediaInfo: any;
declare const X2JS: any;

@Injectable({
  providedIn: 'root',
})
export class VideoMediainfoService {

  public get mediaInfoProcessing() {
    return this._mediaInfoProcessing;
  }
  public mediaInfoResult$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  private _mediaInfoProcessing = 0;
  private _mediaInfoProcessingObs!: Observable<number>;
  private _mediaInfoProcessingObe!: Observer<number>;
  private _mediaInfoOffset = 0;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private _CHUNK_SIZE = 5 * 1024 * 1024;
  private _mi: any;
  private _x2js: any;

  constructor(
    private _helperService: HelperService
  ) {
    this._mediaInfoProcessingObs = new Observable(
      (observer: any) => this._mediaInfoProcessingObe = observer
    );
  }

  mediaInfoInit() {
    this._mediaInfoOffset = 0;
    this._CHUNK_SIZE = 5 * 1024 * 1024;

    return new Promise((resolve, reject) => {
      if (!this._helperService.checkScript('mediainfo')) {
        this.updateProcessingStage(20);

        this._helperService.loadScript('mediainfo').then(() => {
          const miLib = MediaInfo(() => {
            this._mi = new miLib.MediaInfo();
            this.updateProcessingStage(30);
            resolve(this._mi);
          });
        }, (err: Error) => {
          reject(err);
        });
      } else {
        this.updateProcessingStage(30);
        resolve(this._mi);
      }
    });
  }

  updateProcessingStage(i: number) {
    this._mediaInfoProcessing = i;
    this._mediaInfoProcessingObe.next(this._mediaInfoProcessing);
  }
  mediainfo(file: any, force = false) {
    if (this._mediaInfoProcessing && !force) {
      return of(0);
    }
    this._mediaInfoProcessing = 10;

    setTimeout(() => {
      this.mediaInfoInit().then(() => {
        this.updateProcessingStage(100);
        if (file && file.size) {
          this._mi.open_buffer_init(file.size, 0);
          this.seek(file, this._CHUNK_SIZE);
        } else {
          this.updateProcessingStage(101);
        }
      }, err => {
        this.updateProcessingStage(102);
      });
    }, 50);
    return this._mediaInfoProcessingObs;
  }

  processChunk = (e: any, file: any) => {
    let l: any;
    let state = null;
    if (e.target.error === null) {
      const chunk = new Uint8Array(e.target.result);
      l = chunk.length;
      state = this._mi.open_buffer_continue(chunk, l);

      let seekTo = -1;
      const seekToLow = this._mi.open_buffer_continue_goto_get_lower();
      const seekToHigh = this._mi.open_buffer_continue_goto_get_upper();

      if (seekToLow === -1 && seekToHigh === -1) {
        seekTo = -1;
      } else if (seekToLow < 0) {
        seekTo = seekToLow + 4294967296 + (seekToHigh * 4294967296);
      } else {
        seekTo = seekToLow + (seekToHigh * 4294967296);
      }

      if (seekTo === -1) {
        this._mediaInfoOffset += l;
      } else {
        this._mediaInfoOffset = seekTo;
        this._mi.open_buffer_init(file.size, seekTo);
      }
    } else {
      this.updateProcessingStage(103);
      return;
    }
    // bit 4 set means finalized
    // eslint-disable-next-line no-bitwise
    if (state & 0x08) {
      const result = this._mi.inform();
      this._mi.close();

      try {
        if (!this._x2js) {
          this._x2js = new X2JS();
        }
        this.processingDone(this._x2js.xml2js(result));
      } catch (err) {
        this.updateProcessingStage(104);
      }

      return;
    }
    this.seek(file, l);
  };

  processingDone(result: any) {
    this.mediaInfoResult$.next(result);
    this.updateProcessingStage(200);
    setTimeout(() => {
      this.updateProcessingStage(0);
    }, 100);
  }

  seek(file: any, length: any) {
    if (this._mediaInfoProcessing) {
      const r = new FileReader();
      const blob = file.slice(this._mediaInfoOffset, length + this._mediaInfoOffset);
      r.onload = (e) => this.processChunk(e, file);
      r.readAsArrayBuffer(blob);
    } else {
      this._mi.close();
      this.updateProcessingStage(105);
    }
  }


  getFormat() {
    const results = this.mediaInfoResult$.getValue();
    let tracks = ((results || {}).File || {}).track;
    if (!tracks) {
      return '';
    }

    const formats = { general: '', video: '', audio: '' };
    if (!Array.isArray(tracks)) {
      tracks = [tracks];
    }

    tracks.forEach((track: any) => {
      if (track._type === 'General' && track.Format) {
        formats.general = track.Format;
      } else if (track._type === 'Video' && track.Format) {
        formats.video = track.Format;
      } else if (track._type === 'Audio' && track.Format) {
        formats.audio = track.Format;
      }
    });

    return formats;
  }
}
