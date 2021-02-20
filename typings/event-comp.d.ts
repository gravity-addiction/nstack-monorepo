import { IEventTeam } from './event-team';

export interface IEventComp {
  name: string;
  roundCnt: number;
  exRoundCnt: number;
  exRoundPre: string;
  draw: any[];
  status: string;
  shown: boolean;
  complete: boolean;
  notes: string;
  teams: IEventTeam[];
}
