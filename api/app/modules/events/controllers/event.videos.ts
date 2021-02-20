import { config } from '@lib/config';
import { first, query } from '@lib/db';
import { IEventVideoComp, IEventVideoJudge, IEventVideoQueue, IEventVideoQueueEntry, IEventVideoTeam, ResultsEventVideo, ResultsEventVideoQueue } from '@typings/event';
import { IVideoPlayerInfoAws } from '@typings/video-player';
import { PoolConnection,  RowDataPacket } from 'mysql2';


/* eslint-disable @typescript-eslint/naming-convention */
export const ngEventVideoInfoAws = (r: RowDataPacket | ResultsEventVideoQueue): IVideoPlayerInfoAws =>
  /*
  Key: string;
  bucket: string;
  fps?: number;
  timeout?: number;
  mime?: string;
  preset?: string;
  */
  ({
    Key: r.s3Key,
    bucket: r.s3Bucket,
    fps: r.fps,
    preset: r.preset,
  });

export const ngEventVideoJudge = (r: RowDataPacket | ResultsEventVideoQueue): IEventVideoJudge =>
  /*
  id: number;
  priority: number;
  notes: string;
  datestamp: string;
  queue: string;
  done: string;
  */
  ({
    id: r.id,
    priority: r.judgePriority,
    notes: r.notes,
    videoMD5: r.videoMD5,
    datestamp: r.datestamp,
    queue: r.judgePrinciple,
    done: r.judgeOfficial,
  });

export const ngEventVideoComp = (r: RowDataPacket | ResultsEventVideoQueue): IEventVideoComp =>
  /*
  eventId: number;
  name: string;
  */
  ({
    eventId: r.compEventId,
    name: r.compName,
  });


export const ngEventVideoTeam = (r: RowDataPacket | ResultsEventVideoQueue): IEventVideoTeam =>
  /*
  teamNumber: string;
  name: string;
  */
  ({
    teamNumber: r.teamNumber,
    name: r.teamName,
  });

export const ngEventVideoQueueEntry = (r: RowDataPacket | ResultsEventVideoQueue): IEventVideoQueueEntry => {
  const scores = (r.score || '').split(',', 2);
  return {
    video: ngEventVideoInfoAws(r),
    judge: ngEventVideoJudge(r),
    comp: ngEventVideoComp(r),
    team: ngEventVideoTeam(r),
    id: r.id,
    name: r.name,
    notes: r.notes,
    round: r.roundNum,
    draw: (r.draw || '').split(',').filter((d: string) => d !== ''),
    score: scores[0] || null,
    maxScore: scores[1] || null,
    videoMD5: r.videoMD5,
  };
};

export const ngEventVideoQueue = (r: RowDataPacket[] | ResultsEventVideoQueue, userid: number, ): IEventVideoQueue =>
  /*
  name: string;
  queue: IEventVideoQueueEntry[];
  watched: IEventVideoQueueEntry[];
  */
  ({
    name: '',
    queue: [],
    watched: [],
  });


