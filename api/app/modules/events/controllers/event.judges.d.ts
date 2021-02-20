import { PoolConnection, ResultSetHeader } from 'mysql2';
export declare const addEventJudgeOfficial: (videoId: number, userId: number, db?: PoolConnection) => Promise<ResultSetHeader>;
export declare const addEventJudgePrinciple: (videoId: number, userId: number, db?: PoolConnection) => Promise<ResultSetHeader>;
export declare const setEventJudgeOfficial: (judgeList: string | string[], videoId?: number, compId?: number, eventId?: number, db?: PoolConnection) => Promise<ResultSetHeader>;
export declare const setEventJudgePrinciple: (judgeList: string | string[], videoId?: number, compId?: number, eventId?: number, db?: PoolConnection) => Promise<ResultSetHeader>;
