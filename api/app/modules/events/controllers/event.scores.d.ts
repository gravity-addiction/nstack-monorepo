import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';
export declare const insertEventScorecard: (videoId: number, userId: number, totalScore: number | null, pointsInTime: number | null, scorecard: any, db?: PoolConnection) => Promise<ResultSetHeader>;
export declare const insertEventSubmission: (eventSlug: string, scorecard: any, db?: PoolConnection) => Promise<ResultSetHeader>;
export declare const getEventScorecard: (videoId: number, userId: number | number[] | null, db?: PoolConnection) => Promise<RowDataPacket[]>;
export declare const getOfficialVideoJudges: (videoId: number, db?: PoolConnection) => Promise<number[]>;
export declare const getScorecardsByVideoOfficial: (videoId: number, db?: PoolConnection) => Promise<RowDataPacket[]>;
export declare const calcScorecardTotal: (videoId: number, db?: PoolConnection) => Promise<any>;