export const getEventVideoQueueForUser = (userId: number, watched = 0, eventId = 0, qStart = 0, qLimit = 500, db?: PoolConnection
      ): Promise<ResultsEventVideoQueue[]> => {
  let sql = '';
  const val: (string | number)[] = [];

  sql += 'SELECT ';
  sql += '??.preset, ??.judgePrinciple, ??.judgeOfficial, ??.priority as judgePriority, ??.notes as judgeNotes, ';
  val.push(...Array(5).fill(config.events.dbTables.eventVideoJudge));
  sql += '??.*, ';
  val.push(config.events.dbTables.eventVideos);
  sql += '??.id as compId, ??.eventId as compEventId, ??.name as compName, ';
  val.push(...Array(3).fill(config.events.dbTables.eventComp));
  sql += '??.id as teamId, ??.teamNumber, ??.name as teamName, ';
  val.push(...Array(3).fill(config.events.dbTables.eventTeam));

  sql += '(';

    sql += 'SELECT CONCAT(totalScore, \',\', pointsInTime) FROM ?? WHERE ??.videoId = ??.id AND ??.userId = ? ';
    val.push(...[config.events.dbTables.eventVideoScores, config.events.dbTables.eventVideoScores,
      config.events.dbTables.eventVideos, config.events.dbTables.eventVideoScores, userId]);

    sql += 'ORDER BY ??.datestamp DESC LIMIT 1';
    val.push(config.events.dbTables.eventVideoScores);

  sql += ') as score ';


  sql += 'FROM ?? ';
  val.push(config.events.dbTables.eventVideoJudge);
  sql += 'LEFT JOIN ?? ON ??.id = ??.videoId ';
  val.push(...[config.events.dbTables.eventVideos, config.events.dbTables.eventVideos, config.events.dbTables.eventVideoJudge]);
  sql += 'LEFT JOIN ?? ON ??.id = ??.compId ';
  val.push(...[config.events.dbTables.eventComp, config.events.dbTables.eventComp, config.events.dbTables.eventVideos]);
  sql += 'LEFT JOIN ?? ON ??.id = ??.teamId ';
  val.push(...[config.events.dbTables.eventTeam, config.events.dbTables.eventTeam, config.events.dbTables.eventVideos]);

  sql += 'WHERE ';
  if (watched) {
    sql += '(??.videoId IN(SELECT videoId FROM ?? WHERE userId = ?)) ';
    val.push(config.events.dbTables.eventVideoJudge, config.events.dbTables.eventVideoScores, userId);
  } else {
    sql += '(??.videoId NOT IN(SELECT videoId FROM ?? WHERE userId = ?)) ';
    val.push(config.events.dbTables.eventVideoJudge, config.events.dbTables.eventVideoScores, userId);
  }
  if (eventId) {
    sql += 'AND (??.eventId = ?) ';
    val.push(...[config.events.dbTables.eventVideos, eventId]);
  }

  sql += 'ORDER BY ';
  sql += '??.priority DESC, ??.priority DESC, ??.eventId, ??.compId, ??.roundNum, ??.name ';
  val.push(...[config.events.dbTables.eventVideoJudge, config.events.dbTables.eventVideos,
    config.events.dbTables.eventVideos, config.events.dbTables.eventVideos, config.events.dbTables.eventVideos,
    config.events.dbTables.eventTeam,
  ]);

  sql += 'LIMIT ?, ? ';
  val.push(...[qStart, qLimit]);

  return query<RowDataPacket[]>(sql, val, db).
  then((rA: RowDataPacket[]) => rA.map((r: RowDataPacket): ResultsEventVideoQueue => r as ResultsEventVideoQueue));
};

export const getEventVideo = (id: number, db?: PoolConnection): Promise<ResultsEventVideo> =>
  query<RowDataPacket[]>(
    'SELECT * FROM ?? WHERE `id` = ? LIMIT 1',
    [config.events.dbTables.eventVideos, id],
    db
  ).
  then((r: RowDataPacket[]): RowDataPacket => first(r)).
  then((r: RowDataPacket): ResultsEventVideo => r as ResultsEventVideo);


export const eventVideoQueueParseRet = (ret: IEventVideoQueue[], data: ResultsEventVideoQueue[], watched = 0, eventSlug?: string) => {
  const dLen = data.length;
  console.log(data);
  for (let d = 0; d < dLen; d++) {
    let retI = ret.findIndex(r => r.name === data[d].compName);
    if (retI === -1) {
      retI = ret.length;
      ret.push({
        name: data[d].compName || eventSlug || '',
        queue: [],
        watched: [],
      });
    }

    if (watched) {
      ret[retI].watched.push(ngEventVideoQueueEntry(data[d]));
    } else {
      ret[retI].queue.push(ngEventVideoQueueEntry(data[d]));
    }
  }
  return ret;
};



