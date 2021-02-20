export interface IEventVideoScorecardMark {
  class: string;
  reason: string;
  time: number;
  left: number;
}

export interface IEventVideoScorecardTimes {
  start: number;
  end: number;
}

export interface IEventVideoScorecard {
  name: string;
  marks: IEventVideoScorecardMark[];
  prestartTime: IEventVideoScorecardTimes;
  workingTime: IEventVideoScorecardTimes;
}

export interface ResultsEventVideoScorecard {
  id: number;
  hash: string;
  name: string;
  marks: string;
  prestartTimeStart: number;
  prestartTimeEnd: number;
  workingTimeStart: number;
  workingTimeEnd: number;
  scorecardSettings: string;
  createdAt: string;
}

export interface IEventVideoScorecardPacket {
  title: string;
  scorecards: IEventVideoScorecard[];
}
