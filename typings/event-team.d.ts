import { IEventVideoScorecardPacket } from './event-video-scorecard';

export interface IEventTeam {
  name: string;
  score: number[];
  total: number;
  avg: number;
  scorePacket?: IEventVideoScorecardPacket[];
  scorePacketRnd?: number;
  scorePacketRndStr?: string;
  scorePacketLoading?: number;
}
