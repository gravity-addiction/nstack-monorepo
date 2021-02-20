
import { FsScoringClass } from '@classes/sdob-scoring/fs-scoring.class';
import { config } from '@lib/config';
import { first, query } from '@lib/db';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

export const addEventJudgeOfficial = (videoId: number, userId: number, db?: PoolConnection): Promise<ResultSetHeader> => {
  const sql = 'UPDATE ?? SET judgeOfficial = REPLACE(CONCAT(judgeOfficial, \',\', ?, \',\'), \',,\', \',\') WHERE videoId = ? LIMIT 1';
  const val = [config.events.dbTables.eventVideoJudge, userId, videoId];
  return query<ResultSetHeader>(sql, val, db);
};

export const addEventJudgePrinciple = (videoId: number, userId: number, db?: PoolConnection): Promise<ResultSetHeader> => {
  const sql = 'UPDATE ?? SET judgePrinciple = REPLACE(CONCAT(judgeOfficial, \',\', ?, \',\'), \',,\', \',\') WHERE videoId = ? LIMIT 1';
  const val = [config.events.dbTables.eventVideoJudge, userId, videoId];
  return query<ResultSetHeader>(sql, val, db);
};

export const setEventJudgeOfficial = (judgeList: string | string[], videoId?: number, compId?: number,
                                      eventId?: number, db?: PoolConnection): Promise<ResultSetHeader> => {
  let judgeOfficial = '';
  if (Array.isArray(judgeList)) {
    judgeOfficial = ',' + judgeList.join(',') + ',';
  } else {
    if (judgeList.charAt(0) !== ',') {
      judgeOfficial += ',';
    }
    judgeOfficial += judgeList;
    if (judgeList.charAt(-1) !== ',') {
      judgeOfficial += ',';
    }
  }
  if (videoId) {
    const sql = 'UPDATE ?? SET judgeOfficial = ? WHERE videoId = ? LIMIT 1';
    const val = [config.events.dbTables.eventVideoJudge, judgeOfficial, videoId];
    return query<ResultSetHeader>(sql, val, db);
  } else if (compId) {
    const sql = 'UPDATE ?? SET judgeOfficial = ? WHERE videoId IN (SELECT id FROM ?? WHERE compId = ?)';
    const val = [config.events.dbTables.eventVideoJudge, judgeOfficial, config.events.dbTables.eventVideos, compId];
    return query<ResultSetHeader>(sql, val, db);
  } else if (eventId) {
    const sql = 'UPDATE ?? SET judgeOfficial = ? WHERE videoId IN (SELECT id FROM ?? WHERE eventId = ?)';
    const val = [config.events.dbTables.eventVideoJudge, judgeOfficial, config.events.dbTables.eventVideos, eventId];
    return query<ResultSetHeader>(sql, val, db);
  } else {
    throw new Error('Erroring setting official judges, no identifier sent');
  }
};


export const setEventJudgePrinciple = (judgeList: string | string[], videoId?: number, compId?: number,
                                      eventId?: number, db?: PoolConnection): Promise<ResultSetHeader> => {
  let judgePrinciple = '';
  if (Array.isArray(judgeList)) {
    judgePrinciple = ',' + judgeList.join(',') + ',';
  } else {
    if (judgeList.charAt(0) !== ',') {
      judgePrinciple += ',';
    }
    judgePrinciple += judgeList;
    if (judgeList.charAt(-1) !== ',') {
      judgePrinciple += ',';
    }
  }
  if (videoId) {
    const sql = 'UPDATE ?? SET judgePrinciple = ? WHERE videoId = ? LIMIT 1';
    const val = [config.events.dbTables.eventVideoJudge, judgePrinciple, videoId];
    return query<ResultSetHeader>(sql, val, db);
  } else if (compId) {
    const sql = 'UPDATE ?? SET judgePrinciple = ? WHERE videoId IN (SELECT id FROM ?? WHERE compId = ?)';
    const val = [config.events.dbTables.eventVideoJudge, judgePrinciple, config.events.dbTables.eventVideos, compId];
    return query<ResultSetHeader>(sql, val, db);
  } else if (eventId) {
    const sql = 'UPDATE ?? SET judgePrinciple = ? WHERE videoId IN (SELECT id FROM ?? WHERE eventId = ?)';
    const val = [config.events.dbTables.eventVideoJudge, judgePrinciple, config.events.dbTables.eventVideos, eventId];
    return query<ResultSetHeader>(sql, val, db);
  } else {
    throw new Error('Erroring setting principle judges, no identifier sent');
  }
};
