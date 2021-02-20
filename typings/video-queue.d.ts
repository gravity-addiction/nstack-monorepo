export interface IVideoQueue {
  id: number;
  s3BucketSrc: string;
  s3KeySrc: string;
  s3BucketDest: string;
  s3KeyDest: string;
  spliceArray: string;
  status: number;
  do360: number;
  do480: number;
  do720: number;
  do1080: number;
  datestamp: string;
}

export interface ResultsVideoQueue {
  id: number;
  s3BucketSrc: string;
  s3KeySrc: string;
  s3BucketDest: string;
  s3KeyDest: string;
  spliceArray: string;
  status: number;
  do360: number;
  do480: number;
  do720: number;
  do1080: number;
  datestamp: string;
}

