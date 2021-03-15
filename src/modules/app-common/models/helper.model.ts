export type HelperScripts = 'alasql' | 'pdfkit' | 'blobstream' | 'svgtopdf' | 'recaptcha' | 'facebook' |
  'google' | 'mediainfo' | 'squareup' | 'pdfjs' | 'hlsjs' | 'shortid' | 'highlight' | 'powerrange';

export interface IHelperScriptsData {
  loaded: boolean;
  script: string;
  defer?: boolean;
  async?: boolean;
}

export type HelperScriptsMap<T> = { [script in HelperScripts]: T };
