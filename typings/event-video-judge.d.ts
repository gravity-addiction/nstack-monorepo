export interface IEventVideoJudge {
  id: number;
  priority: number;
  notes: string;
  videoMD5: string;
  datestamp: string;
  queue: string;
  done: string;
}

export interface ResultsEventVideoJudge {
  id: number;
  videoId: number;
  preset: string;
  judgePrinciple: string;
  judgeOfficial: string;
  priority: number;
  notes: string;
  videoMD5: string;
  datestamp: string;
}
