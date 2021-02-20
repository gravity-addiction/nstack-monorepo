
import { FsScoringClass } from '@classes/sdob-scoring/fs-scoring.class';
import { config } from '@lib/config';
import { first, insert, query } from '@lib/db';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

export const insertEventScorecard = (videoId: number, userId: number,
                                totalScore: number | null, pointsInTime: number | null, scorecard: any,
                                db?: PoolConnection
): Promise<ResultSetHeader> =>
  insert(
    { videoId, userId, totalScore, pointsInTime, scInfo: scorecard },
    config.events.dbTables.eventVideoScores,
    db
  );

export const insertEventSubmission = (eventSlug: string, scorecard: any, db?: PoolConnection): Promise<ResultSetHeader> => {
  let data = scorecard;
  if (typeof scorecard !== 'string') {
    data = JSON.stringify(scorecard);
  }

  return insert(
    { eventSlug, data },
    config.events.dbTables.eventVideoSubmit,
    db
  );
};

export const getEventScorecard = (videoId: number, userId: number | number[] | null, db?: PoolConnection): Promise<RowDataPacket[]> => {
  let sql = '';
  const val: (string | number)[] = [];

  sql += 'SELECT totalScore, pointsInTime, scInfo FROM ?? WHERE `videoId` = ? ';
  val.push(...[config.events.dbTables.eventVideoScores, videoId]);

  if (userId && Array.isArray(userId) && userId.length) {
    sql += 'AND (';
    const uLen = userId.length;
    for (let u = 0; u < uLen; u++) {
      if (u > 0) {
        sql += 'OR ';
      }
      sql += 'userId = ? ';
      val.push(userId[u]);
    }
    sql += ') ';
  } else if (typeof userId === 'number') {
    sql += 'AND userId = ? ';
    val.push(userId);
  }

  sql += 'GROUP BY userId, IFNULL(userId, CONCAT(\'X\', id)) ORDER BY datestamp DESC LIMIT 0, 100';

  return query<RowDataPacket[]>(sql, val, db);
};


export const getOfficialVideoJudges = (videoId: number, db?: PoolConnection): Promise<number[]> => {
  if (!videoId) {
    return Promise.resolve([]);
  }

  let sql = '';
  const val: (string | number)[] = [];
/*
  if (Array.isArray(videoId)) {
    const vLen = videoId.length;
    if (!vLen) { return Promise.resolve([]); }
    sql += 'SELECT videoId, judgeOfficial FROM ?? WHERE (';
    for (let vI = 0; vI < vLen; vI++) {
      if (vI > 0) { sql += 'OR '; }
      sql += 'videoId = ? ';
      val.push(videoId[vI]);
    }
    sql += ')';
    return query<RowDataPacket[]>(sql, val, db);

  } else {
    */
    sql += 'SELECT videoId, judgeOfficial FROM ?? WHERE videoId = ? LIMIT 0, 1';
    val.push(...[config.events.dbTables.eventVideoJudge, videoId]);
    return query<RowDataPacket[]>(sql, val, db).
    then((r: RowDataPacket[]): RowDataPacket => first(r)).
    then((jLRes: any): number[] => (jLRes.judgeOfficial || '').split(',') || []);
  // }

};

export const getScorecardsByVideoOfficial = async (videoId: number, db?: PoolConnection): Promise<RowDataPacket[]> => {

  // Get Judges List
  const arrJudgeOfficial = await getOfficialVideoJudges(videoId, db);

  const jQLen = arrJudgeOfficial.length;
  let sqlJudges = '';
  const valJudges: (string | number)[] = [];

  for (let jQI = 0; jQI < jQLen; jQI++) {
    if (!arrJudgeOfficial[jQI]) {
      continue;
    }
    if (sqlJudges) {
      sqlJudges += 'OR ';
    }
    sqlJudges += 'userId = ? ';
    valJudges.push(arrJudgeOfficial[jQI]);
  }
  // if (sqlJudges === '') { throw new Error('No Judges in official judge list'); }


  let sql = '';
  const val: (string | number)[] = [];

  sql += 'SELECT ??.videoId, ??.userId, ??.totalScore, ??.pointsInTime, ??.scInfo FROM ';
  val.push(...[config.events.dbTables.eventVideoScores, config.events.dbTables.eventVideoScores, config.events.dbTables.eventVideoScores,
              config.events.dbTables.eventVideoScores, config.events.dbTables.eventVideoScores]);

  sql += '(';
    sql += 'SELECT userId, MAX(datestamp) `datestamp` FROM ?? WHERE videoId = ? ';
    val.push(...[config.events.dbTables.eventVideoScores, videoId]);

    if (sqlJudges !== '') {
      sql += 'AND (' + sqlJudges + ') ';
      val.push(...valJudges);
    }

    sql += 'GROUP BY userId ';
  sql += ') filtered_scorecards ';

  sql += 'JOIN ?? USING (userId, datestamp) WHERE `videoId` = ? GROUP BY userId, datestamp';
  val.push(config.events.dbTables.eventVideoScores, videoId);

  return query<RowDataPacket[]>(sql, val, db);

};


export const calcScorecardTotal = async (videoId: number, db?: PoolConnection): Promise<any> => {

  const datestamp = new Date().toUTCString();

  // Fetch scrollcards and Filter Out User 0 // Collated
  const scorecards: any[] = (await getScorecardsByVideoOfficial(videoId) || []).filter(video => !!video.userId);
  const judgeList = [];

  // loop for info
  const scLen = scorecards.length;
  const scArr = [];
  for (let sC = 0; sC < scLen; sC++) {
    scArr[sC] = JSON.parse(scorecards[sC].scInfo) || [];
    judgeList.push(scorecards[sC].userId);
  }

  const scInfo = await FsScoringClass.calculateCollation(scArr);
  const totalScore = FsScoringClass.calculateScore(scInfo);
  const pointsInTime = FsScoringClass.calculatePit(scInfo);

  // Sanity check new scorecard
  if (scInfo.length === 0) {
    scInfo.push({ resolved: 0, datestamp });
  } else {
    // Add datestamp
    scInfo[0].datestamp = datestamp;

    // find tiebreaks
    const tiebreaks = scInfo.filter((sc: any) => (sc.hasOwnProperty('class') && sc.class === 'tiebreak')) || [];
    if (tiebreaks.length > 0) {
      scInfo[0].resolved = 0;
    } else {
      scInfo[0].resolved = judgeList.length;
    }
  }

  return { totalScore, pointsInTime, scInfo };
};
