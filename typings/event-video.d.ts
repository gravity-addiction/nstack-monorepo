import { IVideoQueue } from './video-queue';

export interface IEventVideo {
  id: number;
  name: string;
  queue: Partial<IVideoQueue>[];
  watched: Partial<IVideoQueue>[];
}

export interface IEventVideoComp {
  eventId: number;
  name: string;
}

export interface IEventVideoTeam {
  teamNumber: string;
  name: string;
}

export interface ResultsEventVideo {
  id: number;
  eventId: number;
  compId: number;
  teamId: number;
  url: string;
  s3Bucket: string;
  s3Key: string;
  fps: number;
  name: string;
  draw: string;
  notes: string;
  datestamp: string;
}
