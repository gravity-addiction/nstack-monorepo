
import { IVideoPlayerInfoAws, IVideoPlayerInfoUrl } from './video-player';
import { IEventVideoJudge } from './event-video-judge';
import { IEventVideoScorecard } from './event-video-scorecard';
import { IEventVideoComp, IEventVideoTeam } from './event-video';

export interface IEventVideoQueueEntry {
  id: number;
  name: string;
  video: IVideoPlayerInfoAws | IVideoPlayerInfoUrl;
  judge: IEventVideoJudge | null;
  comp: IEventVideoComp | null;
  team: IEventVideoTeam | null;
  notes: string;
  videoMD5: string;
  round: number;
  draw: string[];
  score: number | null;
  scores?: IEventVideoScorecard[];
  maxScore: number | null;

  loadScores?: boolean;
}

export interface IEventVideoQueue {
  name: string;
  queue: IEventVideoQueueEntry[];
  watched: IEventVideoQueueEntry[];
}

export interface ResultsEventVideoQueue {
  preset: string;
  judgePrinciple: string;
  judgeOfficial: string;
  judgePriority: number;
  judgeNotes: string;
  id: number;
  eventId: number;
  compId: number;
  teamId: number;
  roundNum: number;
  priority: number;
  url: string;
  s3Bucket: string;
  s3Key: string;
  fps: number;
  name: string;
  draw: string;
  notes: string;
  videoMD5: string;
  datestamp: string;
  compEventId: number;
  compName: string;
  teamNumber: string;
  teamName: string;
  score: string;
}
