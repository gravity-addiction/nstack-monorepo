export interface IVideoPlayerInfoUrl {
  url: string;
  fps?: number;
  timeout?: number;
  mime?: string;
  preset?: string;
}

export interface IVideoPlayerInfoAws {
  server?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Key: string;
  bucket: string;
  fps?: number;
  timeout?: number;
  mime?: string;
  preset?: string;
}
